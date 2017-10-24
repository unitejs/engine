/**
 * Pipeline step to generate scaffolding for Vue application.
 */
import { JestConfiguration } from "src/configuration/models/jest/jestConfiguration";
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

export class Vue extends SharedAppFramework {
    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): boolean | undefined {
        return super.condition(uniteConfiguration.applicationFramework, "Vue");
    }

    public async initialise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        if (mainCondition) {
            ArrayHelper.addRemove(uniteConfiguration.viewExtensions, "vue", true);
        }

        return 0;
    }

    public async configure(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        engineVariables.toggleDevDependency(["unitejs-vue-protractor-plugin"], mainCondition && super.condition(uniteConfiguration.e2eTestRunner, "Protractor"));
        engineVariables.toggleDevDependency(["unitejs-vue-webdriver-plugin"], mainCondition && super.condition(uniteConfiguration.e2eTestRunner, "WebdriverIO"));

        engineVariables.toggleDevDependency(["babel-plugin-transform-decorators-legacy", "babel-plugin-transform-class-properties"],
                                            mainCondition && super.condition(uniteConfiguration.sourceLanguage, "JavaScript"));

        engineVariables.toggleDevDependency(["babel-eslint"], mainCondition && super.condition(uniteConfiguration.linter, "ESLint"));

        engineVariables.toggleClientPackage("vue", {
                                                name: "vue",
                                                main: "dist/vue.runtime.js",
                                                mainMinified: "dist/vue.runtime.min.js",
                                                includeMode: "both"
                                            },
                                            mainCondition);

        engineVariables.toggleClientPackage("vue-router", {
                                                name: "vue-router",
                                                main: "dist/vue-router.js",
                                                mainMinified: "dist/vue-router.min.js",
                                                includeMode: "both"
                                            },
                                            mainCondition);

        engineVariables.toggleClientPackage("vue-class-component", {
                                                name: "vue-class-component",
                                                main: "dist/vue-class-component.js",
                                                mainMinified: "dist/vue-class-component.min.js",
                                                includeMode: "both"
                                            },
                                            mainCondition);

        engineVariables.toggleClientPackage("require-css", {
                                                name: "require-css",
                                                main: "css.js",
                                                includeMode: "both",
                                                map: { css: "require-css" }
                                            },
                                            mainCondition && super.condition(uniteConfiguration.bundler, "RequireJS"));

        engineVariables.toggleClientPackage("systemjs-plugin-css", {
                                                name: "systemjs-plugin-css",
                                                main: "css.js",
                                                includeMode: "both",
                                                map: { css: "systemjs-plugin-css" },
                                                loaders: { "*.css" : "css" }
                                            },
                                            mainCondition &&
            (super.condition(uniteConfiguration.bundler, "Browserify") ||
             super.condition(uniteConfiguration.bundler, "SystemJSBuilder") ||
             super.condition(uniteConfiguration.bundler, "Webpack")));

        const usingGulp = super.condition(uniteConfiguration.taskManager, "Gulp");
        engineVariables.toggleDevDependency(["gulp-inline-vue-template"], mainCondition && usingGulp);
        if (mainCondition && usingGulp) {
            engineVariables.buildTranspileInclude.push("const inlineVue = require(\"gulp-inline-vue-template\");");

            if (super.condition(uniteConfiguration.bundler, "RequireJS")) {
                engineVariables.buildTranspileInclude.push("const replace = require(\"gulp-replace\");");
                engineVariables.buildTranspileInclude.push("const clientPackages = require(\"./util/client-packages\");");

                engineVariables.buildTranspilePreBuild.push(".pipe(replace(/import \\\"\\.\\\/(.*?).css\";/g,");
                engineVariables.buildTranspilePreBuild.push("            `import \"\${clientPackages.getTypeMap(uniteConfig, \"css\", buildConfiguration.minify)}!./$1.css\";`))");
            }
            engineVariables.buildTranspilePostBuild.push(`.pipe(inlineVue())`);
        }

        const esLintConfiguration = engineVariables.getConfiguration<EsLintConfiguration>("ESLint");
        if (esLintConfiguration) {
            ObjectHelper.addRemove(esLintConfiguration, "parser", "babel-eslint", mainCondition);
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
                                                                            fileSystem.pathCombine(engineVariables.www.packageFolder, "unitejs-vue-protractor-plugin")));
            ArrayHelper.addRemove(protractorConfiguration.plugins, { path: plugin }, mainCondition, (object, item) => object.path === item.path);
        }
        const webdriverIoPlugins = engineVariables.getConfiguration<string[]>("WebdriverIO.Plugins");
        if (webdriverIoPlugins) {
            ArrayHelper.addRemove(webdriverIoPlugins, "unitejs-vue-webdriver-plugin", mainCondition);
        }

        const babelConfiguration = engineVariables.getConfiguration<BabelConfiguration>("Babel");
        if (babelConfiguration) {
            ArrayHelper.addRemove(babelConfiguration.plugins, "transform-decorators-legacy", mainCondition);
            ArrayHelper.addRemove(babelConfiguration.plugins, "transform-class-properties", mainCondition);
        }

        const typeScriptConfiguration = engineVariables.getConfiguration<TypeScriptConfiguration>("TypeScript");
        if (typeScriptConfiguration) {
            ObjectHelper.addRemove(typeScriptConfiguration.compilerOptions, "experimentalDecorators", true, mainCondition);
            ObjectHelper.addRemove(typeScriptConfiguration.compilerOptions, "allowSyntheticDefaultImports", true, mainCondition);
        }

        const javaScriptConfiguration = engineVariables.getConfiguration<JavaScriptConfiguration>("JavaScript");
        if (javaScriptConfiguration) {
            ObjectHelper.addRemove(javaScriptConfiguration.compilerOptions, "experimentalDecorators", true, mainCondition);
        }

        const jestConfiguration = engineVariables.getConfiguration<JestConfiguration>("Jest");
        if (jestConfiguration) {
            ObjectHelper.addRemove(jestConfiguration.moduleNameMapper, "\\.vue$", "<rootDir>/test/unit/dummy.mock.js", mainCondition);
        }

        return 0;
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        if (mainCondition) {
            const isTypeScript = super.condition(uniteConfiguration.sourceLanguage, "TypeScript");
            const sourceExtension = isTypeScript ? ".ts" : ".js";

            const srcFiles = [
                `app${sourceExtension}`,
                `router${sourceExtension}`,
                `child/child${sourceExtension}`,
                `bootstrapper${sourceExtension}`,
                `entryPoint${sourceExtension}`
            ];

            if (isTypeScript) {
                srcFiles.push("customTypes/vue-module.d.ts");
            }

            let ret = await this.generateAppSource(logger, fileSystem, uniteConfiguration, engineVariables, srcFiles);

            if (ret === 0) {
                ret = await super.generateAppHtml(logger, fileSystem, uniteConfiguration, engineVariables, ["app.vue", "child/child.vue"]);
            }

            if (ret === 0) {
                ret = await super.generateAppCss(logger, fileSystem, uniteConfiguration, engineVariables, [`child/child`]);
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
