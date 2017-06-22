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
class Less extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (uniteConfiguration.cssPre === "Less") {
                try {
                    _super("log").call(this, logger, display, "Creating Less folder", { cssSrcFolder: engineVariables.cssSrcFolder });
                    engineVariables.cssSrcFolder = fileSystem.pathCombine(engineVariables.rootFolder, "\\less");
                    yield fileSystem.directoryCreate(engineVariables.cssSrcFolder);
                    yield fileSystem.directoryCreate(engineVariables.cssDistFolder);
                    engineVariables.requiredDevDependencies.push("gulp-less");
                    const assetCssFolder = fileSystem.pathCombine(engineVariables.assetsDirectory, "scaffold/css/less");
                    const exists = yield fileSystem.fileExists(engineVariables.cssSrcFolder, "app.less");
                    if (!exists) {
                        _super("copyFile").call(this, logger, display, fileSystem, assetCssFolder, "app.less", engineVariables.cssSrcFolder, "app.less");
                    }
                    _super("copyFile").call(this, logger, display, fileSystem, assetCssFolder, "main.less", engineVariables.cssSrcFolder, "main.less");
                    _super("copyFile").call(this, logger, display, fileSystem, assetCssFolder, "reset.less", engineVariables.cssSrcFolder, "reset.less");
                    return 0;
                }
                catch (err) {
                    _super("error").call(this, logger, display, "Generating Less folder failed", err, { cssSrcFolder: engineVariables.cssSrcFolder });
                    return 1;
                }
            }
            return 0;
        });
    }
}
exports.Less = Less;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvY3NzUHJlUHJvY2Vzc29yL2xlc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUlBLGdGQUE2RTtBQU03RSxVQUFrQixTQUFRLCtDQUFzQjtJQUMvQixPQUFPLENBQUMsTUFBZSxFQUFFLE9BQWlCLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQ3RKLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLE1BQU0sS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUN2QyxJQUFJLENBQUM7b0JBQ0QsYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsRUFBRSxZQUFZLEVBQUUsZUFBZSxDQUFDLFlBQVksRUFBRSxFQUFFO29CQUVuRyxlQUFlLENBQUMsWUFBWSxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztvQkFFNUYsTUFBTSxVQUFVLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQztvQkFDL0QsTUFBTSxVQUFVLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFFaEUsZUFBZSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztvQkFFMUQsTUFBTSxjQUFjLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsZUFBZSxFQUFFLG1CQUFtQixDQUFDLENBQUM7b0JBRXBHLE1BQU0sTUFBTSxHQUFHLE1BQU0sVUFBVSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsWUFBWSxFQUFFLFVBQVUsQ0FBQyxDQUFDO29CQUNyRixFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7d0JBQ1Ysa0JBQWMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQUUsVUFBVSxFQUFFLGVBQWUsQ0FBQyxZQUFZLEVBQUUsVUFBVSxFQUFFO29CQUN0SCxDQUFDO29CQUNELGtCQUFjLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLFdBQVcsRUFBRSxlQUFlLENBQUMsWUFBWSxFQUFFLFdBQVcsRUFBRTtvQkFDcEgsa0JBQWMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQUUsWUFBWSxFQUFFLGVBQWUsQ0FBQyxZQUFZLEVBQUUsWUFBWSxFQUFFO29CQUN0SCxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7Z0JBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDWCxlQUFXLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSwrQkFBK0IsRUFBRSxHQUFHLEVBQUUsRUFBRSxZQUFZLEVBQUUsZUFBZSxDQUFDLFlBQVksRUFBRSxFQUFFO29CQUNuSCxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7WUFDTCxDQUFDO1lBRUQsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtDQUNKO0FBOUJELG9CQThCQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2Nzc1ByZVByb2Nlc3Nvci9sZXNzLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
