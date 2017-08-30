/**
 * Pipeline step to generate scaffolding for plain application.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { ProtractorConfiguration } from "../../configuration/models/protractor/protractorConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { SharedAppFramework } from "../sharedAppFramework";

export class PlainApp extends SharedAppFramework {
    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["unitejs-plain-protractor-plugin"],
                                            super.condition(uniteConfiguration.applicationFramework, "PlainApp") && super.condition(uniteConfiguration.e2eTestRunner, "Protractor"));

        engineVariables.toggleDevDependency(["unitejs-plain-webdriver-plugin"],
                                            super.condition(uniteConfiguration.applicationFramework, "PlainApp") && super.condition(uniteConfiguration.e2eTestRunner, "WebdriverIO"));

        if (super.condition(uniteConfiguration.applicationFramework, "PlainApp")) {
            const protractorConfiguration = engineVariables.getConfiguration<ProtractorConfiguration>("Protractor");
            if (protractorConfiguration) {
                const plugin = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder,
                                                                                fileSystem.pathCombine(engineVariables.www.packageFolder, "unitejs-plain-protractor-plugin")));
                protractorConfiguration.plugins.push({ path: plugin });
            }
            const webdriverIoPlugins = engineVariables.getConfiguration<string[]>("WebdriverIO.Plugins");
            if (webdriverIoPlugins) {
                webdriverIoPlugins.push("unitejs-plain-webdriver-plugin");
            }

            let ret = await this.generateAppSource(logger, fileSystem, uniteConfiguration, engineVariables, ["app", "bootstrapper", "entryPoint"]);

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
