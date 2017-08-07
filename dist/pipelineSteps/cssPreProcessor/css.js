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
class Css extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            if (uniteConfiguration.cssPre === "Css") {
                try {
                    engineVariables.cssSrcFolder = fileSystem.pathCombine(engineVariables.wwwFolder, "cssSrc");
                    logger.info("Creating cssSrc folder", { cssSrcFolder: engineVariables.cssSrcFolder });
                    engineVariables.styleLanguageExt = "css";
                    yield fileSystem.directoryCreate(engineVariables.cssSrcFolder);
                    yield fileSystem.directoryCreate(engineVariables.cssDistFolder);
                    return 0;
                }
                catch (err) {
                    logger.error("Generating css folder failed", err, { cssSrcFolder: engineVariables.cssSrcFolder });
                    return 1;
                }
            }
            return 0;
        });
    }
}
exports.Css = Css;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2Nzc1ByZVByb2Nlc3Nvci9jc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQU1BLGdGQUE2RTtBQUc3RSxTQUFpQixTQUFRLCtDQUFzQjtJQUM5QixPQUFPLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7O1lBQ25JLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLE1BQU0sS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUN0QyxJQUFJLENBQUM7b0JBQ0QsZUFBZSxDQUFDLFlBQVksR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7b0JBRTNGLE1BQU0sQ0FBQyxJQUFJLENBQUMsd0JBQXdCLEVBQUUsRUFBRSxZQUFZLEVBQUUsZUFBZSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7b0JBRXRGLGVBQWUsQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7b0JBRXpDLE1BQU0sVUFBVSxDQUFDLGVBQWUsQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLENBQUM7b0JBQy9ELE1BQU0sVUFBVSxDQUFDLGVBQWUsQ0FBQyxlQUFlLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBRWhFLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztnQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsOEJBQThCLEVBQUUsR0FBRyxFQUFFLEVBQUUsWUFBWSxFQUFFLGVBQWUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO29CQUNsRyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7WUFDTCxDQUFDO1lBRUQsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtDQUNKO0FBdEJELGtCQXNCQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2Nzc1ByZVByb2Nlc3Nvci9jc3MuanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
