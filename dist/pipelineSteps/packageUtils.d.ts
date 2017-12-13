import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
export declare class PackageUtils {
    static isWindows: boolean;
    static exec(logger: ILogger, fileSystem: IFileSystem, packageName: string, workingDirectory: string, args: string[]): Promise<string>;
}
