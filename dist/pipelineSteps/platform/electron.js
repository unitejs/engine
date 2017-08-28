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
                const assetTasksPlatform = fileSystem.pathCombine(engineVariables.engineAssetsFolder, "gulp/tasks/platform/");
                let ret = yield this.copyFile(logger, fileSystem, assetTasksPlatform, Electron.FILENAME, buildTasks, Electron.FILENAME, engineVariables.force);
                if (ret === 0) {
                    const assetPlatform = fileSystem.pathCombine(engineVariables.engineAssetsFolder, "gulp/assets/platform/electron/");
                    ret = yield this.copyFile(logger, fileSystem, assetPlatform, Electron.FILENAME2, buildAssetPlatform, Electron.FILENAME2, engineVariables.force);
                }
                return ret;
            }
            else {
                let ret = yield _super("deleteFile").call(this, logger, fileSystem, buildTasks, Electron.FILENAME, engineVariables.force);
                if (ret === 0) {
                    ret = yield _super("deleteFile").call(this, logger, fileSystem, buildAssetPlatform, Electron.FILENAME2, engineVariables.force);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3BsYXRmb3JtL2VsZWN0cm9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFNQSxnRkFBNkU7QUFHN0UsY0FBc0IsU0FBUSwrQ0FBc0I7SUFLbkMsT0FBTyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDbkksZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsVUFBVTtnQkFDWCxtQkFBbUI7Z0JBQ25CLG1CQUFtQixDQUFDLEVBQ3BCLGtCQUFrQixDQUFDLFdBQVcsS0FBSyxNQUFNLElBQUksa0JBQWtCLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQztZQUVoSixNQUFNLGtCQUFrQixHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsNEJBQTRCLENBQUMsQ0FBQztZQUNqSCxNQUFNLFVBQVUsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3RGLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLFdBQVcsS0FBSyxNQUFNLElBQUksa0JBQWtCLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUM3RyxNQUFNLGtCQUFrQixHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLGtCQUFrQixFQUFFLHNCQUFzQixDQUFDLENBQUM7Z0JBQzlHLElBQUksR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFLFFBQVEsQ0FBQyxRQUFRLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxRQUFRLEVBQUUsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUUvSSxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDWixNQUFNLGFBQWEsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsRUFBRSxnQ0FBZ0MsQ0FBQyxDQUFDO29CQUNuSCxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsYUFBYSxFQUFFLFFBQVEsQ0FBQyxTQUFTLEVBQUUsa0JBQWtCLEVBQUUsUUFBUSxDQUFDLFNBQVMsRUFBRSxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3BKLENBQUM7Z0JBRUQsTUFBTSxDQUFDLEdBQUcsQ0FBQztZQUNmLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixJQUFJLEdBQUcsR0FBRyxNQUFNLG9CQUFnQixZQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxRQUFRLEVBQUUsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUMzRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDWixHQUFHLEdBQUcsTUFBTSxvQkFBZ0IsWUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFLFFBQVEsQ0FBQyxTQUFTLEVBQUUsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNwSCxDQUFDO2dCQUNELE1BQU0sQ0FBQyxHQUFHLENBQUM7WUFDZixDQUFDO1FBQ0wsQ0FBQztLQUFBOztBQTdCYSxpQkFBUSxHQUFXLFVBQVUsQ0FBQztBQUM3QixpQkFBUSxHQUFXLHNCQUFzQixDQUFDO0FBQzFDLGtCQUFTLEdBQVcsU0FBUyxDQUFDO0FBSGpELDRCQStCQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL3BsYXRmb3JtL2VsZWN0cm9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIHRvIGdlbmVyYXRlIGVsZWN0cm9uIHBsYXRmb3JtIGNvbmZpZ3VyYXRpb24uXG4gKi9cbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lUGlwZWxpbmVTdGVwQmFzZSB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lUGlwZWxpbmVTdGVwQmFzZVwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcblxuZXhwb3J0IGNsYXNzIEVsZWN0cm9uIGV4dGVuZHMgRW5naW5lUGlwZWxpbmVTdGVwQmFzZSB7XG4gICAgcHVibGljIHN0YXRpYyBQTEFURk9STTogc3RyaW5nID0gXCJFbGVjdHJvblwiO1xuICAgIHByaXZhdGUgc3RhdGljIEZJTEVOQU1FOiBzdHJpbmcgPSBcInBsYXRmb3JtLWVsZWN0cm9uLmpzXCI7XG4gICAgcHJpdmF0ZSBzdGF0aWMgRklMRU5BTUUyOiBzdHJpbmcgPSBcIm1haW4uanNcIjtcblxuICAgIHB1YmxpYyBhc3luYyBwcm9jZXNzKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVEZXZEZXBlbmRlbmN5KFtcImFyY2hpdmVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZWxlY3Ryb24tcGFja2FnZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ1bml0ZWpzLWltYWdlLWNsaVwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnRhc2tNYW5hZ2VyID09PSBcIkd1bHBcIiAmJiB1bml0ZUNvbmZpZ3VyYXRpb24ucGxhdGZvcm1zW0VsZWN0cm9uLlBMQVRGT1JNXSAhPT0gdW5kZWZpbmVkKTtcblxuICAgICAgICBjb25zdCBidWlsZEFzc2V0UGxhdGZvcm0gPSBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy53d3cuYnVpbGRGb2xkZXIsIFwiL2Fzc2V0cy9wbGF0Zm9ybS9lbGVjdHJvbi9cIik7XG4gICAgICAgIGNvbnN0IGJ1aWxkVGFza3MgPSBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy53d3cuYnVpbGRGb2xkZXIsIFwiL3Rhc2tzL1wiKTtcbiAgICAgICAgaWYgKHVuaXRlQ29uZmlndXJhdGlvbi50YXNrTWFuYWdlciA9PT0gXCJHdWxwXCIgJiYgdW5pdGVDb25maWd1cmF0aW9uLnBsYXRmb3Jtc1tFbGVjdHJvbi5QTEFURk9STV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3QgYXNzZXRUYXNrc1BsYXRmb3JtID0gZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMuZW5naW5lQXNzZXRzRm9sZGVyLCBcImd1bHAvdGFza3MvcGxhdGZvcm0vXCIpO1xuICAgICAgICAgICAgbGV0IHJldCA9IGF3YWl0IHRoaXMuY29weUZpbGUobG9nZ2VyLCBmaWxlU3lzdGVtLCBhc3NldFRhc2tzUGxhdGZvcm0sIEVsZWN0cm9uLkZJTEVOQU1FLCBidWlsZFRhc2tzLCBFbGVjdHJvbi5GSUxFTkFNRSwgZW5naW5lVmFyaWFibGVzLmZvcmNlKTtcblxuICAgICAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGFzc2V0UGxhdGZvcm0gPSBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy5lbmdpbmVBc3NldHNGb2xkZXIsIFwiZ3VscC9hc3NldHMvcGxhdGZvcm0vZWxlY3Ryb24vXCIpO1xuICAgICAgICAgICAgICAgIHJldCA9IGF3YWl0IHRoaXMuY29weUZpbGUobG9nZ2VyLCBmaWxlU3lzdGVtLCBhc3NldFBsYXRmb3JtLCBFbGVjdHJvbi5GSUxFTkFNRTIsIGJ1aWxkQXNzZXRQbGF0Zm9ybSwgRWxlY3Ryb24uRklMRU5BTUUyLCBlbmdpbmVWYXJpYWJsZXMuZm9yY2UpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHJldCA9IGF3YWl0IHN1cGVyLmRlbGV0ZUZpbGUobG9nZ2VyLCBmaWxlU3lzdGVtLCBidWlsZFRhc2tzLCBFbGVjdHJvbi5GSUxFTkFNRSwgZW5naW5lVmFyaWFibGVzLmZvcmNlKTtcbiAgICAgICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXQgPSBhd2FpdCBzdXBlci5kZWxldGVGaWxlKGxvZ2dlciwgZmlsZVN5c3RlbSwgYnVpbGRBc3NldFBsYXRmb3JtLCBFbGVjdHJvbi5GSUxFTkFNRTIsIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9XG4gICAgfVxufVxuIl19
