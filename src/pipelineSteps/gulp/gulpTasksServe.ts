/**
 * Pipeline step to generate gulp tasks utils.
 */
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";
import { IDisplay } from "../../interfaces/IDisplay";
import { IFileSystem } from "../../interfaces/IFileSystem";
import { ILogger } from "../../interfaces/ILogger";

export class GulpTasksServe extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            super.log(logger, display, "Generating gulp tasks serve in", { gulpTasksFolder: engineVariables.gulpTasksFolder });

            engineVariables.requiredDevDependencies.push("browser-sync");

            const assetTasks = fileSystem.pathCombine(engineVariables.assetsDirectory, "gulp/tasks/");

            await this.copyFile(logger, display, fileSystem, assetTasks, "serve.js", engineVariables.gulpTasksFolder, "serve.js");

            return 0;
        } catch (err) {
            super.error(logger, display, "Generating gulp tasks serve failed", err, { gulpTasksFolder: engineVariables.gulpTasksFolder });
            return 1;
        }
    }
}