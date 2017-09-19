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
    private _files;
    mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): boolean | undefined;
    install(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number>;
    finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number>;
    uninstall(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number>;
    private generateBuildDependencies(logger, fileSystem, uniteConfiguration, engineVariables, isGulp);
    private generateBuildFiles(logger, fileSystem, uniteConfiguration, engineVariables);
    private generateUnitDependencies(logger, fileSystem, uniteConfiguration, engineVariables, isGulp);
    private generateUnitFiles(logger, fileSystem, uniteConfiguration, engineVariables);
    private generateE2eDependencies(logger, fileSystem, uniteConfiguration, engineVariables, isGulp);
    private generateE2eFiles(logger, fileSystem, uniteConfiguration, engineVariables);
    private generateServeDependencies(logger, fileSystem, uniteConfiguration, engineVariables, isGulp);
    private generateServeFiles(logger, fileSystem, uniteConfiguration, engineVariables);
    private generateThemeFiles(logger, fileSystem, uniteConfiguration, engineVariables);
    private generateUtilsDependencies(logger, fileSystem, uniteConfiguration, engineVariables, isGulp);
    private generateUtilsFiles(logger, fileSystem, uniteConfiguration, engineVariables);
    private toggleFile(sourceFolder, sourceFile, destFolder, destFile, keep, replacements?);
}
