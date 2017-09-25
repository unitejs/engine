/**
 * Pipeline step to generate scaffolding for unit tests.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class UnitTestScaffold extends PipelineStepBase {
    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables) : boolean | undefined {
        return !super.condition(uniteConfiguration.unitTestRunner, "None");
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        return await super.folderToggle(logger, fileSystem, engineVariables.www.unitTestFolder, engineVariables.force, mainCondition);
    }
}
