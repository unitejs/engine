/**
 * Pipeline step to generate scaffolding for Polymer application.
 */
import { ArrayHelper } from "unitejs-framework/dist/helpers/arrayHelper";
import { ObjectHelper } from "unitejs-framework/dist/helpers/objectHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { EsLintConfiguration } from "../../configuration/models/eslint/esLintConfiguration";
import { ProtractorConfiguration } from "../../configuration/models/protractor/protractorConfiguration";
import { TsLintConfiguration } from "../../configuration/models/tslint/tsLintConfiguration";
import { TypeScriptConfiguration } from "../../configuration/models/typeScript/typeScriptConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { JavaScriptConfiguration } from "../../configuration/models/vscode/javaScriptConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { SharedAppFramework } from "../sharedAppFramework";

export class Polymer extends SharedAppFramework {
    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): boolean | undefined {
        return super.condition(uniteConfiguration.applicationFramework, "Polymer");
    }

    public async initialise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        if (mainCondition) {
            if (super.condition(uniteConfiguration.unitTestEngine, "PhantomJS")) {
                logger.error(`Polymer does not support unit testing with ${uniteConfiguration.unitTestEngine} as it lack many modern ES features`);
                return 1;
            }
            if (super.condition(uniteConfiguration.unitTestEngine, "Jest")) {
                logger.error(`Polymer does not support unit testing with ${uniteConfiguration.unitTestEngine} as it has no MutationObserver support`);
                return 1;
            }
            ArrayHelper.addRemove(uniteConfiguration.viewExtensions, "html", true);
        }

        return 0;
    }

    public async configure(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        engineVariables.toggleDevDependency(["unitejs-polymer-protractor-plugin"], mainCondition && super.condition(uniteConfiguration.e2eTestRunner, "Protractor"));
        engineVariables.toggleDevDependency(["unitejs-polymer-webdriver-plugin"], mainCondition && super.condition(uniteConfiguration.e2eTestRunner, "WebdriverIO"));

        engineVariables.toggleClientPackage("@webcomponents/webcomponentsjs-es5adapter", {
                                                name: "@webcomponents/webcomponentsjs",
                                                main: "custom-elements-es5-adapter.js",
                                                includeMode: "both",
                                                scriptIncludeMode: "both"
                                            },
                                            mainCondition);

        engineVariables.toggleClientPackage("@webcomponents/webcomponentsjs", {
                                                name: "@webcomponents/webcomponentsjs",
                                                main: "webcomponents-lite.js",
                                                includeMode: "both",
                                                scriptIncludeMode: "both"
                                            },
                                            mainCondition);

        engineVariables.toggleClientPackage("@webcomponents/shadycss", {
                                                name: "@webcomponents/shadycss",
                                                transpileAlias: "@webcomponents-transpiled/shadycss",
                                                transpileSrc: ["entrypoints/*.js", "src/**/*.js"],
                                                main: "*",
                                                includeMode: "both"
                                            },
                                            mainCondition);

        engineVariables.toggleClientPackage("@polymer/polymer", {
                                                name: "@polymer/polymer",
                                                transpileAlias: "@polymer-transpiled/polymer",
                                                transpileSrc: ["polymer.js", "polymer-element.js", "lib/**/*.js"],
                                                transpileTransforms: [
                                                    {
                                                        from: "import '(.*)@webcomponents",
                                                        to: "import '@webcomponents"
                                                    },
                                                    {
                                                        from: "import '(.*).js'",
                                                        to: "import '$1'"
                                                    }
                                                ],
                                                main: "*",
                                                includeMode: "both"
                                            },
                                            mainCondition);

        engineVariables.toggleClientPackage("@polymer/app-route", {
                                                name: "@polymer/app-route",
                                                transpileAlias: "@polymer-transpiled/app-route",
                                                transpileSrc: ["*.js"],
                                                main: "*",
                                                includeMode: "both"
                                            },
                                            mainCondition);

        engineVariables.toggleClientPackage("@polymer/iron-location", {
                                                name: "@polymer/iron-location",
                                                transpileAlias: "@polymer-transpiled/iron-location",
                                                transpileSrc: ["*.js"],
                                                main: "*",
                                                includeMode: "both"
                                            },
                                            mainCondition);

        engineVariables.toggleClientPackage("requirejs-text", {
                                                name: "requirejs-text",
                                                main: "text.js",
                                                includeMode: "both",
                                                map: { text: "requirejs-text" }
                                            },
                                            mainCondition && super.condition(uniteConfiguration.moduleType, "AMD"));

        engineVariables.toggleClientPackage("systemjs-plugin-text", {
                                                name: "systemjs-plugin-text",
                                                includeMode: "both",
                                                main: "text.js",
                                                map: {
                                                    text: "systemjs-plugin-text"
                                                },
                                                loaders: {
                                                    "*.html" : "text",
                                                    "*.css" : "text"
                                                }
                                            },
                                            mainCondition &&
            (super.condition(uniteConfiguration.bundler, "Browserify") ||
                super.condition(uniteConfiguration.bundler, "SystemJSBuilder") ||
                super.condition(uniteConfiguration.bundler, "Webpack")));

        if (mainCondition && super.condition(uniteConfiguration.taskManager, "Gulp") && super.condition(uniteConfiguration.bundler, "RequireJS")) {
            engineVariables.buildTranspileInclude.push("const replace = require(\"gulp-replace\");");
            engineVariables.buildTranspilePreBuild.push(".pipe(replace(/import \\\"\\.\\\/(.*?).css\";/g,");
            engineVariables.buildTranspilePreBuild.push("            `import \"text!./$1.css\";`))");
            engineVariables.buildTranspilePreBuild.push(".pipe(replace(/import \\\"\\.\\\/(.*?).html\";/g,");
            engineVariables.buildTranspilePreBuild.push("            `import \"text!./$1.html\";`))");
        }

        const esLintConfiguration = engineVariables.getConfiguration<EsLintConfiguration>("ESLint");
        if (esLintConfiguration) {
            ObjectHelper.addRemove(esLintConfiguration.rules, "no-unused-vars", 1, mainCondition);
        }

        const tsLintConfiguration = engineVariables.getConfiguration<TsLintConfiguration>("TSLint");
        if (tsLintConfiguration) {
            ObjectHelper.addRemove(tsLintConfiguration.rules, "no-empty", { severity: "warning" }, mainCondition);
            ObjectHelper.addRemove(tsLintConfiguration.rules, "no-empty-interface", { severity: "warning" }, mainCondition);
            ObjectHelper.addRemove(tsLintConfiguration.rules, "variable-name", [true, "allow-leading-underscore"], mainCondition);
        }

        const protractorConfiguration = engineVariables.getConfiguration<ProtractorConfiguration>("Protractor");
        if (protractorConfiguration) {
            const plugin = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder,
                                                                            fileSystem.pathCombine(engineVariables.www.packageFolder, "unitejs-polymer-protractor-plugin")));
            ArrayHelper.addRemove(protractorConfiguration.plugins, { path: plugin }, mainCondition, (object, item) => object.path === item.path);
        }
        const webdriverIoPlugins = engineVariables.getConfiguration<string[]>("WebdriverIO.Plugins");
        if (webdriverIoPlugins) {
            ArrayHelper.addRemove(webdriverIoPlugins, "unitejs-polymer-webdriver-plugin", mainCondition);
        }

        const typeScriptConfiguration = engineVariables.getConfiguration<TypeScriptConfiguration>("TypeScript");
        if (typeScriptConfiguration) {
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
                `app${sourceExtension}`,
                `child/child${sourceExtension}`,
                `bootstrapper${sourceExtension}`,
                `entryPoint${sourceExtension}`
            ]);

            if (ret === 0) {
                ret = await super.generateAppHtml(logger, fileSystem, uniteConfiguration, engineVariables, ["app.html", "child/child.html"]);
            }

            if (ret === 0) {
                ret = await super.generateAppCss(logger, fileSystem, uniteConfiguration, engineVariables, ["child/child"]);
            }

            if (ret === 0) {
                ret = await super.generateE2eTest(logger, fileSystem, uniteConfiguration, engineVariables, [`app.spec${sourceExtension}`]);
            }

            if (ret === 0) {
                ret = await this.generateUnitTest(logger, fileSystem, uniteConfiguration, engineVariables, [`app.spec${sourceExtension}`, `bootstrapper.spec${sourceExtension}`], true);
            }

            if (ret === 0) {
                ret = await super.generateCss(logger, fileSystem, uniteConfiguration, engineVariables);
            }

            return ret;
        } else {
            return 0;
        }
    }
}
