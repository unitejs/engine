/**
 * Base implementation of engine pipeline step.
 */
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { IDisplay } from "../interfaces/IDisplay";
import { IEnginePipelineStep } from "../interfaces/IEnginePipelineStep";
import { IFileSystem } from "../interfaces/IFileSystem";
import { ILogger } from "../interfaces/ILogger";
import { EngineVariables } from "./engineVariables";
export declare abstract class EnginePipelineStepBase implements IEnginePipelineStep {
    static MARKER: string;
    abstract process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number>;
    log(logger: ILogger, display: IDisplay, message: string, args?: {
        [id: string]: any;
    }): void;
    error(logger: ILogger, display: IDisplay, message: string, err: any, args?: {
        [id: string]: any;
    }): void;
    copyFile(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, sourceFolder: string, sourceFilename: string, destFolder: string, destFilename: string): Promise<void>;
    wrapMarker(before: string, after: string): string;
    fileHasMarker(fileSystem: IFileSystem, folder: string, filename: string): Promise<boolean>;
}
