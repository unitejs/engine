/**
 * Pipeline step to generate configuration for gulp.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";
export declare class Gulp extends PipelineStepBase {
    private _tasksFolder;
    private _utilFolder;
    private _distFolder;
    private _files;
    mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): boolean | undefined;
    configure(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number>;
    finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number>;
    private generateBuildDependencies;
    private generateBuildFiles;
    private generateUnitDependencies;
    private generateUnitFiles;
    private generateE2eDependencies;
    private generateE2eFiles;
    private generateServeDependencies;
    private generateServeFiles;
    private generateThemeFiles;
    private generateUtilsDependencies;
    private generateUtilsFiles;
    private toggleFile;
}
