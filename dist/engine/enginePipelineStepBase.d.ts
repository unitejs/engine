/**
 * Base implementation of engine pipeline step.
 */
import { IDisplay } from "unitejs-framework/dist/interfaces/IDisplay";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { IEnginePipelineStep } from "../interfaces/IEnginePipelineStep";
import { EngineVariables } from "./engineVariables";
export declare abstract class EnginePipelineStepBase implements IEnginePipelineStep {
    static MARKER: string;
    prerequisites(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number>;
    abstract process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number>;
    log(logger: ILogger, display: IDisplay, message: string, args?: {
        [id: string]: any;
    }): void;
    error(logger: ILogger, display: IDisplay, message: string, err?: any, args?: {
        [id: string]: any;
    }): void;
    copyFile(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, sourceFolder: string, sourceFilename: string, destFolder: string, destFilename: string): Promise<void>;
    deleteFile(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, folder: string, filename: string): Promise<number>;
    wrapGeneratedMarker(before: string, after: string): string;
    fileHasGeneratedMarker(fileSystem: IFileSystem, folder: string, filename: string): Promise<boolean>;
}
