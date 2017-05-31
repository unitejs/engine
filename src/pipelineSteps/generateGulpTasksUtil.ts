/**
 * Pipeline step to generate gulp tasks utils.
 */
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../engine/enginePipelineStepBase";
import { EngineVariables } from "../engine/engineVariables";
import { IDisplay } from "../interfaces/IDisplay";
import { IFileSystem } from "../interfaces/IFileSystem";
import { ILogger } from "../interfaces/ILogger";

export class GenerateGulpTasksUtil extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            super.log(logger, display, "Generating gulp tasks utils in", { gulpUtilFolder: engineVariables.gulpUtilFolder });

            engineVariables.requiredDevDependencies.push("gulp-util");
            engineVariables.requiredDevDependencies.push("gulp-rename");
            engineVariables.requiredDevDependencies.push("gulp-replace");

            const assetUtils = fileSystem.directoryPathCombine(engineVariables.assetsDirectory, "gulp/tasks/util/");

            await this.copyFile(logger, display, fileSystem, assetUtils, "build-config.js", engineVariables.gulpUtilFolder, "build-config.js");

            await this.copyFile(logger, display, fileSystem, assetUtils, "display.js", engineVariables.gulpUtilFolder, "display.js");

            await this.copyFile(logger, display, fileSystem, assetUtils, "template.js", engineVariables.gulpUtilFolder, "template.js");

            return 0;
        } catch (err) {
            super.error(logger, display, "Generating gulp tasks utils failed", err, { gulpUtilFolder: engineVariables.gulpUtilFolder });
            return 1;
        }
    }
}