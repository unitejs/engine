/**
 * Pipeline step to generate configuration for gulp.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class Gulp extends EnginePipelineStepBase {
    private static FILENAME: string = "gulpfile.js";

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["gulp",
                                            "bluebird",
                                            "require-dir",
                                            "gulp-rename",
                                            "gulp-replace",
                                            "minimist",
                                            "gulp-uglify",
                                            "uglify-js",
                                            "mkdirp"],
                                            uniteConfiguration.taskManager === "Gulp");

        if (uniteConfiguration.taskManager === "Gulp") {
            try {
                const hasGeneratedMarker = await super.fileHasGeneratedMarker(fileSystem, engineVariables.wwwFolder, Gulp.FILENAME);

                if (hasGeneratedMarker) {
                    logger.info(`Generating ${Gulp.FILENAME} in`, { wwwFolder: engineVariables.wwwFolder });

                    const lines: string[] = [];
                    lines.push("require('require-dir')('build/tasks');");
                    lines.push(super.wrapGeneratedMarker("/* ", " */"));

                    await fileSystem.fileWriteLines(engineVariables.wwwFolder, Gulp.FILENAME, lines);
                } else {
                    logger.info(`Skipping ${Gulp.FILENAME} at it has no generated marker`);
                }
            } catch (err) {
                logger.error(`Generating ${Gulp.FILENAME} failed`, err, { wwwFolder: engineVariables.wwwFolder });
                return 1;
            }

            try {
                logger.info("Creating Gulp Build Directory", { gulpBuildFolder: engineVariables.gulpBuildFolder });
                await fileSystem.directoryCreate(engineVariables.gulpBuildFolder);
            } catch (err) {
                logger.error("Creating Gulp Build Directory failed", err, { gulpBuildFolder: engineVariables.gulpBuildFolder });
                return 1;
            }

            engineVariables.gulpTasksFolder = fileSystem.pathCombine(engineVariables.gulpBuildFolder, "tasks");
            try {
                logger.info("Creating Gulp Tasks Directory", { gulpTasksFolder: engineVariables.gulpTasksFolder });
                await fileSystem.directoryCreate(engineVariables.gulpTasksFolder);
            } catch (err) {
                logger.error("Creating Gulp Tasks Directory failed", err, { gulpTasksFolder: engineVariables.gulpTasksFolder });
                return 1;
            }

            engineVariables.gulpUtilFolder = fileSystem.pathCombine(engineVariables.gulpTasksFolder, "util");
            try {
                logger.info("Creating Gulp Util Directory", { gulpUtilFolder: engineVariables.gulpUtilFolder });
                await fileSystem.directoryCreate(engineVariables.gulpUtilFolder);
            } catch (err) {
                logger.error("Creating Gulp Util Directory failed", err, { gulpUtilFolder: engineVariables.gulpUtilFolder });
                return 1;
            }
        } else {
            try {
                logger.info("Deleting Gulp Build Directory", { gulpBuildFolder: engineVariables.gulpBuildFolder });

                const exists = await fileSystem.directoryExists(engineVariables.wwwFolder);
                if (exists) {
                    await fileSystem.directoryDelete(engineVariables.gulpBuildFolder);
                }
            } catch (err) {
                logger.error("Deleting Gulp Build Directory failed", err, { gulpBuildFolder: engineVariables.gulpBuildFolder });
                return 1;
            }

            const ret2 = await super.deleteFile(logger, fileSystem, engineVariables.wwwFolder, Gulp.FILENAME);
            if (ret2 !== 0) {
                return ret2;
            }
        }

        let ret = await this.generateBuildTasks(logger, fileSystem, uniteConfiguration, engineVariables);
        if (ret === 0) {
            ret = await this.generateUnitTasks(logger, fileSystem, uniteConfiguration, engineVariables);
            if (ret === 0) {
                ret = await this.generateE2eTasks(logger, fileSystem, uniteConfiguration, engineVariables);
                if (ret === 0) {
                    ret = await this.generateServeTasks(logger, fileSystem, uniteConfiguration, engineVariables);
                    if (ret === 0) {
                        ret = await this.generateThemeTasks(logger, fileSystem, uniteConfiguration, engineVariables);
                        if (ret === 0) {
                            ret = await this.generateUtils(logger, fileSystem, uniteConfiguration, engineVariables);
                        }
                    }
                }
            }
        }
        return ret;
    }

    public async generateBuildTasks(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["del", "delete-empty", "run-sequence", "gulp-sourcemaps", "gulp-concat", "gulp-insert", "gulp-htmlmin", "html-minifier", "node-glob"],
                                            uniteConfiguration.taskManager === "Gulp");
        engineVariables.toggleDevDependency(["gulp-babel"], uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.sourceLanguage === "JavaScript");
        engineVariables.toggleDevDependency(["gulp-typescript"], uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.sourceLanguage === "TypeScript");
        engineVariables.toggleDevDependency(["gulp-eslint"], uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.linter === "ESLint");
        engineVariables.toggleDevDependency(["gulp-tslint"], uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.linter === "TSLint");
        engineVariables.toggleDevDependency(["webpack-stream"], uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.bundler === "Webpack");
        engineVariables.toggleDevDependency(["vinyl-source-stream", "vinyl-buffer"], uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.bundler === "Browserify");
        engineVariables.toggleDevDependency(["gulp-less"], uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.cssPre === "Less");
        engineVariables.toggleDevDependency(["gulp-sass"], uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.cssPre === "Sass");
        engineVariables.toggleDevDependency(["gulp-stylus"], uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.cssPre === "Stylus");
        engineVariables.toggleDevDependency(["gulp-postcss"], uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.cssPost === "PostCss");

        if (uniteConfiguration.taskManager === "Gulp") {
            try {
                logger.info("Generating gulp tasks for build in", { gulpTasksFolder: engineVariables.gulpTasksFolder });

                const assetTasks = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, "gulp/tasks/");
                const assetTasksLanguage = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/sourceLanguage/${uniteConfiguration.sourceLanguage.toLowerCase()}/`);
                const assetTasksBundler = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/bundler/${uniteConfiguration.bundler.toLowerCase()}/`);
                const assetTasksLinter = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/linter/${uniteConfiguration.linter.toLowerCase()}/`);
                const assetTasksCssPre = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/cssPre/${uniteConfiguration.cssPre.toLowerCase()}/`);
                const assetTasksCssPost = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/cssPost/${uniteConfiguration.cssPost.toLowerCase()}/`);

                await this.copyFile(logger, fileSystem, assetTasksLanguage, "build-transpile.js", engineVariables.gulpTasksFolder, "build-transpile.js");
                await this.copyFile(logger, fileSystem, assetTasksBundler, "build-bundle-app.js", engineVariables.gulpTasksFolder, "build-bundle-app.js");
                await this.copyFile(logger, fileSystem, assetTasksBundler, "build-bundle-vendor.js", engineVariables.gulpTasksFolder, "build-bundle-vendor.js");
                await this.copyFile(logger, fileSystem, assetTasksLinter, "build-lint.js", engineVariables.gulpTasksFolder, "build-lint.js");
                await this.copyFile(logger, fileSystem, assetTasksCssPre, "build-css-app.js", engineVariables.gulpTasksFolder, "build-css-app.js");
                await this.copyFile(logger, fileSystem, assetTasksCssPre, "build-css-components.js", engineVariables.gulpTasksFolder, "build-css-components.js");
                await this.copyFile(logger, fileSystem, assetTasksCssPost, "build-css-post-app.js", engineVariables.gulpTasksFolder, "build-css-post-app.js");
                await this.copyFile(logger, fileSystem, assetTasksCssPost, "build-css-post-components.js", engineVariables.gulpTasksFolder, "build-css-post-components.js");

                await this.copyFile(logger, fileSystem, assetTasks, "build.js", engineVariables.gulpTasksFolder, "build.js");

                return 0;
            } catch (err) {
                logger.error("Generating gulp tasks for build failed", err, { gulpTasksFolder: engineVariables.gulpTasksFolder });
                return 1;
            }
        }

        return 0;
    }

    private async generateUnitTasks(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["gulp-karma-runner"], uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.unitTestRunner === "Karma");

        if (uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.unitTestRunner !== "None") {
            try {
                logger.info("Generating gulp tasks for unit in", { gulpTasksFolder: engineVariables.gulpTasksFolder });

                const assetUnitTest = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, "gulp/tasks/");

                const assetUnitTestLanguage = fileSystem.pathCombine(engineVariables.packageAssetsDirectory,
                                                                     `gulp/tasks/sourceLanguage/${uniteConfiguration.sourceLanguage.toLowerCase()}/`);

                const assetLinter = fileSystem.pathCombine(engineVariables.packageAssetsDirectory,
                                                           `gulp/tasks/linter/${uniteConfiguration.linter.toLowerCase()}/`);

                const assetUnitTestRunner = fileSystem.pathCombine(engineVariables.packageAssetsDirectory,
                                                                   `gulp/tasks/unitTestRunner/${uniteConfiguration.unitTestRunner.toLowerCase()}/`);

                await this.copyFile(logger, fileSystem, assetUnitTest, "unit.js", engineVariables.gulpTasksFolder, "unit.js");
                await this.copyFile(logger, fileSystem, assetUnitTestLanguage, "unit-transpile.js", engineVariables.gulpTasksFolder, "unit-transpile.js");
                await this.copyFile(logger, fileSystem, assetLinter, "unit-lint.js", engineVariables.gulpTasksFolder, "unit-lint.js");
                await this.copyFile(logger, fileSystem, assetUnitTestRunner, "unit-runner.js", engineVariables.gulpTasksFolder, "unit-runner.js");

                return 0;
            } catch (err) {
                logger.error("Generating gulp tasks for unit failed", err, { gulpTasksFolder: engineVariables.gulpTasksFolder });
                return 1;
            }
        }

        return 0;
    }

    private async generateE2eTasks(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["gulp-webdriver", "browser-sync"], uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.e2eTestRunner === "WebdriverIO");
        engineVariables.toggleDevDependency(["browser-sync"], uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.e2eTestRunner === "Protractor");

        if (uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.e2eTestRunner !== "None") {
            try {
                logger.info("Generating gulp tasks for e2e in", { gulpTasksFolder: engineVariables.gulpTasksFolder });

                const assetE2eTest = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, "gulp/tasks/");

                const assetUnitTestLanguage = fileSystem.pathCombine(engineVariables.packageAssetsDirectory,
                                                                     `gulp/tasks/sourceLanguage/${uniteConfiguration.sourceLanguage.toLowerCase()}/`);

                const assetLinter = fileSystem.pathCombine(engineVariables.packageAssetsDirectory,
                                                           `gulp/tasks/linter/${uniteConfiguration.linter.toLowerCase()}/`);

                const assetE2eTestRunner = fileSystem.pathCombine(engineVariables.packageAssetsDirectory,
                                                                  `gulp/tasks/e2eTestRunner/${uniteConfiguration.e2eTestRunner.toLowerCase()}/`);

                await this.copyFile(logger, fileSystem, assetE2eTest, "e2e.js", engineVariables.gulpTasksFolder, "e2e.js");
                await this.copyFile(logger, fileSystem, assetUnitTestLanguage, "e2e-transpile.js", engineVariables.gulpTasksFolder, "e2e-transpile.js");
                await this.copyFile(logger, fileSystem, assetLinter, "e2e-lint.js", engineVariables.gulpTasksFolder, "e2e-lint.js");
                await this.copyFile(logger, fileSystem, assetE2eTestRunner, "e2e-runner.js", engineVariables.gulpTasksFolder, "e2e-runner.js");
                await this.copyFile(logger, fileSystem, assetE2eTestRunner, "e2e-install.js", engineVariables.gulpTasksFolder, "e2e-install.js");

                return 0;
            } catch (err) {
                logger.error("Generating gulp tasks for e2e failed", err, { gulpTasksFolder: engineVariables.gulpTasksFolder });
                return 1;
            }
        }

        return 0;
    }

    private async generateServeTasks(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        if (uniteConfiguration.taskManager === "Gulp") {

            try {
                logger.info("Generating gulp tasks serve in", { gulpTasksFolder: engineVariables.gulpTasksFolder });

                const assetTasksServer = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/server/${uniteConfiguration.server.toLowerCase()}`);

                await this.copyFile(logger, fileSystem, assetTasksServer, "serve.js", engineVariables.gulpTasksFolder, "serve.js");

                return 0;
            } catch (err) {
                logger.error("Generating gulp tasks serve failed", err, { gulpTasksFolder: engineVariables.gulpTasksFolder });
                return 1;
            }
        }

        return 0;
    }

    private async generateThemeTasks(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        if (uniteConfiguration.taskManager === "Gulp") {

            try {
                logger.info("Generating gulp tasks theme in", { gulpTasksFolder: engineVariables.gulpTasksFolder });

                const assetTasksTheme = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, "gulp/tasks/");

                await this.copyFile(logger, fileSystem, assetTasksTheme, "theme.js", engineVariables.gulpTasksFolder, "theme.js");

                return 0;
            } catch (err) {
                logger.error("Generating gulp tasks serve failed", err, { gulpTasksFolder: engineVariables.gulpTasksFolder });
                return 1;
            }
        }

        return 0;
    }

    private async generateUtils(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["gulp-util", "gulp-rename"], uniteConfiguration.taskManager === "Gulp");

        if (uniteConfiguration.taskManager === "Gulp") {
            try {
                logger.info("Generating gulp tasks utils in", { gulpUtilFolder: engineVariables.gulpUtilFolder });

                const assetUtils = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, "gulp/tasks/util/");
                const assetUtilModuleType = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/moduleType/${uniteConfiguration.moduleType.toLowerCase()}/util/`);

                await this.copyFile(logger, fileSystem, assetUtils, "async-util.js", engineVariables.gulpUtilFolder, "async-util.js");
                await this.copyFile(logger, fileSystem, assetUtils, "bundle.js", engineVariables.gulpUtilFolder, "bundle.js");
                await this.copyFile(logger, fileSystem, assetUtils, "client-packages.js", engineVariables.gulpUtilFolder, "client-packages.js");
                await this.copyFile(logger, fileSystem, assetUtils, "display.js", engineVariables.gulpUtilFolder, "display.js");
                await this.copyFile(logger, fileSystem, assetUtils, "exec.js", engineVariables.gulpUtilFolder, "exec.js");
                await this.copyFile(logger, fileSystem, assetUtils, "theme-utils.js", engineVariables.gulpUtilFolder, "theme-utils.js");
                await this.copyFile(logger, fileSystem, assetUtils, "unite-config.js", engineVariables.gulpUtilFolder, "unite-config.js");

                await this.copyFile(logger, fileSystem, assetUtilModuleType, "module-config.js", engineVariables.gulpUtilFolder, "module-config.js");

                return 0;
            } catch (err) {
                logger.error("Generating gulp tasks utils failed", err, { gulpUtilFolder: engineVariables.gulpUtilFolder });
                return 1;
            }
        }

        return 0;
    }
}
