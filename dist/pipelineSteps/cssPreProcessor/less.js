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
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["less"], uniteConfiguration.cssPre === "Less");
            if (uniteConfiguration.cssPre === "Less") {
                try {
                    engineVariables.www.cssSrcFolder = fileSystem.pathCombine(engineVariables.wwwRootFolder, "less");
                    logger.info("Creating Less folder", { cssSrcFolder: engineVariables.www.cssSrcFolder });
                    engineVariables.styleLanguageExt = "less";
                    yield fileSystem.directoryCreate(engineVariables.www.cssSrcFolder);
                    yield fileSystem.directoryCreate(engineVariables.www.cssDistFolder);
                    return 0;
                }
                catch (err) {
                    logger.error("Generating Less folder failed", err, { cssSrcFolder: engineVariables.www.cssSrcFolder });
                    return 1;
                }
            }
            return 0;
        });
    }
}
exports.Less = Less;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2Nzc1ByZVByb2Nlc3Nvci9sZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFNQSxnRkFBNkU7QUFHN0UsVUFBa0IsU0FBUSwrQ0FBc0I7SUFDL0IsT0FBTyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOztZQUNuSSxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxNQUFNLEtBQUssTUFBTSxDQUFDLENBQUM7WUFFcEYsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsTUFBTSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZDLElBQUksQ0FBQztvQkFDRCxlQUFlLENBQUMsR0FBRyxDQUFDLFlBQVksR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUM7b0JBRWpHLE1BQU0sQ0FBQyxJQUFJLENBQUMsc0JBQXNCLEVBQUUsRUFBRSxZQUFZLEVBQUUsZUFBZSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO29CQUV4RixlQUFlLENBQUMsZ0JBQWdCLEdBQUcsTUFBTSxDQUFDO29CQUUxQyxNQUFNLFVBQVUsQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztvQkFDbkUsTUFBTSxVQUFVLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBRXBFLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztnQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsK0JBQStCLEVBQUUsR0FBRyxFQUFFLEVBQUUsWUFBWSxFQUFFLGVBQWUsQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQztvQkFDdkcsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO1lBQ0wsQ0FBQztZQUVELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7Q0FDSjtBQXhCRCxvQkF3QkMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9jc3NQcmVQcm9jZXNzb3IvbGVzcy5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMifQ==
