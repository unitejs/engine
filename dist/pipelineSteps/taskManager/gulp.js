"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class Gulp extends enginePipelineStepBase_1.EnginePipelineStepBase {
    prerequisites(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            this._buildFolder = fileSystem.pathCombine(engineVariables.wwwRootFolder, "build");
            this._tasksFolder = fileSystem.pathCombine(engineVariables.wwwRootFolder, "build/tasks");
            this._utilFolder = fileSystem.pathCombine(engineVariables.wwwRootFolder, "build/tasks/util");
            return 0;
        });
    }
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["gulp",
                "bluebird",
                "require-dir",
                "gulp-rename",
                "gulp-replace",
                "minimist",
                "gulp-uglify",
                "uglify-js",
                "mkdirp",
                "gulp-zip"], uniteConfiguration.taskManager === "Gulp");
            if (uniteConfiguration.taskManager === "Gulp") {
                try {
                    const hasGeneratedMarker = yield _super("fileHasGeneratedMarker").call(this, fileSystem, engineVariables.wwwRootFolder, Gulp.FILENAME);
                    if (hasGeneratedMarker) {
                        logger.info(`Generating ${Gulp.FILENAME} in`, { wwwFolder: engineVariables.wwwRootFolder });
                        const lines = [];
                        lines.push("require('require-dir')('build/tasks');");
                        lines.push(_super("wrapGeneratedMarker").call(this, "/* ", " */"));
                        yield fileSystem.fileWriteLines(engineVariables.wwwRootFolder, Gulp.FILENAME, lines);
                    }
                    else {
                        logger.info(`Skipping ${Gulp.FILENAME} at it has no generated marker`);
                    }
                }
                catch (err) {
                    logger.error(`Generating ${Gulp.FILENAME} failed`, err, { wwwFolder: engineVariables.wwwRootFolder });
                    return 1;
                }
                try {
                    logger.info("Creating Gulp Build Directory", { gulpBuildFolder: this._buildFolder });
                    yield fileSystem.directoryCreate(this._buildFolder);
                }
                catch (err) {
                    logger.error("Creating Gulp Build Directory failed", err, { gulpBuildFolder: this._buildFolder });
                    return 1;
                }
                try {
                    logger.info("Creating Gulp Tasks Directory", { gulpTasksFolder: this._tasksFolder });
                    yield fileSystem.directoryCreate(this._tasksFolder);
                }
                catch (err) {
                    logger.error("Creating Gulp Tasks Directory failed", err, { gulpTasksFolder: this._tasksFolder });
                    return 1;
                }
                try {
                    logger.info("Creating Gulp Util Directory", { gulpUtilFolder: this._utilFolder });
                    yield fileSystem.directoryCreate(this._utilFolder);
                }
                catch (err) {
                    logger.error("Creating Gulp Util Directory failed", err, { gulpUtilFolder: this._utilFolder });
                    return 1;
                }
            }
            else {
                try {
                    logger.info("Deleting Gulp Build Directory", { gulpBuildFolder: this._buildFolder });
                    const exists = yield fileSystem.directoryExists(engineVariables.wwwRootFolder);
                    if (exists) {
                        yield fileSystem.directoryDelete(this._buildFolder);
                    }
                }
                catch (err) {
                    logger.error("Deleting Gulp Build Directory failed", err, { gulpBuildFolder: this._buildFolder });
                    return 1;
                }
                const ret2 = yield _super("deleteFile").call(this, logger, fileSystem, engineVariables.wwwRootFolder, Gulp.FILENAME);
                if (ret2 !== 0) {
                    return ret2;
                }
            }
            let ret = yield this.generateBuildTasks(logger, fileSystem, uniteConfiguration, engineVariables);
            if (ret === 0) {
                ret = yield this.generateUnitTasks(logger, fileSystem, uniteConfiguration, engineVariables);
                if (ret === 0) {
                    ret = yield this.generateE2eTasks(logger, fileSystem, uniteConfiguration, engineVariables);
                    if (ret === 0) {
                        ret = yield this.generateServeTasks(logger, fileSystem, uniteConfiguration, engineVariables);
                        if (ret === 0) {
                            ret = yield this.generateThemeTasks(logger, fileSystem, uniteConfiguration, engineVariables);
                            if (ret === 0) {
                                ret = yield this.generateUtils(logger, fileSystem, uniteConfiguration, engineVariables);
                            }
                        }
                    }
                }
            }
            return ret;
        });
    }
    generateBuildTasks(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["del", "delete-empty", "run-sequence", "gulp-sourcemaps", "gulp-concat", "gulp-insert", "gulp-htmlmin", "html-minifier", "node-glob"], uniteConfiguration.taskManager === "Gulp");
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
                    logger.info("Generating gulp tasks for build in", { gulpTasksFolder: this._tasksFolder });
                    const assetTasks = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, "gulp/tasks/");
                    const assetTasksLanguage = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/sourceLanguage/${uniteConfiguration.sourceLanguage.toLowerCase()}/`);
                    const assetTasksBundler = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/bundler/${uniteConfiguration.bundler.toLowerCase()}/`);
                    const assetTasksLinter = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/linter/${uniteConfiguration.linter.toLowerCase()}/`);
                    const assetTasksCssPre = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/cssPre/${uniteConfiguration.cssPre.toLowerCase()}/`);
                    const assetTasksCssPost = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/cssPost/${uniteConfiguration.cssPost.toLowerCase()}/`);
                    const assetTasksPlatform = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, "gulp/tasks/platform/");
                    yield this.copyFile(logger, fileSystem, assetTasksLanguage, "build-transpile.js", this._tasksFolder, "build-transpile.js");
                    yield this.copyFile(logger, fileSystem, assetTasksBundler, "build-bundle-app.js", this._tasksFolder, "build-bundle-app.js");
                    yield this.copyFile(logger, fileSystem, assetTasksBundler, "build-bundle-vendor.js", this._tasksFolder, "build-bundle-vendor.js");
                    yield this.copyFile(logger, fileSystem, assetTasksLinter, "build-lint.js", this._tasksFolder, "build-lint.js");
                    yield this.copyFile(logger, fileSystem, assetTasksCssPre, "build-css-app.js", this._tasksFolder, "build-css-app.js");
                    yield this.copyFile(logger, fileSystem, assetTasksCssPre, "build-css-components.js", this._tasksFolder, "build-css-components.js");
                    yield this.copyFile(logger, fileSystem, assetTasksCssPost, "build-css-post-app.js", this._tasksFolder, "build-css-post-app.js");
                    yield this.copyFile(logger, fileSystem, assetTasksCssPost, "build-css-post-components.js", this._tasksFolder, "build-css-post-components.js");
                    yield this.copyFile(logger, fileSystem, assetTasksPlatform, "platform-web.js", this._tasksFolder, "platform-web.js");
                    yield this.copyFile(logger, fileSystem, assetTasks, "build.js", this._tasksFolder, "build.js");
                    return 0;
                }
                catch (err) {
                    logger.error("Generating gulp tasks for build failed", err, { gulpTasksFolder: this._tasksFolder });
                    return 1;
                }
            }
            return 0;
        });
    }
    generateUnitTasks(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["gulp-karma-runner"], uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.unitTestRunner === "Karma");
            if (uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.unitTestRunner !== "None") {
                try {
                    logger.info("Generating gulp tasks for unit in", { gulpTasksFolder: this._tasksFolder });
                    const assetUnitTest = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, "gulp/tasks/");
                    const assetUnitTestLanguage = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/sourceLanguage/${uniteConfiguration.sourceLanguage.toLowerCase()}/`);
                    const assetLinter = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/linter/${uniteConfiguration.linter.toLowerCase()}/`);
                    const assetUnitTestRunner = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/unitTestRunner/${uniteConfiguration.unitTestRunner.toLowerCase()}/`);
                    yield this.copyFile(logger, fileSystem, assetUnitTest, "unit.js", this._tasksFolder, "unit.js");
                    yield this.copyFile(logger, fileSystem, assetUnitTestLanguage, "unit-transpile.js", this._tasksFolder, "unit-transpile.js");
                    yield this.copyFile(logger, fileSystem, assetLinter, "unit-lint.js", this._tasksFolder, "unit-lint.js");
                    yield this.copyFile(logger, fileSystem, assetUnitTestRunner, "unit-runner.js", this._tasksFolder, "unit-runner.js");
                    return 0;
                }
                catch (err) {
                    logger.error("Generating gulp tasks for unit failed", err, { gulpTasksFolder: this._tasksFolder });
                    return 1;
                }
            }
            return 0;
        });
    }
    generateE2eTasks(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["gulp-webdriver", "browser-sync"], uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.e2eTestRunner === "WebdriverIO");
            engineVariables.toggleDevDependency(["browser-sync"], uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.e2eTestRunner === "Protractor");
            if (uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.e2eTestRunner !== "None") {
                try {
                    logger.info("Generating gulp tasks for e2e in", { gulpTasksFolder: this._tasksFolder });
                    const assetE2eTest = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, "gulp/tasks/");
                    const assetUnitTestLanguage = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/sourceLanguage/${uniteConfiguration.sourceLanguage.toLowerCase()}/`);
                    const assetLinter = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/linter/${uniteConfiguration.linter.toLowerCase()}/`);
                    const assetE2eTestRunner = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/e2eTestRunner/${uniteConfiguration.e2eTestRunner.toLowerCase()}/`);
                    yield this.copyFile(logger, fileSystem, assetE2eTest, "e2e.js", this._tasksFolder, "e2e.js");
                    yield this.copyFile(logger, fileSystem, assetUnitTestLanguage, "e2e-transpile.js", this._tasksFolder, "e2e-transpile.js");
                    yield this.copyFile(logger, fileSystem, assetLinter, "e2e-lint.js", this._tasksFolder, "e2e-lint.js");
                    yield this.copyFile(logger, fileSystem, assetE2eTestRunner, "e2e-runner.js", this._tasksFolder, "e2e-runner.js");
                    yield this.copyFile(logger, fileSystem, assetE2eTestRunner, "e2e-install.js", this._tasksFolder, "e2e-install.js");
                    return 0;
                }
                catch (err) {
                    logger.error("Generating gulp tasks for e2e failed", err, { gulpTasksFolder: this._tasksFolder });
                    return 1;
                }
            }
            return 0;
        });
    }
    generateServeTasks(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            if (uniteConfiguration.taskManager === "Gulp") {
                try {
                    logger.info("Generating gulp tasks serve in", { gulpTasksFolder: this._tasksFolder });
                    const assetTasksServer = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/server/${uniteConfiguration.server.toLowerCase()}`);
                    yield this.copyFile(logger, fileSystem, assetTasksServer, "serve.js", this._tasksFolder, "serve.js");
                    return 0;
                }
                catch (err) {
                    logger.error("Generating gulp tasks serve failed", err, { gulpTasksFolder: this._tasksFolder });
                    return 1;
                }
            }
            return 0;
        });
    }
    generateThemeTasks(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            if (uniteConfiguration.taskManager === "Gulp") {
                try {
                    logger.info("Generating gulp tasks theme in", { gulpTasksFolder: this._tasksFolder });
                    const assetTasksTheme = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, "gulp/tasks/");
                    yield this.copyFile(logger, fileSystem, assetTasksTheme, "theme.js", this._tasksFolder, "theme.js");
                    return 0;
                }
                catch (err) {
                    logger.error("Generating gulp tasks serve failed", err, { gulpTasksFolder: this._tasksFolder });
                    return 1;
                }
            }
            return 0;
        });
    }
    generateUtils(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["gulp-util", "gulp-rename"], uniteConfiguration.taskManager === "Gulp");
            if (uniteConfiguration.taskManager === "Gulp") {
                try {
                    logger.info("Generating gulp tasks utils in", { gulpUtilFolder: this._utilFolder });
                    const assetUtils = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, "gulp/tasks/util/");
                    const assetUtilModuleType = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/moduleType/${uniteConfiguration.moduleType.toLowerCase()}/util/`);
                    yield this.copyFile(logger, fileSystem, assetUtils, "async-util.js", this._utilFolder, "async-util.js");
                    yield this.copyFile(logger, fileSystem, assetUtils, "bundle.js", this._utilFolder, "bundle.js");
                    yield this.copyFile(logger, fileSystem, assetUtils, "client-packages.js", this._utilFolder, "client-packages.js");
                    yield this.copyFile(logger, fileSystem, assetUtils, "display.js", this._utilFolder, "display.js");
                    yield this.copyFile(logger, fileSystem, assetUtils, "exec.js", this._utilFolder, "exec.js");
                    yield this.copyFile(logger, fileSystem, assetUtils, "theme-utils.js", this._utilFolder, "theme-utils.js");
                    yield this.copyFile(logger, fileSystem, assetUtils, "unite-config.js", this._utilFolder, "unite-config.js");
                    yield this.copyFile(logger, fileSystem, assetUtilModuleType, "module-config.js", this._utilFolder, "module-config.js");
                    return 0;
                }
                catch (err) {
                    logger.error("Generating gulp tasks utils failed", err, { gulpUtilFolder: this._utilFolder });
                    return 1;
                }
            }
            return 0;
        });
    }
}
Gulp.FILENAME = "gulpfile.js";
exports.Gulp = Gulp;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3Rhc2tNYW5hZ2VyL2d1bHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQU1BLGdGQUE2RTtBQUc3RSxVQUFrQixTQUFRLCtDQUFzQjtJQU8vQixhQUFhLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7O1lBQ3pJLElBQUksQ0FBQyxZQUFZLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ25GLElBQUksQ0FBQyxZQUFZLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBQ3pGLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFLGtCQUFrQixDQUFDLENBQUM7WUFFN0YsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtJQUVZLE9BQU8sQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQ25JLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE1BQU07Z0JBQ1AsVUFBVTtnQkFDVixhQUFhO2dCQUNiLGFBQWE7Z0JBQ2IsY0FBYztnQkFDZCxVQUFVO2dCQUNWLGFBQWE7Z0JBQ2IsV0FBVztnQkFDWCxRQUFRO2dCQUNSLFVBQVUsQ0FBQyxFQUNYLGtCQUFrQixDQUFDLFdBQVcsS0FBSyxNQUFNLENBQUMsQ0FBQztZQUUvRSxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDNUMsSUFBSSxDQUFDO29CQUNELE1BQU0sa0JBQWtCLEdBQUcsTUFBTSxnQ0FBNEIsWUFBQyxVQUFVLEVBQUUsZUFBZSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7b0JB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QUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDO29CQUM1RixNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO29CQUMxRyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO29CQUU1RyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxtQkFBbUIsRUFBRSxrQkFBa0IsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLGtCQUFrQixDQUFDLENBQUM7b0JBRXZILE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztnQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsb0NBQW9DLEVBQUUsR0FBRyxFQUFFLEVBQUUsY0FBYyxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO29CQUM5RixNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7WUFDTCxDQUFDO1lBRUQsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTs7QUFyU2MsYUFBUSxHQUFXLGFBQWEsQ0FBQztBQURwRCxvQkF1U0MiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy90YXNrTWFuYWdlci9ndWxwLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
