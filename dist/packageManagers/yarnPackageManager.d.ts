import { IDisplay } from "unitejs-framework/dist/interfaces/IDisplay";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { PackageConfiguration } from "../configuration/models/packages/packageConfiguration";
import { IPackageManager } from "../interfaces/IPackageManager";
export declare class YarnPackageManager implements IPackageManager {
    private _logger;
    private _display;
    private _fileSystem;
    constructor(logger: ILogger, display: IDisplay, fileSystem: IFileSystem);
    info(packageName: string): Promise<PackageConfiguration>;
    add(workingDirectory: string, packageName: string, version: string, isDev: boolean): Promise<void>;
    remove(workingDirectory: string, packageName: string, isDev: boolean): Promise<void>;
    private execYarn(workingDirectory, args);
}
