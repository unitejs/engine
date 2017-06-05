/**
 * Base implementation of engine pipeline step.
 */
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { ErrorHandler } from "../core/errorHandler";
import { IDisplay } from "../interfaces/IDisplay";
import { IEnginePipelineStep } from "../interfaces/IEnginePipelineStep";
import { IFileSystem } from "../interfaces/IFileSystem";
import { ILogger } from "../interfaces/ILogger";
import { EngineVariables } from "./engineVariables";

export abstract class EnginePipelineStepBase implements IEnginePipelineStep {
    public abstract process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number>;

    public log(logger: ILogger, display: IDisplay, message: string, args?: { [id: string]: any}): void {
        display.log(message + ": " + this.arrayToReadable(args));
        logger.log(message, args);
    }

    public error(logger: ILogger, display: IDisplay, message: string, err: any, args?: { [id: string]: any}): void {
        if (err) {
            display.error(message + ": " + ErrorHandler.format(err));
            logger.exception(message, err, args);
        } else {
            display.error(message + ": " + this.arrayToReadable(args));
            logger.error(message, args);
        }
    }

    public async copyFile(logger: ILogger, display: IDisplay, fileSystem: IFileSystem,
                          sourceFolder: string, sourceFilename: string, destFolder: string, destFilename: string, replacer?: ((line: string) => string) | undefined): Promise<void> {
        this.log(logger, display, "Copying " + sourceFilename, { from: sourceFolder, to: destFolder });

        let lines = await fileSystem.fileReadLines(sourceFolder, sourceFilename);
        if (replacer) {
            lines = lines.map(replacer);
        }
        await fileSystem.fileWriteLines(destFolder, destFilename, lines);
    }

    private arrayToReadable(args?: { [id: string]: any}): string {
        if (!args) {
            return "";
        } else {
            const objKeys = Object.keys(args);
            return (objKeys.length === 0 ? "" : (objKeys.length === 1 ? args[objKeys[0]] : JSON.stringify(args)));
        }
    }
}
