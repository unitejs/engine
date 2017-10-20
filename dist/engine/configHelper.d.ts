/**
 * Configuration helper
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
export declare class ConfigHelper {
    static findConfigFolder(fileSystem: IFileSystem, outputDirectory: string | null | undefined): Promise<string>;
}
