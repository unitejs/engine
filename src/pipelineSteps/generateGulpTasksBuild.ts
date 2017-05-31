/**
 * Pipeline step to generate gulp tasks for build.
 */
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { UniteSourceLanguage } from "../configuration/models/unite/uniteSourceLanguage";
import { EnginePipelineStepBase } from "../engine/enginePipelineStepBase";
import { EngineVariables } from "../engine/engineVariables";
import { IDisplay } from "../interfaces/IDisplay";
import { IFileSystem } from "../interfaces/IFileSystem";
import { ILogger } from "../interfaces/ILogger";

export class GenerateGulpTasksBuild extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            super.log(logger, display, "Generating gulp tasks for build in", { gulpTasksgulpTasksFolderBuildFolder: engineVariables.gulpTasksFolder });

            const assetTasks = fileSystem.directoryPathCombine(engineVariables.assetsDirectory, "gulp/tasks/");
            engineVariables.requiredDevDependencies.push("del");

            if (engineVariables.uniteSourceLanguage === UniteSourceLanguage.JavaScript) {
                await this.copyFile(logger, display, fileSystem, assetTasks, "build-javascript.js", engineVariables.gulpTasksFolder, "build.js");
            } else if (engineVariables.uniteSourceLanguage === UniteSourceLanguage.TypeScript) {
                await this.copyFile(logger, display, fileSystem, assetTasks, "build-typescript.js", engineVariables.gulpTasksFolder, "build.js");
            }

            return 0;
        } catch (err) {
            super.error(logger, display, "Generating gulp tasks for build failed", err, { gulpTasksFolder: engineVariables.gulpTasksFolder });
            return 1;
        }
    }
}