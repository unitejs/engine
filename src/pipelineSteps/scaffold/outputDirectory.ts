/**
 * Pipeline step to create output directory.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class OutputDirectory extends EnginePipelineStepBase {
    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            logger.info("Creating Root Directory", { rootFolder: engineVariables.rootFolder });
            await fileSystem.directoryCreate(engineVariables.rootFolder);
        } catch (err) {
            logger.error("Creating Root Directory failed", err, { wwwFolder: engineVariables.rootFolder });
            return 1;
        }

        try {
            logger.info("Creating WWW Directory", { wwwFolder: engineVariables.wwwRootFolder });
            await fileSystem.directoryCreate(engineVariables.wwwRootFolder);
        } catch (err) {
            logger.error("Creating WWW Directory failed", err, { wwwFolder: engineVariables.wwwRootFolder });
            return 1;
        }

        try {
            logger.info("Creating Packaged Directory", { wwwFolder: engineVariables.packagedRootFolder });
            await fileSystem.directoryCreate(engineVariables.packagedRootFolder);
            return 0;
        } catch (err) {
            logger.error("Creating Packaged Directory failed", err, { wwwFolder: engineVariables.packagedRootFolder });
            return 1;
        }
    }
}
