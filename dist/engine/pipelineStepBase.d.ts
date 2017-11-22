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
    initialise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number>;
    configure(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number>;
    finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number>;
    copyFile(logger: ILogger, fileSystem: IFileSystem, sourceFolder: string, sourceFilename: string, destFolder: string, destFilename: string, force: boolean, noCreate: boolean, replacements?: {
        [id: string]: string[];
    }): Promise<number>;
    folderToggle(logger: ILogger, fileSystem: IFileSystem, folder: string, force: boolean, mainCondition: boolean): Promise<number>;
    folderCreate(logger: ILogger, fileSystem: IFileSystem, folder: string): Promise<number>;
    folderDelete(logger: ILogger, fileSystem: IFileSystem, folder: string, force: boolean): Promise<number>;
    wrapGeneratedMarker(before: string, after: string): string;
    fileHasGeneratedMarker(fileSystem: IFileSystem, folder: string, filename: string): Promise<MarkerState>;
    fileReadJson<T>(logger: ILogger, fileSystem: IFileSystem, folder: string, filename: string, force: boolean, jsonCallback: (obj: T) => Promise<number>): Promise<number>;
    fileReadText(logger: ILogger, fileSystem: IFileSystem, folder: string, filename: string, force: boolean, textCallback: (text: string) => Promise<number>): Promise<number>;
    fileReadLines(logger: ILogger, fileSystem: IFileSystem, folder: string, filename: string, force: boolean, linesCallback: (lines: string[]) => Promise<number>): Promise<number>;
    fileToggleLines(logger: ILogger, fileSystem: IFileSystem, folder: string, filename: string, force: boolean, mainCondition: boolean, linesGenerator: () => Promise<string[]>): Promise<number>;
    fileToggleText(logger: ILogger, fileSystem: IFileSystem, folder: string, filename: string, force: boolean, mainCondition: boolean, textGenerator: () => Promise<string>): Promise<number>;
    fileToggleJson(logger: ILogger, fileSystem: IFileSystem, folder: string, filename: string, force: boolean, mainCondition: boolean, jsonGenerator: () => Promise<any>): Promise<number>;
    fileWriteLines(logger: ILogger, fileSystem: IFileSystem, folder: string, filename: string, force: boolean, linesGenerator: () => Promise<string[]>): Promise<number>;
    fileWriteText(logger: ILogger, fileSystem: IFileSystem, folder: string, filename: string, force: boolean, textGenerator: () => Promise<string>): Promise<number>;
    fileWriteJson(logger: ILogger, fileSystem: IFileSystem, folder: string, filename: string, force: boolean, jsonGenerator: () => Promise<any>): Promise<number>;
    fileDeleteText(logger: ILogger, fileSystem: IFileSystem, folder: string, filename: string, force: boolean): Promise<number>;
    fileDeleteLines(logger: ILogger, fileSystem: IFileSystem, folder: string, filename: string, force: boolean): Promise<number>;
    fileDeleteJson(logger: ILogger, fileSystem: IFileSystem, folder: string, filename: string, force: boolean): Promise<number>;
    condition(uniteConfigurationKey: string, value: string): boolean;
    objectCondition(uniteConfigurationObject: any, value: string): boolean;
    arrayCondition(uniteConfigurationArray: string[], value: string): boolean;
    internalDeleteFolder(logger: ILogger, fileSystem: IFileSystem, folder: string): Promise<number>;
}
