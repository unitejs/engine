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
        logger.info("Generating MochaChai Configuration");

        const isUnit = super.condition(uniteConfiguration.unitTestFramework, "MochaChai");
        const isE2E = super.condition(uniteConfiguration.e2eTestFramework, "MochaChai");
        const isEither = isUnit || isE2E;

        engineVariables.toggleDevDependency(["mocha"], isEither);
        engineVariables.toggleDevDependency(["@types/mocha", "@types/chai"], super.condition(uniteConfiguration.sourceLanguage, "TypeScript") && isEither);

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
