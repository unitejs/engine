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
                    let transpileReplacer;
                    let runnerReplacer;
                    let srcDistReplace;
                    const unitFiles = [];
                    const karmaFrameworks = [];
                    if (uniteConfiguration.moduleLoader === "Webpack") {
                        unitFiles.push({
                            pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(uniteConfiguration.outputDirectory, fileSystem.pathCombine(engineVariables.unitTestDistFolder, "test-bundle.js"))),
                            included: true
                        });
                    }
                    else {
                        unitFiles.push({
                            pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(uniteConfiguration.outputDirectory, fileSystem.pathCombine(engineVariables.distFolder, "**/*.js"))),
                            included: false
                        });
                        unitFiles.push({
                            pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(uniteConfiguration.outputDirectory, fileSystem.pathCombine(engineVariables.unitTestDistFolder, "**/*.spec.js"))),
                            included: false
                        });
                        unitFiles.push({
                            pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(uniteConfiguration.outputDirectory, fileSystem.pathCombine(engineVariables.unitTestDistFolder, "../unitBootstrap.js"))),
                            included: true
                        });
                    }
                    if (uniteConfiguration.moduleLoader === "RequireJS") {
                        srcDistReplace = "replace(\/(define)*?(..\\/src\\/)/g, \"..\/dist\/\")";
                        karmaFrameworks.push("requirejs");
                        engineVariables.requiredDevDependencies.push("karma-requirejs");
                    }
                    else if (uniteConfiguration.moduleLoader === "SystemJS") {
                        srcDistReplace = "replace(\/(System.register)*?(..\\/src\\/)/g, \"..\/dist\/\")";
                        engineVariables.requiredDevDependencies.push("bluebird");
                        unitFiles.push({ pattern: "node_modules/bluebird/js/browser/bluebird.js", included: true });
                        engineVariables.requiredDevDependencies.push("karma-systemjs");
                        unitFiles.push({ pattern: "node_modules/systemjs/dist/system.js", included: true });
                    }
                    else if (uniteConfiguration.moduleLoader === "Webpack") {
                        srcDistReplace = "replace(\/(require)*?(..\\/src\\/)/g, \"..\/dist\/\")";
                        engineVariables.requiredDevDependencies.push("karma-commonjs");
                    }
                    if (uniteConfiguration.unitTestFramework === "Mocha-Chai") {
                        karmaFrameworks.push("mocha");
                        karmaFrameworks.push("chai");
                        engineVariables.requiredDevDependencies.push("karma-mocha");
                        engineVariables.requiredDevDependencies.push("karma-chai");
                    }
                    else if (uniteConfiguration.unitTestFramework === "Jasmine") {
                        karmaFrameworks.push("jasmine");
                        engineVariables.requiredDevDependencies.push("karma-jasmine");
                    }
                    transpileReplacer = (line) => line.replace("{SRC_DIST_REPLACE}", srcDistReplace);
                    let karmaUnitFiles = "";
                    for (let i = 0; i < unitFiles.length; i++) {
                        karmaUnitFiles += "unitFiles.push({ pattern: '" + unitFiles[i].pattern + "', included: " + unitFiles[i].included + " });\r\n    ";
                    }
                    runnerReplacer = (line) => {
                        line = line.replace("{KARMA_FRAMEWORKS}", "[" + karmaFrameworks.map(f => "'" + f + "'").join(", ") + "]");
                        line = line.replace("{UNIT_FILES}", karmaUnitFiles.trim());
                        return line;
                    };
                    yield this.copyFile(logger, display, fileSystem, assetUnitTest, "unit.js", engineVariables.gulpTasksFolder, "unit.js");
                    yield this.copyFile(logger, display, fileSystem, assetUnitTestLanguage, "unit-transpile.js", engineVariables.gulpTasksFolder, "unit-transpile.js", transpileReplacer);
                    yield this.copyFile(logger, display, fileSystem, assetUnitTestRunner, "unit-runner.js", engineVariables.gulpTasksFolder, "unit-runner.js", runnerReplacer);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvZ3VscFRhc2tzVW5pdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBSUEsdURBQW9EO0FBQ3BELDZFQUEwRTtBQU0xRSxtQkFBMkIsU0FBUSwrQ0FBc0I7SUFDeEMsT0FBTyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUN0SixJQUFJLENBQUM7Z0JBQ0QsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsY0FBYyxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQ2hELGFBQVMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLG1DQUFtQyxFQUFFLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBQyxlQUFlLEVBQUUsRUFBRTtvQkFFdEgsTUFBTSxhQUFhLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsZUFBZSxFQUFFLGFBQWEsQ0FBQyxDQUFDO29CQUU3RixNQUFNLHFCQUFxQixHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLGVBQWUsRUFDL0IsYUFBYTt3QkFDYiwyQkFBWSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztvQkFFeEgsTUFBTSxtQkFBbUIsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxlQUFlLEVBQy9CLGFBQWE7d0JBQ2IsMkJBQVksQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsY0FBYyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7b0JBRXRILE1BQU0sbUJBQW1CLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsZUFBZSxFQUMvQixhQUFhO3dCQUNiLDJCQUFZLENBQUMsV0FBVyxDQUFDLGtCQUFrQixDQUFDLFlBQVksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO29CQUVwSCxlQUFlLENBQUMsdUJBQXVCLENBQUMs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O29CQUN0SSxDQUFDO29CQUVELGNBQWMsR0FBRyxDQUFDLElBQUk7d0JBQ2xCLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLG9CQUFvQixFQUFFLEdBQUcsR0FBRyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQzt3QkFDMUcsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO3dCQUMzRCxNQUFNLENBQUMsSUFBSSxDQUFDO29CQUNoQixDQUFDLENBQUM7b0JBRUYsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLGFBQWEsRUFBRSxTQUFTLEVBQUUsZUFBZSxDQUFDLGVBQWUsRUFBRSxTQUFTLENBQUMsQ0FBQztvQkFDdkgsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLHFCQUFxQixFQUFFLG1CQUFtQixFQUFFLGVBQWUsQ0FBQyxlQUFlLEVBQUUsbUJBQW1CLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztvQkFDdEssTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLG1CQUFtQixFQUFFLGdCQUFnQixFQUFFLGVBQWUsQ0FBQyxlQUFlLEVBQUUsZ0JBQWdCLEVBQUUsY0FBYyxDQUFDLENBQUM7b0JBQzNKLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxtQkFBbUIsRUFBRSxnQkFBZ0IsRUFBRSxlQUFlLENBQUMsZUFBZSxFQUFFLGdCQUFnQixDQUFDLENBQUM7Z0JBQy9JLENBQUM7Z0JBRUQsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLHVDQUF1QyxFQUFFLEdBQUcsRUFBRSxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUMsZUFBZSxFQUFFLEVBQUU7Z0JBQ2pJLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1FBQ0wsQ0FBQztLQUFBO0NBQ0o7QUF2R0Qsc0NBdUdDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvZ3VscFRhc2tzVW5pdC5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMifQ==
