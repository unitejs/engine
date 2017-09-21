/**
 * Interface for engine command.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { PackageConfiguration } from "../configuration/models/packages/packageConfiguration";
import { IEngineCommandParams } from "./IEngineCommandParams";

export interface IEngineCommand<T extends IEngineCommandParams> {
    create(logger: ILogger, fileSystem: IFileSystem, engineRootFolder: string, enginePackageJson: PackageConfiguration): void;

    run(args: T): Promise<number>;
}
