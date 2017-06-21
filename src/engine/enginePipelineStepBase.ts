/**
 * Base implementation of engine pipeline step.
 */
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { IDisplay } from "../interfaces/IDisplay";
import { IEnginePipelineStep } from "../interfaces/IEnginePipelineStep";
import { IFileSystem } from "../interfaces/IFileSystem";
import { ILogger } from "../interfaces/ILogger";
import { EngineVariables } from "./engineVariables";

export abstract class EnginePipelineStepBase implements IEnginePipelineStep {
    public abstract process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number>;

    public log(logger: ILogger, display: IDisplay, message: string, args?: { [id: string]: any}): void {
        display.log(message, args);
        logger.log(message, args);
    }

    public error(logger: ILogger, display: IDisplay, message: string, err: any, args?: { [id: string]: any}): void {
        display.error(message, err, args);
        logger.error(message, args);
    }

    public async copyFile(logger: ILogger, display: IDisplay, fileSystem: IFileSystem,
                          sourceFolder: string, sourceFilename: string, destFolder: string, destFilename: string): Promise<void> {
        this.log(logger, display, "Copying " + sourceFilename, { from: sourceFolder, to: destFolder });

        const lines = await fileSystem.fileReadLines(sourceFolder, sourceFilename);
        await fileSystem.fileWriteLines(destFolder, destFilename, lines);
    }
}
