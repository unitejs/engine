import { IDisplay } from "../interfaces/IDisplay";
import { IEngine } from "../interfaces/IEngine";
import { IFileSystem } from "../interfaces/IFileSystem";
import { ILogger } from "../interfaces/ILogger";
export declare class Engine implements IEngine {
    private _logger;
    private _display;
    private _fileSystem;
    constructor(logger: ILogger, display: IDisplay, fileSystem: IFileSystem);
    init(packageName: string | undefined | null, language: string | undefined | null, outputDirectory: string | undefined | null): Promise<number>;
}
