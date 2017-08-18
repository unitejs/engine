/**
 * Base implementation of engine pipeline step.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { IEnginePipelineStep } from "../interfaces/IEnginePipelineStep";
import { EngineVariables } from "./engineVariables";
export declare abstract class EnginePipelineStepBase implements IEnginePipelineStep {
    static MARKER: string;
    preProcess(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number>;
    abstract process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number>;
    copyFile(logger: ILogger, fileSystem: IFileSystem, sourceFolder: string, sourceFilename: string, destFolder: string, destFilename: string): Promise<number>;
    deleteFile(logger: ILogger, fileSystem: IFileSystem, folder: string, filename: string): Promise<number>;
    wrapGeneratedMarker(before: string, after: string): string;
    fileHasGeneratedMarker(fileSystem: IFileSystem, folder: string, filename: string): Promise<boolean>;
}
