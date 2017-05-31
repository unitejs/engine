import { UniteModuleLoader } from "../configuration/models/unite/uniteModuleLoader";
import { UniteSourceLanguage } from "../configuration/models/unite/uniteSourceLanguage";
import { IDisplay } from "../interfaces/IDisplay";
import { IEngine } from "../interfaces/IEngine";
import { IFileSystem } from "../interfaces/IFileSystem";
import { ILogger } from "../interfaces/ILogger";
import { ModuleOperation } from "../interfaces/moduleOperation";
export declare class Engine implements IEngine {
    private _logger;
    private _display;
    private _fileSystem;
    constructor(logger: ILogger, display: IDisplay, fileSystem: IFileSystem);
    init(packageName: string | undefined | null, title: string | undefined | null, sourceLanguage: UniteSourceLanguage | undefined | null, moduleLoader: UniteModuleLoader | undefined | null, sourceMaps: boolean, outputDirectory: string | undefined | null): Promise<number>;
    module(operation: ModuleOperation | undefined | null, name: string | undefined | null): Promise<number>;
}
