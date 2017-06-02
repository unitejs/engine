/**
 * Pipeline step to generate gulp tasks for build.
 */
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { StringHelper } from "../core/stringHelper";
import { EnginePipelineStepBase } from "../engine/enginePipelineStepBase";
import { EngineVariables } from "../engine/engineVariables";
import { IDisplay } from "../interfaces/IDisplay";
import { IFileSystem } from "../interfaces/IFileSystem";
import { ILogger } from "../interfaces/ILogger";

export class GulpTasksBuild extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            super.log(logger, display, "Generating gulp tasks for build in", { gulpTasksFolder: engineVariables.gulpTasksFolder });

            const assetTasks = fileSystem.pathCombine(engineVariables.assetsDirectory, "gulp/tasks/");
            const assetTasksLanguage = fileSystem.pathCombine(engineVariables.assetsDirectory, "gulp/tasks/" + StringHelper.toCamelCase(uniteConfiguration.sourceLanguage) + "/");

            engineVariables.requiredDevDependencies.push("del");
            engineVariables.requiredDevDependencies.push("run-sequence");

            if (uniteConfiguration.sourceMaps) {
                engineVariables.requiredDevDependencies.push("gulp-sourcemaps");
            }

            if (uniteConfiguration.sourceLanguage === "JavaScript") {
                engineVariables.requiredDevDependencies.push("gulp-babel");
            } else if (uniteConfiguration.sourceLanguage === "TypeScript") {
                engineVariables.requiredDevDependencies.push("gulp-typescript");
                engineVariables.requiredDevDependencies.push("typescript");
            }

            await this.copyFile(logger, display, fileSystem, assetTasksLanguage, "build-transpile.js", engineVariables.gulpTasksFolder, "build-transpile.js");

            await this.copyFile(logger, display, fileSystem, assetTasks, "build.js", engineVariables.gulpTasksFolder, "build.js");

            return 0;
        } catch (err) {
            super.error(logger, display, "Generating gulp tasks for build failed", err, { gulpTasksFolder: engineVariables.gulpTasksFolder });
            return 1;
        }
    }
}