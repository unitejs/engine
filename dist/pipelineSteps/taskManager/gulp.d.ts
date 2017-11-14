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
    private generateBuildDependencies(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition);
    private generateBuildFiles(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition);
    private generateUnitDependencies(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition);
    private generateUnitFiles(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition);
    private generateE2eDependencies(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition);
    private generateE2eFiles(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition);
    private generateServeDependencies(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition);
    private generateServeFiles(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition);
    private generateThemeFiles(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition);
    private generateUtilsDependencies(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition);
    private generateUtilsFiles(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition);
    private toggleFile(sourceFolder, sourceFile, destFolder, destFile, keep, replacements?);
}
