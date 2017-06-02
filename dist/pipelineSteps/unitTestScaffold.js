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
            engineVariables.unitTestFolder = fileSystem.directoryPathCombine(uniteConfiguration.outputDirectory, "\\test\\unit");
            try {
                _super("log").call(this, logger, display, "Creating Unit Test Directory", { unitTestFolder: engineVariables.unitTestFolder });
                yield fileSystem.directoryCreate(engineVariables.unitTestFolder);
            }
            catch (err) {
                _super("error").call(this, logger, display, "Creating Unit Test Directory failed", err, { unitTestFolder: engineVariables.unitTestFolder });
                return 1;
            }
            try {
                _super("log").call(this, logger, display, "Generating unit test scaffold", { gulpTasksgulpTunitTestFolderasksFolderBuildFolder: engineVariables.unitTestFolder });
                const unitTestsScaffold = fileSystem.directoryPathCombine(engineVariables.assetsDirectory, "scaffold/test/unit/" +
                    stringHelper_1.StringHelper.toCamelCase(uniteConfiguration.sourceLanguage) + "/" +
                    stringHelper_1.StringHelper.toCamelCase(uniteConfiguration.unitTestFramework) + "/");
                if (uniteConfiguration.unitTestFramework === "Chai") {
                    engineVariables.requiredDevDependencies.push("chai");
                }
                else if (uniteConfiguration.unitTestFramework === "Jasmine") {
                    engineVariables.requiredDevDependencies.push("jasmine-core");
                }
                yield this.copyFile(logger, display, fileSystem, unitTestsScaffold, "main.spec." + engineVariables.sourceLanguageExt, engineVariables.unitTestFolder, "main.spec." + engineVariables.sourceLanguageExt);
                yield this.copyFile(logger, display, fileSystem, unitTestsScaffold, "app.spec." + engineVariables.sourceLanguageExt, engineVariables.unitTestFolder, "app.spec." + engineVariables.sourceLanguageExt);
                return 0;
            }
            catch (err) {
                _super("error").call(this, logger, display, "Generating unit test scaffold failed", err, { unitTestFolder: engineVariables.unitTestFolder });
                return 1;
            }
        });
    }
}
exports.UnitTestScaffold = UnitTestScaffold;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvdW5pdFRlc3RTY2FmZm9sZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBSUEsdURBQW9EO0FBQ3BELDZFQUEwRTtBQU0xRSxzQkFBOEIsU0FBUSwrQ0FBc0I7SUFDM0MsT0FBTyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUN0SixlQUFlLENBQUMsY0FBYyxHQUFHLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLEVBQUUsY0FBYyxDQUFDLENBQUM7WUFDckgsSUFBSSxDQUFDO2dCQUNELGFBQVMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLDhCQUE4QixFQUFFLEVBQUUsY0FBYyxFQUFFLGVBQWUsQ0FBQyxjQUFjLEVBQUUsRUFBRTtnQkFDL0csTUFBTSxVQUFVLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUNyRSxDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxlQUFXLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxxQ0FBcUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxjQUFjLEVBQUUsZUFBZSxDQUFDLGNBQWMsRUFBRSxFQUFFO2dCQUM3SCxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUVELElBQUksQ0FBQztnQkFDRCxhQUFTLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSwrQkFBK0IsRUFBRSxFQUFFLGlEQUFpRCxFQUFFLGVBQWUsQ0FBQyxjQUFjLEVBQUUsRUFBRTtnQkFFbkosTUFBTSxpQkFBaUIsR0FBRyxVQUFVLENBQUMsb0JBQW9CLENBQUMsZUFBZSxDQUFDLGVBQWUsRUFDL0IscUJBQXFCO29CQUNyQiwyQkFBWSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsR0FBRyxHQUFHO29CQUNqRSwyQkFBWSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUVoSSxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxpQkFBaUIsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUNsRCxlQUFlLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUN6RCxDQUFDO2dCQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxpQkFBaUIsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO29CQUM1RCxlQUFlLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2dCQUNqRSxDQUFDO2dCQUVELE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxpQkFBaUIsRUFDOUMsWUFBWSxHQUFHLGVBQWUsQ0FBQyxpQkFBaUIsRUFDaEQsZUFBZSxDQUFDLGNBQWMsRUFDOUIsWUFBWSxHQUFHLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2dCQUV0RSxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsaUJBQWlCLEVBQzlDLFdBQVcsR0FBRyxlQUFlLENBQUMsaUJBQWlCLEVBQy9DLGVBQWUsQ0FBQyxjQUFjLEVBQzlCLFdBQVcsR0FBRyxlQUFlLENBQUMsaUJBQWlCLENBQUMsQ0FBQztnQkFFckUsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLHNDQUFzQyxFQUFFLEdBQUcsRUFBRSxFQUFFLGNBQWMsRUFBRSxlQUFlLENBQUMsY0FBYyxFQUFFLEVBQUU7Z0JBQzlILE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1FBQ0wsQ0FBQztLQUFBO0NBQ0o7QUF6Q0QsNENBeUNDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvdW5pdFRlc3RTY2FmZm9sZC5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMifQ==
