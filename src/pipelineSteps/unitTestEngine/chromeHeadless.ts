/**
 * Pipeline step to generate chrome headless configuration.
 */
import { ArrayHelper } from "unitejs-framework/dist/helpers/arrayHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { KarmaConfiguration } from "../../configuration/models/karma/karmaConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineKey } from "../../engine/pipelineKey";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class ChromeHeadless extends PipelineStepBase {
    public influences(): PipelineKey[] {
        return [
            new PipelineKey("unite", "uniteConfigurationJson"),
            new PipelineKey("content", "packageJson"),
            new PipelineKey("unitTestRunner", "karma")
        ];
    }

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["karma-chrome-launcher"],
                                            super.condition(uniteConfiguration.unitTestRunner, "Karma") &&
                                            super.condition(uniteConfiguration.unitTestEngine, "ChromeHeadless"));

        const karmaConfiguration = engineVariables.getConfiguration<KarmaConfiguration>("Karma");
        if (karmaConfiguration) {
            ArrayHelper.addRemove(karmaConfiguration.browsers, "ChromeHeadless",
                                  super.condition(uniteConfiguration.unitTestRunner, "Karma") && super.condition(uniteConfiguration.unitTestEngine, "ChromeHeadless"));
        }

        return 0;
    }
}
