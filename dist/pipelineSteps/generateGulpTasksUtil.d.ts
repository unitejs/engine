/**
 * Pipeline step to generate gulp tasks utils.
 */
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../engine/enginePipelineStepBase";
import { EngineVariables } from "../engine/engineVariables";
import { IDisplay } from "../interfaces/IDisplay";
import { IFileSystem } from "../interfaces/IFileSystem";
import { ILogger } from "../interfaces/ILogger";
export declare class GenerateGulpTasksUtil extends EnginePipelineStepBase {
    process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number>;
    private buildUtilsDisplay(logger, display, fileSystem, uniteConfiguration, engineVariables);
    private buildUtilsBuildConfiguration(logger, display, fileSystem, uniteConfiguration, engineVariables);
}
