/**
 * Base implementation of engine pipeline step.
 */
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { IDisplay } from "../interfaces/IDisplay";
import { IEnginePipelineStep } from "../interfaces/IEnginePipelineStep";
import { IFileSystem } from "../interfaces/IFileSystem";
import { ILogger } from "../interfaces/ILogger";
export declare abstract class EnginePipelineStepBase implements IEnginePipelineStep {
    abstract process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration): Promise<number>;
    log(logger: ILogger, display: IDisplay, message: string, args: {
        [id: string]: any;
    }): void;
    error(logger: ILogger, display: IDisplay, message: string, err: any, args: {
        [id: string]: any;
    }): void;
}
