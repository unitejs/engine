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
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (uniteConfiguration.cssPre === "Css") {
                try {
                    _super("log").call(this, logger, display, "Creating cssSrc folder", { cssSrcFolder: engineVariables.cssSrcFolder });
                    engineVariables.cssSrcFolder = fileSystem.pathCombine(engineVariables.wwwFolder, "cssSrc");
                    engineVariables.styleLanguageExt = "css";
                    yield fileSystem.directoryCreate(engineVariables.cssSrcFolder);
                    yield fileSystem.directoryCreate(engineVariables.cssDistFolder);
                    return 0;
                }
                catch (err) {
                    _super("error").call(this, logger, display, "Generating css folder failed", err, { cssSrcFolder: engineVariables.cssSrcFolder });
                    return 1;
                }
            }
            return 0;
        });
    }
}
exports.Css = Css;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2Nzc1ByZVByb2Nlc3Nvci9jc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQU9BLGdGQUE2RTtBQUc3RSxTQUFpQixTQUFRLCtDQUFzQjtJQUM5QixPQUFPLENBQUMsTUFBZSxFQUFFLE9BQWlCLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQ3RKLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLE1BQU0sS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUN0QyxJQUFJLENBQUM7b0JBQ0QsYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsRUFBRSxZQUFZLEVBQUUsZUFBZSxDQUFDLFlBQVksRUFBRSxFQUFFO29CQUVyRyxlQUFlLENBQUMsWUFBWSxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztvQkFDM0YsZUFBZSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQztvQkFFekMsTUFBTSxVQUFVLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQztvQkFDL0QsTUFBTSxVQUFVLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFFaEUsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsZUFBVyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsOEJBQThCLEVBQUUsR0FBRyxFQUFFLEVBQUUsWUFBWSxFQUFFLGVBQWUsQ0FBQyxZQUFZLEVBQUUsRUFBRTtvQkFDbEgsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO1lBQ0wsQ0FBQztZQUVELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7Q0FDSjtBQXJCRCxrQkFxQkMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9jc3NQcmVQcm9jZXNzb3IvY3NzLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
