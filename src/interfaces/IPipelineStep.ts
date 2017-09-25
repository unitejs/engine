/**
 * Interface for pipeline steps.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../engine/engineVariables";

export interface IPipelineStep {
    mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): boolean | undefined;

    initialise(logger: ILogger,
               fileSystem: IFileSystem,
               uniteConfiguration: UniteConfiguration,
               engineVariables: EngineVariables,
               mainCondition: boolean): Promise<number>;

    configure(logger: ILogger,
              fileSystem: IFileSystem,
              uniteConfiguration: UniteConfiguration,
              engineVariables: EngineVariables,
              mainCondition: boolean): Promise<number>;

    finalise(logger: ILogger,
             fileSystem: IFileSystem,
             uniteConfiguration: UniteConfiguration,
             engineVariables: EngineVariables,
             mainCondition: boolean): Promise<number>;
}
