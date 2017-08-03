/**
 * Pipeline step to generate configuration for gulp.
 */
import { IDisplay } from "unitejs-framework/dist/interfaces/IDisplay";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class Gulp extends EnginePipelineStepBase {
    private static FILENAME: string = "gulpfile.js";

    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
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
                const hasGeneratedMarker = await super.fileHasGeneratedMarker(fileSystem, engineVariables.rootFolder, Gulp.FILENAME);

                if (hasGeneratedMarker) {
                    super.log(logger, display, `Generating ${Gulp.FILENAME} in`, { rootFolder: engineVariables.rootFolder });

                    const lines: string[] = [];
                    lines.push("require('require-dir')('build/tasks');");
                    lines.push(super.wrapGeneratedMarker("/* ", " */"));

                    await fileSystem.fileWriteLines(engineVariables.rootFolder, Gulp.FILENAME, lines);
                } else {
                    super.log(logger, display, `Skipping ${Gulp.FILENAME} at it has no generated marker`);
                }
            } catch (err) {
                super.error(logger, display, `Generating ${Gulp.FILENAME} failed`, err, { rootFolder: engineVariables.rootFolder });
                return 1;
            }

            try {
                super.log(logger, display, "Creating Gulp Build Directory", { gulpBuildFolder: engineVariables.gulpBuildFolder });
                await fileSystem.directoryCreate(engineVariables.gulpBuildFolder);
            } catch (err) {
                super.error(logger, display, "Creating Gulp Build Directory failed", err, { gulpBuildFolder: engineVariables.gulpBuildFolder });
                return 1;
            }

            engineVariables.gulpTasksFolder = fileSystem.pathCombine(engineVariables.gulpBuildFolder, "tasks");
            try {
                super.log(logger, display, "Creating Gulp Tasks Directory", { gulpTasksFolder: engineVariables.gulpTasksFolder });
                await fileSystem.directoryCreate(engineVariables.gulpTasksFolder);
            } catch (err) {
                super.error(logger, display, "Creating Gulp Tasks Directory failed", err, { gulpTasksFolder: engineVariables.gulpTasksFolder });
                return 1;
            }

            engineVariables.gulpUtilFolder = fileSystem.pathCombine(engineVariables.gulpTasksFolder, "util");
            try {
                super.log(logger, display, "Creating Gulp Util Directory", { gulpUtilFolder: engineVariables.gulpUtilFolder });
                await fileSystem.directoryCreate(engineVariables.gulpUtilFolder);
            } catch (err) {
                super.error(logger, display, "Creating Gulp Util Directory failed", err, { gulpUtilFolder: engineVariables.gulpUtilFolder });
                return 1;
            }
        } else {
            try {
                super.log(logger, display, "Deleting Gulp Build Directory", { gulpBuildFolder: engineVariables.gulpBuildFolder });

                const exists = await fileSystem.directoryExists(engineVariables.rootFolder);
                if (exists) {
                    await fileSystem.directoryDelete(engineVariables.gulpBuildFolder);
                }
            } catch (err) {
                super.error(logger, display, "Deleting Gulp Build Directory failed", err, { gulpBuildFolder: engineVariables.gulpBuildFolder });
                return 1;
            }

            const ret2 = await super.deleteFile(logger, display, fileSystem, engineVariables.rootFolder, Gulp.FILENAME);
            if (ret2 !== 0) {
                return ret2;
            }
        }

        let ret = await this.generateBuildTasks(logger, display, fileSystem, uniteConfiguration, engineVariables);
        if (ret === 0) {
            ret = await this.generateUnitTasks(logger, display, fileSystem, uniteConfiguration, engineVariables);
            if (ret === 0) {
                ret = await this.generateE2eTasks(logger, display, fileSystem, uniteConfiguration, engineVariables);
                if (ret === 0) {
                    ret = await this.generateServeTasks(logger, display, fileSystem, uniteConfiguration, engineVariables);
                    if (ret === 0) {
                        ret = await this.generateThemeTasks(logger, display, fileSystem, uniteConfiguration, engineVariables);
                        if (ret === 0) {
                            ret = await this.generateUtils(logger, display, fileSystem, uniteConfiguration, engineVariables);
                        }
                    }
                }
            }
        }
        return ret;
    }

    public async generateBuildTasks(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
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
        engineVariables.toggleDevDependency(["merge2"], uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.cssPost === "None");

        if (uniteConfiguration.taskManager === "Gulp") {
            try {
                super.log(logger, display, "Generating gulp tasks for build in", { gulpTasksFolder: engineVariables.gulpTasksFolder });

                const assetTasks = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, "gulp/tasks/");
                const assetTasksLanguage = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/sourceLanguage/${uniteConfiguration.sourceLanguage.toLowerCase()}/`);
                const assetTasksBundler = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/bundler/${uniteConfiguration.bundler.toLowerCase()}/`);
                const assetTasksLinter = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/linter/${uniteConfiguration.linter.toLowerCase()}/`);
                const assetTasksCssPre = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/cssPre/${uniteConfiguration.cssPre.toLowerCase()}/`);
                const assetTasksCssPost = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/cssPost/${uniteConfiguration.cssPost.toLowerCase()}/`);

                await this.copyFile(logger, display, fileSystem, assetTasksLanguage, "build-transpile.js", engineVariables.gulpTasksFolder, "build-transpile.js");
                await this.copyFile(logger, display, fileSystem, assetTasksBundler, "build-bundle-app.js", engineVariables.gulpTasksFolder, "build-bundle-app.js");
                await this.copyFile(logger, display, fileSystem, assetTasksBundler, "build-bundle-vendor.js", engineVariables.gulpTasksFolder, "build-bundle-vendor.js");
                await this.copyFile(logger, display, fileSystem, assetTasksLinter, "build-lint.js", engineVariables.gulpTasksFolder, "build-lint.js");
                await this.copyFile(logger, display, fileSystem, assetTasksCssPre, "build-css-app.js", engineVariables.gulpTasksFolder, "build-css-app.js");
                await this.copyFile(logger, display, fileSystem, assetTasksCssPre, "build-css-components.js", engineVariables.gulpTasksFolder, "build-css-components.js");
                await this.copyFile(logger, display, fileSystem, assetTasksCssPost, "build-css-post-app.js", engineVariables.gulpTasksFolder, "build-css-post-app.js");
                await this.copyFile(logger, display, fileSystem, assetTasksCssPost, "build-css-post-components.js", engineVariables.gulpTasksFolder, "build-css-post-components.js");

                await this.copyFile(logger, display, fileSystem, assetTasks, "build.js", engineVariables.gulpTasksFolder, "build.js");

                return 0;
            } catch (err) {
                super.error(logger, display, "Generating gulp tasks for build failed", err, { gulpTasksFolder: engineVariables.gulpTasksFolder });
                return 1;
            }
        }

        return 0;
    }

    private async generateUnitTasks(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["gulp-karma-runner"], uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.unitTestRunner === "Karma");

        if (uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.unitTestRunner !== "None") {
            try {
                super.log(logger, display, "Generating gulp tasks for unit in", { gulpTasksFolder: engineVariables.gulpTasksFolder });

                const assetUnitTest = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, "gulp/tasks/");

                const assetUnitTestLanguage = fileSystem.pathCombine(engineVariables.packageAssetsDirectory,
                                                                     `gulp/tasks/sourceLanguage/${uniteConfiguration.sourceLanguage.toLowerCase()}/`);

                const assetLinter = fileSystem.pathCombine(engineVariables.packageAssetsDirectory,
                                                           `gulp/tasks/linter/${uniteConfiguration.linter.toLowerCase()}/`);

                const assetUnitTestRunner = fileSystem.pathCombine(engineVariables.packageAssetsDirectory,
                                                                   `gulp/tasks/unitTestRunner/${uniteConfiguration.unitTestRunner.toLowerCase()}/`);

                await this.copyFile(logger, display, fileSystem, assetUnitTest, "unit.js", engineVariables.gulpTasksFolder, "unit.js");
                await this.copyFile(logger, display, fileSystem, assetUnitTestLanguage, "unit-transpile.js", engineVariables.gulpTasksFolder, "unit-transpile.js");
                await this.copyFile(logger, display, fileSystem, assetLinter, "unit-lint.js", engineVariables.gulpTasksFolder, "unit-lint.js");
                await this.copyFile(logger, display, fileSystem, assetUnitTestRunner, "unit-runner.js", engineVariables.gulpTasksFolder, "unit-runner.js");

                return 0;
            } catch (err) {
                super.error(logger, display, "Generating gulp tasks for unit failed", err, { gulpTasksFolder: engineVariables.gulpTasksFolder });
                return 1;
            }
        }

        return 0;
    }

    private async generateE2eTasks(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["gulp-webdriver", "browser-sync"], uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.e2eTestRunner === "WebdriverIO");
        engineVariables.toggleDevDependency(["browser-sync"], uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.e2eTestRunner === "Protractor");

        if (uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.e2eTestRunner !== "None") {
            try {
                super.log(logger, display, "Generating gulp tasks for e2e in", { gulpTasksFolder: engineVariables.gulpTasksFolder });

                const assetE2eTest = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, "gulp/tasks/");

                const assetUnitTestLanguage = fileSystem.pathCombine(engineVariables.packageAssetsDirectory,
                                                                     `gulp/tasks/sourceLanguage/${uniteConfiguration.sourceLanguage.toLowerCase()}/`);

                const assetLinter = fileSystem.pathCombine(engineVariables.packageAssetsDirectory,
                                                           `gulp/tasks/linter/${uniteConfiguration.linter.toLowerCase()}/`);

                const assetE2eTestRunner = fileSystem.pathCombine(engineVariables.packageAssetsDirectory,
                                                                  `gulp/tasks/e2eTestRunner/${uniteConfiguration.e2eTestRunner.toLowerCase()}/`);

                await this.copyFile(logger, display, fileSystem, assetE2eTest, "e2e.js", engineVariables.gulpTasksFolder, "e2e.js");
                await this.copyFile(logger, display, fileSystem, assetUnitTestLanguage, "e2e-transpile.js", engineVariables.gulpTasksFolder, "e2e-transpile.js");
                await this.copyFile(logger, display, fileSystem, assetLinter, "e2e-lint.js", engineVariables.gulpTasksFolder, "e2e-lint.js");
                await this.copyFile(logger, display, fileSystem, assetE2eTestRunner, "e2e-runner.js", engineVariables.gulpTasksFolder, "e2e-runner.js");
                await this.copyFile(logger, display, fileSystem, assetE2eTestRunner, "e2e-install.js", engineVariables.gulpTasksFolder, "e2e-install.js");

                return 0;
            } catch (err) {
                super.error(logger, display, "Generating gulp tasks for e2e failed", err, { gulpTasksFolder: engineVariables.gulpTasksFolder });
                return 1;
            }
        }

        return 0;
    }

    private async generateServeTasks(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        if (uniteConfiguration.taskManager === "Gulp") {

            try {
                super.log(logger, display, "Generating gulp tasks serve in", { gulpTasksFolder: engineVariables.gulpTasksFolder });

                const assetTasksServer = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/server/${uniteConfiguration.server.toLowerCase()}`);

                await this.copyFile(logger, display, fileSystem, assetTasksServer, "serve.js", engineVariables.gulpTasksFolder, "serve.js");

                return 0;
            } catch (err) {
                super.error(logger, display, "Generating gulp tasks serve failed", err, { gulpTasksFolder: engineVariables.gulpTasksFolder });
                return 1;
            }
        }

        return 0;
    }

    private async generateThemeTasks(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        if (uniteConfiguration.taskManager === "Gulp") {

            try {
                super.log(logger, display, "Generating gulp tasks theme in", { gulpTasksFolder: engineVariables.gulpTasksFolder });

                const assetTasksTheme = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, "gulp/tasks/");

                await this.copyFile(logger, display, fileSystem, assetTasksTheme, "theme.js", engineVariables.gulpTasksFolder, "theme.js");

                return 0;
            } catch (err) {
                super.error(logger, display, "Generating gulp tasks serve failed", err, { gulpTasksFolder: engineVariables.gulpTasksFolder });
                return 1;
            }
        }

        return 0;
    }

    private async generateUtils(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["gulp-util", "gulp-rename"], uniteConfiguration.taskManager === "Gulp");

        if (uniteConfiguration.taskManager === "Gulp") {
            try {
                super.log(logger, display, "Generating gulp tasks utils in", { gulpUtilFolder: engineVariables.gulpUtilFolder });

                const assetUtils = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, "gulp/tasks/util/");
                const assetUtilModuleType = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/moduleType/${uniteConfiguration.moduleType.toLowerCase()}/util/`);

                await this.copyFile(logger, display, fileSystem, assetUtils, "async-util.js", engineVariables.gulpUtilFolder, "async-util.js");
                await this.copyFile(logger, display, fileSystem, assetUtils, "bundle.js", engineVariables.gulpUtilFolder, "bundle.js");
                await this.copyFile(logger, display, fileSystem, assetUtils, "client-packages.js", engineVariables.gulpUtilFolder, "client-packages.js");
                await this.copyFile(logger, display, fileSystem, assetUtils, "display.js", engineVariables.gulpUtilFolder, "display.js");
                await this.copyFile(logger, display, fileSystem, assetUtils, "exec.js", engineVariables.gulpUtilFolder, "exec.js");
                await this.copyFile(logger, display, fileSystem, assetUtils, "theme-utils.js", engineVariables.gulpUtilFolder, "theme-utils.js");
                await this.copyFile(logger, display, fileSystem, assetUtils, "unite-config.js", engineVariables.gulpUtilFolder, "unite-config.js");

                await this.copyFile(logger, display, fileSystem, assetUtilModuleType, "module-config.js", engineVariables.gulpUtilFolder, "module-config.js");

                return 0;
            } catch (err) {
                super.error(logger, display, "Generating gulp tasks utils failed", err, { gulpUtilFolder: engineVariables.gulpUtilFolder });
                return 1;
            }
        }

        return 0;
    }
}
