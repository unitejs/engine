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
class Stylus extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["stylus"], uniteConfiguration.cssPre === "Stylus");
            if (uniteConfiguration.cssPre === "Stylus") {
                try {
                    engineVariables.www.cssSrcFolder = fileSystem.pathCombine(engineVariables.wwwRootFolder, "stylus");
                    logger.info("Creating Stylus folder", { cssSrcFolder: engineVariables.www.cssSrcFolder });
                    engineVariables.styleLanguageExt = "styl";
                    yield fileSystem.directoryCreate(engineVariables.www.cssSrcFolder);
                    yield fileSystem.directoryCreate(engineVariables.www.cssDistFolder);
                    return 0;
                }
                catch (err) {
                    logger.error("Generating Stylus folder failed", err, { cssSrcFolder: engineVariables.www.cssSrcFolder });
                    return 1;
                }
            }
            return 0;
        });
    }
}
exports.Stylus = Stylus;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2Nzc1ByZVByb2Nlc3Nvci9zdHlsdXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQU1BLGdGQUE2RTtBQUc3RSxZQUFvQixTQUFRLCtDQUFzQjtJQUNqQyxPQUFPLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7O1lBQ25JLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLE1BQU0sS0FBSyxRQUFRLENBQUMsQ0FBQztZQUV4RixFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDekMsSUFBSSxDQUFDO29CQUNELGVBQWUsQ0FBQyxHQUFHLENBQUMsWUFBWSxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQztvQkFFbkcsTUFBTSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxFQUFFLFlBQVksRUFBRSxlQUFlLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7b0JBRTFGLGVBQWUsQ0FBQyxnQkFBZ0IsR0FBRyxNQUFNLENBQUM7b0JBRTFDLE1BQU0sVUFBVSxDQUFDLGVBQWUsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO29CQUNuRSxNQUFNLFVBQVUsQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFFcEUsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsTUFBTSxDQUFDLEtBQUssQ0FBQyxpQ0FBaUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxZQUFZLEVBQUUsZUFBZSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO29CQUN6RyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7WUFDTCxDQUFDO1lBRUQsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtDQUNKO0FBeEJELHdCQXdCQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2Nzc1ByZVByb2Nlc3Nvci9zdHlsdXMuanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
