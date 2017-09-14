/**
 * Pipeline step to generate scaffolding for Aurelia application.
 */
import { ArrayHelper } from "unitejs-framework/dist/helpers/arrayHelper";
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

export class Aurelia extends SharedAppFramework {
    public influences(): PipelineKey[] {
        return [
            new PipelineKey("unite", "uniteConfigurationJson"),
            new PipelineKey("content", "packageJson"),
            new PipelineKey("e2eTestRunner", "webdriverIo"),
            new PipelineKey("e2eTestRunner", "protractor"),
            new PipelineKey("language", "typeScript")
        ];
    }

    public async initialise(logger: ILogger,
                            fileSystem: IFileSystem,
                            uniteConfiguration: UniteConfiguration,
                            engineVariables: EngineVariables): Promise<number> {
        if (super.condition(uniteConfiguration.applicationFramework, "Aurelia")) {
            if (super.condition(uniteConfiguration.bundler, "Browserify") || super.condition(uniteConfiguration.bundler, "Webpack")) {
                logger.error(`Aurelia does not currently support bundling with ${uniteConfiguration.bundler}`);
                return 1;
            }
            ArrayHelper.addRemove(uniteConfiguration.viewExtensions, "html", true);
        }
        return 0;
    }

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        const cond = super.condition(uniteConfiguration.applicationFramework, "Aurelia");
        engineVariables.toggleDevDependency(["aurelia-protractor-plugin"],
                                            cond &&
            super.condition(uniteConfiguration.e2eTestRunner, "Protractor"));
        engineVariables.toggleDevDependency(["unitejs-aurelia-webdriver-plugin"],
                                            cond &&
            super.condition(uniteConfiguration.e2eTestRunner, "WebdriverIO"));

        engineVariables.toggleDevDependency(["babel-plugin-transform-decorators-legacy"],
                                            cond && super.condition(uniteConfiguration.sourceLanguage, "JavaScript"));

        engineVariables.toggleDevDependency(["babel-eslint"], cond && super.condition(uniteConfiguration.linter, "ESLint"));

        this.toggleAllPackages(uniteConfiguration, engineVariables);

        const protractorConfiguration = engineVariables.getConfiguration<ProtractorConfiguration>("Protractor");
        if (protractorConfiguration) {
            const plugin = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder,
                                                                            fileSystem.pathCombine(engineVariables.www.packageFolder, "aurelia-protractor-plugin")));
            ArrayHelper.addRemove(protractorConfiguration.plugins, { path: plugin }, cond, (object, item) => object.path === item.path);
        }
        const webdriverIoPlugins = engineVariables.getConfiguration<string[]>("WebdriverIO.Plugins");
        if (webdriverIoPlugins) {
            ArrayHelper.addRemove(webdriverIoPlugins, "unitejs-aurelia-webdriver-plugin", cond);
        }

        const babelConfiguration = engineVariables.getConfiguration<BabelConfiguration>("Babel");
        if (babelConfiguration) {
            ArrayHelper.addRemove(babelConfiguration.plugins, "transform-decorators-legacy", super.condition(uniteConfiguration.applicationFramework, "Angular"));
        }

        if (cond) {
            const esLintConfiguration = engineVariables.getConfiguration<EsLintConfiguration>("ESLint");
            if (esLintConfiguration) {
                esLintConfiguration.parser = "babel-eslint";
            }

            const typeScriptConfiguration = engineVariables.getConfiguration<TypeScriptConfiguration>("TypeScript");
            if (typeScriptConfiguration) {
                typeScriptConfiguration.compilerOptions.experimentalDecorators = true;
            }

            const sourceExtension = uniteConfiguration.sourceLanguage === "TypeScript" ? ".ts" : ".js";

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
        return 0;
    }

    private toggleAllPackages(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): void {
        let location = "dist/";

        if (super.condition(uniteConfiguration.moduleType, "AMD")) {
            location += "amd/";
        } else if (super.condition(uniteConfiguration.moduleType, "CommonJS")) {
            location += "commonjs/";
        } else {
            location += "system/";
        }

        this.toggleClientPackages(uniteConfiguration, engineVariables, location, [
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
        ]);

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
            super.condition(uniteConfiguration.applicationFramework, "Aurelia"));

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
            super.condition(uniteConfiguration.applicationFramework, "Aurelia") && super.condition(uniteConfiguration.moduleType, "AMD"));

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
            super.condition(uniteConfiguration.applicationFramework, "Aurelia") && super.condition(uniteConfiguration.moduleType, "SystemJS"));
    }

    private toggleClientPackages(uniteConfiguration: UniteConfiguration,
                                 engineVariables: EngineVariables,
                                 location: string,
                                 clientPackages: { name: string; isPackage?: boolean }[]): void {

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
                super.condition(uniteConfiguration.applicationFramework, "Aurelia"));
        });
    }
}
