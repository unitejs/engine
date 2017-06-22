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
class GulpTasksBuild extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            try {
                _super("log").call(this, logger, display, "Generating gulp tasks for build in", { gulpTasksFolder: engineVariables.gulpTasksFolder });
                const assetTasks = fileSystem.pathCombine(engineVariables.assetsDirectory, "gulp/tasks/");
                const assetTasksLanguage = fileSystem.pathCombine(engineVariables.assetsDirectory, "gulp/tasks/sourceLanguage/" + uniteConfiguration.sourceLanguage.toLowerCase() + "/");
                const assetTasksModuleLoader = fileSystem.pathCombine(engineVariables.assetsDirectory, "gulp/tasks/moduleLoader/" + uniteConfiguration.moduleLoader.toLowerCase() + "/");
                const assetTasksLinter = fileSystem.pathCombine(engineVariables.assetsDirectory, "gulp/tasks/linter/" + uniteConfiguration.linter.toLowerCase() + "/");
                const assetTasksCssPre = fileSystem.pathCombine(engineVariables.assetsDirectory, "gulp/tasks/cssPre/" + uniteConfiguration.cssPre.toLowerCase() + "/");
                const assetTasksCssPost = fileSystem.pathCombine(engineVariables.assetsDirectory, "gulp/tasks/cssPost/" + uniteConfiguration.cssPost.toLowerCase() + "/");
                engineVariables.requiredDevDependencies.push("del");
                engineVariables.requiredDevDependencies.push("run-sequence");
                engineVariables.requiredDevDependencies.push("gulp-sourcemaps");
                if (uniteConfiguration.sourceLanguage === "JavaScript") {
                    engineVariables.requiredDevDependencies.push("gulp-babel");
                }
                else if (uniteConfiguration.sourceLanguage === "TypeScript") {
                    engineVariables.requiredDevDependencies.push("gulp-typescript");
                    engineVariables.requiredDevDependencies.push("typescript");
                }
                if (uniteConfiguration.moduleLoader === "Webpack") {
                    engineVariables.requiredDevDependencies.push("webpack");
                    engineVariables.requiredDevDependencies.push("webpack-stream");
                    engineVariables.requiredDevDependencies.push("source-map-loader");
                }
                else if (uniteConfiguration.moduleLoader === "Browserify") {
                    engineVariables.requiredDevDependencies.push("browserify");
                    engineVariables.requiredDevDependencies.push("vinyl-source-stream");
                    engineVariables.requiredDevDependencies.push("vinyl-buffer");
                    engineVariables.requiredDevDependencies.push("merge2");
                }
                yield this.copyFile(logger, display, fileSystem, assetTasksLanguage, "build-transpile.js", engineVariables.gulpTasksFolder, "build-transpile.js");
                yield this.copyFile(logger, display, fileSystem, assetTasksModuleLoader, "build-bundle.js", engineVariables.gulpTasksFolder, "build-bundle.js");
                yield this.copyFile(logger, display, fileSystem, assetTasksLinter, "build-lint.js", engineVariables.gulpTasksFolder, "build-lint.js");
                yield this.copyFile(logger, display, fileSystem, assetTasksCssPre, "build-css.js", engineVariables.gulpTasksFolder, "build-css.js");
                yield this.copyFile(logger, display, fileSystem, assetTasksCssPost, "build-css-post.js", engineVariables.gulpTasksFolder, "build-css-post.js");
                yield this.copyFile(logger, display, fileSystem, assetTasks, "build.js", engineVariables.gulpTasksFolder, "build.js");
                return 0;
            }
            catch (err) {
                _super("error").call(this, logger, display, "Generating gulp tasks for build failed", err, { gulpTasksFolder: engineVariables.gulpTasksFolder });
                return 1;
            }
        });
    }
}
exports.GulpTasksBuild = GulpTasksBuild;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvZ3VscC9ndWxwVGFza3NCdWlsZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBSUEsZ0ZBQTZFO0FBTTdFLG9CQUE0QixTQUFRLCtDQUFzQjtJQUN6QyxPQUFPLENBQUMsTUFBZSxFQUFFLE9BQWlCLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQ3RKLElBQUksQ0FBQztnQkFDRCxhQUFTLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxvQ0FBb0MsRUFBRSxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUMsZUFBZSxFQUFFLEVBQUU7Z0JBRXZILE1BQU0sVUFBVSxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLGVBQWUsRUFBRSxhQUFhLENBQUMsQ0FBQztnQkFDMUYsTUFBTSxrQkFBa0IsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxlQUFlLEVBQUUsNEJBQTRCLEdBQUcsa0JBQWtCLENBQUMsY0FBYyxDQUFDLFdBQVcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUN6SyxNQUFNLHNCQUFzQixHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLGVBQWUsRUFBRSwwQkFBMEIsR0FBRyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBQ3pLLE1BQU0sZ0JBQWdCLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsZUFBZSxFQUFFLG9CQUFvQixHQUFHLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQztnQkFDdkosTUFBTSxnQkFBZ0IsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxlQUFlLEVBQUUsb0JBQW9CLEdBQUcsa0JBQWtCLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUN2SixNQUFNLGlCQUFpQixHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLGVBQWUsRUFBRSxxQkFBcUIsR0FBRyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBRTFKLGVBQWUsQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3BELGVBQWUsQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7Z0JBRTdELGVBQWUsQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztnQkFFaEUsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsY0FBYyxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUM7b0JBQ3JELGVBQWUsQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQy9ELENBQUM7Z0JBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLGNBQWMsS0FBSyxZQUFZLENBQUMsQ0FBQyxDQUFDO29CQUM1RCxlQUFlLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7b0JBQ2hFLGVBQWUsQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQy9ELENBQUM7Z0JBRUQsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsWUFBWSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBQ2hELGVBQWUsQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQ3hELGVBQWUsQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztvQkFDL0QsZUFBZSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO2dCQUN0RSxDQUFDO2dCQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQztvQkFDMUQsZUFBZSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztvQkFDM0QsZUFBZSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO29CQUNwRSxlQUFlLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO29CQUM3RCxlQUFlLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUMzRCxDQUFDO2dCQUVELE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxvQkFBb0IsRUFBRSxlQUFlLENBQUMsZUFBZSxFQUFFLG9CQUFvQixDQUFDLENBQUM7Z0JBQ2xKLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxzQkFBc0IsRUFBRSxpQkFBaUIsRUFBRSxlQUFlLENBQUMsZUFBZSxFQUFFLGlCQUFpQixDQUFDLENBQUM7Z0JBQ2hKLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxnQkFBZ0IsRUFBRSxlQUFlLEVBQUUsZUFBZSxDQUFDLGVBQWUsRUFBRSxlQUFlLENBQUMsQ0FBQztnQkFDdEksTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFFLGNBQWMsRUFBRSxlQUFlLENBQUMsZUFBZSxFQUFFLGNBQWMsQ0FBQyxDQUFDO2dCQUNwSSxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsaUJBQWlCLEVBQUUsbUJBQW1CLEVBQUUsZUFBZSxDQUFDLGVBQWUsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO2dCQUUvSSxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsZUFBZSxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUV0SCxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsZUFBVyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsd0NBQXdDLEVBQUUsR0FBRyxFQUFFLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBQyxlQUFlLEVBQUUsRUFBRTtnQkFDbEksTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7UUFDTCxDQUFDO0tBQUE7Q0FDSjtBQWpERCx3Q0FpREMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9ndWxwL2d1bHBUYXNrc0J1aWxkLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
