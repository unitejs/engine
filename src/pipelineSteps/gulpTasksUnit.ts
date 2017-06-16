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
                engineVariables.requiredDevDependencies.push("karma-html-reporter");
                engineVariables.requiredDevDependencies.push("remap-istanbul");
                engineVariables.requiredDevDependencies.push("karma-coverage");
                engineVariables.requiredDevDependencies.push("karma-sourcemap-loader");

                uniteConfiguration.testFrameworks = [];
                uniteConfiguration.testIncludes = [];
                uniteConfiguration.testAppPreprocessors = ["sourcemap", "coverage"];
                uniteConfiguration.testUnitPreprocessors = [];

                uniteConfiguration.testIncludes.push({
                    pattern: "unite.json",
                    included: false
                });

                if (uniteConfiguration.moduleLoader === "RequireJS") {
                    uniteConfiguration.srcDistReplace = "(define)*?(..\/src\/)";
                    uniteConfiguration.srcDistReplaceWith = "../dist/";

                    engineVariables.requiredDevDependencies.push("requirejs");
                    uniteConfiguration.testIncludes.push({ pattern: "node_modules/requirejs/require.js", included: true });
                } else if (uniteConfiguration.moduleLoader === "SystemJS") {
                    uniteConfiguration.srcDistReplace = "(System.register)*?(..\/src\/)";
                    uniteConfiguration.srcDistReplaceWith = "../dist/";

                    engineVariables.requiredDevDependencies.push("bluebird");
                    uniteConfiguration.testIncludes.push({ pattern: "node_modules/bluebird/js/browser/bluebird.js", included: true });

                    uniteConfiguration.testIncludes.push({ pattern: "node_modules/systemjs/dist/system.js", included: true });
                } else if (uniteConfiguration.moduleLoader === "Webpack" || uniteConfiguration.moduleLoader === "Browserify") {
                    uniteConfiguration.srcDistReplace = "(require)*?(..\/src\/)";
                    uniteConfiguration.srcDistReplaceWith = "../dist/";

                    uniteConfiguration.testIncludes.push({ pattern: "node_modules/cajon/cajon.js", included: true });
                    engineVariables.requiredDevDependencies.push("cajon");
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

                let srcInclude;
                if (uniteConfiguration.moduleLoader === "RequireJS" || uniteConfiguration.moduleLoader === "SystemJS") {
                    srcInclude = "**/*.js";
                } else if (uniteConfiguration.moduleLoader === "Webpack" || uniteConfiguration.moduleLoader === "Browserify") {
                    srcInclude = "**/!(*-bundle|entryPoint).js";
                }

                if (srcInclude) {
                    uniteConfiguration.testIncludes.push({
                        pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.rootFolder, fileSystem.pathCombine(engineVariables.distFolder, srcInclude))),
                        included: false
                    });
                }

                uniteConfiguration.testIncludes.push({
                    pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.rootFolder, fileSystem.pathCombine(engineVariables.unitTestDistFolder, "**/*.spec.js"))),
                    included: false
                });

                uniteConfiguration.testIncludes.push({
                    pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.rootFolder, fileSystem.pathCombine(engineVariables.unitTestDistFolder, "../unitBootstrap.js"))),
                    included: true
                });

                await this.copyFile(logger, display, fileSystem, assetUnitTest, "unit.js", engineVariables.gulpTasksFolder, "unit.js");
                await this.copyFile(logger, display, fileSystem, assetUnitTest, "unit-report.js", engineVariables.gulpTasksFolder, "unit-report.js");
                await this.copyFile(logger, display, fileSystem, assetUnitTestLanguage, "unit-transpile.js", engineVariables.gulpTasksFolder, "unit-transpile.js");
                await this.copyFile(logger, display, fileSystem, assetUnitTestRunner, "unit-runner.js", engineVariables.gulpTasksFolder, "unit-runner.js");
            }

            return 0;
        } catch (err) {
            super.error(logger, display, "Generating gulp tasks for unit failed", err, { gulpTasksFolder: engineVariables.gulpTasksFolder });
            return 1;
        }
    }
}