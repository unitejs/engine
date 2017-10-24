/**
 * Pipeline step to generate configuration for gulp.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class Gulp extends PipelineStepBase {
    private _tasksFolder: string;
    private _utilFolder: string;

    private _files: { sourceFolder: string; sourceFile: string; destFolder: string; destFile: string; keep: boolean; replacements: { [id: string]: string[]} }[];

    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables) : boolean | undefined {
        return super.condition(uniteConfiguration.taskManager, "Gulp");
    }

    public async configure(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        engineVariables.toggleDevDependency([
                                                "gulp",
                                                "require-dir",
                                                "gulp-rename",
                                                "gulp-replace",
                                                "minimist",
                                                "gulp-uglify",
                                                "uglify-js",
                                                "mkdirp",
                                                "stream-to-promise"
                                            ],
                                            mainCondition);

        this.generateBuildDependencies(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition);
        this.generateUnitDependencies(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition);
        this.generateE2eDependencies(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition);
        this.generateServeDependencies(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition);
        this.generateUtilsDependencies(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition);
        return 0;
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        this._tasksFolder = fileSystem.pathCombine(engineVariables.wwwRootFolder, "build/tasks");
        this._utilFolder = fileSystem.pathCombine(engineVariables.wwwRootFolder, "build/tasks/util");
        this._files = [];

        const assetGulp = fileSystem.pathCombine(engineVariables.engineAssetsFolder, "gulp");
        this.toggleFile(assetGulp, "gulpfile.js", engineVariables.wwwRootFolder, "gulpfile.js", mainCondition);

        this.generateBuildFiles(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition);
        this.generateUnitFiles(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition);
        this.generateE2eFiles(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition);
        this.generateServeFiles(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition);
        this.generateThemeFiles(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition);
        this.generateUtilsFiles(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition);

        for (let i = 0; i < this._files.length; i++) {
            let ret;

            if (this._files[i].keep) {
                ret = await super.copyFile(logger,
                                           fileSystem,
                                           this._files[i].sourceFolder,
                                           this._files[i].sourceFile,
                                           this._files[i].destFolder,
                                           this._files[i].destFile,
                                           engineVariables.force,
                                           this._files[i].replacements);
            } else {
                ret = await super.fileDeleteText(logger, fileSystem, this._files[i].destFolder, this._files[i].destFile, engineVariables.force);
            }

            if (ret !== 0) {
                return ret;
            }
        }

        return 0;
    }

    private generateBuildDependencies(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): void {
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
                                            mainCondition);

        engineVariables.toggleDevDependency(["gulp-babel"], mainCondition);
        engineVariables.toggleDevDependency(["gulp-typescript"], mainCondition && super.condition(uniteConfiguration.sourceLanguage, "TypeScript"));
        engineVariables.toggleDevDependency(["gulp-eslint"], mainCondition && super.condition(uniteConfiguration.linter, "ESLint"));
        engineVariables.toggleDevDependency(["gulp-tslint"], mainCondition && super.condition(uniteConfiguration.linter, "TSLint"));
        engineVariables.toggleDevDependency(["webpack-stream"], mainCondition && super.condition(uniteConfiguration.bundler, "Webpack"));
        engineVariables.toggleDevDependency(["vinyl-source-stream", "vinyl-buffer"], mainCondition && super.condition(uniteConfiguration.bundler, "Browserify"));
        engineVariables.toggleDevDependency(["gulp-less"], mainCondition && super.condition(uniteConfiguration.cssPre, "Less"));
        engineVariables.toggleDevDependency(["gulp-sass"], mainCondition && super.condition(uniteConfiguration.cssPre, "Sass"));
        engineVariables.toggleDevDependency(["gulp-stylus"], mainCondition && super.condition(uniteConfiguration.cssPre, "Stylus"));
        engineVariables.toggleDevDependency(["gulp-postcss"], mainCondition && super.condition(uniteConfiguration.cssPost, "PostCss"));
        engineVariables.toggleDevDependency(["gulp-cssnano"], mainCondition);
    }

    private generateBuildFiles(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): void {
        logger.info("Generating gulp tasks for build in", { gulpTasksFolder: this._tasksFolder });

        const assetTasks = fileSystem.pathCombine(engineVariables.engineAssetsFolder, "gulp/tasks/");
        const assetTasksLanguage = fileSystem.pathCombine(engineVariables.engineAssetsFolder, `gulp/tasks/sourceLanguage/${uniteConfiguration.sourceLanguage.toLowerCase()}/`);
        const assetTasksBundler = fileSystem.pathCombine(engineVariables.engineAssetsFolder, `gulp/tasks/bundler/${uniteConfiguration.bundler.toLowerCase()}/`);
        const assetTasksLinter = fileSystem.pathCombine(engineVariables.engineAssetsFolder, `gulp/tasks/linter/${uniteConfiguration.linter.toLowerCase()}/`);
        const assetTasksCssPre = fileSystem.pathCombine(engineVariables.engineAssetsFolder, `gulp/tasks/cssPre/${uniteConfiguration.cssPre.toLowerCase()}/`);
        const assetTasksCssPost = fileSystem.pathCombine(engineVariables.engineAssetsFolder, `gulp/tasks/cssPost/${uniteConfiguration.cssPost.toLowerCase()}/`);

        this.toggleFile(assetTasksLanguage, "build-transpile.js", this._tasksFolder, "build-transpile.js", mainCondition, {
            TRANSPILEINCLUDE: engineVariables.buildTranspileInclude,
            TRANSPILEPREBUILD: engineVariables.buildTranspilePreBuild,
            TRANSPILEPOSTBUILD: engineVariables.buildTranspilePostBuild
        });
        this.toggleFile(assetTasksBundler, "build-bundle-app.js", this._tasksFolder, "build-bundle-app.js", mainCondition);
        this.toggleFile(assetTasksBundler, "build-bundle-vendor.js", this._tasksFolder, "build-bundle-vendor.js", mainCondition);
        this.toggleFile(assetTasksLinter, "build-lint.js", this._tasksFolder, "build-lint.js", mainCondition);
        this.toggleFile(assetTasksCssPre, "build-css-app.js", this._tasksFolder, "build-css-app.js", mainCondition);
        this.toggleFile(assetTasksCssPre, "build-css-components.js", this._tasksFolder, "build-css-components.js", mainCondition);
        this.toggleFile(assetTasksCssPost, "build-css-post-app.js", this._tasksFolder, "build-css-post-app.js", mainCondition);
        this.toggleFile(assetTasksCssPost, "build-css-post-components.js", this._tasksFolder, "build-css-post-components.js", mainCondition);

        this.toggleFile(assetTasks, "build.js", this._tasksFolder, "build.js", mainCondition);
        this.toggleFile(assetTasks, "build-transpile-modules.js", this._tasksFolder, "build-transpile-modules.js", mainCondition);
        this.toggleFile(assetTasks, "version.js", this._tasksFolder, "version.js", mainCondition);
    }

    private generateUnitDependencies(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): void {
    }

    private generateUnitFiles(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): void {
        const hasUnit = !super.condition(uniteConfiguration.unitTestRunner, "None");
        logger.info("Generating gulp tasks for unit in", { gulpTasksFolder: this._tasksFolder });

        const assetUnitTest = fileSystem.pathCombine(engineVariables.engineAssetsFolder, "gulp/tasks/");

        const assetUnitTestLanguage = fileSystem.pathCombine(engineVariables.engineAssetsFolder,
                                                             `gulp/tasks/sourceLanguage/${uniteConfiguration.sourceLanguage.toLowerCase()}/`);

        const assetLinter = fileSystem.pathCombine(engineVariables.engineAssetsFolder,
                                                   `gulp/tasks/linter/${uniteConfiguration.linter.toLowerCase()}/`);

        const assetUnitTestRunner = fileSystem.pathCombine(engineVariables.engineAssetsFolder,
                                                           `gulp/tasks/unitTestRunner/${uniteConfiguration.unitTestRunner.toLowerCase()}/`);

        this.toggleFile(assetUnitTest, "unit.js", this._tasksFolder, "unit.js", hasUnit);
        this.toggleFile(assetUnitTestLanguage, "unit-transpile.js", this._tasksFolder, "unit-transpile.js", hasUnit);
        this.toggleFile(assetLinter, "unit-lint.js", this._tasksFolder, "unit-lint.js", hasUnit);
        this.toggleFile(assetUnitTestRunner, "unit-runner.js", this._tasksFolder, "unit-runner.js", hasUnit);
    }

    private generateE2eDependencies(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): void {
        engineVariables.toggleDevDependency(["gulp-webdriver", "browser-sync"], mainCondition && super.condition(uniteConfiguration.e2eTestRunner, "WebdriverIO"));
        engineVariables.toggleDevDependency(["browser-sync"], mainCondition && super.condition(uniteConfiguration.e2eTestRunner, "Protractor"));
    }

    private generateE2eFiles(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): void {
        const hasE2e = !super.condition(uniteConfiguration.e2eTestRunner, "None");
        logger.info("Generating gulp tasks for e2e in", { gulpTasksFolder: this._tasksFolder });

        const assetE2eTest = fileSystem.pathCombine(engineVariables.engineAssetsFolder, "gulp/tasks/");

        const assetUnitTestLanguage = fileSystem.pathCombine(engineVariables.engineAssetsFolder,
                                                             `gulp/tasks/sourceLanguage/${uniteConfiguration.sourceLanguage.toLowerCase()}/`);

        const assetLinter = fileSystem.pathCombine(engineVariables.engineAssetsFolder,
                                                   `gulp/tasks/linter/${uniteConfiguration.linter.toLowerCase()}/`);

        const assetE2eTestRunner = fileSystem.pathCombine(engineVariables.engineAssetsFolder,
                                                          `gulp/tasks/e2eTestRunner/${uniteConfiguration.e2eTestRunner.toLowerCase()}/`);

        this.toggleFile(assetE2eTest, "e2e.js", this._tasksFolder, "e2e.js", hasE2e);
        this.toggleFile(assetUnitTestLanguage, "e2e-transpile.js", this._tasksFolder, "e2e-transpile.js", hasE2e);
        this.toggleFile(assetLinter, "e2e-lint.js", this._tasksFolder, "e2e-lint.js", hasE2e);
        this.toggleFile(assetE2eTestRunner, "e2e-runner.js", this._tasksFolder, "e2e-runner.js", hasE2e);
        this.toggleFile(assetE2eTestRunner, "e2e-install.js", this._tasksFolder, "e2e-install.js", hasE2e);
    }

    private generateServeDependencies(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): void {
        engineVariables.toggleDevDependency(["browser-sync"], mainCondition && super.condition(uniteConfiguration.server, "BrowserSync"));
    }

    private generateServeFiles(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): void {
        logger.info("Generating gulp tasks serve in", { gulpTasksFolder: this._tasksFolder });

        const assetTasksServer = fileSystem.pathCombine(engineVariables.engineAssetsFolder, `gulp/tasks/server/${uniteConfiguration.server.toLowerCase()}`);

        this.toggleFile(assetTasksServer, "serve.js", this._tasksFolder, "serve.js", mainCondition);
    }

    private generateThemeFiles(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): void {
        logger.info("Generating gulp tasks theme in", { gulpTasksFolder: this._tasksFolder });

        const assetTasksTheme = fileSystem.pathCombine(engineVariables.engineAssetsFolder, "gulp/tasks/");

        this.toggleFile(assetTasksTheme, "theme.js", this._tasksFolder, "theme.js", mainCondition);
    }

    private generateUtilsDependencies(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): void {
        engineVariables.toggleDevDependency(["gulp-util", "gulp-rename"], mainCondition);
    }

    private generateUtilsFiles(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): void {
        logger.info("Generating gulp tasks utils in", { gulpUtilFolder: this._utilFolder });

        const assetUtils = fileSystem.pathCombine(engineVariables.engineAssetsFolder, "gulp/tasks/util/");

        this.toggleFile(assetUtils, "async-util.js", this._utilFolder, "async-util.js", mainCondition);
        this.toggleFile(assetUtils, "client-packages.js", this._utilFolder, "client-packages.js", mainCondition);
        this.toggleFile(assetUtils, "config-utils.js", this._utilFolder, "config-utils.js", mainCondition);
        this.toggleFile(assetUtils, "display.js", this._utilFolder, "display.js", mainCondition);
        this.toggleFile(assetUtils, "exec.js", this._utilFolder, "exec.js", mainCondition);
        this.toggleFile(assetUtils, "env-util.js", this._utilFolder, "env-util.js", mainCondition);
        this.toggleFile(assetUtils, "error-util.js", this._utilFolder, "error-util.js", mainCondition);
        this.toggleFile(assetUtils, "json-helper.js", this._utilFolder, "json-helper.js", mainCondition);
        this.toggleFile(assetUtils, "module-config.js", this._utilFolder, "module-config.js", mainCondition);
        this.toggleFile(assetUtils, "package-config.js", this._utilFolder, "package-config.js", mainCondition);
        this.toggleFile(assetUtils, "platform-utils.js", this._utilFolder, "platform-utils.js", mainCondition);
        this.toggleFile(assetUtils, "theme-utils.js", this._utilFolder, "theme-utils.js", mainCondition);
        this.toggleFile(assetUtils, "unite-config.js", this._utilFolder, "unite-config.js", mainCondition);

        // no longer used so always delete
        this.toggleFile(assetUtils, "bundle.js", this._utilFolder, "bundle.js", false);
    }

    private toggleFile(sourceFolder: string, sourceFile: string, destFolder: string, destFile: string, keep: boolean, replacements?: { [id: string]: string[]}): void {
        this._files.push({ sourceFolder, sourceFile, destFolder, destFile, keep, replacements });
    }
}
