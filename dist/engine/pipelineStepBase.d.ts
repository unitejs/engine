/**
 * Base implementation of engine pipeline step.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { IPipelineStep } from "../interfaces/IPipelineStep";
import { EngineVariables } from "./engineVariables";
import { MarkerState } from "./markerState";
export declare abstract class PipelineStepBase implements IPipelineStep {
    static MARKER: string;
    mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): boolean | undefined;
    initialise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number>;
    install(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number>;
    uninstall(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number>;
    finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number>;
    copyFile(logger: ILogger, fileSystem: IFileSystem, sourceFolder: string, sourceFilename: string, destFolder: string, destFilename: string, force: boolean, replacements?: {
        [id: string]: string[];
    }): Promise<number>;
    deleteFileText(logger: ILogger, fileSystem: IFileSystem, folder: string, filename: string, force: boolean): Promise<number>;
    deleteFileLines(logger: ILogger, fileSystem: IFileSystem, folder: string, filename: string, force: boolean): Promise<number>;
    deleteFileJson(logger: ILogger, fileSystem: IFileSystem, folder: string, filename: string, force: boolean): Promise<number>;
    createFolder(logger: ILogger, fileSystem: IFileSystem, folder: string): Promise<number>;
    deleteFolder(logger: ILogger, fileSystem: IFileSystem, folder: string, force: boolean): Promise<number>;
    wrapGeneratedMarker(before: string, after: string): string;
    fileHasGeneratedMarker(fileSystem: IFileSystem, folder: string, filename: string): Promise<MarkerState>;
    fileReadJson<T>(logger: ILogger, fileSystem: IFileSystem, folder: string, filename: string, force: boolean, jsonCallback: (obj: T) => Promise<number>): Promise<number>;
    fileReadText(logger: ILogger, fileSystem: IFileSystem, folder: string, filename: string, force: boolean, textCallback: (text: string) => Promise<number>): Promise<number>;
    fileReadLines(logger: ILogger, fileSystem: IFileSystem, folder: string, filename: string, force: boolean, linesCallback: (lines: string[]) => Promise<number>): Promise<number>;
    fileWriteLines(logger: ILogger, fileSystem: IFileSystem, folder: string, filename: string, force: boolean, linesGenerator: () => Promise<string[]>): Promise<number>;
    fileWriteText(logger: ILogger, fileSystem: IFileSystem, folder: string, filename: string, force: boolean, textGenerator: () => Promise<string>): Promise<number>;
    fileWriteJson(logger: ILogger, fileSystem: IFileSystem, folder: string, filename: string, force: boolean, jsonGenerator: () => Promise<any>): Promise<number>;
    condition(uniteConfigurationKey: string, value: string): boolean;
    objectCondition(uniteConfigurationObject: any, value: string): boolean;
    internalDeleteFolder(logger: ILogger, fileSystem: IFileSystem, folder: string): Promise<number>;
}
