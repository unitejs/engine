/**
 * Pipeline step to generate jsdom configuration.
 */
import { ArrayHelper } from "unitejs-framework/dist/helpers/arrayHelper";
import { ObjectHelper } from "unitejs-framework/dist/helpers/objectHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { JestConfiguration } from "../../configuration/models/jest/jestConfiguration";
import { KarmaConfiguration } from "../../configuration/models/karma/karmaConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class JsDom extends PipelineStepBase {
    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables) : boolean | undefined {
        return super.condition(uniteConfiguration.unitTestEngine, "JSDom");
    }

    public async configure(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        engineVariables.toggleDevDependency(["jsdom"], mainCondition);
        engineVariables.toggleDevDependency(["karma-jsdom-launcher"], mainCondition && super.condition(uniteConfiguration.unitTestRunner, "Karma"));

        const karmaConfiguration = engineVariables.getConfiguration<KarmaConfiguration>("Karma");
        if (karmaConfiguration) {
            ArrayHelper.addRemove(karmaConfiguration.browsers, "jsdom", mainCondition && super.condition(uniteConfiguration.unitTestRunner, "Karma"));
        }

        const jestConfiguration = engineVariables.getConfiguration<JestConfiguration>("Jest");
        if (karmaConfiguration) {
            ObjectHelper.addRemove(jestConfiguration, "testEnvironment", "jsdom", mainCondition && super.condition(uniteConfiguration.unitTestRunner, "Jest"));
        }

        return 0;
    }
}
