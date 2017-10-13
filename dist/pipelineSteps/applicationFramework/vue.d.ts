import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { SharedAppFramework } from "../sharedAppFramework";
export declare class Vue extends SharedAppFramework {
    mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): boolean | undefined;
    configure(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number>;
    finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number>;
}
