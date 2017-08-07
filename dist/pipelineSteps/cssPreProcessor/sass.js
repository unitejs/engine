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
class Sass extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["node-sass"], uniteConfiguration.cssPre === "Sass");
            if (uniteConfiguration.cssPre === "Sass") {
                try {
                    engineVariables.cssSrcFolder = fileSystem.pathCombine(engineVariables.wwwFolder, "sass");
                    logger.info("Creating Sass folder", { cssSrcFolder: engineVariables.cssSrcFolder });
                    engineVariables.styleLanguageExt = "scss";
                    yield fileSystem.directoryCreate(engineVariables.cssSrcFolder);
                    yield fileSystem.directoryCreate(engineVariables.cssDistFolder);
                    return 0;
                }
                catch (err) {
                    logger.error("Generating Sass folder failed", err, { cssSrcFolder: engineVariables.cssSrcFolder });
                    return 1;
                }
            }
            return 0;
        });
    }
}
exports.Sass = Sass;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2Nzc1ByZVByb2Nlc3Nvci9zYXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFNQSxnRkFBNkU7QUFHN0UsVUFBa0IsU0FBUSwrQ0FBc0I7SUFDL0IsT0FBTyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOztZQUNuSSxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxXQUFXLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxNQUFNLEtBQUssTUFBTSxDQUFDLENBQUM7WUFFekYsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsTUFBTSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZDLElBQUksQ0FBQztvQkFDRCxlQUFlLENBQUMsWUFBWSxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztvQkFFekYsTUFBTSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxFQUFFLFlBQVksRUFBRSxlQUFlLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQztvQkFFcEYsZUFBZSxDQUFDLGdCQUFnQixHQUFHLE1BQU0sQ0FBQztvQkFFMUMsTUFBTSxVQUFVLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQztvQkFDL0QsTUFBTSxVQUFVLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFFaEUsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsTUFBTSxDQUFDLEtBQUssQ0FBQywrQkFBK0IsRUFBRSxHQUFHLEVBQUUsRUFBRSxZQUFZLEVBQUUsZUFBZSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7b0JBQ25HLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztZQUNMLENBQUM7WUFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0NBQ0o7QUF4QkQsb0JBd0JDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvY3NzUHJlUHJvY2Vzc29yL3Nhc3MuanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
