/**
 * Pipeline step to generate scaffolding for e2e tests.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class E2eTestScaffold extends PipelineStepBase {
    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables) : boolean | undefined {
        return !super.condition(uniteConfiguration.e2eTestRunner, "None");
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        return await super.folderToggle(logger, fileSystem, engineVariables.www.e2eTestFolder, engineVariables.force, mainCondition);
    }
}
