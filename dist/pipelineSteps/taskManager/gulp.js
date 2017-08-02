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
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["gulp", "require-dir", "gulp-rename", "gulp-replace", "minimist", "gulp-uglify", "uglify-js", "mkdirp"], uniteConfiguration.taskManager === "Gulp");
            if (uniteConfiguration.taskManager === "Gulp") {
                try {
                    const hasGeneratedMarker = yield _super("fileHasGeneratedMarker").call(this, fileSystem, engineVariables.rootFolder, Gulp.FILENAME);
                    if (hasGeneratedMarker) {
                        _super("log").call(this, logger, display, `Generating ${Gulp.FILENAME} in`, { rootFolder: engineVariables.rootFolder });
                        const lines = [];
                        lines.push("require('require-dir')('build/tasks');");
                        lines.push(_super("wrapGeneratedMarker").call(this, "/* ", " */"));
                        yield fileSystem.fileWriteLines(engineVariables.rootFolder, Gulp.FILENAME, lines);
                    }
                    else {
                        _super("log").call(this, logger, display, `Skipping ${Gulp.FILENAME} at it has no generated marker`);
                    }
                }
                catch (err) {
                    _super("error").call(this, logger, display, `Generating ${Gulp.FILENAME} failed`, err, { rootFolder: engineVariables.rootFolder });
                    return 1;
                }
                try {
                    _super("log").call(this, logger, display, "Creating Gulp Build Directory", { gulpBuildFolder: engineVariables.gulpBuildFolder });
                    yield fileSystem.directoryCreate(engineVariables.gulpBuildFolder);
                }
                catch (err) {
                    _super("error").call(this, logger, display, "Creating Gulp Build Directory failed", err, { gulpBuildFolder: engineVariables.gulpBuildFolder });
                    return 1;
                }
                engineVariables.gulpTasksFolder = fileSystem.pathCombine(engineVariables.gulpBuildFolder, "tasks");
                try {
                    _super("log").call(this, logger, display, "Creating Gulp Tasks Directory", { gulpTasksFolder: engineVariables.gulpTasksFolder });
                    yield fileSystem.directoryCreate(engineVariables.gulpTasksFolder);
                }
                catch (err) {
                    _super("error").call(this, logger, display, "Creating Gulp Tasks Directory failed", err, { gulpTasksFolder: engineVariables.gulpTasksFolder });
                    return 1;
                }
                engineVariables.gulpUtilFolder = fileSystem.pathCombine(engineVariables.gulpTasksFolder, "util");
                try {
                    _super("log").call(this, logger, display, "Creating Gulp Util Directory", { gulpUtilFolder: engineVariables.gulpUtilFolder });
                    yield fileSystem.directoryCreate(engineVariables.gulpUtilFolder);
                }
                catch (err) {
                    _super("error").call(this, logger, display, "Creating Gulp Util Directory failed", err, { gulpUtilFolder: engineVariables.gulpUtilFolder });
                    return 1;
                }
            }
            else {
                try {
                    _super("log").call(this, logger, display, "Deleting Gulp Build Directory", { gulpBuildFolder: engineVariables.gulpBuildFolder });
                    const exists = yield fileSystem.directoryExists(engineVariables.rootFolder);
                    if (exists) {
                        yield fileSystem.directoryDelete(engineVariables.gulpBuildFolder);
                    }
                }
                catch (err) {
                    _super("error").call(this, logger, display, "Deleting Gulp Build Directory failed", err, { gulpBuildFolder: engineVariables.gulpBuildFolder });
                    return 1;
                }
                const ret2 = yield _super("deleteFile").call(this, logger, display, fileSystem, engineVariables.rootFolder, Gulp.FILENAME);
                if (ret2 !== 0) {
                    return ret2;
                }
            }
            let ret = yield this.generateBuildTasks(logger, display, fileSystem, uniteConfiguration, engineVariables);
            if (ret === 0) {
                ret = yield this.generateUnitTasks(logger, display, fileSystem, uniteConfiguration, engineVariables);
                if (ret === 0) {
                    ret = yield this.generateE2eTasks(logger, display, fileSystem, uniteConfiguration, engineVariables);
                    if (ret === 0) {
                        ret = yield this.generateServeTasks(logger, display, fileSystem, uniteConfiguration, engineVariables);
                        if (ret === 0) {
                            ret = yield this.generateThemeTasks(logger, display, fileSystem, uniteConfiguration, engineVariables);
                            if (ret === 0) {
                                ret = yield this.generateUtils(logger, display, fileSystem, uniteConfiguration, engineVariables);
                            }
                        }
                    }
                }
            }
            return ret;
        });
    }
    generateBuildTasks(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
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
            engineVariables.toggleDevDependency(["merge2"], uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.cssPost === "None");
            if (uniteConfiguration.taskManager === "Gulp") {
                try {
                    _super("log").call(this, logger, display, "Generating gulp tasks for build in", { gulpTasksFolder: engineVariables.gulpTasksFolder });
                    const assetTasks = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, "gulp/tasks/");
                    const assetTasksLanguage = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/sourceLanguage/${uniteConfiguration.sourceLanguage.toLowerCase()}/`);
                    const assetTasksBundler = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/bundler/${uniteConfiguration.bundler.toLowerCase()}/`);
                    const assetTasksLinter = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/linter/${uniteConfiguration.linter.toLowerCase()}/`);
                    const assetTasksCssPre = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/cssPre/${uniteConfiguration.cssPre.toLowerCase()}/`);
                    const assetTasksCssPost = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/cssPost/${uniteConfiguration.cssPost.toLowerCase()}/`);
                    yield this.copyFile(logger, display, fileSystem, assetTasksLanguage, "build-transpile.js", engineVariables.gulpTasksFolder, "build-transpile.js");
                    yield this.copyFile(logger, display, fileSystem, assetTasksBundler, "build-bundle-app.js", engineVariables.gulpTasksFolder, "build-bundle-app.js");
                    yield this.copyFile(logger, display, fileSystem, assetTasksBundler, "build-bundle-vendor.js", engineVariables.gulpTasksFolder, "build-bundle-vendor.js");
                    yield this.copyFile(logger, display, fileSystem, assetTasksLinter, "build-lint.js", engineVariables.gulpTasksFolder, "build-lint.js");
                    yield this.copyFile(logger, display, fileSystem, assetTasksCssPre, "build-css-app.js", engineVariables.gulpTasksFolder, "build-css-app.js");
                    yield this.copyFile(logger, display, fileSystem, assetTasksCssPre, "build-css-components.js", engineVariables.gulpTasksFolder, "build-css-components.js");
                    yield this.copyFile(logger, display, fileSystem, assetTasksCssPost, "build-css-post-app.js", engineVariables.gulpTasksFolder, "build-css-post-app.js");
                    yield this.copyFile(logger, display, fileSystem, assetTasksCssPost, "build-css-post-components.js", engineVariables.gulpTasksFolder, "build-css-post-components.js");
                    yield this.copyFile(logger, display, fileSystem, assetTasks, "build.js", engineVariables.gulpTasksFolder, "build.js");
                    return 0;
                }
                catch (err) {
                    _super("error").call(this, logger, display, "Generating gulp tasks for build failed", err, { gulpTasksFolder: engineVariables.gulpTasksFolder });
                    return 1;
                }
            }
            return 0;
        });
    }
    generateUnitTasks(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["gulp-karma-runner"], uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.unitTestRunner === "Karma");
            if (uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.unitTestRunner !== "None") {
                try {
                    _super("log").call(this, logger, display, "Generating gulp tasks for unit in", { gulpTasksFolder: engineVariables.gulpTasksFolder });
                    const assetUnitTest = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, "gulp/tasks/");
                    const assetUnitTestLanguage = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/sourceLanguage/${uniteConfiguration.sourceLanguage.toLowerCase()}/`);
                    const assetLinter = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/linter/${uniteConfiguration.linter.toLowerCase()}/`);
                    const assetUnitTestRunner = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/unitTestRunner/${uniteConfiguration.unitTestRunner.toLowerCase()}/`);
                    yield this.copyFile(logger, display, fileSystem, assetUnitTest, "unit.js", engineVariables.gulpTasksFolder, "unit.js");
                    yield this.copyFile(logger, display, fileSystem, assetUnitTestLanguage, "unit-transpile.js", engineVariables.gulpTasksFolder, "unit-transpile.js");
                    yield this.copyFile(logger, display, fileSystem, assetLinter, "unit-lint.js", engineVariables.gulpTasksFolder, "unit-lint.js");
                    yield this.copyFile(logger, display, fileSystem, assetUnitTestRunner, "unit-runner.js", engineVariables.gulpTasksFolder, "unit-runner.js");
                    return 0;
                }
                catch (err) {
                    _super("error").call(this, logger, display, "Generating gulp tasks for unit failed", err, { gulpTasksFolder: engineVariables.gulpTasksFolder });
                    return 1;
                }
            }
            return 0;
        });
    }
    generateE2eTasks(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["gulp-webdriver", "browser-sync"], uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.e2eTestRunner === "WebdriverIO");
            engineVariables.toggleDevDependency(["browser-sync"], uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.e2eTestRunner === "Protractor");
            if (uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.e2eTestRunner !== "None") {
                try {
                    _super("log").call(this, logger, display, "Generating gulp tasks for e2e in", { gulpTasksFolder: engineVariables.gulpTasksFolder });
                    const assetE2eTest = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, "gulp/tasks/");
                    const assetUnitTestLanguage = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/sourceLanguage/${uniteConfiguration.sourceLanguage.toLowerCase()}/`);
                    const assetLinter = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/linter/${uniteConfiguration.linter.toLowerCase()}/`);
                    const assetE2eTestRunner = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/e2eTestRunner/${uniteConfiguration.e2eTestRunner.toLowerCase()}/`);
                    yield this.copyFile(logger, display, fileSystem, assetE2eTest, "e2e.js", engineVariables.gulpTasksFolder, "e2e.js");
                    yield this.copyFile(logger, display, fileSystem, assetUnitTestLanguage, "e2e-transpile.js", engineVariables.gulpTasksFolder, "e2e-transpile.js");
                    yield this.copyFile(logger, display, fileSystem, assetLinter, "e2e-lint.js", engineVariables.gulpTasksFolder, "e2e-lint.js");
                    yield this.copyFile(logger, display, fileSystem, assetE2eTestRunner, "e2e-runner.js", engineVariables.gulpTasksFolder, "e2e-runner.js");
                    yield this.copyFile(logger, display, fileSystem, assetE2eTestRunner, "e2e-install.js", engineVariables.gulpTasksFolder, "e2e-install.js");
                    return 0;
                }
                catch (err) {
                    _super("error").call(this, logger, display, "Generating gulp tasks for e2e failed", err, { gulpTasksFolder: engineVariables.gulpTasksFolder });
                    return 1;
                }
            }
            return 0;
        });
    }
    generateServeTasks(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (uniteConfiguration.taskManager === "Gulp") {
                try {
                    _super("log").call(this, logger, display, "Generating gulp tasks serve in", { gulpTasksFolder: engineVariables.gulpTasksFolder });
                    const assetTasksServer = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/server/${uniteConfiguration.server.toLowerCase()}`);
                    yield this.copyFile(logger, display, fileSystem, assetTasksServer, "serve.js", engineVariables.gulpTasksFolder, "serve.js");
                    return 0;
                }
                catch (err) {
                    _super("error").call(this, logger, display, "Generating gulp tasks serve failed", err, { gulpTasksFolder: engineVariables.gulpTasksFolder });
                    return 1;
                }
            }
            return 0;
        });
    }
    generateThemeTasks(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (uniteConfiguration.taskManager === "Gulp") {
                try {
                    _super("log").call(this, logger, display, "Generating gulp tasks theme in", { gulpTasksFolder: engineVariables.gulpTasksFolder });
                    const assetTasksTheme = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, "gulp/tasks/");
                    yield this.copyFile(logger, display, fileSystem, assetTasksTheme, "theme.js", engineVariables.gulpTasksFolder, "theme.js");
                    return 0;
                }
                catch (err) {
                    _super("error").call(this, logger, display, "Generating gulp tasks serve failed", err, { gulpTasksFolder: engineVariables.gulpTasksFolder });
                    return 1;
                }
            }
            return 0;
        });
    }
    generateUtils(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["gulp-util", "gulp-rename"], uniteConfiguration.taskManager === "Gulp");
            if (uniteConfiguration.taskManager === "Gulp") {
                try {
                    _super("log").call(this, logger, display, "Generating gulp tasks utils in", { gulpUtilFolder: engineVariables.gulpUtilFolder });
                    const assetUtils = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, "gulp/tasks/util/");
                    const assetUtilModuleType = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `gulp/tasks/moduleType/${uniteConfiguration.moduleType.toLowerCase()}/util/`);
                    yield this.copyFile(logger, display, fileSystem, assetUtils, "bundle.js", engineVariables.gulpUtilFolder, "bundle.js");
                    yield this.copyFile(logger, display, fileSystem, assetUtils, "client-packages.js", engineVariables.gulpUtilFolder, "client-packages.js");
                    yield this.copyFile(logger, display, fileSystem, assetUtils, "display.js", engineVariables.gulpUtilFolder, "display.js");
                    yield this.copyFile(logger, display, fileSystem, assetUtils, "exec.js", engineVariables.gulpUtilFolder, "exec.js");
                    yield this.copyFile(logger, display, fileSystem, assetUtils, "theme-utils.js", engineVariables.gulpUtilFolder, "theme-utils.js");
                    yield this.copyFile(logger, display, fileSystem, assetUtils, "unite-config.js", engineVariables.gulpUtilFolder, "unite-config.js");
                    yield this.copyFile(logger, display, fileSystem, assetUtilModuleType, "module-config.js", engineVariables.gulpUtilFolder, "module-config.js");
                    return 0;
                }
                catch (err) {
                    _super("error").call(this, logger, display, "Generating gulp tasks utils failed", err, { gulpUtilFolder: engineVariables.gulpUtilFolder });
                    return 1;
                }
            }
            return 0;
        });
    }
}
Gulp.FILENAME = "gulpfile.js";
exports.Gulp = Gulp;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3Rhc2tNYW5hZ2VyL2d1bHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQU9BLGdGQUE2RTtBQUc3RSxVQUFrQixTQUFRLCtDQUFzQjtJQUcvQixPQUFPLENBQUMsTUFBZSxFQUFFLE9BQWlCLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQ3RKLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE1BQU0sRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFFLGNBQWMsRUFBRSxVQUFVLEVBQUUsYUFBYSxFQUFFLFdBQVcsRUFBRSxRQUFRLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxXQUFXLEtBQUssTUFBTSxDQUFDLENBQUM7WUFFekwsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsV0FBVyxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQzVDLElBQUksQ0FBQztvQkFDRCxNQUFNLGtCQUFrQixHQUFHLE1BQU0sZ0NBQTRCLFlBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUVySCxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7d0JBQ3JCLGFBQVMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGNBQWMsSUFBSSxDQUFDLFFBQVEsS0FBSyxFQUFFLEVBQUUsVUFBVSxFQUFFLGVBQWUsQ0FBQyxVQUFVLEVBQUUsRUFBRTt3QkFFekcsTUFBTSxLQUFLLEdBQWEsRUFBRSxDQUFDO3dCQUMzQixLQUFLLENBQUMsSUFBSSxDQUFDLHdDQUF3QyxDQUFDLENBQUM7d0JBQ3JELEtBQUssQ0FBQyxJQUFJLENBQUMsNkJBQXlCLFlBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDO3dCQUVwRCxNQUFNLFVBQVUsQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUN0RixDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNKLGFBQVMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFlBQVksSUFBSSxDQUFDLFFBQVEsZ0NBQWdDLEVBQUU7b0JBQzFGLENBQUM7Z0JBQ0wsQ0FBQztnQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNYLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGNBQWMsSUFBSSxDQUFDLFFBQVEsU0FBUyxFQUFFLEdBQUcsRUFBRSxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsVUFBVSxFQUFFLEVBQUU7b0JBQ3BILE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztnQkFFRCxJQUFJLENBQUM7b0JBQ0QsYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsK0JBQStCLEVBQUUsRUFBRSxlQUFlLEVBQUUsZUFBZSxDQUFDLGVBQWUsRUFBRSxFQUFFO29CQUNsSCxNQUFNLFVBQVUsQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxDQUFDO2dCQUN0RSxDQUFDO2dCQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsZUFBVyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsc0NBQXNDLEVBQUUsR0FBRyxFQUFFLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBQyxlQUFlLEVBQUUsRUFBRTtvQkFDaEksTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUVELGVBQWUsQ0FBQyxlQUFlLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsZUFBZSxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUNuRyxJQUFJLENBQUM7b0JBQ0QsYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsK0JBQStCLEVBQUUsRUFBRSxlQUFlLEVBQUUsZUFBZSxDQUFDLGVBQWUsRUFBRSxFQUFFO29CQUNsSCxNQUFNLFVBQVUsQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxDQUFDO2dCQUN0RSxDQUFDO2dCQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsZUFBVyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsc0NBQXNDLEVBQUUsR0FBRyxFQUFFLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBQyxlQUFlLEVBQUUsRUFBRTtvQkFDaEksTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUVELGVBQWUsQ0FBQyxjQUFjLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsZUFBZSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUNqRyxJQUFJLENBQUM7b0JBQ0QsYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsOEJBQThCLEVBQUUsRUFBRSxjQUFjLEVBQUUsZUFBZSxDQUFDLGNBQWMsRUFBRSxFQUFFO29CQUMvRyxNQUFNLFVBQVUsQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2dCQUNyRSxDQUFDO2dCQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsZUFBVyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUscUNBQXFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsY0FBYyxFQUFFLGVBQWUsQ0FBQyxjQUFjLEVBQUUsRUFBRTtvQkFDN0gsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO1lBQ0wsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLElBQUksQ0FBQztvQkFDRCxhQUFTLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSwrQkFBK0IsRUFBRSxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUMsZUFBZSxFQUFFLEVBQUU7b0JBRWxILE1BQU0sTUFBTSxHQUFHLE1BQU0sVUFBVSxDQUFDLGVBQWUsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7b0JBQzVFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7d0JBQ1QsTUFBTSxVQUFVLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxlQUFlLENBQUMsQ0FBQztvQkFDdEUsQ0FBQztnQkFDTCxDQUFDO2dCQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsZUFBVyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsc0NBQXNDLEVBQUUsR0FBRyxFQUFFLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBQyxlQUFlLEVBQUUsRUFBRTtvQkFDaEksTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUVELE1BQU0sSUFBSSxHQUFHLE1BQU0sb0JBQWdCLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsZUFBZSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQzVHLEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNiLE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0JBQ2hCLENBQUM7WUFDTCxDQUFDO1lBRUQsSUFBSSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsa0JBQWtCLEVBQUUsZUFBZSxDQUFDLENBQUM7WUFDMUcsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1osR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxDQUFDO2dCQUNyRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDWixHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsa0JBQWtCLEVBQUUsZUFBZSxDQUFDLENBQUM7b0JBQ3BHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNaLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLENBQUMsQ0FBQzt3QkFDdEcsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ1osR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxDQUFDOzRCQUN0RyxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQ0FDWixHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxDQUFDOzRCQUNyRyxDQUFDO3dCQUNMLENBQUM7b0JBQ0wsQ0FBQztnQkFDTCxDQUFDO1lBQ0wsQ0FBQztZQUNELE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDZixDQUFDO0tBQUE7SUFFWSxrQkFBa0IsQ0FBQyxNQUFlLEVBQUUsT0FBaUIsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDakssZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsS0FBSyxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsaUJBQWlCLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFBRSxjQUFjLEVBQUUsZUFBZSxFQUFFLFdBQVcsQ0FBQyxFQUN0SSxrQkFBa0IsQ0FBQyxXQUFXLEtBQUssTUFBTSxDQUFDLENBQUM7WUFDL0UsZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsWUFBWSxDQUFDLEVBQUUsa0JBQWtCLENBQUMsV0FBVyxLQUFLLE1BQU0sSUFBSSxrQkFBa0IsQ0FBQyxjQUFjLEtBQUssWUFBWSxDQUFDLENBQUM7WUFDckosZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsaUJBQWlCLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxXQUFXLEtBQUssTUFBTSxJQUFJLGtCQUFrQixDQUFDLGNBQWMsS0FBSyxZQUFZLENBQUMsQ0FBQztZQUMxSixlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxhQUFhLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxXQUFXLEtBQUssTUFBTSxJQUFJLGtCQUFrQixDQUFDLE1BQU0sS0FBSyxRQUFRLENBQUMsQ0FBQztZQUMxSSxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxhQUFhLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxXQUFXLEtBQUssTUFBTSxJQUFJLGtCQUFrQixDQUFDLE1BQU0sS0FBSyxRQUFRLENBQUMsQ0FBQztZQUMxSSxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLFdBQVcsS0FBSyxNQUFNLElBQUksa0JBQWtCLENBQUMsT0FBTyxLQUFLLFNBQVMsQ0FBQyxDQUFDO1lBQy9JLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLHFCQUFxQixFQUFFLGNBQWMsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLFdBQVcsS0FBSyxNQUFNLElBQUksa0JBQWtCLENBQUMsT0FBTyxLQUFLLFlBQVksQ0FBQyxDQUFDO1lBQ3ZLLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLFdBQVcsS0FBSyxNQUFNLElBQUksa0JBQWtCLENBQUMsTUFBTSxLQUFLLE1BQU0sQ0FBQyxDQUFDO1lBQ3RJLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLFdBQVcsS0FBSyxNQUFNLElBQUksa0JBQWtCLENBQUMsTUFBTSxLQUFLLE1BQU0sQ0FBQyxDQUFDO1lBQ3RJLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLFdBQVcsS0FBSyxNQUFNLElBQUksa0JBQWtCLENBQUMsTUFBTSxLQUFLLFFBQVEsQ0FBQyxDQUFDO1lBQzFJLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLFdBQVcsS0FBSyxNQUFNLElBQUksa0JBQWtCLENBQUMsT0FBTyxLQUFLLFNBQVMsQ0FBQyxDQUFDO1lBQzdJLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLFdBQVcsS0FBSyxNQUFNLElBQUksa0JBQWtCLENBQUMsT0FBTyxLQUFLLE1BQU0sQ0FBQyxDQUFDO1lBRXBJLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLFdBQVcsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUM1QyxJQUFJLENBQUM7b0JBQ0QsYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsb0NBQW9DLEVBQUUsRUFBRSxlQUFlLEVBQUUsZUFBZSxDQUFDLGVBQWUsRUFBRSxFQUFFO29CQUV2SCxNQUFNLFVBQVUsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxzQkFBc0IsRUFBRSxhQUFhLENBQUMsQ0FBQztvQkFDakcsTUFBTSxrQkFBa0IsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxzQkFBc0IsRUFBRSw2QkFBNkIsa0JBQWtCLENBQUMsY0FBYyxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDM0ssTUFBTSxpQkFBaUIsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxzQkFBc0IsRUFBRSxzQkFBc0Isa0JBQWtCLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDNUosTUFBTSxnQkFBZ0IsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxzQkFBc0IsRUFBRSxxQkFBcUIsa0JBQWtCLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDekosTUFBTSxnQkFBZ0IsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxzQkFBc0IsRUFBRSxxQkFBcUIsa0JBQWtCLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDekosTUFBTSxpQkFBaUIsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxzQkFBc0IsRUFBRSxzQkFBc0Isa0JBQWtCLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFFNUosTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFLG9CQUFvQixFQUFFLGVBQWUsQ0FBQyxlQUFlLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztvQkFDbEosTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLGlCQUFpQixFQUFFLHFCQUFxQixFQUFFLGVBQWUsQ0FBQyxlQUFlLEVBQUUscUJBQXFCLENBQUMsQ0FBQztvQkFDbkosTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLGlCQUFpQixFQUFFLHdCQUF3QixFQUFFLGVBQWUsQ0FBQyxlQUFlLEVBQUUsd0JBQXdCLENBQUMsQ0FBQztvQkFDekosTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUMsZUFBZSxFQUFFLGVBQWUsQ0FBQyxDQUFDO29CQUN0SSxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsa0JBQWtCLEVBQUUsZUFBZSxDQUFDLGVBQWUsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO29CQUM1SSxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUseUJBQXlCLEVBQUUsZUFBZSxDQUFDLGVBQWUsRUFBRSx5QkFBeUIsQ0FBQyxDQUFDO29CQUMxSixNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsaUJBQWlCLEVBQUUsdUJBQXVCLEVBQUUsZUFBZSxDQUFDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO29CQUN2SixNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsaUJBQWlCLEVBQUUsOEJBQThCLEVBQUUsZUFBZSxDQUFDLGVBQWUsRUFBRSw4QkFBOEIsQ0FBQyxDQUFDO29CQUVySyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsZUFBZSxFQUFFLFVBQVUsQ0FBQyxDQUFDO29CQUV0SCxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7Z0JBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDWCxlQUFXLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSx3Q0FBd0MsRUFBRSxHQUFHLEVBQUUsRUFBRSxlQUFlLEVBQUUsZUFBZSxDQUFDLGVBQWUsRUFBRSxFQUFFO29CQUNsSSxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7WUFDTCxDQUFDO1lBRUQsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtJQUVhLGlCQUFpQixDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUNqSyxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLFdBQVcsS0FBSyxNQUFNLElBQUksa0JBQWtCLENBQUMsY0FBYyxLQUFLLE9BQU8sQ0FBQyxDQUFDO1lBRXZKLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLFdBQVcsS0FBSyxNQUFNLElBQUksa0JBQWtCLENBQUMsY0FBYyxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQzVGLElBQUksQ0FBQztvQkFDRCxhQUFTLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxtQ0FBbUMsRUFBRSxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUMsZUFBZSxFQUFFLEVBQUU7b0JBRXRILE1BQU0sYUFBYSxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLHNCQUFzQixFQUFFLGFBQWEsQ0FBQyxDQUFDO29CQUVwRyxNQUFNLHFCQUFxQixHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLHNCQUFzQixFQUN0Qyw2QkFBNkIsa0JBQWtCLENBQUMsY0FBYyxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFFdEksTUFBTSxXQUFXLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsc0JBQXNCLEVBQ3RDLHFCQUFxQixrQkFBa0IsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUU1RyxNQUFNLG1CQUFtQixHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLHNCQUFzQixFQUN0Qyw2QkFBNkIsa0JBQWtCLENBQUMsY0FBYyxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFFcEksTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLGFBQWEsRUFBRSxTQUFTLEVBQUUsZUFBZSxDQUFDLGVBQWUsRUFBRSxTQUFTLENBQUMsQ0FBQztvQkFDdkgsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLHFCQUFxQixFQUFFLG1CQUFtQixFQUFFLGVBQWUsQ0FBQyxlQUFlLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztvQkFDbkosTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxjQUFjLEVBQUUsZUFBZSxDQUFDLGVBQWUsRUFBRSxjQUFjLENBQUMsQ0FBQztvQkFDL0gsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLG1CQUFtQixFQUFFLGdCQUFnQixFQUFFLGVBQWUsQ0FBQyxlQUFlLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztvQkFFM0ksTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsZUFBVyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsdUNBQXVDLEVBQUUsR0FBRyxFQUFFLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBQyxlQUFlLEVBQUUsRUFBRTtvQkFDakksTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO1lBQ0wsQ0FBQztZQUVELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7SUFFYSxnQkFBZ0IsQ0FBQyxNQUFlLEVBQUUsT0FBaUIsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDaEssZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsZ0JBQWdCLEVBQUUsY0FBYyxDQUFDLEVBQUUsa0JBQWtCLENBQUMsV0FBVyxLQUFLLE1BQU0sSUFBSSxrQkFBa0IsQ0FBQyxhQUFhLEtBQUssYUFBYSxDQUFDLENBQUM7WUFDekssZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsY0FBYyxDQUFDLEVBQUUsa0JBQWtCLENBQUMsV0FBVyxLQUFLLE1BQU0sSUFBSSxrQkFBa0IsQ0FBQyxhQUFhLEtBQUssWUFBWSxDQUFDLENBQUM7WUFFdEosRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsV0FBVyxLQUFLLE1BQU0sSUFBSSxrQkFBa0IsQ0FBQyxhQUFhLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDM0YsSUFBSSxDQUFDO29CQUNELGFBQVMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGtDQUFrQyxFQUFFLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBQyxlQUFlLEVBQUUsRUFBRTtvQkFFckgsTUFBTSxZQUFZLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsc0JBQXNCLEVBQUUsYUFBYSxDQUFDLENBQUM7b0JBRW5HLE1BQU0scUJBQXFCLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsc0JBQXNCLEVBQ3RDLDZCQUE2QixrQkFBa0IsQ0FBQyxjQUFjLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUV0SSxNQUFNLFdBQVcsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxzQkFBc0IsRUFDdEMscUJBQXFCLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBRTVHLE1BQU0sa0JBQWtCLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsc0JBQXNCLEVBQ3RDLDRCQUE0QixrQkFBa0IsQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUVqSSxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxlQUFlLENBQUMsZUFBZSxFQUFFLFFBQVEsQ0FBQyxDQUFDO29CQUNwSCxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUscUJBQXFCLEVBQUUsa0JBQWtCLEVBQUUsZUFBZSxDQUFDLGVBQWUsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO29CQUNqSixNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLGFBQWEsRUFBRSxlQUFlLENBQUMsZUFBZSxFQUFFLGFBQWEsQ0FBQyxDQUFDO29CQUM3SCxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsa0JBQWtCLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBQyxlQUFlLEVBQUUsZUFBZSxDQUFDLENBQUM7b0JBQ3hJLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxnQkFBZ0IsRUFBRSxlQUFlLENBQUMsZUFBZSxFQUFFLGdCQUFnQixDQUFDLENBQUM7b0JBRTFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztnQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNYLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLHNDQUFzQyxFQUFFLEdBQUcsRUFBRSxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUMsZUFBZSxFQUFFLEVBQUU7b0JBQ2hJLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztZQUNMLENBQUM7WUFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0lBRWEsa0JBQWtCLENBQUMsTUFBZSxFQUFFLE9BQWlCLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQ2xLLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLFdBQVcsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUU1QyxJQUFJLENBQUM7b0JBQ0QsYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsZ0NBQWdDLEVBQUUsRUFBRSxlQUFlLEVBQUUsZUFBZSxDQUFDLGVBQWUsRUFBRSxFQUFFO29CQUVuSCxNQUFNLGdCQUFnQixHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLHNCQUFzQixFQUFFLHFCQUFxQixrQkFBa0IsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUV4SixNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsVUFBVSxFQUFFLGVBQWUsQ0FBQyxlQUFlLEVBQUUsVUFBVSxDQUFDLENBQUM7b0JBRTVILE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztnQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNYLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLG9DQUFvQyxFQUFFLEdBQUcsRUFBRSxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUMsZUFBZSxFQUFFLEVBQUU7b0JBQzlILE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztZQUNMLENBQUM7WUFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0lBRWEsa0JBQWtCLENBQUMsTUFBZSxFQUFFLE9BQWlCLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQ2xLLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLFdBQVcsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUU1QyxJQUFJLENBQUM7b0JBQ0QsYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsZ0NBQWdDLEVBQUUsRUFBRSxlQUFlLEVBQUUsZUFBZSxDQUFDLGVBQWUsRUFBRSxFQUFFO29CQUVuSCxNQUFNLGVBQWUsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxzQkFBc0IsRUFBRSxhQUFhLENBQUMsQ0FBQztvQkFFdEcsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLGVBQWUsRUFBRSxVQUFVLEVBQUUsZUFBZSxDQUFDLGVBQWUsRUFBRSxVQUFVLENBQUMsQ0FBQztvQkFFM0gsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsZUFBVyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsb0NBQW9DLEVBQUUsR0FBRyxFQUFFLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBQyxlQUFlLEVBQUUsRUFBRTtvQkFDOUgsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO1lBQ0wsQ0FBQztZQUVELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7SUFFYSxhQUFhLENBQUMsTUFBZSxFQUFFLE9BQWlCLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQzdKLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLFdBQVcsRUFBRSxhQUFhLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxXQUFXLEtBQUssTUFBTSxDQUFDLENBQUM7WUFFN0csRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsV0FBVyxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQzVDLElBQUksQ0FBQztvQkFDRCxhQUFTLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxnQ0FBZ0MsRUFBRSxFQUFFLGNBQWMsRUFBRSxlQUFlLENBQUMsY0FBYyxFQUFFLEVBQUU7b0JBRWpILE1BQU0sVUFBVSxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLHNCQUFzQixFQUFFLGtCQUFrQixDQUFDLENBQUM7b0JBQ3RHLE1BQU0sbUJBQW1CLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsc0JBQXNCLEVBQUUseUJBQXlCLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUM7b0JBRXpLLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLGVBQWUsQ0FBQyxjQUFjLEVBQUUsV0FBVyxDQUFDLENBQUM7b0JBQ3ZILE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsb0JBQW9CLEVBQUUsZUFBZSxDQUFDLGNBQWMsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO29CQUN6SSxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxlQUFlLENBQUMsY0FBYyxFQUFFLFlBQVksQ0FBQyxDQUFDO29CQUN6SCxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxlQUFlLENBQUMsY0FBYyxFQUFFLFNBQVMsQ0FBQyxDQUFDO29CQUNuSCxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFFLGVBQWUsQ0FBQyxjQUFjLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztvQkFDakksTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSxlQUFlLENBQUMsY0FBYyxFQUFFLGlCQUFpQixDQUFDLENBQUM7b0JBRW5JLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxtQkFBbUIsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLENBQUMsY0FBYyxFQUFFLGtCQUFrQixDQUFDLENBQUM7b0JBRTlJLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztnQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNYLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLG9DQUFvQyxFQUFFLEdBQUcsRUFBRSxFQUFFLGNBQWMsRUFBRSxlQUFlLENBQUMsY0FBYyxFQUFFLEVBQUU7b0JBQzVILE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztZQUNMLENBQUM7WUFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBOztBQTlRYyxhQUFRLEdBQVcsYUFBYSxDQUFDO0FBRHBELG9CQWdSQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL3Rhc2tNYW5hZ2VyL2d1bHAuanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
