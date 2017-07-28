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
            engineVariables.toggleDevDependency(["gulp", "require-dir", "gulp-rename", "gulp-replace", "minimist", "gulp-uglify", "uglify-js"], uniteConfiguration.taskManager === "Gulp");
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
                    const assetTasks = fileSystem.pathCombine(engineVariables.assetsDirectory, "gulp/tasks/");
                    const assetTasksLanguage = fileSystem.pathCombine(engineVariables.assetsDirectory, `gulp/tasks/sourceLanguage/${uniteConfiguration.sourceLanguage.toLowerCase()}/`);
                    const assetTasksBundler = fileSystem.pathCombine(engineVariables.assetsDirectory, `gulp/tasks/bundler/${uniteConfiguration.bundler.toLowerCase()}/`);
                    const assetTasksLinter = fileSystem.pathCombine(engineVariables.assetsDirectory, `gulp/tasks/linter/${uniteConfiguration.linter.toLowerCase()}/`);
                    const assetTasksCssPre = fileSystem.pathCombine(engineVariables.assetsDirectory, `gulp/tasks/cssPre/${uniteConfiguration.cssPre.toLowerCase()}/`);
                    const assetTasksCssPost = fileSystem.pathCombine(engineVariables.assetsDirectory, `gulp/tasks/cssPost/${uniteConfiguration.cssPost.toLowerCase()}/`);
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
                    const assetUnitTest = fileSystem.pathCombine(engineVariables.assetsDirectory, "gulp/tasks/");
                    const assetUnitTestLanguage = fileSystem.pathCombine(engineVariables.assetsDirectory, `gulp/tasks/sourceLanguage/${uniteConfiguration.sourceLanguage.toLowerCase()}/`);
                    const assetLinter = fileSystem.pathCombine(engineVariables.assetsDirectory, `gulp/tasks/linter/${uniteConfiguration.linter.toLowerCase()}/`);
                    const assetUnitTestRunner = fileSystem.pathCombine(engineVariables.assetsDirectory, `gulp/tasks/unitTestRunner/${uniteConfiguration.unitTestRunner.toLowerCase()}/`);
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
                    const assetE2eTest = fileSystem.pathCombine(engineVariables.assetsDirectory, "gulp/tasks/");
                    const assetUnitTestLanguage = fileSystem.pathCombine(engineVariables.assetsDirectory, `gulp/tasks/sourceLanguage/${uniteConfiguration.sourceLanguage.toLowerCase()}/`);
                    const assetLinter = fileSystem.pathCombine(engineVariables.assetsDirectory, `gulp/tasks/linter/${uniteConfiguration.linter.toLowerCase()}/`);
                    const assetE2eTestRunner = fileSystem.pathCombine(engineVariables.assetsDirectory, `gulp/tasks/e2eTestRunner/${uniteConfiguration.e2eTestRunner.toLowerCase()}/`);
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
                    const assetTasksServer = fileSystem.pathCombine(engineVariables.assetsDirectory, `gulp/tasks/server/${uniteConfiguration.server.toLowerCase()}`);
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
            engineVariables.toggleDevDependency(["gulp-util", "gulp-rename"], uniteConfiguration.taskManager === "Gulp");
            if (uniteConfiguration.taskManager === "Gulp") {
                try {
                    _super("log").call(this, logger, display, "Generating gulp tasks utils in", { gulpUtilFolder: engineVariables.gulpUtilFolder });
                    const assetUtils = fileSystem.pathCombine(engineVariables.assetsDirectory, "gulp/tasks/util/");
                    const assetUtilModuleType = fileSystem.pathCombine(engineVariables.assetsDirectory, `gulp/tasks/moduleType/${uniteConfiguration.moduleType.toLowerCase()}/util/`);
                    yield this.copyFile(logger, display, fileSystem, assetUtils, "bundle.js", engineVariables.gulpUtilFolder, "bundle.js");
                    yield this.copyFile(logger, display, fileSystem, assetUtils, "client-packages.js", engineVariables.gulpUtilFolder, "client-packages.js");
                    yield this.copyFile(logger, display, fileSystem, assetUtils, "display.js", engineVariables.gulpUtilFolder, "display.js");
                    yield this.copyFile(logger, display, fileSystem, assetUtils, "exec.js", engineVariables.gulpUtilFolder, "exec.js");
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3Rhc2tNYW5hZ2VyL2d1bHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQU9BLGdGQUE2RTtBQUc3RSxVQUFrQixTQUFRLCtDQUFzQjtJQUcvQixPQUFPLENBQUMsTUFBZSxFQUFFLE9BQWlCLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQ3RKLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE1BQU0sRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFFLGNBQWMsRUFBRSxVQUFVLEVBQUUsYUFBYSxFQUFFLFdBQVcsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLFdBQVcsS0FBSyxNQUFNLENBQUMsQ0FBQztZQUUvSyxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDNUMsSUFBSSxDQUFDO29CQUNELE1BQU0sa0JBQWtCLEdBQUcsTUFBTSxnQ0FBNEIsWUFBQyxVQUFVLEVBQUUsZUFBZSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBRXJILEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQzt3QkFDckIsYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsY0FBYyxJQUFJLENBQUMsUUFBUSxLQUFLLEVBQUUsRUFBRSxVQUFVLEVBQUUsZUFBZSxDQUFDLFVBQVUsRUFBRSxFQUFFO3dCQUV6RyxNQUFNLEtBQUssR0FBYSxFQUFFLENBQUM7d0JBQzNCLEtBQUssQ0FBQyxJQUFJLENBQUMsd0NBQXdDLENBQUMsQ0FBQzt3QkFDckQsS0FBSyxDQUFDLElBQUksQ0FBQyw2QkFBeUIsWUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUM7d0JBRXBELE1BQU0sVUFBVSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFD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QU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsZUFBZSxDQUFDLGNBQWMsRUFBRSxZQUFZLENBQUMsQ0FBQztvQkFDekgsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsZUFBZSxDQUFDLGNBQWMsRUFBRSxTQUFTLENBQUMsQ0FBQztvQkFDbkgsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSxlQUFlLENBQUMsY0FBYyxFQUFFLGlCQUFpQixDQUFDLENBQUM7b0JBRW5JLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxtQkFBbUIsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLENBQUMsY0FBYyxFQUFFLGtCQUFrQixDQUFDLENBQUM7b0JBRTlJLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztnQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNYLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLG9DQUFvQyxFQUFFLEdBQUcsRUFBRSxFQUFFLGNBQWMsRUFBRSxlQUFlLENBQUMsY0FBYyxFQUFFLEVBQUU7b0JBQzVILE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztZQUNMLENBQUM7WUFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBOztBQXRQYyxhQUFRLEdBQVcsYUFBYSxDQUFDO0FBRHBELG9CQXdQQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL3Rhc2tNYW5hZ2VyL2d1bHAuanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
