import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { PackageConfiguration } from "../../configuration/models/packages/packageConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";
import { IPackageManager } from "../../interfaces/IPackageManager";
export declare class Yarn extends PipelineStepBase implements IPackageManager {
    mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): boolean | undefined;
    configure(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number>;
    info(logger: ILogger, fileSystem: IFileSystem, packageName: string, version: string): Promise<PackageConfiguration>;
    add(logger: ILogger, fileSystem: IFileSystem, workingDirectory: string, packageName: string, version: string, isDev: boolean): Promise<any>;
    remove(logger: ILogger, fileSystem: IFileSystem, workingDirectory: string, packageName: string, isDev: boolean): Promise<any>;
}
