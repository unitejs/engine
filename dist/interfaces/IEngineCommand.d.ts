/**
 * Interface for engine command.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { IEngineCommandParams } from "./IEngineCommandParams";
export interface IEngineCommand<T extends IEngineCommandParams> {
    create(logger: ILogger, fileSystem: IFileSystem, engineRootFolder: string, engineVersion: string, engineDependencies: {
        [id: string]: string;
    }): void;
    run(args: T): Promise<number>;
}
