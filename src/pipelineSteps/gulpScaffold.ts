/**
 * Pipeline step to generate scaffolding for gulp.
 */
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../engine/enginePipelineStepBase";
import { EngineVariables } from "../engine/engineVariables";
import { IDisplay } from "../interfaces/IDisplay";
import { IFileSystem } from "../interfaces/IFileSystem";
import { ILogger } from "../interfaces/ILogger";

export class GulpScaffold extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            super.log(logger, display, "Generating gulpfile.js in", { outputDirectory: uniteConfiguration.outputDirectory });

            const lines: string[] = [];

            lines.push("require('require-dir')('build/tasks');");

            engineVariables.requiredDevDependencies.push("gulp");
            engineVariables.requiredDevDependencies.push("require-dir");

            await fileSystem.fileWriteLines(uniteConfiguration.outputDirectory, "gulpfile.js", lines);
        } catch (err) {
            super.error(logger, display, "Generating gulpfile.js failed", err, { outputDirectory: uniteConfiguration.outputDirectory });
            return 1;
        }

        engineVariables.gulpBuildFolder = fileSystem.directoryPathCombine(uniteConfiguration.outputDirectory, "\\build");
        try {
            super.log(logger, display, "Creating Gulp Build Directory", { gulpBuildFolder: engineVariables.gulpBuildFolder });
            await fileSystem.directoryCreate(engineVariables.gulpBuildFolder);
        } catch (err) {
            super.error(logger, display, "Creating Gulp Build Directory failed", err, { gulpBuildFolder: engineVariables.gulpBuildFolder });
            return 1;
        }

        engineVariables.gulpTasksFolder = fileSystem.directoryPathCombine(engineVariables.gulpBuildFolder, "\\tasks");
        try {
            super.log(logger, display, "Creating Gulp Tasks Directory", { gulpTasksFolder: engineVariables.gulpTasksFolder });
            await fileSystem.directoryCreate(engineVariables.gulpTasksFolder);
        } catch (err) {
            super.error(logger, display, "Creating Gulp Tasks Directory failed", err, { gulpTasksFolder: engineVariables.gulpTasksFolder });
            return 1;
        }

        engineVariables.gulpUtilFolder = fileSystem.directoryPathCombine(engineVariables.gulpTasksFolder, "\\util");
        try {
            super.log(logger, display, "Creating Gulp Util Directory", { gulpUtilFolder: engineVariables.gulpUtilFolder });
            await fileSystem.directoryCreate(engineVariables.gulpUtilFolder);
            return 0;
        } catch (err) {
            super.error(logger, display, "Creating Gulp Util Directory failed", err, { gulpUtilFolder: engineVariables.gulpUtilFolder });
            return 1;
        }
    }
}