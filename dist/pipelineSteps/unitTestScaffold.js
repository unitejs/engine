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
class UnitTestScaffold extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (uniteConfiguration.unitTestRunner === "Karma") {
                engineVariables.unitTestFolder = fileSystem.pathCombine(uniteConfiguration.outputDirectory, "\\test\\unit");
                engineVariables.unitTestSrcFolder = fileSystem.pathCombine(uniteConfiguration.outputDirectory, "\\test\\unit\\src");
                engineVariables.unitTestDistFolder = fileSystem.pathCombine(uniteConfiguration.outputDirectory, "\\test\\unit\\dist");
                try {
                    _super("log").call(this, logger, display, "Creating Unit Test Directory", { unitTestSrcFolder: engineVariables.unitTestSrcFolder });
                    yield fileSystem.directoryCreate(engineVariables.unitTestSrcFolder);
                }
                catch (err) {
                    _super("error").call(this, logger, display, "Creating Unit Test Directory failed", err, { unitTestSrcFolder: engineVariables.unitTestSrcFolder });
                    return 1;
                }
                try {
                    _super("log").call(this, logger, display, "Generating unit test scaffold", { unitTestSrcFolder: engineVariables.unitTestSrcFolder });
                    const unitTestsScaffold = fileSystem.pathCombine(engineVariables.assetsDirectory, "scaffold/test/unit/src/" +
                        stringHelper_1.StringHelper.toCamelCase(uniteConfiguration.sourceLanguage) + "/" +
                        stringHelper_1.StringHelper.toCamelCase(uniteConfiguration.unitTestFramework) + "/");
                    const unitTestsScaffoldModuleLoader = fileSystem.pathCombine(engineVariables.assetsDirectory, "scaffold/test/unit/src/" +
                        stringHelper_1.StringHelper.toCamelCase(uniteConfiguration.moduleLoader) + "/");
                    const unitFrameworks = {};
                    let bootstrapReplacer;
                    if (uniteConfiguration.unitTestFramework === "Mocha-Chai") {
                        engineVariables.requiredDevDependencies.push("mocha");
                        engineVariables.requiredDevDependencies.push("chai");
                        unitFrameworks.chai = "node_modules/chai/chai";
                    }
                    else if (uniteConfiguration.unitTestFramework === "Jasmine") {
                        engineVariables.requiredDevDependencies.push("jasmine-core");
                    }
                    yield this.copyFile(logger, display, fileSystem, unitTestsScaffold, "main.spec." + engineVariables.sourceLanguageExt, engineVariables.unitTestSrcFolder, "main.spec." + engineVariables.sourceLanguageExt);
                    yield this.copyFile(logger, display, fileSystem, unitTestsScaffold, "app.spec." + engineVariables.sourceLanguageExt, engineVariables.unitTestSrcFolder, "app.spec." + engineVariables.sourceLanguageExt);
                    const keys = Object.keys(unitFrameworks);
                    let requirePaths = "";
                    const requirePackages = "";
                    for (let i = 0; i < keys.length; i++) {
                        requirePaths += "paths['" + keys[i] + "'] = '" + unitFrameworks[keys[i]] + "';\n";
                    }
                    bootstrapReplacer = (line) => {
                        line = line.replace("{REQUIRE_PATHS}", requirePaths);
                        line = line.replace("{REQUIRE_PACKAGES}", requirePackages);
                        return line;
                    };
                    yield this.copyFile(logger, display, fileSystem, unitTestsScaffoldModuleLoader, "unitBootstrap.js", engineVariables.unitTestFolder, "unitBootstrap.js", bootstrapReplacer);
                    return 0;
                }
                catch (err) {
                    _super("error").call(this, logger, display, "Generating unit test scaffold failed", err, { unitTestSrcFolder: engineVariables.unitTestSrcFolder });
                    return 1;
                }
            }
            else {
                return 0;
            }
        });
    }
}
exports.UnitTestScaffold = UnitTestScaffold;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvdW5pdFRlc3RTY2FmZm9sZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBSUEsdURBQW9EO0FBQ3BELDZFQUEwRTtBQU0xRSxzQkFBOEIsU0FBUSwrQ0FBc0I7SUFDM0MsT0FBTyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUN0SixFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDaEQsZUFBZSxDQUFDLGNBQWMsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGtCQUFrQixDQUFDLGVBQWUsRUFBRSxjQUFjLENBQUMsQ0FBQztnQkFDNUcsZUFBZSxDQUFDLGlCQUFpQixHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsZUFBZSxFQUFFLG1CQUFtQixDQUFDLENBQUM7Z0JBQ3BILGVBQWUsQ0FBQyxrQkFBa0IsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGtCQUFrQixDQUFDLGVBQWUsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO2dCQUV0SCxJQUFJLENBQUM7b0JBQ0QsYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsOEJBQThCLEVBQUUsRUFBRSxpQkFBaUIsRUFBRSxlQUFlLENBQUMsaUJBQWlCLEVBQUUsRUFBRTtvQkFDckgsTUFBTSxVQUFVLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2dCQUN4RSxDQUFDO2dCQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsZUFBVyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUscUNBQXFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsaUJBQWlCLEVBQUUsZUFBZSxDQUFDLGlCQUFpQixFQUFFLEVBQUU7b0JBQ25JLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztnQkFF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LFVBQVUsRUFBRSw2QkFBNkIsRUFDMUQsa0JBQWtCLEVBQ2xCLGVBQWUsQ0FBQyxjQUFjLEVBQzlCLGtCQUFrQixFQUFFLGlCQUFpQixDQUFDLENBQUM7b0JBRTNELE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztnQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNYLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLHNDQUFzQyxFQUFFLEdBQUcsRUFBRSxFQUFFLGlCQUFpQixFQUFFLGVBQWUsQ0FBQyxpQkFBaUIsRUFBRSxFQUFFO29CQUNwSSxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7WUFDTCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7UUFDTCxDQUFDO0tBQUE7Q0FDSjtBQTVFRCw0Q0E0RUMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy91bml0VGVzdFNjYWZmb2xkLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
