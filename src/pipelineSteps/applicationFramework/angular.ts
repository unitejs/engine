/**
 * Pipeline step to generate scaffolding for angular application.
 */
import { ArrayHelper } from "unitejs-framework/dist/helpers/arrayHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { BabelConfiguration } from "../../configuration/models/babel/babelConfiguration";
import { EsLintConfiguration } from "../../configuration/models/eslint/esLintConfiguration";
import { TypeScriptConfiguration } from "../../configuration/models/typeScript/typeScriptConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { SharedAppFramework } from "./sharedAppFramework";

export class Angular extends SharedAppFramework {
    public async initialise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        if (uniteConfiguration.applicationFramework === "Angular") {
            if (uniteConfiguration.bundler === "RequireJS") {
                logger.error(`Aurelia does not currently support bundling with ${uniteConfiguration.bundler}`);
                return 1;
            }
        }
        return 0;
    }

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        this.toggleDependencies(logger, fileSystem, uniteConfiguration, engineVariables);

        engineVariables.toggleDevDependency(["babel-plugin-transform-decorators-legacy"], uniteConfiguration.applicationFramework === "Angular" && uniteConfiguration.sourceLanguage === "JavaScript");
        engineVariables.toggleDevDependency(["babel-eslint"], uniteConfiguration.applicationFramework === "Angular" && uniteConfiguration.linter === "ESLint");
        // engineVariables.toggleDevDependency(["unitejs-plain-protractor-plugin"], uniteConfiguration.applicationFramework === "PlainApp" && uniteConfiguration.e2eTestRunner === "Protractor");

        // engineVariables.toggleDevDependency(["unitejs-plain-webdriver-plugin"], uniteConfiguration.applicationFramework === "PlainApp" && uniteConfiguration.e2eTestRunner === "WebdriverIO");

        const babelConfiguration = engineVariables.getConfiguration<BabelConfiguration>("Babel");
        if (babelConfiguration) {
            ArrayHelper.addRemove(babelConfiguration.plugins, "transform-decorators-legacy", uniteConfiguration.applicationFramework === "Angular");
        }

        if (uniteConfiguration.applicationFramework === "Angular") {
            //     const protractorConfiguration = engineVariables.getConfiguration<ProtractorConfiguration>("Protractor");
            //     if (protractorConfiguration) {
            //         const plugin = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder,
            //                                                                         fileSystem.pathCombine(engineVariables.www.packageFolder, "unitejs-plain-protractor-plugin")));
            //         protractorConfiguration.plugins.push({ path: plugin });
            //     }
            //     const webdriverIoPlugins = engineVariables.getConfiguration<string[]>("WebdriverIO.Plugins");
            //     if (webdriverIoPlugins) {
            //         webdriverIoPlugins.push("unitejs-plain-webdriver-plugin");
            //     }

            const esLintConfiguration = engineVariables.getConfiguration<EsLintConfiguration>("ESLint");
            if (esLintConfiguration) {
                esLintConfiguration.parser = "babel-eslint";
            }

            const typeScriptConfiguration = engineVariables.getConfiguration<TypeScriptConfiguration>("TypeScript");
            if (typeScriptConfiguration) {
                typeScriptConfiguration.compilerOptions.experimentalDecorators = true;
            }

            let ret = await this.generateAppSource(logger, fileSystem, uniteConfiguration, engineVariables, ["app.component", "app.module", "child/child.component", "bootstrapper", "entryPoint"]);

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

    public toggleDependencies(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): void {
        const packages = ["core", "common", "compiler", "platform-browser", "platform-browser-dynamic", "http", "router", "forms"];

        packages.forEach(pkg => {
            engineVariables.toggleClientPackage(
                `@angular/${pkg}`,
                `bundles/${pkg}.umd.js`,
                `bundles/${pkg}.umd.min.js`,
                false,
                "both",
                false,
                false,
                undefined,
                uniteConfiguration.applicationFramework === "Angular");
        });

        engineVariables.toggleClientPackage(
            "rxjs",
            "*",
            undefined,
            false,
            "both",
            false,
            false,
            undefined,
            uniteConfiguration.applicationFramework === "Angular");

        engineVariables.toggleClientPackage(
            "core-js",
            "client/shim.js",
            "client/shim.js",
            false,
            "both",
            true,
            false,
            undefined,
            uniteConfiguration.applicationFramework === "Angular");

        engineVariables.toggleClientPackage(
            "zone.js",
            "dist/zone.js",
            "dist/zone.min.js",
            false,
            "both",
            true,
            false,
            undefined,
            uniteConfiguration.applicationFramework === "Angular");

        engineVariables.toggleClientPackage(
            "reflect-metadata",
            "Reflect.js",
            undefined,
            false,
            "both",
            true,
            false,
            undefined,
            uniteConfiguration.applicationFramework === "Angular");
    }
}
