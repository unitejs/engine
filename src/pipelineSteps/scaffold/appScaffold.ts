/**
 * Pipeline step to generate scaffolding for app.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class AppScaffold extends EnginePipelineStepBase {
    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            logger.info("Creating App Source Directory", { appSourceFolder: engineVariables.www.srcFolder });
            await fileSystem.directoryCreate(engineVariables.www.srcFolder);
            return 0;
        } catch (err) {
            logger.error("Creating App Source Directory failed", err, { appSourceFolder: engineVariables.www.srcFolder });
            return 1;
        }
    }
}
