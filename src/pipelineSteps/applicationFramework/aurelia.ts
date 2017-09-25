/**
 * Pipeline step to generate scaffolding for Aurelia application.
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
import { JavaScriptConfiguration } from "../../configuration/models/vscode/javaScriptConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { SharedAppFramework } from "../sharedAppFramework";

export class Aurelia extends SharedAppFramework {
    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables) : boolean | undefined {
        return super.condition(uniteConfiguration.applicationFramework, "Aurelia");
    }

    public async initialise(logger: ILogger,
                            fileSystem: IFileSystem,
                            uniteConfiguration: UniteConfiguration,
                            engineVariables: EngineVariables): Promise<number> {
        if (super.condition(uniteConfiguration.bundler, "Browserify") || super.condition(uniteConfiguration.bundler, "Webpack")) {
            logger.error(`Aurelia does not currently support bundling with ${uniteConfiguration.bundler}`);
            return 1;
        }
        ArrayHelper.addRemove(uniteConfiguration.viewExtensions, "html", true);
        return 0;
    }

    public async install(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["aurelia-protractor-plugin"],
                                            super.condition(uniteConfiguration.e2eTestRunner, "Protractor"));
        engineVariables.toggleDevDependency(["unitejs-aurelia-webdriver-plugin"],
                                            super.condition(uniteConfiguration.e2eTestRunner, "WebdriverIO"));

        engineVariables.toggleDevDependency(["babel-plugin-transform-decorators-legacy"],
                                            super.condition(uniteConfiguration.sourceLanguage, "JavaScript"));

        engineVariables.toggleDevDependency(["babel-eslint"], super.condition(uniteConfiguration.linter, "ESLint"));

        this.toggleAllPackages(uniteConfiguration, engineVariables, true);

        const protractorConfiguration = engineVariables.getConfiguration<ProtractorConfiguration>("Protractor");
        if (protractorConfiguration) {
            const plugin = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder,
                                                                            fileSystem.pathCombine(engineVariables.www.packageFolder, "aurelia-protractor-plugin")));
            ArrayHelper.addRemove(protractorConfiguration.plugins, { path: plugin }, true, (object, item) => object.path === item.path);
        }
        const webdriverIoPlugins = engineVariables.getConfiguration<string[]>("WebdriverIO.Plugins");
        if (webdriverIoPlugins) {
            ArrayHelper.addRemove(webdriverIoPlugins, "unitejs-aurelia-webdriver-plugin", true);
        }

        const babelConfiguration = engineVariables.getConfiguration<BabelConfiguration>("Babel");
        if (babelConfiguration) {
            ArrayHelper.addRemove(babelConfiguration.plugins, "transform-decorators-legacy", true);
        }

        const esLintConfiguration = engineVariables.getConfiguration<EsLintConfiguration>("ESLint");
        if (esLintConfiguration) {
            ObjectHelper.addRemove(esLintConfiguration, "parser", "babel-eslint", true);
        }

        const typeScriptConfiguration = engineVariables.getConfiguration<TypeScriptConfiguration>("TypeScript");
        if (typeScriptConfiguration) {
            ObjectHelper.addRemove(typeScriptConfiguration.compilerOptions, "experimentalDecorators", true, true);
        }

        const javaScriptConfiguration = engineVariables.getConfiguration<JavaScriptConfiguration>("JavaScript");
        if (javaScriptConfiguration) {
            ObjectHelper.addRemove(javaScriptConfiguration.compilerOptions, "experimentalDecorators", true, true);
        }

        return 0;
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        const sourceExtension = super.condition(uniteConfiguration.sourceLanguage, "TypeScript") ? ".ts" : ".js";

        let ret = await this.generateAppSource(logger, fileSystem, uniteConfiguration, engineVariables,
                                               [
                                                    `app${sourceExtension}`,
                                                    `bootstrapper${sourceExtension}`,
                                                    `entryPoint${sourceExtension}`,
                                                    `child/child${sourceExtension}`
                                                ]);

        if (ret === 0) {
            ret = await super.generateAppHtml(logger, fileSystem, uniteConfiguration, engineVariables, ["app.html", "child/child.html"]);

            if (ret === 0) {
                ret = await super.generateAppCss(logger, fileSystem, uniteConfiguration, engineVariables, ["child/child"]);

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
        }

        return ret;
    }

    public async uninstall(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["aurelia-protractor-plugin"], false);
        engineVariables.toggleDevDependency(["unitejs-aurelia-webdriver-plugin"], false);
        engineVariables.toggleDevDependency(["babel-plugin-transform-decorators-legacy"], false);
        engineVariables.toggleDevDependency(["babel-eslint"], false);

        this.toggleAllPackages(uniteConfiguration, engineVariables, false);

        const protractorConfiguration = engineVariables.getConfiguration<ProtractorConfiguration>("Protractor");
        if (protractorConfiguration) {
            const plugin = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder,
                                                                            fileSystem.pathCombine(engineVariables.www.packageFolder, "aurelia-protractor-plugin")));
            ArrayHelper.addRemove(protractorConfiguration.plugins, { path: plugin }, false, (object, item) => object.path === item.path);
        }
        const webdriverIoPlugins = engineVariables.getConfiguration<string[]>("WebdriverIO.Plugins");
        if (webdriverIoPlugins) {
            ArrayHelper.addRemove(webdriverIoPlugins, "unitejs-aurelia-webdriver-plugin", false);
        }

        const babelConfiguration = engineVariables.getConfiguration<BabelConfiguration>("Babel");
        if (babelConfiguration) {
            ArrayHelper.addRemove(babelConfiguration.plugins, "transform-decorators-legacy", false);
        }

        const esLintConfiguration = engineVariables.getConfiguration<EsLintConfiguration>("ESLint");
        if (esLintConfiguration) {
            ObjectHelper.addRemove(esLintConfiguration, "parser", "babel-eslint", false);
        }

        const typeScriptConfiguration = engineVariables.getConfiguration<TypeScriptConfiguration>("TypeScript");
        if (typeScriptConfiguration) {
            ObjectHelper.addRemove(typeScriptConfiguration.compilerOptions, "experimentalDecorators", true, false);
        }

        const javaScriptConfiguration = engineVariables.getConfiguration<JavaScriptConfiguration>("JavaScript");
        if (javaScriptConfiguration) {
            ObjectHelper.addRemove(javaScriptConfiguration.compilerOptions, "experimentalDecorators", true, true);
        }

        return 0;
    }

    private toggleAllPackages(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, toggle: boolean): void {
        let location = "dist/";

        if (super.condition(uniteConfiguration.moduleType, "AMD")) {
            location += "amd/";
        } else if (super.condition(uniteConfiguration.moduleType, "CommonJS")) {
            location += "commonjs/";
        } else {
            location += "system/";
        }

        const clientPackages: { name: string; isPackage?: boolean }[] = [
            { name: "aurelia-animator-css" },
            { name: "aurelia-binding" },
            { name: "aurelia-bootstrapper" },
            { name: "aurelia-dependency-injection" },
            { name: "aurelia-event-aggregator" },
            { name: "aurelia-fetch-client" },
            { name: "aurelia-http-client" },
            { name: "aurelia-framework" },
            { name: "aurelia-history" },
            { name: "aurelia-history-browser" },
            { name: "aurelia-loader" },
            { name: "aurelia-loader-default" },
            { name: "aurelia-logging" },
            { name: "aurelia-logging-console" },
            { name: "aurelia-metadata" },
            { name: "aurelia-pal" },
            { name: "aurelia-pal-browser" },
            { name: "aurelia-path" },
            { name: "aurelia-polyfills" },
            { name: "aurelia-route-recognizer" },
            { name: "aurelia-router" },
            { name: "aurelia-task-queue" },
            { name: "aurelia-templating" },
            { name: "aurelia-templating-binding" },
            { name: "aurelia-dialog", isPackage: true },
            { name: "aurelia-templating-resources", isPackage: true },
            { name: "aurelia-templating-router", isPackage: true },
            { name: "aurelia-validation", isPackage: true }
        ];

        clientPackages.forEach(clientPackage => {
            engineVariables.toggleClientPackage(
                clientPackage.name,
                `${location}${clientPackage.name}.js`,
                undefined,
                undefined,
                false,
                "both",
                "none",
                clientPackage.isPackage ? true : false,
                undefined,
                undefined,
                undefined,
                undefined,
                toggle);
        });

        engineVariables.toggleClientPackage(
            "whatwg-fetch",
            "fetch.js",
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
            toggle);

        engineVariables.toggleClientPackage(
            "requirejs-text",
            "text.js",
            undefined,
            undefined,
            false,
            "both",
            "none",
            false,
            undefined,
            { text: "requirejs-text" },
            undefined,
            undefined,
            toggle && super.condition(uniteConfiguration.moduleType, "AMD"));

        engineVariables.toggleClientPackage(
            "systemjs-plugin-text",
            "text.js",
            undefined,
            undefined,
            false,
            "both",
            "none",
            false,
            undefined,
            { text: "systemjs-plugin-text" },
            undefined,
            undefined,
            toggle && super.condition(uniteConfiguration.moduleType, "SystemJS"));
    }
}
