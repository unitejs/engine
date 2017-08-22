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
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class MochaChai extends EnginePipelineStepBase {
    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        logger.info("Generating Mocha-Chai Configuration");

        const isUnit = uniteConfiguration.unitTestFramework === "Mocha-Chai";
        const isE2E = uniteConfiguration.e2eTestFramework === "Mocha-Chai";
        const isEither = isUnit || isE2E;

        engineVariables.toggleDevDependency(["mocha"], isEither);
        engineVariables.toggleDevDependency(["@types/mocha", "@types/chai"], uniteConfiguration.sourceLanguage === "TypeScript" && isEither);

        engineVariables.toggleDevDependency(["karma-mocha", "karma-chai"], uniteConfiguration.unitTestRunner === "Karma" && isUnit);

        engineVariables.toggleDevDependency(["mochawesome-screenshots"], uniteConfiguration.e2eTestRunner === "Protractor" && isE2E);

        engineVariables.toggleDevDependency(["wdio-mocha-framework"], uniteConfiguration.e2eTestRunner === "WebdriverIO" && isE2E);

        engineVariables.toggleClientPackage(
            "chai",
            "chai.js",
            undefined,
            true,
            "test",
            false,
            false,
            undefined,
            isEither);

        const esLintConfiguration = engineVariables.getConfiguration<EsLintConfiguration>("ESLint");
        if (esLintConfiguration) {
            ObjectHelper.addRemove(esLintConfiguration.env, "mocha", true, isEither);
        }

        const karmaConfiguration = engineVariables.getConfiguration<KarmaConfiguration>("Karma");
        if (karmaConfiguration) {
            ArrayHelper.addRemove(karmaConfiguration.frameworks, "mocha", isUnit);
        }

        if (isE2E) {
            const protractorConfiguration = engineVariables.getConfiguration<ProtractorConfiguration>("Protractor");
            if (protractorConfiguration) {
                protractorConfiguration.framework = "mocha";

                const reportsFolder = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, engineVariables.www.reportsFolder));

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

            const webdriverIoConfiguration = engineVariables.getConfiguration<WebdriverIoConfiguration>("WebdriverIO");
            if (webdriverIoConfiguration) {
                webdriverIoConfiguration.framework = "mocha";
            }
        }

        return 0;
    }
}
