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
                    engineVariables.requiredDevDependencies.push("gulp-karma-runner");
                    engineVariables.requiredDevDependencies.push("karma-story-reporter");
                    let transpileReplacer;
                    let runnerReplacer;
                    let srcDistReplace;
                    const unitFiles = [];
                    const karmaFrameworks = [];
                    if (uniteConfiguration.moduleLoader === "RequireJS") {
                        srcDistReplace = "replace(\/(define)*?(..\\/src\\/)/g, \"..\/dist\/\")";
                        karmaFrameworks.push("requirejs");
                        engineVariables.requiredDevDependencies.push("karma-requirejs");
                    }
                    if (uniteConfiguration.unitTestFramework === "Mocha-Chai") {
                        karmaFrameworks.push("mocha");
                        unitFiles.push({ pattern: "node_modules/chai/chai.js", included: false });
                        engineVariables.requiredDevDependencies.push("karma-mocha");
                    }
                    transpileReplacer = (line) => line.replace("{SRC_DIST_REPLACE}", srcDistReplace);
                    let karmaUnitFiles = "";
                    for (let i = 0; i < unitFiles.length; i++) {
                        karmaUnitFiles += "unitFiles.push({ pattern: '" + unitFiles[i].pattern + "', included: " + unitFiles[i].included + " });";
                    }
                    runnerReplacer = (line) => {
                        line = line.replace("{KARMA_FRAMEWORKS}", "[" + karmaFrameworks.map(f => "\"" + f + "\"").join(", ") + "]");
                        line = line.replace("{UNIT_FILES}", karmaUnitFiles);
                        return line;
                    };
                    yield this.copyFile(logger, display, fileSystem, assetUnitTest, "unit.js", engineVariables.gulpTasksFolder, "unit.js");
                    yield this.copyFile(logger, display, fileSystem, assetUnitTestLanguage, "unit-transpile.js", engineVariables.gulpTasksFolder, "unit-transpile.js", transpileReplacer);
                    yield this.copyFile(logger, display, fileSystem, assetUnitTestRunner, "unit-runner.js", engineVariables.gulpTasksFolder, "unit-runner.js", runnerReplacer);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvZ3VscFRhc2tzVW5pdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBSUEsdURBQW9EO0FBQ3BELDZFQUEwRTtBQU0xRSxtQkFBMkIsU0FBUSwrQ0FBc0I7SUFDeEMsT0FBTyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUN0SixJQUFJLENBQUM7Z0JBQ0QsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsY0FBYyxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQ2hELGFBQVMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLG1DQUFtQyxFQUFFLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBQyxlQUFlLEVBQUUsRUFBRTtvQkFFdEgsTUFBTSxhQUFhLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsZUFBZSxFQUFFLGFBQWEsQ0FBQyxDQUFDO29CQUU3RixNQUFNLHFCQUFxQixHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLGVBQWUsRUFDL0IsYUFBYTt3QkFDYiwyQkFBWSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztvQkFFeEgsTUFBTSxtQkFBbUIsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxlQUFlLEVBQy9CLGFBQWE7d0JBQ2IsMkJBQVksQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsY0FBYyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7b0JBRXRILGVBQWUsQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztvQkFDbEUsZUFBZSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO29CQUVyRSxJQUFJLGlCQUF5RCxDQUFDO29CQUM5RCxJQUFJLGNBQXNELENBQUM7b0JBQzNELElB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
