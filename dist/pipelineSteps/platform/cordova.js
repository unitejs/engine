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
const pipelineStepBase_1 = require("../../engine/pipelineStepBase");
class Cordova extends pipelineStepBase_1.PipelineStepBase {
    mainCondition(uniteConfiguration, engineVariables) {
        return super.objectCondition(uniteConfiguration.platforms, Cordova.PLATFORM);
    }
    configure(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["xml2js"], mainCondition && _super("condition").call(this, uniteConfiguration.taskManager, "Gulp"));
            const uniteThemeConfiguration = engineVariables.getConfiguration("UniteTheme");
            if (uniteThemeConfiguration) {
                if (mainCondition) {
                    let headers;
                    let scriptInclude;
                    let scriptStart;
                    let scriptEnd;
                    if (uniteThemeConfiguration.cordova) {
                        headers = uniteThemeConfiguration.cordova.headers;
                        scriptInclude = uniteThemeConfiguration.cordova.scriptInclude;
                        scriptStart = uniteThemeConfiguration.cordova.scriptStart;
                        scriptEnd = uniteThemeConfiguration.cordova.scriptEnd;
                    }
                    uniteThemeConfiguration.cordova = {
                        headers: headers || [
                            // tslint:disable-next-line:max-line-length
                            "<meta http-equiv=\"Content-Security-Policy\" content=\"default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; media-src *; img-src 'self' data: content:;\">",
                            "<meta name=\"format-detection\" content=\"telephone=no\">",
                            "<meta name=\"msapplication-tap-highlight\" content=\"no\">"
                        ],
                        scriptInclude: scriptInclude || [
                            "<script type=\"text/javascript\" src=\"./cordova.js\"></script>"
                        ],
                        scriptStart: scriptStart || [
                            "document.addEventListener('deviceready', function() {"
                        ],
                        scriptEnd: scriptEnd || [
                            "});"
                        ]
                    };
                }
                else {
                    delete uniteThemeConfiguration.cordova;
                }
            }
            return 0;
        });
    }
    finalise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield _super("folderCreate").call(this, logger, fileSystem, engineVariables.platformRootFolder);
            if (ret === 0) {
                const buildTasks = fileSystem.pathCombine(engineVariables.www.buildFolder, "/tasks/");
                const buildAssetPlatform = fileSystem.pathCombine(engineVariables.www.buildFolder, "/assets/platform/cordova/");
                if (mainCondition && _super("condition").call(this, uniteConfiguration.taskManager, "Gulp")) {
                    const assetTasksPlatform = fileSystem.pathCombine(engineVariables.engineAssetsFolder, "gulp/tasks/platform/");
                    ret = yield this.copyFile(logger, fileSystem, assetTasksPlatform, Cordova.FILENAME, buildTasks, Cordova.FILENAME, engineVariables.force);
                    const assetPlatform = fileSystem.pathCombine(engineVariables.engineAssetsFolder, "gulp/assets/platform/cordova/");
                    if (ret === 0) {
                        ret = yield this.copyFile(logger, fileSystem, assetPlatform, Cordova.FILENAME_PROJ, buildAssetPlatform, Cordova.FILENAME_PROJ, engineVariables.force);
                    }
                }
                else {
                    ret = yield _super("fileDeleteText").call(this, logger, fileSystem, buildTasks, Cordova.FILENAME, engineVariables.force);
                    if (ret === 0) {
                        ret = yield _super("fileDeleteText").call(this, logger, fileSystem, buildAssetPlatform, Cordova.FILENAME_PROJ, engineVariables.force);
                    }
                }
            }
            return ret;
        });
    }
}
Cordova.PLATFORM = "Cordova";
Cordova.FILENAME = "platform-cordova.js";
Cordova.FILENAME_PROJ = "cordova.jsproj";
exports.Cordova = Cordova;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3BsYXRmb3JtL2NvcmRvdmEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQVFBLG9FQUFpRTtBQUVqRSxhQUFxQixTQUFRLG1DQUFnQjtJQUtsQyxhQUFhLENBQUMsa0JBQXNDLEVBQUUsZUFBZ0M7UUFDekYsTUFBTSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsa0JBQWtCLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNqRixDQUFDO0lBRVksU0FBUyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDLEVBQUUsYUFBc0I7OztZQUM3SixlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxhQUFhLElBQUksbUJBQWUsWUFBQyxrQkFBa0IsQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUUxSCxNQUFNLHVCQUF1QixHQUFHLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBMEIsWUFBWSxDQUFDLENBQUM7WUFDeEcsRUFBRSxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDO2dCQUMxQixFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO29CQUNoQixJQUFJLE9BQU8sQ0FBQztvQkFDWixJQUFJLGFBQWEsQ0FBQztvQkFDbEIsSUFBSSxXQUFXLENBQUM7b0JBQ2hCLElBQUksU0FBUyxDQUFDO29CQUNkLEVBQUUsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7d0JBQ2xDLE9BQU8sR0FBRyx1QkFBdUIsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO3dCQUNsRCxhQUFhLEdBQUcsdUJBQXVCLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQzt3QkFDOUQsV0FBVyxHQUFHLHVCQUF1QixDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7d0JBQzFELFNBQVMsR0FBRyx1QkFB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QUFBOztBQXhFYyxnQkFBUSxHQUFXLFNBQVMsQ0FBQztBQUM3QixnQkFBUSxHQUFXLHFCQUFxQixDQUFDO0FBQ3pDLHFCQUFhLEdBQVcsZ0JBQWdCLENBQUM7QUFINUQsMEJBMEVDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvcGxhdGZvcm0vY29yZG92YS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgc3RlcCB0byBnZW5lcmF0ZSBjb3Jkb3ZhIHBsYXRmb3JtIGNvbmZpZ3VyYXRpb24uXG4gKi9cbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgVW5pdGVUaGVtZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGVUaGVtZS91bml0ZVRoZW1lQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcbmltcG9ydCB7IFBpcGVsaW5lU3RlcEJhc2UgfSBmcm9tIFwiLi4vLi4vZW5naW5lL3BpcGVsaW5lU3RlcEJhc2VcIjtcblxuZXhwb3J0IGNsYXNzIENvcmRvdmEgZXh0ZW5kcyBQaXBlbGluZVN0ZXBCYXNlIHtcbiAgICBwcml2YXRlIHN0YXRpYyBQTEFURk9STTogc3RyaW5nID0gXCJDb3Jkb3ZhXCI7XG4gICAgcHJpdmF0ZSBzdGF0aWMgRklMRU5BTUU6IHN0cmluZyA9IFwicGxhdGZvcm0tY29yZG92YS5qc1wiO1xuICAgIHByaXZhdGUgc3RhdGljIEZJTEVOQU1FX1BST0o6IHN0cmluZyA9IFwiY29yZG92YS5qc3Byb2pcIjtcblxuICAgIHB1YmxpYyBtYWluQ29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IGJvb2xlYW4gfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gc3VwZXIub2JqZWN0Q29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5wbGF0Zm9ybXMsIENvcmRvdmEuUExBVEZPUk0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBjb25maWd1cmUobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1wieG1sMmpzXCJdLCBtYWluQ29uZGl0aW9uICYmIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24udGFza01hbmFnZXIsIFwiR3VscFwiKSk7XG5cbiAgICAgICAgY29uc3QgdW5pdGVUaGVtZUNvbmZpZ3VyYXRpb24gPSBlbmdpbmVWYXJpYWJsZXMuZ2V0Q29uZmlndXJhdGlvbjxVbml0ZVRoZW1lQ29uZmlndXJhdGlvbj4oXCJVbml0ZVRoZW1lXCIpO1xuICAgICAgICBpZiAodW5pdGVUaGVtZUNvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgICAgIGlmIChtYWluQ29uZGl0aW9uKSB7XG4gICAgICAgICAgICAgICAgbGV0IGhlYWRlcnM7XG4gICAgICAgICAgICAgICAgbGV0IHNjcmlwdEluY2x1ZGU7XG4gICAgICAgICAgICAgICAgbGV0IHNjcmlwdFN0YXJ0O1xuICAgICAgICAgICAgICAgIGxldCBzY3JpcHRFbmQ7XG4gICAgICAgICAgICAgICAgaWYgKHVuaXRlVGhlbWVDb25maWd1cmF0aW9uLmNvcmRvdmEpIHtcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVycyA9IHVuaXRlVGhlbWVDb25maWd1cmF0aW9uLmNvcmRvdmEuaGVhZGVycztcbiAgICAgICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZSA9IHVuaXRlVGhlbWVDb25maWd1cmF0aW9uLmNvcmRvdmEuc2NyaXB0SW5jbHVkZTtcbiAgICAgICAgICAgICAgICAgICAgc2NyaXB0U3RhcnQgPSB1bml0ZVRoZW1lQ29uZmlndXJhdGlvbi5jb3Jkb3ZhLnNjcmlwdFN0YXJ0O1xuICAgICAgICAgICAgICAgICAgICBzY3JpcHRFbmQgPSB1bml0ZVRoZW1lQ29uZmlndXJhdGlvbi5jb3Jkb3ZhLnNjcmlwdEVuZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdW5pdGVUaGVtZUNvbmZpZ3VyYXRpb24uY29yZG92YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogaGVhZGVycyB8fCBbXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgICAgICBcIjxtZXRhIGh0dHAtZXF1aXY9XFxcIkNvbnRlbnQtU2VjdXJpdHktUG9saWN5XFxcIiBjb250ZW50PVxcXCJkZWZhdWx0LXNyYyAnc2VsZicgZGF0YTogZ2FwOiBodHRwczovL3NzbC5nc3RhdGljLmNvbSAndW5zYWZlLWV2YWwnICd1bnNhZmUtaW5saW5lJzsgc3R5bGUtc3JjICdzZWxmJyAndW5zYWZlLWlubGluZSc7IG1lZGlhLXNyYyAqOyBpbWctc3JjICdzZWxmJyBkYXRhOiBjb250ZW50OjtcXFwiPlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCI8bWV0YSBuYW1lPVxcXCJmb3JtYXQtZGV0ZWN0aW9uXFxcIiBjb250ZW50PVxcXCJ0ZWxlcGhvbmU9bm9cXFwiPlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCI8bWV0YSBuYW1lPVxcXCJtc2FwcGxpY2F0aW9uLXRhcC1oaWdobGlnaHRcXFwiIGNvbnRlbnQ9XFxcIm5vXFxcIj5cIlxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICBzY3JpcHRJbmNsdWRlOiBzY3JpcHRJbmNsdWRlIHx8IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiPHNjcmlwdCB0eXBlPVxcXCJ0ZXh0L2phdmFzY3JpcHRcXFwiIHNyYz1cXFwiLi9jb3Jkb3ZhLmpzXFxcIj48L3NjcmlwdD5cIlxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICBzY3JpcHRTdGFydDogc2NyaXB0U3RhcnQgfHwgW1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2VyZWFkeScsIGZ1bmN0aW9uKCkge1wiXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIHNjcmlwdEVuZDogc2NyaXB0RW5kIHx8IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwifSk7XCJcbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB1bml0ZVRoZW1lQ29uZmlndXJhdGlvbi5jb3Jkb3ZhO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbmFsaXNlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGxldCByZXQgPSBhd2FpdCBzdXBlci5mb2xkZXJDcmVhdGUobG9nZ2VyLCBmaWxlU3lzdGVtLCBlbmdpbmVWYXJpYWJsZXMucGxhdGZvcm1Sb290Rm9sZGVyKTtcblxuICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICBjb25zdCBidWlsZFRhc2tzID0gZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3LmJ1aWxkRm9sZGVyLCBcIi90YXNrcy9cIik7XG4gICAgICAgICAgICBjb25zdCBidWlsZEFzc2V0UGxhdGZvcm0gPSBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy53d3cuYnVpbGRGb2xkZXIsIFwiL2Fzc2V0cy9wbGF0Zm9ybS9jb3Jkb3ZhL1wiKTtcblxuICAgICAgICAgICAgaWYgKG1haW5Db25kaXRpb24gJiYgc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi50YXNrTWFuYWdlciwgXCJHdWxwXCIpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYXNzZXRUYXNrc1BsYXRmb3JtID0gZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMuZW5naW5lQXNzZXRzRm9sZGVyLCBcImd1bHAvdGFza3MvcGxhdGZvcm0vXCIpO1xuICAgICAgICAgICAgICAgIHJldCA9IGF3YWl0IHRoaXMuY29weUZpbGUobG9nZ2VyLCBmaWxlU3lzdGVtLCBhc3NldFRhc2tzUGxhdGZvcm0sIENvcmRvdmEuRklMRU5BTUUsIGJ1aWxkVGFza3MsIENvcmRvdmEuRklMRU5BTUUsIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBhc3NldFBsYXRmb3JtID0gZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMuZW5naW5lQXNzZXRzRm9sZGVyLCBcImd1bHAvYXNzZXRzL3BsYXRmb3JtL2NvcmRvdmEvXCIpO1xuICAgICAgICAgICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gYXdhaXQgdGhpcy5jb3B5RmlsZShsb2dnZXIsIGZpbGVTeXN0ZW0sIGFzc2V0UGxhdGZvcm0sIENvcmRvdmEuRklMRU5BTUVfUFJPSiwgYnVpbGRBc3NldFBsYXRmb3JtLCBDb3Jkb3ZhLkZJTEVOQU1FX1BST0osIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXQgPSBhd2FpdCBzdXBlci5maWxlRGVsZXRlVGV4dChsb2dnZXIsIGZpbGVTeXN0ZW0sIGJ1aWxkVGFza3MsIENvcmRvdmEuRklMRU5BTUUsIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSk7XG4gICAgICAgICAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXQgPSBhd2FpdCBzdXBlci5maWxlRGVsZXRlVGV4dChsb2dnZXIsIGZpbGVTeXN0ZW0sIGJ1aWxkQXNzZXRQbGF0Zm9ybSwgQ29yZG92YS5GSUxFTkFNRV9QUk9KLCBlbmdpbmVWYXJpYWJsZXMuZm9yY2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cbn1cbiJdfQ==
