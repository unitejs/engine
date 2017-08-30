/**
 * Interface for package manager.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { PackageConfiguration } from "../configuration/models/packages/packageConfiguration";
import { IEnginePipelineStep } from "./IEnginePipelineStep";
export interface IPackageManager extends IEnginePipelineStep {
    info(logger: ILogger, fileSystem: IFileSystem, packageName: string): Promise<PackageConfiguration>;
    add(logger: ILogger, fileSystem: IFileSystem, workingDirectory: string, packageName: string, version: string, isDev: boolean): Promise<void>;
    remove(logger: ILogger, fileSystem: IFileSystem, workingDirectory: string, packageName: string, isDev: boolean): Promise<void>;
}
