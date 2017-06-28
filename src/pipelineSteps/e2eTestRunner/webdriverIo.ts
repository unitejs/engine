/**
 * Pipeline step to generate WebdriverIO configuration.
 */
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { WebdriverIoConfiguration } from "../../configuration/models/webdriverIo/webdriverIoConfiguration";
import { JsonHelper } from "../../core/jsonHelper";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";
import { IDisplay } from "../../interfaces/IDisplay";
import { IFileSystem } from "../../interfaces/IFileSystem";
import { ILogger } from "../../interfaces/ILogger";

export class WebdriverIo extends EnginePipelineStepBase {
    private static FILENAME: string = "wdio.conf.js";

    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDependencies(["webdriverio",
                                            "wdio-spec-reporter",
                                            "wdio-allure-reporter",
                                            "browser-sync",
                                            "selenium-standalone",
                                            "allure-commandline"],
                                           uniteConfiguration.e2eTestRunner === "WebdriverIO",
                                           true);

        engineVariables.toggleDependencies(["wdio-jasmine-framework"], uniteConfiguration.e2eTestRunner === "WebdriverIO" && uniteConfiguration.e2eTestFramework === "Jasmine", true);
        engineVariables.toggleDependencies(["wdio-mocha-framework"], uniteConfiguration.e2eTestRunner === "WebdriverIO" && uniteConfiguration.e2eTestFramework === "Mocha-Chai", true);
        engineVariables.toggleDependencies(["@types/webdriverio"], uniteConfiguration.e2eTestRunner === "WebdriverIO" && uniteConfiguration.sourceLanguage === "TypeScript", true);

        if (uniteConfiguration.e2eTestRunner === "WebdriverIO") {
            try {
                const hasGeneratedMarker = await super.fileHasGeneratedMarker(fileSystem, engineVariables.rootFolder, WebdriverIo.FILENAME);

                if (hasGeneratedMarker) {
                    super.log(logger, display, `Generating ${WebdriverIo.FILENAME}`);

                    const lines: string[] = [];
                    this.generateConfig(fileSystem, uniteConfiguration, engineVariables, lines);
                    await fileSystem.fileWriteLines(engineVariables.rootFolder, WebdriverIo.FILENAME, lines);
                } else {
                    super.log(logger, display, `Skipping ${WebdriverIo.FILENAME} as it has no generated marker`);
                }

                return 0;
            } catch (err) {
                super.error(logger, display, `Generating ${WebdriverIo.FILENAME} failed`, err);
                return 1;
            }
        } else {
            try {
                const exists = await fileSystem.fileExists(engineVariables.rootFolder, WebdriverIo.FILENAME);
                if (exists) {
                    await fileSystem.fileDelete(engineVariables.rootFolder, WebdriverIo.FILENAME);
                }
            } catch (err) {
                super.error(logger, display, `Deleting ${WebdriverIo.FILENAME} failed`, err);
                return 1;
            }
        }

        return 0;
    }

    private generateConfig(fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, lines: string[]): void {
        const reportsFolder = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.rootFolder, engineVariables.reportsFolder));

        const webdriverConfiguration = new WebdriverIoConfiguration();
        webdriverConfiguration.baseUrl = "http://localhost:9000";
        webdriverConfiguration.specs = [
            fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.rootFolder, fileSystem.pathCombine(engineVariables.e2eTestDistFolder, "**/*.spec.js")))
        ];
        webdriverConfiguration.capabilities = [
            {
                browserName: "chrome"
            }
        ];
        webdriverConfiguration.sync = true;

        if (uniteConfiguration.e2eTestFramework === "Jasmine") {
            webdriverConfiguration.framework = "jasmine";
        } else if (uniteConfiguration.e2eTestFramework === "Mocha-Chai") {
            webdriverConfiguration.framework = "mocha";
        }
        webdriverConfiguration.reporters = ["spec", "allure"];
        webdriverConfiguration.reporterOptions = {
            allure: {
                outputDir: reportsFolder + "/e2etemp/"
            }
        };

        lines.push("exports.config = " + JsonHelper.codify(webdriverConfiguration));
        lines.push(super.wrapGeneratedMarker("/* ", " */"));
    }
}