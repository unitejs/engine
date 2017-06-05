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

export class GulpTasksUnit extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            if (uniteConfiguration.unitTestRunner === "Karma") {
                super.log(logger, display, "Generating gulp tasks for unit in", { gulpTasksFolder: engineVariables.gulpTasksFolder });

                const assetUnitTest = fileSystem.pathCombine(engineVariables.assetsDirectory, "gulp/tasks/");

                const assetUnitTestLanguage = fileSystem.pathCombine(engineVariables.assetsDirectory,
                                                                     "gulp/tasks/" +
                                                                     StringHelper.toCamelCase(uniteConfiguration.sourceLanguage) + "/");

                const assetUnitTestRunner = fileSystem.pathCombine(engineVariables.assetsDirectory,
                                                                   "gulp/tasks/" +
                                                                   StringHelper.toCamelCase(uniteConfiguration.unitTestRunner) + "/");

                engineVariables.requiredDevDependencies.push("gulp-karma-runner");
                engineVariables.requiredDevDependencies.push("karma-story-reporter");

                let transpileReplacer: ((line: string) => string) | undefined;
                let runnerReplacer: ((line: string) => string) | undefined;
                let srcDistReplace: string;
                const unitFiles: { pattern: string, included: boolean}[] = [];
                const karmaFrameworks: string[] = [];

                if (uniteConfiguration.moduleLoader === "RequireJS") {
                    srcDistReplace = "replace(\/(define)*?(..\\/src\\/)/g, \"..\/dist\/\")";
                    karmaFrameworks.push("requirejs");
                    engineVariables.requiredDevDependencies.push("karma-requirejs");
                }

                if (uniteConfiguration.unitTestFramework === "Mocha-Chai") {
                    karmaFrameworks.push("mocha");

                    unitFiles.push({ pattern: "node_modules/chai/chai.js", included: false });

                    engineVariables.requiredDevDependencies.push("karma-mocha");
                }

                transpileReplacer = (line) => line.replace("{SRC_DIST_REPLACE}", srcDistReplace);
                let karmaUnitFiles = "";
                for (let i = 0; i < unitFiles.length; i++) {
                    karmaUnitFiles += "unitFiles.push({ pattern: '" + unitFiles[i].pattern + "', included: " + unitFiles[i].included + " });";
                }

                runnerReplacer = (line) => {
                    line = line.replace("{KARMA_FRAMEWORKS}", "[" + karmaFrameworks.map(f => "\"" + f + "\"").join(", ") + "]");
                    line = line.replace("{UNIT_FILES}", karmaUnitFiles);
                    return line;
                };

                await this.copyFile(logger, display, fileSystem, assetUnitTest, "unit.js", engineVariables.gulpTasksFolder, "unit.js");
                await this.copyFile(logger, display, fileSystem, assetUnitTestLanguage, "unit-transpile.js", engineVariables.gulpTasksFolder, "unit-transpile.js", transpileReplacer);
                await this.copyFile(logger, display, fileSystem, assetUnitTestRunner, "unit-runner.js", engineVariables.gulpTasksFolder, "unit-runner.js", runnerReplacer);
            }

            return 0;
        } catch (err) {
            super.error(logger, display, "Generating gulp tasks for unit failed", err, { gulpTasksFolder: engineVariables.gulpTasksFolder });
            return 1;
        }
    }
}