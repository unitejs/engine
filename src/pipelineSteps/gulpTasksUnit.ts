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

                const assetUnitTestModule = fileSystem.pathCombine(engineVariables.assetsDirectory,
                                                                   "gulp/tasks/" +
                                                                   StringHelper.toCamelCase(uniteConfiguration.moduleLoader) + "/");

                engineVariables.requiredDevDependencies.push("gulp-karma-runner");
                engineVariables.requiredDevDependencies.push("karma-story-reporter");

                let transpileReplacer: ((line: string) => string) | undefined;
                let runnerReplacer: ((line: string) => string) | undefined;
                let srcDistReplace: string;
                const unitFiles: { pattern: string, included: boolean }[] = [];
                const karmaFrameworks: string[] = [];

                if (uniteConfiguration.moduleLoader === "Webpack") {
                    unitFiles.push({
                        pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(uniteConfiguration.outputDirectory, fileSystem.pathCombine(engineVariables.unitTestDistFolder, "test-bundle.js"))),
                        included: true
                    });
                } else {
                    unitFiles.push({
                        pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(uniteConfiguration.outputDirectory, fileSystem.pathCombine(engineVariables.distFolder, "**/*.js"))),
                        included: false
                    });
                    unitFiles.push({
                        pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(uniteConfiguration.outputDirectory, fileSystem.pathCombine(engineVariables.unitTestDistFolder, "**/*.spec.js"))),
                        included: false
                    });
                    unitFiles.push({
                        pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(uniteConfiguration.outputDirectory,
                                                                                  fileSystem.pathCombine(engineVariables.unitTestDistFolder, "../unitBootstrap.js"))),
                        included: true
                    });
                }

                if (uniteConfiguration.moduleLoader === "RequireJS") {
                    srcDistReplace = "replace(\/(define)*?(..\\/src\\/)/g, \"..\/dist\/\")";
                    karmaFrameworks.push("requirejs");
                    engineVariables.requiredDevDependencies.push("karma-requirejs");
                } else if (uniteConfiguration.moduleLoader === "SystemJS") {
                    srcDistReplace = "replace(\/(System.register)*?(..\\/src\\/)/g, \"..\/dist\/\")";

                    engineVariables.requiredDevDependencies.push("bluebird");
                    unitFiles.push({ pattern: "node_modules/bluebird/js/browser/bluebird.js", included: true });

                    engineVariables.requiredDevDependencies.push("karma-systemjs");
                    unitFiles.push({ pattern: "node_modules/systemjs/dist/system.js", included: true });
                } else if (uniteConfiguration.moduleLoader === "Webpack") {
                    srcDistReplace = "replace(\/(require)*?(..\\/src\\/)/g, \"..\/dist\/\")";
                    engineVariables.requiredDevDependencies.push("karma-commonjs");
                }

                if (uniteConfiguration.unitTestFramework === "Mocha-Chai") {
                    karmaFrameworks.push("mocha");
                    karmaFrameworks.push("chai");

                    engineVariables.requiredDevDependencies.push("karma-mocha");
                    engineVariables.requiredDevDependencies.push("karma-chai");
                } else if (uniteConfiguration.unitTestFramework === "Jasmine") {
                    karmaFrameworks.push("jasmine");

                    engineVariables.requiredDevDependencies.push("karma-jasmine");
                }

                transpileReplacer = (line) => line.replace("{SRC_DIST_REPLACE}", srcDistReplace);
                let karmaUnitFiles = "";
                for (let i = 0; i < unitFiles.length; i++) {
                    karmaUnitFiles += "unitFiles.push({ pattern: '" + unitFiles[i].pattern + "', included: " + unitFiles[i].included + " });\r\n    ";
                }

                runnerReplacer = (line) => {
                    line = line.replace("{KARMA_FRAMEWORKS}", "[" + karmaFrameworks.map(f => "'" + f + "'").join(", ") + "]");
                    line = line.replace("{UNIT_FILES}", karmaUnitFiles.trim());
                    return line;
                };

                await this.copyFile(logger, display, fileSystem, assetUnitTest, "unit.js", engineVariables.gulpTasksFolder, "unit.js");
                await this.copyFile(logger, display, fileSystem, assetUnitTestLanguage, "unit-transpile.js", engineVariables.gulpTasksFolder, "unit-transpile.js", transpileReplacer);
                await this.copyFile(logger, display, fileSystem, assetUnitTestRunner, "unit-runner.js", engineVariables.gulpTasksFolder, "unit-runner.js", runnerReplacer);
                await this.copyFile(logger, display, fileSystem, assetUnitTestModule, "unit-bundle.js", engineVariables.gulpTasksFolder, "unit-bundle.js");
            }

            return 0;
        } catch (err) {
            super.error(logger, display, "Generating gulp tasks for unit failed", err, { gulpTasksFolder: engineVariables.gulpTasksFolder });
            return 1;
        }
    }
}