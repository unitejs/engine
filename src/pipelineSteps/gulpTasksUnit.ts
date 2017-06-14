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
                engineVariables.requiredDevDependencies.push("karma-html-reporter");
                engineVariables.requiredDevDependencies.push("remap-istanbul");
                engineVariables.requiredDevDependencies.push("karma-coverage");
                engineVariables.requiredDevDependencies.push("karma-sourcemap-loader");

                uniteConfiguration.testFrameworks = [];
                uniteConfiguration.testIncludes = [];

                uniteConfiguration.testIncludes.push({
                    pattern: "unite.json",
                    included: false
                });

                if (uniteConfiguration.moduleLoader === "Webpack") {
                    uniteConfiguration.testIncludes.push({
                        pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.rootFolder, fileSystem.pathCombine(engineVariables.unitTestDistFolder, "test-bundle.js"))),
                        included: true
                    });
                } else {
                    uniteConfiguration.testIncludes.push({
                        pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.rootFolder, fileSystem.pathCombine(engineVariables.distFolder, "**/*.js"))),
                        included: false
                    });
                    uniteConfiguration.testIncludes.push({
                        pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.rootFolder, fileSystem.pathCombine(engineVariables.unitTestDistFolder, "**/*.spec.js"))),
                        included: false
                    });
                }

                if (uniteConfiguration.moduleLoader === "RequireJS") {
                    uniteConfiguration.srcDistReplace = "(define)*?(..\/src\/)";
                    uniteConfiguration.srcDistReplaceWith = "../dist/";
                    uniteConfiguration.testFrameworks.push("requirejs");
                    engineVariables.requiredDevDependencies.push("karma-requirejs");
                } else if (uniteConfiguration.moduleLoader === "SystemJS") {
                    uniteConfiguration.srcDistReplace = "(System.register)*?(..\/src\/)";
                    uniteConfiguration.srcDistReplaceWith = "../dist/";

                    engineVariables.requiredDevDependencies.push("bluebird");
                    uniteConfiguration.testIncludes.push({ pattern: "node_modules/bluebird/js/browser/bluebird.js", included: true });

                    uniteConfiguration.testIncludes.push({ pattern: "node_modules/systemjs/dist/system.js", included: true });
                } else if (uniteConfiguration.moduleLoader === "Webpack") {
                    uniteConfiguration.srcDistReplace = "(require)*?(..\/src\/)";
                    uniteConfiguration.srcDistReplaceWith = "../dist/";

                    engineVariables.requiredDevDependencies.push("karma-commonjs");
                }

                if (uniteConfiguration.unitTestFramework === "Mocha-Chai") {
                    uniteConfiguration.testFrameworks.push("mocha");
                    uniteConfiguration.testFrameworks.push("chai");

                    engineVariables.requiredDevDependencies.push("karma-mocha");
                    engineVariables.requiredDevDependencies.push("karma-chai");
                } else if (uniteConfiguration.unitTestFramework === "Jasmine") {
                    uniteConfiguration.testFrameworks.push("jasmine");

                    engineVariables.requiredDevDependencies.push("karma-jasmine");
                }

                if (uniteConfiguration.moduleLoader === "RequireJS" || uniteConfiguration.moduleLoader === "SystemJS") {
                    uniteConfiguration.testIncludes.push({
                        pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.rootFolder,
                                                                                  fileSystem.pathCombine(engineVariables.unitTestDistFolder, "../unitBootstrap.js"))),
                        included: true
                    });
                }

                await this.copyFile(logger, display, fileSystem, assetUnitTest, "unit.js", engineVariables.gulpTasksFolder, "unit.js");
                await this.copyFile(logger, display, fileSystem, assetUnitTest, "unit-report.js", engineVariables.gulpTasksFolder, "unit-report.js");
                await this.copyFile(logger, display, fileSystem, assetUnitTestLanguage, "unit-transpile.js", engineVariables.gulpTasksFolder, "unit-transpile.js");
                await this.copyFile(logger, display, fileSystem, assetUnitTestRunner, "unit-runner.js", engineVariables.gulpTasksFolder, "unit-runner.js");
                await this.copyFile(logger, display, fileSystem, assetUnitTestModule, "unit-bundle.js", engineVariables.gulpTasksFolder, "unit-bundle.js");
            }

            return 0;
        } catch (err) {
            super.error(logger, display, "Generating gulp tasks for unit failed", err, { gulpTasksFolder: engineVariables.gulpTasksFolder });
            return 1;
        }
    }
}