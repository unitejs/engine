/**
 * Main engine
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { IEngine } from "../interfaces/IEngine";
import { IEngineCommandParams } from "../interfaces/IEngineCommandParams";
export declare class Engine implements IEngine {
    private _logger;
    private _fileSystem;
    private _engineRootFolder;
    private _engineVersion;
    private _engineDependencies;
    constructor(logger: ILogger, fileSystem: IFileSystem);
    initialise(): Promise<number>;
    version(): string;
    command<T extends IEngineCommandParams>(commandName: string, args: T): Promise<number>;
    private findConfigFolder(outputDirectory);
}
