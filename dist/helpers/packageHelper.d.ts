/**
 * Package helper
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
export declare class PackageHelper {
    static locate(fileSystem: IFileSystem, logger: ILogger, initialDir: string, packageName: string): Promise<string>;
}
