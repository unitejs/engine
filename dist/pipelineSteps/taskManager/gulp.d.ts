/**
 * Pipeline step to generate configuration for gulp.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineKey } from "../../engine/pipelineKey";
import { PipelineStepBase } from "../../engine/pipelineStepBase";
export declare class Gulp extends PipelineStepBase {
    private _buildFolder;
    private _tasksFolder;
    private _utilFolder;
    private _files;
    influences(): PipelineKey[];
    initialise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number>;
    process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number>;
    generateBuildTasks(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, isGulp: boolean): void;
    private generateUnitTasks(logger, fileSystem, uniteConfiguration, engineVariables, isGulp);
    private generateE2eTasks(logger, fileSystem, uniteConfiguration, engineVariables, isGulp);
    private generateServeTasks(logger, fileSystem, uniteConfiguration, engineVariables, isGulp);
    private generateThemeTasks(logger, fileSystem, uniteConfiguration, engineVariables, isGulp);
    private generateUtils(logger, fileSystem, uniteConfiguration, engineVariables, isGulp);
    private toggleFile(sourceFolder, sourceFile, destFolder, destFile, keep);
}
