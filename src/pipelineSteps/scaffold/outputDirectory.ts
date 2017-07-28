/**
 * Pipeline step to create output directory.
 */
import { IDisplay } from "unitejs-framework/dist/interfaces/IDisplay";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class OutputDirectory extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            super.log(logger, display, "Creating Directory", { rootFolder: engineVariables.rootFolder });
            await fileSystem.directoryCreate(engineVariables.rootFolder);
            return 0;
        } catch (err) {
            super.error(logger, display, "Creating Directory failed", err, { rootFolder: engineVariables.rootFolder });
            return 1;
        }
    }
}
