/**
 * Pipeline step to generate scaffolding for Aurelia application.
 */
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { IDisplay } from "../../interfaces/IDisplay";
import { IFileSystem } from "../../interfaces/IFileSystem";
import { ILogger } from "../../interfaces/ILogger";
import { SharedAppFramework } from "./sharedAppFramework";

export class Aurelia extends SharedAppFramework {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["aurelia-protractor-plugin"], uniteConfiguration.applicationFramework === "Aurelia" && uniteConfiguration.e2eTestRunner === "Protractor");
        engineVariables.protractorPlugins["aurelia-protractor-plugin"] = uniteConfiguration.applicationFramework === "Aurelia" && uniteConfiguration.e2eTestRunner === "Protractor";

        this.toggleAllPackages(uniteConfiguration, engineVariables);

        if (uniteConfiguration.applicationFramework === "Aurelia") {
            if (uniteConfiguration.bundler === "Browserify" || uniteConfiguration.bundler === "Webpack") {
                super.error(logger, display, "Aurelia does not currently support bundling with " + uniteConfiguration.bundler);
                return 1;
            }

            let ret = await this.generateAppSource(logger, display, fileSystem, uniteConfiguration, engineVariables, ["app", "bootstrapper", "entryPoint", "child/child"]);

            if (ret === 0) {
                ret = await super.generateAppHtml(logger, display, fileSystem, uniteConfiguration, engineVariables, ["app", "child/child"]);

                if (ret === 0) {
                    ret = await super.generateAppCss(logger, display, fileSystem, uniteConfiguration, engineVariables, ["child/child"]);

                    if (ret === 0) {
                        ret = await super.generateE2eTest(logger, display, fileSystem, uniteConfiguration, engineVariables, ["app"]);

                        if (ret === 0) {
                            ret = await this.generateUnitTest(logger, display, fileSystem, uniteConfiguration, engineVariables, ["app", "bootstrapper"]);

                            if (ret === 0) {
                                ret = await super.generateCss(logger, display, fileSystem, uniteConfiguration, engineVariables);
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

        if (uniteConfiguration.moduleType === "AMD") {
            location += "amd/";
        } else if (uniteConfiguration.moduleType === "CommonJS") {
            location += "commonjs/";
        } else if (uniteConfiguration.moduleType === "SystemJS") {
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
            false,
            "both",
            false,
            uniteConfiguration.applicationFramework === "Aurelia");
    }

    private toggleClientPackages(uniteConfiguration: UniteConfiguration,
                                 engineVariables: EngineVariables,
                                 location: string,
                                 clientPackages: { name: string, isPackage?: boolean }[]): void {

        clientPackages.forEach(clientPackage => {
            engineVariables.toggleClientPackage(
                clientPackage.name,
                location + clientPackage.name + ".js",
                undefined,
                false,
                "both",
                clientPackage.isPackage ? true : false,
                uniteConfiguration.applicationFramework === "Aurelia");
        });
    }
}