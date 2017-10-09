/**
 * Pipeline step to generate scaffolding for Preact application.
 */
import { ArrayHelper } from "unitejs-framework/dist/helpers/arrayHelper";
import { ObjectHelper } from "unitejs-framework/dist/helpers/objectHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { BabelConfiguration } from "../../configuration/models/babel/babelConfiguration";
import { EsLintConfiguration } from "../../configuration/models/eslint/esLintConfiguration";
import { ProtractorConfiguration } from "../../configuration/models/protractor/protractorConfiguration";
import { TsLintConfiguration } from "../../configuration/models/tslint/tsLintConfiguration";
import { TypeScriptConfiguration } from "../../configuration/models/typeScript/typeScriptConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { JavaScriptConfiguration } from "../../configuration/models/vscode/javaScriptConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { SharedAppFramework } from "../sharedAppFramework";

export class Preact extends SharedAppFramework {
    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): boolean | undefined {
        return super.condition(uniteConfiguration.applicationFramework, "Preact");
    }

    public async initialise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        if (mainCondition) {
            if (super.condition(uniteConfiguration.moduleType, "AMD") || super.condition(uniteConfiguration.moduleType, "SystemJS")) {
                logger.error(`Preact does not support moduleType ${uniteConfiguration.moduleType}`);
                return 1;
            }

            ArrayHelper.addRemove(uniteConfiguration.viewExtensions, "html", true);

            ArrayHelper.addRemove(uniteConfiguration.sourceExtensions, "tsx",
                                  super.condition(uniteConfiguration.sourceLanguage, "TypeScript"));

            ArrayHelper.addRemove(uniteConfiguration.sourceExtensions, "jsx",
                                  super.condition(uniteConfiguration.sourceLanguage, "JavaScript"));
        }

        return 0;
    }

    public async configure(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        engineVariables.toggleDevDependency(["babel-plugin-transform-react-jsx"], mainCondition && super.condition(uniteConfiguration.sourceLanguage, "JavaScript"));
        engineVariables.toggleDevDependency(["eslint-plugin-react"], mainCondition && super.condition(uniteConfiguration.linter, "ESLint"));

        engineVariables.toggleDevDependency(["unitejs-preact-protractor-plugin"], mainCondition && super.condition(uniteConfiguration.e2eTestRunner, "Protractor"));
        engineVariables.toggleDevDependency(["unitejs-preact-webdriver-plugin"], mainCondition && super.condition(uniteConfiguration.e2eTestRunner, "WebdriverIO"));

        engineVariables.toggleClientPackage(
            "preact",
            "dist/preact.dev.js",
            "dist/preact.min.js",
            undefined,
            false,
            "both",
            "none",
            false,
            undefined,
            undefined,
            undefined,
            undefined,
            mainCondition);

        engineVariables.toggleClientPackage(
            "preact-router",
            "dist/preact-router.js",
            undefined,
            undefined,
            false,
            "both",
            "none",
            false,
            undefined,
            undefined,
            undefined,
            undefined,
            mainCondition);

        const esLintConfiguration = engineVariables.getConfiguration<EsLintConfiguration>("ESLint");
        if (esLintConfiguration) {
            ObjectHelper.addRemove(esLintConfiguration.parserOptions.ecmaFeatures, "jsx", true, mainCondition);
            ArrayHelper.addRemove(esLintConfiguration.extends, "plugin:react/recommended", mainCondition);
            ArrayHelper.addRemove(esLintConfiguration.plugins, "react", mainCondition);
            ObjectHelper.addRemove(esLintConfiguration.rules, "no-unused-vars", 1, mainCondition);
            ObjectHelper.addRemove(esLintConfiguration.settings, "react", { pragma: "h" }, mainCondition);
        }

        const tsLintConfiguration = engineVariables.getConfiguration<TsLintConfiguration>("TSLint");
        if (tsLintConfiguration) {
            ObjectHelper.addRemove(tsLintConfiguration.rules, "no-empty", { severity: "warning" }, mainCondition);
            ObjectHelper.addRemove(tsLintConfiguration.rules, "no-empty-interface", { severity: "warning" }, mainCondition);
            ObjectHelper.addRemove(tsLintConfiguration.rules, "variable-name", [true, "allow-leading-underscore"], mainCondition);
        }

        const babelConfiguration = engineVariables.getConfiguration<BabelConfiguration>("Babel");
        if (babelConfiguration) {
            ArrayHelper.addRemove(babelConfiguration.plugins, [ "transform-react-jsx", { pragma: "h"} ], mainCondition,
                                  (obj, item) => Array.isArray(item) && item.length > 0 && item[0] === obj[0]);
        }

        const protractorConfiguration = engineVariables.getConfiguration<ProtractorConfiguration>("Protractor");
        if (protractorConfiguration) {
            const plugin = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder,
                                                                            fileSystem.pathCombine(engineVariables.www.packageFolder, "unitejs-preact-protractor-plugin")));
            ArrayHelper.addRemove(protractorConfiguration.plugins, { path: plugin }, mainCondition, (object, item) => object.path === item.path);
        }
        const webdriverIoPlugins = engineVariables.getConfiguration<string[]>("WebdriverIO.Plugins");
        if (webdriverIoPlugins) {
            ArrayHelper.addRemove(webdriverIoPlugins, "unitejs-preact-webdriver-plugin", mainCondition);
        }

        const typeScriptConfiguration = engineVariables.getConfiguration<TypeScriptConfiguration>("TypeScript");
        if (typeScriptConfiguration) {
            ObjectHelper.addRemove(typeScriptConfiguration.compilerOptions, "jsx", "react", mainCondition);
            ObjectHelper.addRemove(typeScriptConfiguration.compilerOptions, "jsxFactory", "h", mainCondition);
            ObjectHelper.addRemove(typeScriptConfiguration.compilerOptions, "experimentalDecorators", true, mainCondition);
        }

        const javaScriptConfiguration = engineVariables.getConfiguration<JavaScriptConfiguration>("JavaScript");
        if (javaScriptConfiguration) {
            ObjectHelper.addRemove(javaScriptConfiguration.compilerOptions, "experimentalDecorators", true, mainCondition);
        }

        return 0;
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        if (mainCondition) {
            const sourceExtension = super.condition(uniteConfiguration.sourceLanguage, "TypeScript") ? ".ts" : ".js";

            let ret = await this.generateAppSource(logger, fileSystem, uniteConfiguration, engineVariables, [
                `app${sourceExtension}x`,
                `child/child${sourceExtension}x`,
                `bootstrapper${sourceExtension}`,
                `entryPoint${sourceExtension}`
            ]);

            if (ret === 0) {
                ret = await super.generateAppCss(logger, fileSystem, uniteConfiguration, engineVariables, [`child/child`]);

                if (ret === 0) {
                    ret = await super.generateE2eTest(logger, fileSystem, uniteConfiguration, engineVariables, [`app.spec${sourceExtension}`]);

                    if (ret === 0) {
                        ret = await this.generateUnitTest(logger, fileSystem, uniteConfiguration, engineVariables, [`app.spec${sourceExtension}`, `bootstrapper.spec${sourceExtension}`], true);

                        if (ret === 0) {
                            ret = await super.generateCss(logger, fileSystem, uniteConfiguration, engineVariables);
                        }
                    }
                }
            }

            return ret;
        } else {
            return 0;
        }
    }
}
