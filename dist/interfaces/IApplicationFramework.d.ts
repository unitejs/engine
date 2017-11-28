/**
 * Interface for application framework.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { UnitePackageRouteConfiguration } from "../configuration/models/unitePackages/unitePackageRouteConfiguration";
import { EngineVariables } from "../engine/engineVariables";
import { IPipelineStep } from "./IPipelineStep";
export interface IApplicationFramework extends IPipelineStep {
    insertRoutes(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, routes: {
        [id: string]: UnitePackageRouteConfiguration;
    }): Promise<number>;
}
