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
                    engineVariables.requiredDevDependencies.push("karma-html-reporter");
                    engineVariables.requiredDevDependencies.push("remap-istanbul");
                    engineVariables.requiredDevDependencies.push("karma-coverage");
                    engineVariables.requiredDevDependencies.push("karma-sourcemap-loader");
                    uniteConfiguration.testFrameworks = [];
                    uniteConfiguration.testIncludes = [];
                    uniteConfiguration.testIncludes.push({
                        pattern: "unite.json",
                        included: false
                    });
                    if (uniteConfiguration.moduleLoader === "Webpack") {
                        uniteConfiguration.testIncludes.push({
                            pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.rootFolder, fileSystem.pathCombine(engineVariables.unitTestDistFolder, "test-bundle.js"))),
                            included: true
                        });
                    }
                    else {
                        uniteConfiguration.testIncludes.push({
                            pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.rootFolder, fileSystem.pathCombine(engineVariables.distFolder, "**/*.js"))),
                            included: false
                        });
                        uniteConfiguration.testIncludes.push({
                            pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.rootFolder, fileSystem.pathCombine(engineVariables.unitTestDistFolder, "**/*.spec.js"))),
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
                            pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.rootFolder, fileSystem.pathCombine(engineVariables.unitTestDistFolder, "../unitBootstrap.js"))),
                            included: true
                        });
                    }
                    yield this.copyFile(logger, display, fileSystem, assetUnitTest, "unit.js", engineVariables.gulpTasksFolder, "unit.js");
                    yield this.copyFile(logger, display, fileSystem, assetUnitTest, "unit-report.js", engineVariables.gulpTasksFolder, "unit-report.js");
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvZ3VscFRhc2tzVW5pdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBSUEsdURBQW9EO0FBQ3BELDZFQUEwRTtBQU0xRSxtQkFBMkIsU0FBUSwrQ0FBc0I7SUFDeEMsT0FBTyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUN0SixJQUFJLENBQUM7Z0JBQ0QsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsY0FBYyxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQ2hELGFBQVMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLG1DQUFtQyxFQUFFLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBQyxlQUFlLEVBQUUsRUFBRTtvQkFFdEgsTUFBTSxhQUFhLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsZUFBZSxFQUFFLGFBQWEsQ0FBQyxDQUFDO29CQUU3RixNQUFNLHFCQUFxQixHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLGVBQWUsRUFDL0IsYUFBYTt3QkFDYiwyQkFBWSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztvQkFFeEgsTUFBTSxtQkFBbUIsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxlQUFlLEVBQy9CLGFBQWE7d0JBQ2IsMkJBQVksQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsY0FBYyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7b0JBRXRILE1BQU0sbUJBQW1CLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsZUFBZSxFQUMvQixhQUFhO3dCQUNiLDJCQUFZLENBQUMsV0FBVyxDQUFDLGtCQUFrQixDQUFDLFlBQVksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO29CQUVwSCxlQUFlLENBQUMsdUJBQXVCLENBQUMs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QyxZQUFZLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQzt3QkFDcEcsa0JBQWtCLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQzs0QkFDakMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQzFCLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLGtCQUFrQixFQUFFLHFCQUFxQixDQUFDLENBQUMsQ0FBQzs0QkFDN0ksUUFBUSxFQUFFLElBQUk7eUJBQ2pCLENBQUMsQ0FBQztvQkFDUCxDQUFDO29CQUVELE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxhQUFhLEVBQUUsU0FBUyxFQUFFLGVBQWUsQ0FBQyxlQUFlLEVBQUUsU0FBUyxDQUFDLENBQUM7b0JBQ3ZILE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxhQUFhLEVBQUUsZ0JBQWdCLEVBQUUsZUFBZSxDQUFDLGVBQWUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO29CQUNySSxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUscUJBQXFCLEVBQUUsbUJBQW1CLEVBQUUsZUFBZSxDQUFDLGVBQWUsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO29CQUNuSixNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsbUJBQW1CLEVBQUUsZ0JBQWdCLEVBQUUsZUFBZSxDQUFDLGVBQWUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO29CQUMzSSxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsbUJBQW1CLEVBQUUsZ0JBQWdCLEVBQUUsZUFBZSxDQUFDLGVBQWUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUMvSSxDQUFDO2dCQUVELE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxlQUFXLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSx1Q0FBdUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxlQUFlLEVBQUUsZUFBZSxDQUFDLGVBQWUsRUFBRSxFQUFFO2dCQUNqSSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztRQUNMLENBQUM7S0FBQTtDQUNKO0FBeEdELHNDQXdHQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2d1bHBUYXNrc1VuaXQuanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
