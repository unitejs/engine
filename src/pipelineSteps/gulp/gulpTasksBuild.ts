/**
 * Pipeline step to generate gulp tasks for build.
 */
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";
import { IDisplay } from "../../interfaces/IDisplay";
import { IFileSystem } from "../../interfaces/IFileSystem";
import { ILogger } from "../../interfaces/ILogger";

export class GulpTasksBuild extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            super.log(logger, display, "Generating gulp tasks for build in", { gulpTasksFolder: engineVariables.gulpTasksFolder });

            const assetTasks = fileSystem.pathCombine(engineVariables.assetsDirectory, "gulp/tasks/");
            const assetTasksLanguage = fileSystem.pathCombine(engineVariables.assetsDirectory, "gulp/tasks/sourceLanguage/" + uniteConfiguration.sourceLanguage.toLowerCase() + "/");
            const assetTasksModuleLoader = fileSystem.pathCombine(engineVariables.assetsDirectory, "gulp/tasks/moduleLoader/" + uniteConfiguration.moduleLoader.toLowerCase() + "/");
            const assetTasksLinter = fileSystem.pathCombine(engineVariables.assetsDirectory, "gulp/tasks/linter/" + uniteConfiguration.linter.toLowerCase() + "/");

            engineVariables.requiredDevDependencies.push("del");
            engineVariables.requiredDevDependencies.push("run-sequence");

            engineVariables.requiredDevDependencies.push("gulp-sourcemaps");

            if (uniteConfiguration.sourceLanguage === "JavaScript") {
                engineVariables.requiredDevDependencies.push("gulp-babel");
            } else if (uniteConfiguration.sourceLanguage === "TypeScript") {
                engineVariables.requiredDevDependencies.push("gulp-typescript");
                engineVariables.requiredDevDependencies.push("typescript");
            }

            if (uniteConfiguration.moduleLoader === "Webpack") {
                engineVariables.requiredDevDependencies.push("webpack");
                engineVariables.requiredDevDependencies.push("webpack-stream");
                engineVariables.requiredDevDependencies.push("source-map-loader");
            } else if (uniteConfiguration.moduleLoader === "Browserify") {
                engineVariables.requiredDevDependencies.push("browserify");
                engineVariables.requiredDevDependencies.push("vinyl-source-stream");
                engineVariables.requiredDevDependencies.push("vinyl-buffer");
                engineVariables.requiredDevDependencies.push("merge2");
            }

            await this.copyFile(logger, display, fileSystem, assetTasksLanguage, "build-transpile.js", engineVariables.gulpTasksFolder, "build-transpile.js");
            await this.copyFile(logger, display, fileSystem, assetTasksModuleLoader, "build-bundle.js", engineVariables.gulpTasksFolder, "build-bundle.js");
            await this.copyFile(logger, display, fileSystem, assetTasksLinter, "build-lint.js", engineVariables.gulpTasksFolder, "build-lint.js");

            await this.copyFile(logger, display, fileSystem, assetTasks, "build.js", engineVariables.gulpTasksFolder, "build.js");

            return 0;
        } catch (err) {
            super.error(logger, display, "Generating gulp tasks for build failed", err, { gulpTasksFolder: engineVariables.gulpTasksFolder });
            return 1;
        }
    }
}