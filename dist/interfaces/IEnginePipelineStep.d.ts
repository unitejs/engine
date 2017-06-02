/**
 * Interface for pipeline steps.
 */
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../engine/engineVariables";
import { IDisplay } from "./IDisplay";
import { IFileSystem } from "./IFileSystem";
import { ILogger } from "./ILogger";
export interface IEnginePipelineStep {
    process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number>;
}
