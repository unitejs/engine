import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { PackageConfiguration } from "../../configuration/models/packages/packageConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";
import { IPackageManager } from "../../interfaces/IPackageManager";
export declare class Npm extends EnginePipelineStepBase implements IPackageManager {
    process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number>;
    info(logger: ILogger, fileSystem: IFileSystem, packageName: string, version: string): Promise<PackageConfiguration>;
    add(logger: ILogger, fileSystem: IFileSystem, workingDirectory: string, packageName: string, version: string, isDev: boolean): Promise<any>;
    remove(logger: ILogger, fileSystem: IFileSystem, workingDirectory: string, packageName: string, isDev: boolean): Promise<any>;
}
