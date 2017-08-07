/**
 * Pipeline step to generate Protractor configuration.
 */
import { JsonHelper } from "unitejs-framework/dist/helpers/jsonHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { ProtractorConfiguration } from "../../configuration/models/protractor/protractorConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class Protractor extends EnginePipelineStepBase {
    private static FILENAME: string = "protractor.conf.js";

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["protractor", "browser-sync"], uniteConfiguration.e2eTestRunner === "Protractor");
        engineVariables.toggleDevDependency(["protractor-jasmine2-html-reporter", "jasmine-spec-reporter"],
                                            uniteConfiguration.e2eTestRunner === "Protractor" && uniteConfiguration.e2eTestFramework === "Jasmine");
        engineVariables.toggleDevDependency(["mochawesome-screenshots"], uniteConfiguration.e2eTestRunner === "Protractor" && uniteConfiguration.e2eTestFramework === "Mocha-Chai");

        engineVariables.toggleDevDependency(["@types/protractor"], uniteConfiguration.e2eTestRunner === "Protractor" && uniteConfiguration.sourceLanguage === "TypeScript");

        engineVariables.lintEnv.protractor = uniteConfiguration.e2eTestRunner === "Protractor" && uniteConfiguration.linter === "ESLint";

        if (uniteConfiguration.e2eTestRunner === "Protractor") {
            try {
                const hasGeneratedMarker = await super.fileHasGeneratedMarker(fileSystem, engineVariables.wwwRootFolder, Protractor.FILENAME);

                if (hasGeneratedMarker) {
                    logger.info(`Generating ${Protractor.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder});

                    const lines: string[] = [];
                    this.generateConfig(fileSystem, uniteConfiguration, engineVariables, lines);
                    await fileSystem.fileWriteLines(engineVariables.wwwRootFolder, Protractor.FILENAME, lines);
                } else {
                    logger.info(`Skipping ${Protractor.FILENAME} as it has no generated marker`);
                }

                return 0;
            } catch (err) {
                logger.error(`Generating ${Protractor.FILENAME} failed`, err);
                return 1;
            }
        } else {
            return await super.deleteFile(logger, fileSystem, engineVariables.wwwRootFolder, Protractor.FILENAME);
        }
    }

    private generateConfig(fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, lines: string[]): void {
        const reportsFolder = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, engineVariables.www.reportsFolder));

        const protractorConfiguration = new ProtractorConfiguration();
        protractorConfiguration.baseUrl = "http://localhost:9000";
        protractorConfiguration.specs = [
            fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.e2eTestDistFolder, "**/*.spec.js")))
        ];
        protractorConfiguration.capabilities = {
            browserName: "chrome"
        };

        protractorConfiguration.plugins = [{
            path: "test/e2e/e2e-bootstrap.js"
        }];

        for (const key in engineVariables.protractorPlugins) {
            const pluginPath = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.packageFolder, key)));
            if (engineVariables.protractorPlugins[key]) {
                let exists = false;
                protractorConfiguration.plugins.forEach(plugin => {
                    if (plugin.path === pluginPath) {
                        exists = true;
                    }
                });
                if (!exists) {
                    protractorConfiguration.plugins.push({ path: pluginPath });
                }
            } else {
                protractorConfiguration.plugins.forEach((plugin, index) => {
                    if (plugin.path === pluginPath) {
                        protractorConfiguration.plugins.splice(index, 1);
                    }
                });
            }
        }

        if (uniteConfiguration.e2eTestFramework === "Jasmine") {
            lines.push("const Jasmine2HtmlReporter = require('protractor-jasmine2-html-reporter');");
            lines.push("const SpecReporter = require('jasmine-spec-reporter').SpecReporter;");

            protractorConfiguration.framework = "jasmine";
            protractorConfiguration.jasmineNodeOpts = {
                showColors: true
            };
        } else if (uniteConfiguration.e2eTestFramework === "Mocha-Chai") {
            protractorConfiguration.framework = "mocha";
            protractorConfiguration.mochaOpts = {
                reporter: "mochawesome-screenshots",
                reporterOptions: {
                    reportDir: `${reportsFolder}/e2e/`,
                    reportName: "index",
                    takePassedScreenshot: true
                },
                timeout: 10000
            };
        }

        lines.push(`exports.config = ${JsonHelper.codify(protractorConfiguration)};`);

        if (uniteConfiguration.e2eTestFramework === "Jasmine") {
            lines.push("exports.config.onPrepare = () => {");
            lines.push("    jasmine.getEnv().clearReporters();");
            lines.push("    jasmine.getEnv().addReporter(");
            lines.push("        new Jasmine2HtmlReporter({");
            lines.push(`            savePath: '${reportsFolder}/e2e/',`);
            lines.push("            fileName: 'index'");
            lines.push("        })");
            lines.push("    );");
            lines.push("    jasmine.getEnv().addReporter(");
            lines.push("        new SpecReporter({");
            lines.push("            displayStacktrace: 'all'");
            lines.push("        })");
            lines.push("    );");
            lines.push("};");
        }

        lines.push(super.wrapGeneratedMarker("/* ", " */"));
    }
}
