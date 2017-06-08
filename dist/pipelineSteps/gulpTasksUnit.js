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
const stringHelper_1 = require("../core/stringHelper");
const enginePipelineStepBase_1 = require("../engine/enginePipelineStepBase");
class GulpTasksUnit extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (uniteConfiguration.unitTestRunner === "Karma") {
                    _super("log").call(this, logger, display, "Generating gulp tasks for unit in", { gulpTasksFolder: engineVariables.gulpTasksFolder });
                    const assetUnitTest = fileSystem.pathCombine(engineVariables.assetsDirectory, "gulp/tasks/");
                    const assetUnitTestLanguage = fileSystem.pathCombine(engineVariables.assetsDirectory, "gulp/tasks/" +
                        stringHelper_1.StringHelper.toCamelCase(uniteConfiguration.sourceLanguage) + "/");
                    const assetUnitTestRunner = fileSystem.pathCombine(engineVariables.assetsDirectory, "gulp/tasks/" +
                        stringHelper_1.StringHelper.toCamelCase(uniteConfiguration.unitTestRunner) + "/");
                    const assetUnitTestModule = fileSystem.pathCombine(engineVariables.assetsDirectory, "gulp/tasks/" +
                        stringHelper_1.StringHelper.toCamelCase(uniteConfiguration.moduleLoader) + "/");
                    engineVariables.requiredDevDependencies.push("gulp-karma-runner");
                    engineVariables.requiredDevDependencies.push("karma-story-reporter");
                    uniteConfiguration.testFrameworks = [];
                    uniteConfiguration.testIncludes = [];
                    uniteConfiguration.testIncludes.push({
                        pattern: "unite.json",
                        included: false
                    });
                    if (uniteConfiguration.moduleLoader === "Webpack") {
                        uniteConfiguration.testIncludes.push({
                            pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(uniteConfiguration.outputDirectory, fileSystem.pathCombine(engineVariables.unitTestDistFolder, "test-bundle.js"))),
                            included: true
                        });
                    }
                    else {
                        uniteConfiguration.testIncludes.push({
                            pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(uniteConfiguration.outputDirectory, fileSystem.pathCombine(engineVariables.distFolder, "**/*.js"))),
                            included: false
                        });
                        uniteConfiguration.testIncludes.push({
                            pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(uniteConfiguration.outputDirectory, fileSystem.pathCombine(engineVariables.unitTestDistFolder, "**/*.spec.js"))),
                            included: false
                        });
                    }
                    if (uniteConfiguration.moduleLoader === "RequireJS") {
                        uniteConfiguration.srcDistReplace = "(define)*?(..\/src\/)";
                        uniteConfiguration.srcDistReplaceWith = "../dist/";
                        uniteConfiguration.testFrameworks.push("requirejs");
                        engineVariables.requiredDevDependencies.push("karma-requirejs");
                    }
                    else if (uniteConfiguration.moduleLoader === "SystemJS") {
                        uniteConfiguration.srcDistReplace = "(System.register)*?(..\/src\/)";
                        uniteConfiguration.srcDistReplaceWith = "../dist/";
                        engineVariables.requiredDevDependencies.push("bluebird");
                        uniteConfiguration.testIncludes.push({ pattern: "node_modules/bluebird/js/browser/bluebird.js", included: true });
                        engineVariables.requiredDevDependencies.push("karma-systemjs");
                        uniteConfiguration.testIncludes.push({ pattern: "node_modules/systemjs/dist/system.js", included: true });
                    }
                    else if (uniteConfiguration.moduleLoader === "Webpack") {
                        uniteConfiguration.srcDistReplace = "(require)*?(..\/src\/)";
                        uniteConfiguration.srcDistReplaceWith = "../dist/";
                        engineVariables.requiredDevDependencies.push("karma-commonjs");
                    }
                    if (uniteConfiguration.unitTestFramework === "Mocha-Chai") {
                        uniteConfiguration.testFrameworks.push("mocha");
                        uniteConfiguration.testFrameworks.push("chai");
                        engineVariables.requiredDevDependencies.push("karma-mocha");
                        engineVariables.requiredDevDependencies.push("karma-chai");
                    }
                    else if (uniteConfiguration.unitTestFramework === "Jasmine") {
                        uniteConfiguration.testFrameworks.push("jasmine");
                        engineVariables.requiredDevDependencies.push("karma-jasmine");
                    }
                    if (uniteConfiguration.moduleLoader === "RequireJS" || uniteConfiguration.moduleLoader === "SystemJS") {
                        uniteConfiguration.testIncludes.push({
                            pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(uniteConfiguration.outputDirectory, fileSystem.pathCombine(engineVariables.unitTestDistFolder, "../unitBootstrap.js"))),
                            included: true
                        });
                    }
                    yield this.copyFile(logger, display, fileSystem, assetUnitTest, "unit.js", engineVariables.gulpTasksFolder, "unit.js");
                    yield this.copyFile(logger, display, fileSystem, assetUnitTestLanguage, "unit-transpile.js", engineVariables.gulpTasksFolder, "unit-transpile.js");
                    yield this.copyFile(logger, display, fileSystem, assetUnitTestRunner, "unit-runner.js", engineVariables.gulpTasksFolder, "unit-runner.js");
                    yield this.copyFile(logger, display, fileSystem, assetUnitTestModule, "unit-bundle.js", engineVariables.gulpTasksFolder, "unit-bundle.js");
                }
                return 0;
            }
            catch (err) {
                _super("error").call(this, logger, display, "Generating gulp tasks for unit failed", err, { gulpTasksFolder: engineVariables.gulpTasksFolder });
                return 1;
            }
        });
    }
}
exports.GulpTasksUnit = GulpTasksUnit;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvZ3VscFRhc2tzVW5pdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBSUEsdURBQW9EO0FBQ3BELDZFQUEwRTtBQU0xRSxtQkFBMkIsU0FBUSwrQ0FBc0I7SUFDeEMsT0FBTyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUN0SixJQUFJLENBQUM7Z0JBQ0QsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsY0FBYyxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQ2hELGFBQVMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLG1DQUFtQyxFQUFFLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBQyxlQUFlLEVBQUUsRUFBRTtvQkFFdEgsTUFBTSxhQUFhLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsZUFBZSxFQUFFLGFBQWEsQ0FBQyxDQUFDO29CQUU3RixNQUFNLHFCQUFxQixHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLGVBQWUsRUFDL0IsYUFBYTt3QkFDYiwyQkFBWSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztvQkFFeEgsTUFBTSxtQkFBbUIsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxlQUFlLEVBQy9CLGFBQWE7d0JBQ2IsMkJBQVksQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsY0FBYyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7b0JBRXRILE1BQU0sbUJBQW1CLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsZUFBZSxFQUMvQixhQUFhO3dCQUNiLDJCQUFZLENBQUMsV0FBVyxDQUFDLGtCQUFrQixDQUFDLFlBQVksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO29CQUVwSCxlQUFlLENBQUMsdUJBQXVCLENBQUMs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
