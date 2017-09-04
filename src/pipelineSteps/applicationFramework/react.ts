/**
 * Pipeline step to generate scaffolding for React application.
 */
import { ArrayHelper } from "unitejs-framework/dist/helpers/arrayHelper";
import { ObjectHelper } from "unitejs-framework/dist/helpers/objectHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { BabelConfiguration } from "../../configuration/models/babel/babelConfiguration";
import { EsLintConfiguration } from "../../configuration/models/eslint/esLintConfiguration";
import { ProtractorConfiguration } from "../../configuration/models/protractor/protractorConfiguration";
import { TypeScriptConfiguration } from "../../configuration/models/typeScript/typeScriptConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineKey } from "../../engine/pipelineKey";
import { SharedAppFramework } from "../sharedAppFramework";

export class React extends SharedAppFramework {
    public influences(): PipelineKey[] {
        return [
            new PipelineKey("content", "packageJson"),
            new PipelineKey("scaffold", "uniteConfigurationJson"),
            new PipelineKey("language", "javaScript"),
            new PipelineKey("language", "typeScript"),
            new PipelineKey("linter", "esLint"),
            new PipelineKey("e2eTestRunner", "webdriverIo"),
            new PipelineKey("e2eTestRunner", "protractor")
        ];
    }

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        const cond = super.condition(uniteConfiguration.applicationFramework, "React");

        engineVariables.toggleDevDependency(["babel-preset-react"],
                                            cond && super.condition(uniteConfiguration.sourceLanguage, "JavaScript"));
        engineVariables.toggleDevDependency(["eslint-plugin-react"],
                                            cond && super.condition(uniteConfiguration.linter, "ESLint"));

        engineVariables.toggleDevDependency(["@types/react", "@types/react-dom", "@types/react-router-dom"],
                                            cond && super.condition(uniteConfiguration.sourceLanguage, "TypeScript"));

        engineVariables.toggleDevDependency(["unitejs-react-protractor-plugin"],
                                            cond && super.condition(uniteConfiguration.e2eTestRunner, "Protractor"));
        engineVariables.toggleDevDependency(["unitejs-react-webdriver-plugin"],
                                            cond && super.condition(uniteConfiguration.e2eTestRunner, "WebdriverIO"));

        engineVariables.toggleClientPackage(
            "react",
            "dist/react.js",
            "dist/react.min.js",
            undefined,
            false,
            "both",
            "none",
            false,
            undefined,
            undefined,
            undefined,
            cond);

        engineVariables.toggleClientPackage(
            "react-dom",
            "dist/react-dom.js",
            "dist/react-dom.min.js",
            undefined,
            false,
            "both",
            "none",
            false,
            undefined,
            undefined,
            undefined,
            cond);

        engineVariables.toggleClientPackage(
            "react-router-dom",
            "umd/react-router-dom.js",
            "umd/react-router-dom.min.js",
            undefined,
            false,
            "both",
            "none",
            false,
            undefined,
            undefined,
            undefined,
            cond);

        const esLintConfiguration = engineVariables.getConfiguration<EsLintConfiguration>("ESLint");
        if (esLintConfiguration) {
            esLintConfiguration.parserOptions.ecmaFeatures.jsx = cond;
            ArrayHelper.addRemove(esLintConfiguration.extends, "plugin:react/recommended", cond);
            ArrayHelper.addRemove(esLintConfiguration.plugins, "react", cond);
        }

        const babelConfiguration = engineVariables.getConfiguration<BabelConfiguration>("Babel");
        if (babelConfiguration) {
            ArrayHelper.addRemove(babelConfiguration.presets, "react", cond);
        }

        const typeScriptConfiguration = engineVariables.getConfiguration<TypeScriptConfiguration>("TypeScript");
        if (typeScriptConfiguration) {
            ObjectHelper.addRemove(typeScriptConfiguration.compilerOptions, "jsx", "react", cond);
        }

        const protractorConfiguration = engineVariables.getConfiguration<ProtractorConfiguration>("Protractor");
        if (protractorConfiguration) {
            const plugin = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder,
                                                                            fileSystem.pathCombine(engineVariables.www.packageFolder, "unitejs-react-protractor-plugin")));
            ArrayHelper.addRemove(protractorConfiguration.plugins, { path: plugin }, cond, (object, item) => object.path === item.path);
        }
        const webdriverIoPlugins = engineVariables.getConfiguration<string[]>("WebdriverIO.Plugins");
        if (webdriverIoPlugins) {
            ArrayHelper.addRemove(webdriverIoPlugins, "unitejs-react-webdriver-plugin", cond);
        }

        if (cond) {
            const codeExtension = `!${engineVariables.sourceLanguageExt}x`;
            let ret = await this.generateAppSource(logger, fileSystem, uniteConfiguration, engineVariables, [
                `app${codeExtension}`,
                `child/child${codeExtension}`,
                "bootstrapper",
                "entryPoint"]);

            if (ret === 0) {
                ret = await super.generateE2eTest(logger, fileSystem, uniteConfiguration, engineVariables, ["app"]);

                if (ret === 0) {
                    ret = await this.generateUnitTest(logger, fileSystem, uniteConfiguration, engineVariables, ["app", "bootstrapper"], true);

                    if (ret === 0) {
                        ret = await super.generateCss(logger, fileSystem, uniteConfiguration, engineVariables);
                    }
                }
            }

            return ret;
        }

        return 0;
    }
}
