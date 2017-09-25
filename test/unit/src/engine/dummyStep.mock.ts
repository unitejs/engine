/**
 * Pipeline step for testing.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../../../dist/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../dist/engine/engineVariables";
import { PipelineStepBase } from "../../../../dist/engine/pipelineStepBase";

export class DummyStep extends PipelineStepBase {
    public async initialise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        return 0;
    }

    public async configure(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        return 0;
    }
}
