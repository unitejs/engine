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
            engineVariables.toggleDependencies(["gulp", "require-dir", "gulp-rename", "gulp-replace", "minimist", "gulp-uglify", "uglify-js"], uniteConfiguration.taskManager === "Gulp", true);
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
                            ret = yield this.generateUtils(logger, display, fileSystem, uniteConfiguration, engineVariables);
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
            engineVariables.toggleDependencies(["del", "run-sequence", "gulp-sourcemaps", "gulp-concat", "gulp-insert"], uniteConfiguration.taskManager === "Gulp", true);
            engineVariables.toggleDependencies(["gulp-babel"], uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.sourceLanguage === "JavaScript", true);
            engineVariables.toggleDependencies(["gulp-typescript"], uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.sourceLanguage === "TypeScript", true);
            engineVariables.toggleDependencies(["gulp-eslint"], uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.linter === "ESLint", true);
            engineVariables.toggleDependencies(["gulp-tslint"], uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.linter === "TSLint", true);
            engineVariables.toggleDependencies(["webpack-stream"], uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.bundler === "Webpack", true);
            engineVariables.toggleDependencies(["vinyl-source-stream", "vinyl-buffer"], uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.bundler === "Browserify", true);
            engineVariables.toggleDependencies(["gulp-less"], uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.cssPre === "Less", true);
            engineVariables.toggleDependencies(["gulp-sass"], uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.cssPre === "Sass", true);
            engineVariables.toggleDependencies(["gulp-stylus"], uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.cssPre === "Stylus", true);
            engineVariables.toggleDependencies(["gulp-postcss"], uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.cssPost === "PostCss", true);
            engineVariables.toggleDependencies(["merge2"], uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.cssPost === "None", true);
            if (uniteConfiguration.taskManager === "Gulp") {
                try {
                    _super("log").call(this, logger, display, "Generating gulp tasks for build in", { gulpTasksFolder: engineVariables.gulpTasksFolder });
                    const assetTasks = fileSystem.pathCombine(engineVariables.assetsDirectory, "gulp/tasks/");
                    const assetTasksLanguage = fileSystem.pathCombine(engineVariables.assetsDirectory, "gulp/tasks/sourceLanguage/" + uniteConfiguration.sourceLanguage.toLowerCase() + "/");
                    const assetTasksBundler = fileSystem.pathCombine(engineVariables.assetsDirectory, "gulp/tasks/bundler/" + uniteConfiguration.bundler.toLowerCase() + "/");
                    const assetTasksLinter = fileSystem.pathCombine(engineVariables.assetsDirectory, "gulp/tasks/linter/" + uniteConfiguration.linter.toLowerCase() + "/");
                    const assetTasksCssPre = fileSystem.pathCombine(engineVariables.assetsDirectory, "gulp/tasks/cssPre/" + uniteConfiguration.cssPre.toLowerCase() + "/");
                    const assetTasksCssPost = fileSystem.pathCombine(engineVariables.assetsDirectory, "gulp/tasks/cssPost/" + uniteConfiguration.cssPost.toLowerCase() + "/");
                    yield this.copyFile(logger, display, fileSystem, assetTasksLanguage, "build-transpile.js", engineVariables.gulpTasksFolder, "build-transpile.js");
                    yield this.copyFile(logger, display, fileSystem, assetTasksBundler, "build-bundle-app.js", engineVariables.gulpTasksFolder, "build-bundle-app.js");
                    yield this.copyFile(logger, display, fileSystem, assetTasksBundler, "build-bundle-vendor.js", engineVariables.gulpTasksFolder, "build-bundle-vendor.js");
                    yield this.copyFile(logger, display, fileSystem, assetTasksLinter, "build-lint.js", engineVariables.gulpTasksFolder, "build-lint.js");
                    yield this.copyFile(logger, display, fileSystem, assetTasksCssPre, "build-css.js", engineVariables.gulpTasksFolder, "build-css.js");
                    yield this.copyFile(logger, display, fileSystem, assetTasksCssPost, "build-css-post.js", engineVariables.gulpTasksFolder, "build-css-post.js");
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
            engineVariables.toggleDependencies(["gulp-karma-runner"], uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.unitTestRunner === "Karma", true);
            if (uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.unitTestRunner !== "None") {
                try {
                    _super("log").call(this, logger, display, "Generating gulp tasks for unit in", { gulpTasksFolder: engineVariables.gulpTasksFolder });
                    const assetUnitTest = fileSystem.pathCombine(engineVariables.assetsDirectory, "gulp/tasks/");
                    const assetUnitTestLanguage = fileSystem.pathCombine(engineVariables.assetsDirectory, "gulp/tasks/sourceLanguage/" +
                        uniteConfiguration.sourceLanguage.toLowerCase() + "/");
                    const assetLinter = fileSystem.pathCombine(engineVariables.assetsDirectory, "gulp/tasks/linter/" +
                        uniteConfiguration.linter.toLowerCase() + "/");
                    const assetUnitTestRunner = fileSystem.pathCombine(engineVariables.assetsDirectory, "gulp/tasks/unitTestRunner/" +
                        uniteConfiguration.unitTestRunner.toLowerCase() + "/");
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
            engineVariables.toggleDependencies(["gulp-webdriver", "browser-sync"], uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.e2eTestRunner === "WebdriverIO", true);
            engineVariables.toggleDependencies(["browser-sync"], uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.e2eTestRunner === "Protractor", true);
            if (uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.e2eTestRunner !== "None") {
                try {
                    _super("log").call(this, logger, display, "Generating gulp tasks for e2e in", { gulpTasksFolder: engineVariables.gulpTasksFolder });
                    const assetE2eTest = fileSystem.pathCombine(engineVariables.assetsDirectory, "gulp/tasks/");
                    const assetUnitTestLanguage = fileSystem.pathCombine(engineVariables.assetsDirectory, "gulp/tasks/sourceLanguage/" +
                        uniteConfiguration.sourceLanguage.toLowerCase() + "/");
                    const assetLinter = fileSystem.pathCombine(engineVariables.assetsDirectory, "gulp/tasks/linter/" +
                        uniteConfiguration.linter.toLowerCase() + "/");
                    const assetE2eTestRunner = fileSystem.pathCombine(engineVariables.assetsDirectory, "gulp/tasks/e2eTestRunner/" +
                        uniteConfiguration.e2eTestRunner.toLowerCase() + "/");
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
                    const assetTasksServer = fileSystem.pathCombine(engineVariables.assetsDirectory, "gulp/tasks/server/" + uniteConfiguration.server.toLowerCase());
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
    generateUtils(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDependencies(["gulp-util", "gulp-rename"], uniteConfiguration.taskManager === "Gulp", true);
            if (uniteConfiguration.taskManager === "Gulp") {
                try {
                    _super("log").call(this, logger, display, "Generating gulp tasks utils in", { gulpUtilFolder: engineVariables.gulpUtilFolder });
                    const assetUtils = fileSystem.pathCombine(engineVariables.assetsDirectory, "gulp/tasks/util/");
                    yield this.copyFile(logger, display, fileSystem, assetUtils, "bundle.js", engineVariables.gulpUtilFolder, "bundle.js");
                    yield this.copyFile(logger, display, fileSystem, assetUtils, "display.js", engineVariables.gulpUtilFolder, "display.js");
                    yield this.copyFile(logger, display, fileSystem, assetUtils, "exec.js", engineVariables.gulpUtilFolder, "exec.js");
                    yield this.copyFile(logger, display, fileSystem, assetUtils, "unite-config.js", engineVariables.gulpUtilFolder, "unite-config.js");
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9waXBlbGluZVN0ZXBzL3Rhc2tNYW5hZ2VyL2d1bHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUlBLGdGQUE2RTtBQU03RSxVQUFrQixTQUFRLCtDQUFzQjtJQUcvQixPQUFPLENBQUMsTUFBZSxFQUFFLE9BQWlCLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQ3RKLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLE1BQU0sRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFFLGNBQWMsRUFBRSxVQUFVLEVBQUUsYUFBYSxFQUFFLFdBQVcsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLFdBQVcsS0FBSyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFcEwsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsV0FBVyxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQzVDLElBQUksQ0FBQztvQkFDRCxNQUFNLGtCQUFrQixHQUFHLE1BQU0sZ0NBQTRCLFlBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUVySCxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7d0JBQ3JCLGFBQVMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGNBQWMsSUFBSSxDQUFDLFFBQVEsS0FBSyxFQUFFLEVBQUUsVUFBVSxFQUFFLGVBQWUsQ0FBQyxVQUFVLEVBQUUsRUFBRTt3QkFFekcsTUFBTSxLQUFLLEdBQWEsRUFBRSxDQUFDO3dCQUMzQixLQUFLLENBQUMsSUFBSSxDQUFDLHdDQUF3QyxDQUFDLENBQUM7d0JBQ3JELEtBQUssQ0FBQyxJQUFJLENBQUMsNkJBQXlCLFlBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDO3dCQUVwRCxNQUFNLFVBQVUsQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLEtB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LE9BQU8sRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLGlCQUFpQixFQUFFLGVBQWUsQ0FBQyxjQUFjLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztvQkFFbkksTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsZUFBVyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsb0NBQW9DLEVBQUUsR0FBRyxFQUFFLEVBQUUsY0FBYyxFQUFFLGVBQWUsQ0FBQyxjQUFjLEVBQUUsRUFBRTtvQkFDNUgsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO1lBQ0wsQ0FBQztZQUVELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7O0FBclBjLGFBQVEsR0FBVyxhQUFhLENBQUM7QUFEcEQsb0JBdVBDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvdGFza01hbmFnZXIvZ3VscC5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMifQ==
