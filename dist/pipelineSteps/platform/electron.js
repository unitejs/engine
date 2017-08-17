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
class Electron extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["archiver",
                "electron-packager",
                "unitejs-image-cli"], uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.platforms[Electron.PLATFORM] !== undefined);
            const buildAssetPlatform = fileSystem.pathCombine(engineVariables.www.buildFolder, "/assets/platform/electron/");
            const buildTasks = fileSystem.pathCombine(engineVariables.www.buildFolder, "/tasks/");
            if (uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.platforms[Electron.PLATFORM] !== undefined) {
                try {
                    const assetTasksPlatform = fileSystem.pathCombine(engineVariables.engineAssetsFolder, "gulp/tasks/platform/");
                    yield this.copyFile(logger, fileSystem, assetTasksPlatform, Electron.FILENAME, buildTasks, Electron.FILENAME);
                }
                catch (err) {
                    logger.error(`Generating ${Electron.FILENAME} failed`, err);
                    return 1;
                }
                try {
                    const assetPlatform = fileSystem.pathCombine(engineVariables.engineAssetsFolder, "gulp/assets/platform/electron/");
                    yield this.copyFile(logger, fileSystem, assetPlatform, Electron.FILENAME2, buildAssetPlatform, Electron.FILENAME2);
                    return 0;
                }
                catch (err) {
                    logger.error(`Generating ${Electron.FILENAME2} failed`, err);
                    return 1;
                }
            }
            else {
                let ret = yield _super("deleteFile").call(this, logger, fileSystem, buildTasks, Electron.FILENAME);
                if (ret === 0) {
                    ret = yield _super("deleteFile").call(this, logger, fileSystem, buildAssetPlatform, Electron.FILENAME2);
                }
                return ret;
            }
        });
    }
}
Electron.PLATFORM = "Electron";
Electron.FILENAME = "platform-electron.js";
Electron.FILENAME2 = "main.js";
exports.Electron = Electron;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3BsYXRmb3JtL2VsZWN0cm9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFNQSxnRkFBNkU7QUFHN0UsY0FBc0IsU0FBUSwrQ0FBc0I7SUFLbkMsT0FBTyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDbkksZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsVUFBVTtnQkFDWCxtQkFBbUI7Z0JBQ25CLG1CQUFtQixDQUFDLEVBQ3BCLGtCQUFrQixDQUFDLFdBQVcsS0FBSyxNQUFNLElBQUksa0JBQWtCLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQztZQUVoSixNQUFNLGtCQUFrQixHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsNEJBQTRCLENBQUMsQ0FBQztZQUNqSCxNQUFNLFVBQVUsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3RGLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLFdBQVcsS0FBSyxNQUFNLElBQUksa0JBQWtCLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUM3RyxJQUFJLENBQUM7b0JBQ0QsTUFBTSxrQkFBa0IsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO29CQUM5RyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxRQUFRLENBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ2xILENBQUM7Z0JBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDWCxNQUFNLENBQUMsS0FBSyxDQUFDLGNBQWMsUUFBUSxDQUFDLFFBQVEsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUM1RCxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7Z0JBRUQsSUFBSSxDQUFDO29CQUNELE1BQU0sYUFBYSxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLGtCQUFrQixFQUFFLGdDQUFnQyxDQUFDLENBQUM7b0JBQ25ILE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGFBQWEsRUFBRSxRQUFRLENBQUMsU0FBUyxFQUFFLGtCQUFrQixFQUFFLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFDbkgsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsTUFBTSxDQUFDLEtBQUssQ0FBQyxjQUFjLFFBQVEsQ0FBQyxTQUFTLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDN0QsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO1lBQ0wsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLElBQUksR0FBRyxHQUFHLE1BQU0sb0JBQWdCLFlBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNwRixFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDWixHQUFHLEdBQUcsTUFBTSxvQkFBZ0IsWUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDN0YsQ0FBQztnQkFDRCxNQUFNLENBQUMsR0FBRyxDQUFDO1lBQ2YsQ0FBQztRQUNMLENBQUM7S0FBQTs7QUFwQ2EsaUJBQVEsR0FBVyxVQUFVLENBQUM7QUFDN0IsaUJBQVEsR0FBVyxzQkFBc0IsQ0FBQztBQUMxQyxrQkFBUyxHQUFXLFNBQVMsQ0FBQztBQUhqRCw0QkFzQ0MiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9wbGF0Zm9ybS9lbGVjdHJvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgc3RlcCB0byBnZW5lcmF0ZSBlbGVjdHJvbiBwbGF0Zm9ybSBjb25maWd1cmF0aW9uLlxuICovXG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZVBpcGVsaW5lU3RlcEJhc2UgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVBpcGVsaW5lU3RlcEJhc2VcIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5cbmV4cG9ydCBjbGFzcyBFbGVjdHJvbiBleHRlbmRzIEVuZ2luZVBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHB1YmxpYyBzdGF0aWMgUExBVEZPUk06IHN0cmluZyA9IFwiRWxlY3Ryb25cIjtcbiAgICBwcml2YXRlIHN0YXRpYyBGSUxFTkFNRTogc3RyaW5nID0gXCJwbGF0Zm9ybS1lbGVjdHJvbi5qc1wiO1xuICAgIHByaXZhdGUgc3RhdGljIEZJTEVOQU1FMjogc3RyaW5nID0gXCJtYWluLmpzXCI7XG5cbiAgICBwdWJsaWMgYXN5bmMgcHJvY2Vzcyhsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJhcmNoaXZlclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImVsZWN0cm9uLXBhY2thZ2VyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidW5pdGVqcy1pbWFnZS1jbGlcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi50YXNrTWFuYWdlciA9PT0gXCJHdWxwXCIgJiYgdW5pdGVDb25maWd1cmF0aW9uLnBsYXRmb3Jtc1tFbGVjdHJvbi5QTEFURk9STV0gIT09IHVuZGVmaW5lZCk7XG5cbiAgICAgICAgY29uc3QgYnVpbGRBc3NldFBsYXRmb3JtID0gZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3LmJ1aWxkRm9sZGVyLCBcIi9hc3NldHMvcGxhdGZvcm0vZWxlY3Ryb24vXCIpO1xuICAgICAgICBjb25zdCBidWlsZFRhc2tzID0gZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3LmJ1aWxkRm9sZGVyLCBcIi90YXNrcy9cIik7XG4gICAgICAgIGlmICh1bml0ZUNvbmZpZ3VyYXRpb24udGFza01hbmFnZXIgPT09IFwiR3VscFwiICYmIHVuaXRlQ29uZmlndXJhdGlvbi5wbGF0Zm9ybXNbRWxlY3Ryb24uUExBVEZPUk1dICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYXNzZXRUYXNrc1BsYXRmb3JtID0gZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMuZW5naW5lQXNzZXRzRm9sZGVyLCBcImd1bHAvdGFza3MvcGxhdGZvcm0vXCIpO1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuY29weUZpbGUobG9nZ2VyLCBmaWxlU3lzdGVtLCBhc3NldFRhc2tzUGxhdGZvcm0sIEVsZWN0cm9uLkZJTEVOQU1FLCBidWlsZFRhc2tzLCBFbGVjdHJvbi5GSUxFTkFNRSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoYEdlbmVyYXRpbmcgJHtFbGVjdHJvbi5GSUxFTkFNRX0gZmFpbGVkYCwgZXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBhc3NldFBsYXRmb3JtID0gZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMuZW5naW5lQXNzZXRzRm9sZGVyLCBcImd1bHAvYXNzZXRzL3BsYXRmb3JtL2VsZWN0cm9uL1wiKTtcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmNvcHlGaWxlKGxvZ2dlciwgZmlsZVN5c3RlbSwgYXNzZXRQbGF0Zm9ybSwgRWxlY3Ryb24uRklMRU5BTUUyLCBidWlsZEFzc2V0UGxhdGZvcm0sIEVsZWN0cm9uLkZJTEVOQU1FMik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoYEdlbmVyYXRpbmcgJHtFbGVjdHJvbi5GSUxFTkFNRTJ9IGZhaWxlZGAsIGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgcmV0ID0gYXdhaXQgc3VwZXIuZGVsZXRlRmlsZShsb2dnZXIsIGZpbGVTeXN0ZW0sIGJ1aWxkVGFza3MsIEVsZWN0cm9uLkZJTEVOQU1FKTtcbiAgICAgICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXQgPSBhd2FpdCBzdXBlci5kZWxldGVGaWxlKGxvZ2dlciwgZmlsZVN5c3RlbSwgYnVpbGRBc3NldFBsYXRmb3JtLCBFbGVjdHJvbi5GSUxFTkFNRTIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==
