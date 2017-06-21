import { PackageConfiguration } from "../configuration/models/packages/packageConfiguration";
import { IDisplay } from "../interfaces/IDisplay";
import { IFileSystem } from "../interfaces/IFileSystem";
import { ILogger } from "../interfaces/ILogger";
import { IPackageManager } from "../interfaces/IPackageManager";
export declare class NpmPackageManager implements IPackageManager {
    private _logger;
    private _display;
    private _fileSystem;
    constructor(logger: ILogger, display: IDisplay, fileSystem: IFileSystem);
    info(packageName: string): Promise<PackageConfiguration>;
    add(workingDirectory: string, packageName: string, version: string, isDev: boolean): Promise<void>;
    remove(workingDirectory: string, packageName: string, isDev: boolean): Promise<void>;
}
