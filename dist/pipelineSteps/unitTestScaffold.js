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
                engineVariables.unitTestRootFolder = fileSystem.pathCombine(uniteConfiguration.outputDirectory, "\\test\\unit");
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
                    if (uniteConfiguration.moduleLoader === "RequireJS") {
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
                    }
                    yield this.copyFile(logger, display, fileSystem, unitTestsScaffoldModuleLoader, "unitBootstrap.js", engineVariables.unitTestRootFolder, "unitBootstrap.js", bootstrapReplacer);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvdW5pdFRlc3RTY2FmZm9sZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBSUEsdURBQW9EO0FBQ3BELDZFQUEwRTtBQU0xRSxzQkFBOEIsU0FBUSwrQ0FBc0I7SUFDM0MsT0FBTyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUN0SixFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDaEQsZUFBZSxDQUFDLGtCQUFrQixHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsZUFBZSxFQUFFLGNBQWMsQ0FBQyxDQUFDO2dCQUNoSCxlQUFlLENBQUMsaUJBQWlCLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztnQkFDcEgsZUFBZSxDQUFDLGtCQUFrQixHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsZUFBZSxFQUFFLG9CQUFvQixDQUFDLENBQUM7Z0JBRXRILElBQUksQ0FBQztvQkFDRCxhQUFTLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSw4QkFBOEIsRUFBRSxFQUFFLGlCQUFpQixFQUFFLGVBQWUsQ0FBQyxpQkFBaUIsRUFBRSxFQUFFO29CQUNySCxNQUFNLFVBQVUsQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLGlCQUFpQixDQUFDLENBQUM7Z0JBQ3hFLENBQUM7Z0JBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDWCxlQUFXLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxxQ0FBcUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxpQkFBaUIsRUFBRSxlQUFlLENBQUMsaUJBQWlCLEVBQUUsRUFBRTtvQkFDbkksTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dC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QkFDaEIsQ0FBQyxDQUFDO29CQUNOLENBQUM7b0JBRUQsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLDZCQUE2QixFQUMxRCxrQkFBa0IsRUFDbEIsZUFBZSxDQUFDLGtCQUFrQixFQUNsQyxrQkFBa0IsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO29CQUUzRCxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7Z0JBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDWCxlQUFXLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxzQ0FBc0MsRUFBRSxHQUFHLEVBQUUsRUFBRSxpQkFBaUIsRUFBRSxlQUFlLENBQUMsaUJBQWlCLEVBQUUsRUFBRTtvQkFDcEksTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO1lBQ0wsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1FBQ0wsQ0FBQztLQUFBO0NBQ0o7QUE5RUQsNENBOEVDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvdW5pdFRlc3RTY2FmZm9sZC5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMifQ==
