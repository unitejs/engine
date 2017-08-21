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

    private _buildFolder: string;
    private _tasksFolder: string;
    private _utilFolder: string;

    private _files: { sourceFolder: string; sourceFile: string; destFolder: string; destFile: string }[];

    public async initialise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        this._buildFolder = fileSystem.pathCombine(engineVariables.wwwRootFolder, "build");
        this._tasksFolder = fileSystem.pathCombine(engineVariables.wwwRootFolder, "build/tasks");
        this._utilFolder = fileSystem.pathCombine(engineVariables.wwwRootFolder, "build/tasks/util");
        this._files = [];

        return 0;
    }

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency([
                                                "gulp",
                                                "bluebird",
                                                "require-dir",
                                                "gulp-rename",
                                                "gulp-replace",
                                                "minimist",
                                                "gulp-uglify",
                                                "uglify-js",
                                                "mkdirp"
                                            ],
                                            uniteConfiguration.taskManager === "Gulp");

        if (uniteConfiguration.taskManager === "Gulp") {
            const assetGulp = fileSystem.pathCombine(engineVariables.engineAssetsFolder, "gulp");
            this.addFile(assetGulp, "gulpfile.js", engineVariables.wwwRootFolder, "gulpfile.js");
        } else {
            try {
                logger.info("Deleting Gulp Build Directory", { gulpBuildFolder: this._buildFolder });

                const exists = await fileSystem.directoryExists(engineVariables.wwwRootFolder);
                if (exists) {
                    await fileSystem.directoryDelete(this._buildFolder);
                }
            } catch (err) {
                logger.error("Deleting Gulp Build Directory failed", err, { gulpBuildFolder: this._buildFolder });
                return 1;
            }

            const ret = await super.deleteFile(logger, fileSystem, engineVariables.wwwRootFolder, Gulp.FILENAME);
            if (ret !== 0) {
                return ret;
            }
        }

        this.generateBuildTasks(logger, fileSystem, uniteConfiguration, engineVariables);
        this.generateUnitTasks(logger, fileSystem, uniteConfiguration, engineVariables);
        this.generateE2eTasks(logger, fileSystem, uniteConfiguration, engineVariables);
        this.generateServeTasks(logger, fileSystem, uniteConfiguration, engineVariables);
        this.generateThemeTasks(logger, fileSystem, uniteConfiguration, engineVariables);
        this.generateUtils(logger, fileSystem, uniteConfiguration, engineVariables);

        for (let i = 0; i < this._files.length; i++) {
            const ret = await super.copyFile(logger, fileSystem, this._files[i].sourceFolder, this._files[i].sourceFile, this._files[i].destFolder, this._files[i].destFile);
            if (ret !== 0) {
                return ret;
            }
        }

        return 0;
    }

    public generateBuildTasks(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): void {
        engineVariables.toggleDevDependency([
                                                "del",
                                                "delete-empty",
                                                "run-sequence",
                                                "gulp-sourcemaps",
                                                "gulp-concat",
                                                "gulp-insert",
                                                "gulp-htmlmin",
                                                "html-minifier",
                                                "node-glob"
                                            ],
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
        engineVariables.toggleDevDependency(["gulp-cssnano"], uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.cssPost === "None");

        if (uniteConfiguration.taskManager === "Gulp") {
            logger.info("Generating gulp tasks for build in", { gulpTasksFolder: this._tasksFolder });

            const assetTasks = fileSystem.pathCombine(engineVariables.engineAssetsFolder, "gulp/tasks/");
            const assetTasksLanguage = fileSystem.pathCombine(engineVariables.engineAssetsFolder, `gulp/tasks/sourceLanguage/${uniteConfiguration.sourceLanguage.toLowerCase()}/`);
            const assetTasksBundler = fileSystem.pathCombine(engineVariables.engineAssetsFolder, `gulp/tasks/bundler/${uniteConfiguration.bundler.toLowerCase()}/`);
            const assetTasksLinter = fileSystem.pathCombine(engineVariables.engineAssetsFolder, `gulp/tasks/linter/${uniteConfiguration.linter.toLowerCase()}/`);
            const assetTasksCssPre = fileSystem.pathCombine(engineVariables.engineAssetsFolder, `gulp/tasks/cssPre/${uniteConfiguration.cssPre.toLowerCase()}/`);
            const assetTasksCssPost = fileSystem.pathCombine(engineVariables.engineAssetsFolder, `gulp/tasks/cssPost/${uniteConfiguration.cssPost.toLowerCase()}/`);

            this.addFile(assetTasksLanguage, "build-transpile.js", this._tasksFolder, "build-transpile.js");
            this.addFile(assetTasksBundler, "build-bundle-app.js", this._tasksFolder, "build-bundle-app.js");
            this.addFile(assetTasksBundler, "build-bundle-vendor.js", this._tasksFolder, "build-bundle-vendor.js");
            this.addFile(assetTasksLinter, "build-lint.js", this._tasksFolder, "build-lint.js");
            this.addFile(assetTasksCssPre, "build-css-app.js", this._tasksFolder, "build-css-app.js");
            this.addFile(assetTasksCssPre, "build-css-components.js", this._tasksFolder, "build-css-components.js");
            this.addFile(assetTasksCssPost, "build-css-post-app.js", this._tasksFolder, "build-css-post-app.js");
            this.addFile(assetTasksCssPost, "build-css-post-components.js", this._tasksFolder, "build-css-post-components.js");

            this.addFile(assetTasks, "build.js", this._tasksFolder, "build.js");
            this.addFile(assetTasks, "version.js", this._tasksFolder, "version.js");
        }
    }

    private generateUnitTasks(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): void {
        engineVariables.toggleDevDependency(["gulp-karma-runner"], uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.unitTestRunner === "Karma");

        if (uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.unitTestRunner !== "None") {
            logger.info("Generating gulp tasks for unit in", { gulpTasksFolder: this._tasksFolder });

            const assetUnitTest = fileSystem.pathCombine(engineVariables.engineAssetsFolder, "gulp/tasks/");

            const assetUnitTestLanguage = fileSystem.pathCombine(engineVariables.engineAssetsFolder,
                                                                 `gulp/tasks/sourceLanguage/${uniteConfiguration.sourceLanguage.toLowerCase()}/`);

            const assetLinter = fileSystem.pathCombine(engineVariables.engineAssetsFolder,
                                                       `gulp/tasks/linter/${uniteConfiguration.linter.toLowerCase()}/`);

            const assetUnitTestRunner = fileSystem.pathCombine(engineVariables.engineAssetsFolder,
                                                               `gulp/tasks/unitTestRunner/${uniteConfiguration.unitTestRunner.toLowerCase()}/`);

            this.addFile(assetUnitTest, "unit.js", this._tasksFolder, "unit.js");
            this.addFile(assetUnitTestLanguage, "unit-transpile.js", this._tasksFolder, "unit-transpile.js");
            this.addFile(assetLinter, "unit-lint.js", this._tasksFolder, "unit-lint.js");
            this.addFile(assetUnitTestRunner, "unit-runner.js", this._tasksFolder, "unit-runner.js");
        }
    }

    private generateE2eTasks(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): void {
        engineVariables.toggleDevDependency(["gulp-webdriver", "browser-sync"], uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.e2eTestRunner === "WebdriverIO");
        engineVariables.toggleDevDependency(["browser-sync"], uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.e2eTestRunner === "Protractor");

        if (uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.e2eTestRunner !== "None") {
            logger.info("Generating gulp tasks for e2e in", { gulpTasksFolder: this._tasksFolder });

            const assetE2eTest = fileSystem.pathCombine(engineVariables.engineAssetsFolder, "gulp/tasks/");

            const assetUnitTestLanguage = fileSystem.pathCombine(engineVariables.engineAssetsFolder,
                                                                 `gulp/tasks/sourceLanguage/${uniteConfiguration.sourceLanguage.toLowerCase()}/`);

            const assetLinter = fileSystem.pathCombine(engineVariables.engineAssetsFolder,
                                                       `gulp/tasks/linter/${uniteConfiguration.linter.toLowerCase()}/`);

            const assetE2eTestRunner = fileSystem.pathCombine(engineVariables.engineAssetsFolder,
                                                              `gulp/tasks/e2eTestRunner/${uniteConfiguration.e2eTestRunner.toLowerCase()}/`);

            this.addFile(assetE2eTest, "e2e.js", this._tasksFolder, "e2e.js");
            this.addFile(assetUnitTestLanguage, "e2e-transpile.js", this._tasksFolder, "e2e-transpile.js");
            this.addFile(assetLinter, "e2e-lint.js", this._tasksFolder, "e2e-lint.js");
            this.addFile(assetE2eTestRunner, "e2e-runner.js", this._tasksFolder, "e2e-runner.js");
            this.addFile(assetE2eTestRunner, "e2e-install.js", this._tasksFolder, "e2e-install.js");
        }
    }

    private generateServeTasks(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): void {
        if (uniteConfiguration.taskManager === "Gulp") {
            logger.info("Generating gulp tasks serve in", { gulpTasksFolder: this._tasksFolder });

            const assetTasksServer = fileSystem.pathCombine(engineVariables.engineAssetsFolder, `gulp/tasks/server/${uniteConfiguration.server.toLowerCase()}`);

            this.addFile(assetTasksServer, "serve.js", this._tasksFolder, "serve.js");
        }
    }

    private generateThemeTasks(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): void {
        if (uniteConfiguration.taskManager === "Gulp") {
            logger.info("Generating gulp tasks theme in", { gulpTasksFolder: this._tasksFolder });

            const assetTasksTheme = fileSystem.pathCombine(engineVariables.engineAssetsFolder, "gulp/tasks/");

            this.addFile(assetTasksTheme, "theme.js", this._tasksFolder, "theme.js");
        }
    }

    private generateUtils(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): void {
        engineVariables.toggleDevDependency(["gulp-util", "gulp-rename"], uniteConfiguration.taskManager === "Gulp");

        if (uniteConfiguration.taskManager === "Gulp") {
            logger.info("Generating gulp tasks utils in", { gulpUtilFolder: this._utilFolder });

            const assetUtils = fileSystem.pathCombine(engineVariables.engineAssetsFolder, "gulp/tasks/util/");
            const assetUtilModuleType = fileSystem.pathCombine(engineVariables.engineAssetsFolder, `gulp/tasks/moduleType/${uniteConfiguration.moduleType.toLowerCase()}/util/`);

            this.addFile(assetUtils, "async-util.js", this._utilFolder, "async-util.js");
            this.addFile(assetUtils, "bundle.js", this._utilFolder, "bundle.js");
            this.addFile(assetUtils, "client-packages.js", this._utilFolder, "client-packages.js");
            this.addFile(assetUtils, "display.js", this._utilFolder, "display.js");
            this.addFile(assetUtils, "exec.js", this._utilFolder, "exec.js");
            this.addFile(assetUtils, "package-config.js", this._utilFolder, "package-config.js");
            this.addFile(assetUtils, "platform-utils.js", this._utilFolder, "platform-utils.js");
            this.addFile(assetUtils, "theme-utils.js", this._utilFolder, "theme-utils.js");
            this.addFile(assetUtils, "unite-config.js", this._utilFolder, "unite-config.js");

            this.addFile(assetUtilModuleType, "module-config.js", this._utilFolder, "module-config.js");
        }
    }

    private addFile(sourceFolder: string, sourceFile: string, destFolder: string, destFile: string): void {
        this._files.push({ sourceFolder, sourceFile, destFolder, destFile });
    }
}
