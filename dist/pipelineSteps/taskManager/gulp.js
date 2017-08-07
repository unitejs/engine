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
                "mkdirp"], uniteConfiguration.taskManager === "Gulp");
            if (uniteConfiguration.taskManager === "Gulp") {
                try {
                    const hasGeneratedMarker = yield _super("fileHasGeneratedMarker").call(this, fileSystem, engineVariables.wwwFolder, Gulp.FILENAME);
                    if (hasGeneratedMarker) {
                        logger.info(`Generating ${Gulp.FILENAME} in`, { wwwFolder: engineVariables.wwwFolder });
                        const lines = [];
                        lines.push("require('require-dir')('build/tasks');");
                        lines.push(_super("wrapGeneratedMarker").call(this, "/* ", " */"));
                        yield fileSystem.fileWriteLines(engineVariables.wwwFolder, Gulp.FILENAME, lines);
                    }
                    else {
                        logger.info(`Skipping ${Gulp.FILENAME} at it has no generated marker`);
                    }
                }
                catch (err) {
                    logger.error(`Generating ${Gulp.FILENAME} failed`, err, { wwwFolder: engineVariables.wwwFolder });
                    return 1;
                }
                try {
                    logger.info("Creating Gulp Build Directory", { gulpBuildFolder: engineVariables.gulpBuildFolder });
                    yield fileSystem.directoryCreate(engineVariables.gulpBuildFolder);
                }
                catch (err) {
                    logger.error("Creating Gulp Build Directory failed", err, { gulpBuildFolder: engineVariables.gulpBuildFolder });
                    return 1;
                }
                engineVariables.gulpTasksFolder = fileSystem.pathCombine(engineVariables.gulpBuildFolder, "tasks");
                try {
                    logger.info("Creating Gulp Tasks Directory", { gulpTasksFolder: engineVariables.gulpTasksFolder });
                    yield fileSystem.directoryCreate(engineVariables.gulpTasksFolder);
                }
                catch (err) {
                    logger.error("Creating Gulp Tasks Directory failed", err, { gulpTasksFolder: engineVariables.gulpTasksFolder });
                    return 1;
                }
                engineVariables.gulpUtilFolder = fileSystem.pathCombine(engineVariables.gulpTasksFolder, "util");
                try {
                    logger.info("Creating Gulp Util Directory", { gulpUtilFolder: engineVariables.gulpUtilFolder });
                    yield fileSystem.directoryCreate(engineVariables.gulpUtilFolder);
                }
                catch (err) {
                    logger.error("Creating Gulp Util Directory failed", err, { gulpUtilFolder: engineVariables.gulpUtilFolder });
                    return 1;
                }
            }
            else {
                try {
                    logger.info("Deleting Gulp Build Directory", { gulpBuildFolder: engineVariables.gulpBuildFolder });
                    const exists = yield fileSystem.directoryExists(engineVariables.wwwFolder);
                    if (exists) {
                        yield fileSystem.directoryDelete(engineVariables.gulpBuildFolder);
                    }
                }
                catch (err) {
                    logger.error("Deleting Gulp Build Directory failed", err, { gulpBuildFolder: engineVariables.gulpBuildFolder });
                    return 1;
                }
                const ret2 = yield _super("deleteFile").call(this, logger, fileSystem, engineVariables.wwwFolder, Gulp.FILENAME);
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
                    logger.info("Generating gulp tasks for build in", { gulpTasksFolder: engineVariables.gulpTasksFolder });
                    const assetTasks = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, "gulp/tasks/");
                    const assetTasksLanguage = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/sourceLanguage/${uniteConfiguration.sourceLanguage.toLowerCase()}/`);
                    const assetTasksBundler = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/bundler/${uniteConfiguration.bundler.toLowerCase()}/`);
                    const assetTasksLinter = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/linter/${uniteConfiguration.linter.toLowerCase()}/`);
                    const assetTasksCssPre = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/cssPre/${uniteConfiguration.cssPre.toLowerCase()}/`);
                    const assetTasksCssPost = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/cssPost/${uniteConfiguration.cssPost.toLowerCase()}/`);
                    yield this.copyFile(logger, fileSystem, assetTasksLanguage, "build-transpile.js", engineVariables.gulpTasksFolder, "build-transpile.js");
                    yield this.copyFile(logger, fileSystem, assetTasksBundler, "build-bundle-app.js", engineVariables.gulpTasksFolder, "build-bundle-app.js");
                    yield this.copyFile(logger, fileSystem, assetTasksBundler, "build-bundle-vendor.js", engineVariables.gulpTasksFolder, "build-bundle-vendor.js");
                    yield this.copyFile(logger, fileSystem, assetTasksLinter, "build-lint.js", engineVariables.gulpTasksFolder, "build-lint.js");
                    yield this.copyFile(logger, fileSystem, assetTasksCssPre, "build-css-app.js", engineVariables.gulpTasksFolder, "build-css-app.js");
                    yield this.copyFile(logger, fileSystem, assetTasksCssPre, "build-css-components.js", engineVariables.gulpTasksFolder, "build-css-components.js");
                    yield this.copyFile(logger, fileSystem, assetTasksCssPost, "build-css-post-app.js", engineVariables.gulpTasksFolder, "build-css-post-app.js");
                    yield this.copyFile(logger, fileSystem, assetTasksCssPost, "build-css-post-components.js", engineVariables.gulpTasksFolder, "build-css-post-components.js");
                    yield this.copyFile(logger, fileSystem, assetTasks, "build.js", engineVariables.gulpTasksFolder, "build.js");
                    return 0;
                }
                catch (err) {
                    logger.error("Generating gulp tasks for build failed", err, { gulpTasksFolder: engineVariables.gulpTasksFolder });
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
                    logger.info("Generating gulp tasks for unit in", { gulpTasksFolder: engineVariables.gulpTasksFolder });
                    const assetUnitTest = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, "gulp/tasks/");
                    const assetUnitTestLanguage = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/sourceLanguage/${uniteConfiguration.sourceLanguage.toLowerCase()}/`);
                    const assetLinter = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/linter/${uniteConfiguration.linter.toLowerCase()}/`);
                    const assetUnitTestRunner = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/unitTestRunner/${uniteConfiguration.unitTestRunner.toLowerCase()}/`);
                    yield this.copyFile(logger, fileSystem, assetUnitTest, "unit.js", engineVariables.gulpTasksFolder, "unit.js");
                    yield this.copyFile(logger, fileSystem, assetUnitTestLanguage, "unit-transpile.js", engineVariables.gulpTasksFolder, "unit-transpile.js");
                    yield this.copyFile(logger, fileSystem, assetLinter, "unit-lint.js", engineVariables.gulpTasksFolder, "unit-lint.js");
                    yield this.copyFile(logger, fileSystem, assetUnitTestRunner, "unit-runner.js", engineVariables.gulpTasksFolder, "unit-runner.js");
                    return 0;
                }
                catch (err) {
                    logger.error("Generating gulp tasks for unit failed", err, { gulpTasksFolder: engineVariables.gulpTasksFolder });
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
                    logger.info("Generating gulp tasks for e2e in", { gulpTasksFolder: engineVariables.gulpTasksFolder });
                    const assetE2eTest = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, "gulp/tasks/");
                    const assetUnitTestLanguage = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/sourceLanguage/${uniteConfiguration.sourceLanguage.toLowerCase()}/`);
                    const assetLinter = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/linter/${uniteConfiguration.linter.toLowerCase()}/`);
                    const assetE2eTestRunner = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/e2eTestRunner/${uniteConfiguration.e2eTestRunner.toLowerCase()}/`);
                    yield this.copyFile(logger, fileSystem, assetE2eTest, "e2e.js", engineVariables.gulpTasksFolder, "e2e.js");
                    yield this.copyFile(logger, fileSystem, assetUnitTestLanguage, "e2e-transpile.js", engineVariables.gulpTasksFolder, "e2e-transpile.js");
                    yield this.copyFile(logger, fileSystem, assetLinter, "e2e-lint.js", engineVariables.gulpTasksFolder, "e2e-lint.js");
                    yield this.copyFile(logger, fileSystem, assetE2eTestRunner, "e2e-runner.js", engineVariables.gulpTasksFolder, "e2e-runner.js");
                    yield this.copyFile(logger, fileSystem, assetE2eTestRunner, "e2e-install.js", engineVariables.gulpTasksFolder, "e2e-install.js");
                    return 0;
                }
                catch (err) {
                    logger.error("Generating gulp tasks for e2e failed", err, { gulpTasksFolder: engineVariables.gulpTasksFolder });
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
                    logger.info("Generating gulp tasks serve in", { gulpTasksFolder: engineVariables.gulpTasksFolder });
                    const assetTasksServer = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/server/${uniteConfiguration.server.toLowerCase()}`);
                    yield this.copyFile(logger, fileSystem, assetTasksServer, "serve.js", engineVariables.gulpTasksFolder, "serve.js");
                    return 0;
                }
                catch (err) {
                    logger.error("Generating gulp tasks serve failed", err, { gulpTasksFolder: engineVariables.gulpTasksFolder });
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
                    logger.info("Generating gulp tasks theme in", { gulpTasksFolder: engineVariables.gulpTasksFolder });
                    const assetTasksTheme = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, "gulp/tasks/");
                    yield this.copyFile(logger, fileSystem, assetTasksTheme, "theme.js", engineVariables.gulpTasksFolder, "theme.js");
                    return 0;
                }
                catch (err) {
                    logger.error("Generating gulp tasks serve failed", err, { gulpTasksFolder: engineVariables.gulpTasksFolder });
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
                    logger.info("Generating gulp tasks utils in", { gulpUtilFolder: engineVariables.gulpUtilFolder });
                    const assetUtils = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, "gulp/tasks/util/");
                    const assetUtilModuleType = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/moduleType/${uniteConfiguration.moduleType.toLowerCase()}/util/`);
                    yield this.copyFile(logger, fileSystem, assetUtils, "async-util.js", engineVariables.gulpUtilFolder, "async-util.js");
                    yield this.copyFile(logger, fileSystem, assetUtils, "bundle.js", engineVariables.gulpUtilFolder, "bundle.js");
                    yield this.copyFile(logger, fileSystem, assetUtils, "client-packages.js", engineVariables.gulpUtilFolder, "client-packages.js");
                    yield this.copyFile(logger, fileSystem, assetUtils, "display.js", engineVariables.gulpUtilFolder, "display.js");
                    yield this.copyFile(logger, fileSystem, assetUtils, "exec.js", engineVariables.gulpUtilFolder, "exec.js");
                    yield this.copyFile(logger, fileSystem, assetUtils, "theme-utils.js", engineVariables.gulpUtilFolder, "theme-utils.js");
                    yield this.copyFile(logger, fileSystem, assetUtils, "unite-config.js", engineVariables.gulpUtilFolder, "unite-config.js");
                    yield this.copyFile(logger, fileSystem, assetUtilModuleType, "module-config.js", engineVariables.gulpUtilFolder, "module-config.js");
                    return 0;
                }
                catch (err) {
                    logger.error("Generating gulp tasks utils failed", err, { gulpUtilFolder: engineVariables.gulpUtilFolder });
                    return 1;
                }
            }
            return 0;
        });
    }
}
Gulp.FILENAME = "gulpfile.js";
exports.Gulp = Gulp;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3Rhc2tNYW5hZ2VyL2d1bHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQU1BLGdGQUE2RTtBQUc3RSxVQUFrQixTQUFRLCtDQUFzQjtJQUcvQixPQUFPLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUNuSSxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxNQUFNO2dCQUNQLFVBQVU7Z0JBQ1YsYUFBYTtnQkFDYixhQUFhO2dCQUNiLGNBQWM7Z0JBQ2QsVUFBVTtnQkFDVixhQUFhO2dCQUNiLFdBQVc7Z0JBQ1gsUUFBUSxDQUFDLEVBQ1Qsa0JBQWtCLENBQUMsV0FBVyxLQUFLLE1BQU0sQ0FBQyxDQUFDO1lBRS9FLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLFdBQVcsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUM1QyxJQUFJLENBQUM7b0JBQ0QsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLGdDQUE0QixZQUFDLFVBQVUsRUFBRSxlQUFlLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFFcEgsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO3dCQUNyQixNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsSUFBSSxDQUFDLFFBQVEsS0FBSyxFQUFFLEVBQUUsU0FBUyxFQUFFLGVBQWUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO3dCQUV4RixNQUFNLEtBQUssR0FBYSxFQUFFLENBQUM7d0JBQzNCLEtBQUssQ0FBQyxJQUFJLENBQUMsd0NBQXdDLENBQUMsQ0FBQzt3QkFDckQsS0FBSyxDQUFDLElBQUksQ0FBQyw2QkFBeUIsWUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUM7d0JBRXBELE1BQU0sVUFBVSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxRQUFRLEVB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QWEsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLFdBQVcsS0FBSyxNQUFNLElBQUksa0JBQWtCLENBQUMsTUFBTSxLQUFLLFFBQVEsQ0FBQyxDQUFDO1lBQzFJLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLFdBQVcsS0FBSyxNQUFNLElBQUksa0JBQWtCLENBQUMsTUFBTSxLQUFLLFFBQVEsQ0FBQyxDQUFDO1lBQzFJLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLEVBQUUsa0JBQWtCLENBQUMsV0FBVyxLQUFLLE1BQU0sSUFBSSxrQkFBa0IsQ0FBQyxPQUFPLEtBQUssU0FBUyxDQUFDLENBQUM7WUFDL0ksZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMscUJBQXFCLEVBQUUsY0FBYyxDQUFDLEVBQUUsa0JBQWtCLENBQUMsV0FBVyxLQUFLLE1BQU0sSUFBSSxrQkFBa0IsQ0FBQyxPQUFPLEtBQUssWUFBWSxDQUFDLENBQUM7WUFDdkssZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsV0FBVyxDQUFDLEVBQUUsa0JBQWtCLENBQUMsV0FBVyxLQUFLLE1BQU0sSUFBSSxrQkFBa0IsQ0FBQyxNQUFNLEtBQUssTUFBTSxDQUFDLENBQUM7WUFDdEksZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsV0FBVyxDQUFDLEVBQUUsa0JBQWtCLENBQUMsV0FBVyxLQUFLLE1BQU0sSUFBSSxrQkFBa0IsQ0FBQyxNQUFNLEtBQUssTUFBTSxDQUFDLENBQUM7WUFDdEksZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsYUFBYSxDQUFDLEVBQUUsa0JBQWtCLENBQUMsV0FBVyxLQUFLLE1BQU0sSUFBSSxrQkFBa0IsQ0FBQyxNQUFNLEtBQUssUUFBUSxDQUFDLENBQUM7WUFDMUksZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsY0FBYyxDQUFDLEVBQUUsa0JBQWtCLENBQUMsV0FBVyxLQUFLLE1BQU0sSUFBSSxrQkFBa0IsQ0FBQyxPQUFPLEtBQUssU0FBUyxDQUFDLENBQUM7WUFFN0ksRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsV0FBVyxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQzVDLElBQUksQ0FBQztvQkFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLG9DQUFvQyxFQUFFLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDO29CQUV4RyxNQUFNLFVBQVUsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxzQkFBc0IsRUFBRSxhQUFhLENBQUMsQ0FBQztvQkFDakcsTUFBTSxrQkFBa0IsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxzQkFBc0IsRUFBRSw2QkFBNkIsa0JBQWtCLENBQUMsY0FBYyxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDM0ssTUFBTSxpQkFBaUIsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxzQkFBc0IsRUFBRSxzQkFBc0Isa0JBQWtCLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDNUosTUFBTSxnQkFBZ0IsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxzQkFBc0IsRUFBRSxxQkFBcUIsa0JBQWtCLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDekosTUFBTSxnQkFBZ0IsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxzQkFBc0IsRUFBRSxxQkFBcUIsa0JBQWtCLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDekosTUFBTSxpQkFBaUIsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxzQkFBc0IsRUFBRSxzQkFBc0Isa0JBQWtCLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFFNUosTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsa0JBQWtCLEVBQUUsb0JBQW9CLEVBQUUsZUFBZSxDQUFDLGVBQWUsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO29CQUN6SSxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSxxQkFBcUIsRUFBRSxlQUFlLENBQUMsZUFBZSxFQUFFLHFCQUFxQixDQUFDLENBQUM7b0JBQzFJLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGlCQUFpQixFQUFFLHdCQUF3QixFQUFFLGVBQWUsQ0FBQyxlQUFlLEVBQUUsd0JBQXdCLENBQUMsQ0FBQztvQkFDaEosTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBQyxlQUFlLEVBQUUsZUFBZSxDQUFDLENBQUM7b0JBQzdILE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFFLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxlQUFlLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztvQkFDbkksTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUseUJBQXlCLEVBQUUsZUFBZSxDQUFDLGVBQWUsRUFBRSx5QkFBeUIsQ0FBQyxDQUFDO29CQUNqSixNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSx1QkFBdUIsRUFBRSxlQUFlLENBQUMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLENBQUM7b0JBQzlJLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGlCQUFpQixFQUFFLDhCQUE4QixFQUFFLGVBQWUsQ0FBQyxlQUFlLEVBQUUsOEJBQThCLENBQUMsQ0FBQztvQkFFNUosTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsZUFBZSxFQUFFLFVBQVUsQ0FBQyxDQUFDO29CQUU3RyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7Z0JBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDWCxNQUFNLENBQUMsS0FBSyxDQUFDLHdDQUF3QyxFQUFFLEdBQUcsRUFBRSxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQztvQkFDbEgsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO1lBQ0wsQ0FBQztZQUVELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7SUFFYSxpQkFBaUIsQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7WUFDOUksZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsbUJBQW1CLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxXQUFXLEtBQUssTUFBTSxJQUFJLGtCQUFrQixDQUFDLGNBQWMsS0FBSyxPQUFPLENBQUMsQ0FBQztZQUV2SixFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLEtBQUssTUFBTSxJQUFJLGtCQUFrQixDQUFDLGNBQWMsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUM1RixJQUFJLENBQUM7b0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxtQ0FBbUMsRUFBRSxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQztvQkFFdkcsTUFBTSxhQUFhLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsc0JBQXNCLEVBQUUsYUFBYSxDQUFDLENBQUM7b0JBRXBHLE1BQU0scUJBQXFCLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsc0JBQXNCLEVBQ3RDLDZCQUE2QixrQkFBa0IsQ0FBQyxjQUFjLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUV0SSxNQUFNLFdBQVcsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxzQkFBc0IsRUFDdEMscUJBQXFCLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBRTVHLE1BQU0sbUJBQW1CLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsc0JBQXNCLEVBQ3RDLDZCQUE2QixrQkFBa0IsQ0FBQyxjQUFjLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUVwSSxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxhQUFhLEVBQUUsU0FBUyxFQUFFLGVBQWUsQ0FBQyxlQUFlLEVBQUUsU0FBUyxDQUFDLENBQUM7b0JBQzlHLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLHFCQUFxQixFQUFFLG1CQUFtQixFQUFFLGVBQWUsQ0FBQyxlQUFlLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztvQkFDMUksTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLGNBQWMsRUFBRSxlQUFlLENBQUMsZUFBZSxFQUFFLGNBQWMsQ0FBQyxDQUFDO29CQUN0SCxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxtQkFBbUIsRUFBRSxnQkFBZ0IsRUFBRSxlQUFlLENBQUMsZUFBZSxFQUFFLGdCQUFnQixDQUFDLENBQUM7b0JBRWxJLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztnQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsdUNBQXVDLEVBQUUsR0FBRyxFQUFFLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDO29CQUNqSCxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7WUFDTCxDQUFDO1lBRUQsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtJQUVhLGdCQUFnQixDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOztZQUM3SSxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxjQUFjLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxXQUFXLEtBQUssTUFBTSxJQUFJLGtCQUFrQixDQUFDLGFBQWEsS0FBSyxhQUFhLENBQUMsQ0FBQztZQUN6SyxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxjQUFjLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxXQUFXLEtBQUssTUFBTSxJQUFJLGtCQUFrQixDQUFDLGFBQWEsS0FBSyxZQUFZLENBQUMsQ0FBQztZQUV0SixFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLEtBQUssTUFBTSxJQUFJLGtCQUFrQixDQUFDLGFBQWEsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUMzRixJQUFJLENBQUM7b0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxrQ0FBa0MsRUFBRSxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQztvQkFFdEcsTUFBTSxZQUFZLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsc0JBQXNCLEVBQUUsYUFBYSxDQUFDLENBQUM7b0JBRW5HLE1BQU0scUJBQXFCLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsc0JBQXNCLEVBQ3RDLDZCQUE2QixrQkFBa0IsQ0FBQyxjQUFjLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUV0SSxNQUFNLFdBQVcsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxzQkFBc0IsRUFDdEMscUJBQXFCLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBRTVHLE1BQU0sa0JBQWtCLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsc0JBQXNCLEVBQ3RDLDRCQUE0QixrQkFBa0IsQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUVqSSxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLGVBQWUsQ0FBQyxlQUFlLEVBQUUsUUFBUSxDQUFDLENBQUM7b0JBQzNHLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLHFCQUFxQixFQUFFLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxlQUFlLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztvQkFDeEksTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLGFBQWEsRUFBRSxlQUFlLENBQUMsZUFBZSxFQUFFLGFBQWEsQ0FBQyxDQUFDO29CQUNwSCxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLEVBQUUsZUFBZSxDQUFDLGVBQWUsRUFBRSxlQUFlLENBQUMsQ0FBQztvQkFDL0gsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsa0JBQWtCLEVBQUUsZ0JBQWdCLEVBQUUsZUFBZSxDQUFDLGVBQWUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO29CQUVqSSxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7Z0JBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDWCxNQUFNLENBQUMsS0FBSyxDQUFDLHNDQUFzQyxFQUFFLEdBQUcsRUFBRSxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQztvQkFDaEgsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO1lBQ0wsQ0FBQztZQUVELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7SUFFYSxrQkFBa0IsQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7WUFDL0ksRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsV0FBVyxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBRTVDLElBQUksQ0FBQztvQkFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLGdDQUFnQyxFQUFFLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDO29CQUVwRyxNQUFNLGdCQUFnQixHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLHNCQUFzQixFQUFFLHFCQUFxQixrQkFBa0IsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUV4SixNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxnQkFBZ0IsRUFBRSxVQUFVLEVBQUUsZUFBZSxDQUFDLGVBQWUsRUFBRSxVQUFVLENBQUMsQ0FBQztvQkFFbkgsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsTUFBTSxDQUFDLEtBQUssQ0FBQyxvQ0FBb0MsRUFBRSxHQUFHLEVBQUUsRUFBRSxlQUFlLEVBQUUsZUFBZSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUM7b0JBQzlHLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztZQUNMLENBQUM7WUFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0lBRWEsa0JBQWtCLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7O1lBQy9JLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLFdBQVcsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUU1QyxJQUFJLENBQUM7b0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxnQ0FBZ0MsRUFBRSxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQztvQkFFcEcsTUFBTSxlQUFlLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsc0JBQXNCLEVBQUUsYUFBYSxDQUFDLENBQUM7b0JBRXRHLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGVBQWUsRUFBRSxVQUFVLEVBQUUsZUFBZSxDQUFDLGVBQWUsRUFBRSxVQUFVLENBQUMsQ0FBQztvQkFFbEgsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsTUFBTSxDQUFDLEtBQUssQ0FBQyxvQ0FBb0MsRUFBRSxHQUFHLEVBQUUsRUFBRSxlQUFlLEVBQUUsZUFBZSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUM7b0JBQzlHLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztZQUNMLENBQUM7WUFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0lBRWEsYUFBYSxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOztZQUMxSSxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxXQUFXLEVBQUUsYUFBYSxDQUFDLEVBQUUsa0JBQWtCLENBQUMsV0FBVyxLQUFLLE1BQU0sQ0FBQyxDQUFDO1lBRTdHLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLFdBQVcsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUM1QyxJQUFJLENBQUM7b0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxnQ0FBZ0MsRUFBRSxFQUFFLGNBQWMsRUFBRSxlQUFlLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztvQkFFbEcsTUFBTSxVQUFVLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsc0JBQXNCLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztvQkFDdEcsTUFBTSxtQkFBbUIsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxzQkFBc0IsRUFBRSx5QkFBeUIsa0JBQWtCLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQztvQkFFekssTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUMsY0FBYyxFQUFFLGVBQWUsQ0FBQyxDQUFDO29CQUN0SCxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLGVBQWUsQ0FBQyxjQUFjLEVBQUUsV0FBVyxDQUFDLENBQUM7b0JBQzlHLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxvQkFBb0IsRUFBRSxlQUFlLENBQUMsY0FBYyxFQUFFLG9CQUFvQixDQUFDLENBQUM7b0JBQ2hJLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsZUFBZSxDQUFDLGNBQWMsRUFBRSxZQUFZLENBQUMsQ0FBQztvQkFDaEgsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxlQUFlLENBQUMsY0FBYyxFQUFFLFNBQVMsQ0FBQyxDQUFDO29CQUMxRyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsZUFBZSxDQUFDLGNBQWMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO29CQUN4SCxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsaUJBQWlCLEVBQUUsZUFBZSxDQUFDLGNBQWMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO29CQUUxSCxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxtQkFBbUIsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLENBQUMsY0FBYyxFQUFFLGtCQUFrQixDQUFDLENBQUM7b0JBRXJJLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztnQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsb0NBQW9DLEVBQUUsR0FBRyxFQUFFLEVBQUUsY0FBYyxFQUFFLGVBQWUsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO29CQUM1RyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7WUFDTCxDQUFDO1lBRUQsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTs7QUF2UmMsYUFBUSxHQUFXLGFBQWEsQ0FBQztBQURwRCxvQkF5UkMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy90YXNrTWFuYWdlci9ndWxwLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
