/**
 * Interface for pipeline steps.
 */
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { IDisplay } from "./IDisplay";
import { IFileSystem } from "./IFileSystem";
import { ILogger } from "./ILogger";

export interface IEnginePipelineStep {
    process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration): Promise<number>;
}