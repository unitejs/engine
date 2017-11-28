import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { UnitePackageRouteConfiguration } from "../../configuration/models/unitePackages/unitePackageRouteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { IApplicationFramework } from "../../interfaces/IApplicationFramework";
import { SharedAppFramework } from "../sharedAppFramework";
export declare class React extends SharedAppFramework implements IApplicationFramework {
    mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): boolean | undefined;
    initialise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number>;
    configure(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number>;
    finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number>;
    insertRoutes(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, routes: {
        [id: string]: UnitePackageRouteConfiguration;
    }): Promise<number>;
}
