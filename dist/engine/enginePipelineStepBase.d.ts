/**
 * Base implementation of engine pipeline step.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { IEnginePipelineStep } from "../interfaces/IEnginePipelineStep";
import { EngineVariables } from "./engineVariables";
import { MarkerState } from "./markerState";
export declare abstract class EnginePipelineStepBase implements IEnginePipelineStep {
    static MARKER: string;
    initialise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number>;
    abstract process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number>;
    copyFile(logger: ILogger, fileSystem: IFileSystem, sourceFolder: string, sourceFilename: string, destFolder: string, destFilename: string, force: boolean): Promise<number>;
    deleteFile(logger: ILogger, fileSystem: IFileSystem, folder: string, filename: string, force: boolean): Promise<number>;
    wrapGeneratedMarker(before: string, after: string): string;
    fileHasGeneratedMarker(fileSystem: IFileSystem, folder: string, filename: string): Promise<MarkerState>;
    condition(uniteConfigurationKey: string, value: string): boolean;
    objectCondition(uniteConfigurationObject: any, value: string): boolean;
}
