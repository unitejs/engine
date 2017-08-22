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
import { SharedAppFramework } from "./sharedAppFramework";

export class React extends SharedAppFramework {
    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["babel-preset-react"], uniteConfiguration.applicationFramework === "React" && uniteConfiguration.sourceLanguage === "JavaScript");
        engineVariables.toggleDevDependency(["eslint-plugin-react"], uniteConfiguration.applicationFramework === "React" && uniteConfiguration.linter === "ESLint");

        engineVariables.toggleDevDependency(["@types/react", "@types/react-dom", "@types/react-router-dom"],
                                            uniteConfiguration.applicationFramework === "React" && uniteConfiguration.sourceLanguage === "TypeScript");

        engineVariables.toggleDevDependency(["unitejs-react-protractor-plugin"], uniteConfiguration.applicationFramework === "React" && uniteConfiguration.e2eTestRunner === "Protractor");
        engineVariables.toggleDevDependency(["unitejs-react-webdriver-plugin"], uniteConfiguration.applicationFramework === "React" && uniteConfiguration.e2eTestRunner === "WebdriverIO");

        engineVariables.toggleClientPackage(
            "react",
            "dist/react.js",
            "dist/react.min.js",
            false,
            "both",
            false,
            false,
            undefined,
            uniteConfiguration.applicationFramework === "React");

        engineVariables.toggleClientPackage(
            "react-dom",
            "dist/react-dom.js",
            "dist/react-dom.min.js",
            false,
            "both",
            false,
            false,
            undefined,
            uniteConfiguration.applicationFramework === "React");

        engineVariables.toggleClientPackage(
            "react-router-dom",
            "umd/react-router-dom.js",
            "umd/react-router-dom.min.js",
            false,
            "both",
            false,
            false,
            undefined,
            uniteConfiguration.applicationFramework === "React");

        const esLintConfiguration = engineVariables.getConfiguration<EsLintConfiguration>("ESLint");
        if (esLintConfiguration) {
            esLintConfiguration.parserOptions.ecmaFeatures.jsx = uniteConfiguration.applicationFramework === "React";
            ArrayHelper.addRemove(esLintConfiguration.extends, "plugin:react/recommended", uniteConfiguration.applicationFramework === "React");
            ArrayHelper.addRemove(esLintConfiguration.plugins, "react", uniteConfiguration.applicationFramework === "React");
        }

        const babelConfiguration = engineVariables.getConfiguration<BabelConfiguration>("Babel");
        if (babelConfiguration) {
            ArrayHelper.addRemove(babelConfiguration.presets, "react", uniteConfiguration.applicationFramework === "React");
        }

        const typeScriptConfiguration = engineVariables.getConfiguration<TypeScriptConfiguration>("TypeScript");
        if (typeScriptConfiguration) {
            ObjectHelper.addRemove(typeScriptConfiguration.compilerOptions, "jsx", "react", uniteConfiguration.applicationFramework === "React");
        }

        if (uniteConfiguration.applicationFramework === "React") {
            const protractorConfiguration = engineVariables.getConfiguration<ProtractorConfiguration>("Protractor");
            if (protractorConfiguration) {
                protractorConfiguration.plugins.push({ path: "unitejs-react-protractor-plugin" });
            }
            const webdriverIoPlugins = engineVariables.getConfiguration<string[]>("WebdriverIO.Plugins");
            if (webdriverIoPlugins) {
                webdriverIoPlugins.push("unitejs-react-webdriver-plugin");
            }

            const codeExtension = `!${engineVariables.sourceLanguageExt}x`;
            let ret = await this.generateAppSource(logger, fileSystem, uniteConfiguration, engineVariables, [
                `app${codeExtension}`,
                `child/child${codeExtension}`,
                "bootstrapper",
                "entryPoint"]);

            if (ret === 0) {
                ret = await super.generateE2eTest(logger, fileSystem, uniteConfiguration, engineVariables, ["app"]);

                if (ret === 0) {
                    ret = await this.generateUnitTest(logger, fileSystem, uniteConfiguration, engineVariables, ["app", "bootstrapper"]);

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
