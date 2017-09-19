/**
 * Pipeline step to generate mocha configuration.
 */
import { ArrayHelper } from "unitejs-framework/dist/helpers/arrayHelper";
import { ObjectHelper } from "unitejs-framework/dist/helpers/objectHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { EsLintConfiguration } from "../../configuration/models/eslint/esLintConfiguration";
import { KarmaConfiguration } from "../../configuration/models/karma/karmaConfiguration";
import { ProtractorConfiguration } from "../../configuration/models/protractor/protractorConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { WebdriverIoConfiguration } from "../../configuration/models/webdriverIo/webdriverIoConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class MochaChai extends PipelineStepBase {
    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables) : boolean | undefined {
        return super.condition(uniteConfiguration.unitTestFramework, "MochaChai") || super.condition(uniteConfiguration.e2eTestFramework, "MochaChai");
    }

    public async install(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        const isUnit = super.condition(uniteConfiguration.unitTestFramework, "MochaChai");
        const isE2E = super.condition(uniteConfiguration.e2eTestFramework, "MochaChai");

        engineVariables.toggleDevDependency(["mocha"], true);
        engineVariables.toggleDevDependency(["@types/mocha", "@types/chai"], super.condition(uniteConfiguration.sourceLanguage, "TypeScript"));

        engineVariables.toggleDevDependency(["karma-mocha", "karma-chai"], super.condition(uniteConfiguration.unitTestRunner, "Karma") && isUnit);

        engineVariables.toggleDevDependency(["mochawesome-screenshots"], super.condition(uniteConfiguration.e2eTestRunner, "Protractor") && isE2E);

        engineVariables.toggleDevDependency(["wdio-mocha-framework"], super.condition(uniteConfiguration.e2eTestRunner, "WebdriverIO") && isE2E);

        engineVariables.toggleClientPackage(
            "chai",
            "chai.js",
            undefined,
            undefined,
            true,
            "test",
            "none",
            false,
            undefined,
            undefined,
            undefined,
            undefined,
            true);

        const esLintConfiguration = engineVariables.getConfiguration<EsLintConfiguration>("ESLint");
        if (esLintConfiguration) {
            ObjectHelper.addRemove(esLintConfiguration.env, "mocha", true, true);
        }

        const karmaConfiguration = engineVariables.getConfiguration<KarmaConfiguration>("Karma");
        if (karmaConfiguration) {
            ArrayHelper.addRemove(karmaConfiguration.frameworks, "mocha", isUnit);
        }

        if (isE2E) {
            const protractorConfiguration = engineVariables.getConfiguration<ProtractorConfiguration>("Protractor");
            if (protractorConfiguration) {
                ObjectHelper.addRemove(protractorConfiguration, "framework", "mocha", true);

                const reportsFolder = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, engineVariables.www.reportsFolder));

                ObjectHelper.addRemove(protractorConfiguration, "mochaOpts", {
                                            reporter: "mochawesome-screenshots",
                                            reporterOptions: {
                                                reportDir: `${reportsFolder}/e2e/`,
                                                reportName: "index",
                                                takePassedScreenshot: true
                                            },
                                            timeout: 10000
                                        },
                                       true);
            }

            const webdriverIoConfiguration = engineVariables.getConfiguration<WebdriverIoConfiguration>("WebdriverIO");
            if (webdriverIoConfiguration) {
                ObjectHelper.addRemove(webdriverIoConfiguration, "framework", "mocha", true);
            }
        }

        return 0;
    }

    public async uninstall(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["mocha"], false);
        engineVariables.toggleDevDependency(["@types/mocha", "@types/chai"], false);

        engineVariables.toggleDevDependency(["karma-mocha", "karma-chai"], false);

        engineVariables.toggleDevDependency(["mochawesome-screenshots"], false);

        engineVariables.toggleDevDependency(["wdio-mocha-framework"], false);

        engineVariables.removeClientPackage("chai");

        const esLintConfiguration = engineVariables.getConfiguration<EsLintConfiguration>("ESLint");
        if (esLintConfiguration) {
            ObjectHelper.addRemove(esLintConfiguration.env, "mocha", true, false);
        }

        const karmaConfiguration = engineVariables.getConfiguration<KarmaConfiguration>("Karma");
        if (karmaConfiguration) {
            ArrayHelper.addRemove(karmaConfiguration.frameworks, "mocha", false);
        }

        const protractorConfiguration = engineVariables.getConfiguration<ProtractorConfiguration>("Protractor");
        if (protractorConfiguration) {
            ObjectHelper.addRemove(protractorConfiguration, "framework", "mocha", false);
            ObjectHelper.addRemove(protractorConfiguration, "mochaOpts", undefined, false);
        }

        const webdriverIoConfiguration = engineVariables.getConfiguration<WebdriverIoConfiguration>("WebdriverIO");
        if (webdriverIoConfiguration) {
            ObjectHelper.addRemove(webdriverIoConfiguration, "framework", "mocha", false);
        }

        return 0;
    }
}
