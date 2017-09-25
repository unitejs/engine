/**
 * Pipeline step to generate chrome headless configuration.
 */
import { ArrayHelper } from "unitejs-framework/dist/helpers/arrayHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { KarmaConfiguration } from "../../configuration/models/karma/karmaConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class ChromeHeadless extends PipelineStepBase {
    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables) : boolean | undefined {
        return super.condition(uniteConfiguration.unitTestEngine, "ChromeHeadless");
    }

    public async configure(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        engineVariables.toggleDevDependency(["karma-chrome-launcher"], mainCondition && super.condition(uniteConfiguration.unitTestRunner, "Karma"));

        const karmaConfiguration = engineVariables.getConfiguration<KarmaConfiguration>("Karma");
        if (karmaConfiguration) {
            ArrayHelper.addRemove(karmaConfiguration.browsers, "ChromeHeadless", mainCondition && super.condition(uniteConfiguration.unitTestRunner, "Karma"));
        }

        return 0;
    }
}
