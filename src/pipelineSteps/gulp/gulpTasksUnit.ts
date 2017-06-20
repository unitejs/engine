/**
 * Pipeline step to generate gulp tasks for build.
 */
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";
import { IDisplay } from "../../interfaces/IDisplay";
import { IFileSystem } from "../../interfaces/IFileSystem";
import { ILogger } from "../../interfaces/ILogger";

export class GulpTasksUnit extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            if (uniteConfiguration.unitTestRunner === "Karma") {
                super.log(logger, display, "Generating gulp tasks for unit in", { gulpTasksFolder: engineVariables.gulpTasksFolder });

                const assetUnitTest = fileSystem.pathCombine(engineVariables.assetsDirectory, "gulp/tasks/");

                const assetUnitTestLanguage = fileSystem.pathCombine(engineVariables.assetsDirectory,
                                                                     "gulp/tasks/sourceLanguage/" +
                                                                     uniteConfiguration.sourceLanguage.toLowerCase() + "/");

                const assetUnitTestRunner = fileSystem.pathCombine(engineVariables.assetsDirectory,
                                                                   "gulp/tasks/unitTestRunner/" +
                                                                   uniteConfiguration.unitTestRunner.toLowerCase() + "/");

                const assetLinter = fileSystem.pathCombine(engineVariables.assetsDirectory,
                                                           "gulp/tasks/linter/" +
                                                           uniteConfiguration.linter.toLowerCase() + "/");

                engineVariables.requiredDevDependencies.push("gulp-karma-runner");
                engineVariables.requiredDevDependencies.push("karma-story-reporter");
                engineVariables.requiredDevDependencies.push("karma-html-reporter");
                engineVariables.requiredDevDependencies.push("remap-istanbul");
                engineVariables.requiredDevDependencies.push("karma-coverage");
                engineVariables.requiredDevDependencies.push("karma-sourcemap-loader");
                engineVariables.requiredDevDependencies.push("karma-remap-istanbul");

                await this.copyFile(logger, display, fileSystem, assetUnitTest, "unit.js", engineVariables.gulpTasksFolder, "unit.js");
                await this.copyFile(logger, display, fileSystem, assetUnitTestLanguage, "unit-transpile.js", engineVariables.gulpTasksFolder, "unit-transpile.js");
                await this.copyFile(logger, display, fileSystem, assetUnitTestRunner, "unit-runner.js", engineVariables.gulpTasksFolder, "unit-runner.js");
                await this.copyFile(logger, display, fileSystem, assetLinter, "unit-lint.js", engineVariables.gulpTasksFolder, "unit-lint.js");
            }

            return 0;
        } catch (err) {
            super.error(logger, display, "Generating gulp tasks for unit failed", err, { gulpTasksFolder: engineVariables.gulpTasksFolder });
            return 1;
        }
    }
}