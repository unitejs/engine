/**
 * Pipeline step to generate scaffolding for app.
 */
import { IDisplay } from "unitejs-framework/dist/interfaces/IDisplay";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class AppScaffold extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            super.log(logger, display, "Creating App Source Directory", { appSourceFolder: engineVariables.srcFolder });
            await fileSystem.directoryCreate(engineVariables.srcFolder);
            return 0;
        } catch (err) {
            super.error(logger, display, "Creating App Source Directory failed", err, { appSourceFolder: engineVariables.srcFolder });
            return 1;
        }
    }
}
