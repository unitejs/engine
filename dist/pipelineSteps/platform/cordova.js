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
            if (mainCondition) {
                engineVariables.additionalCompletionMessages.push("Make sure you have installed the cordova package globally using:");
                engineVariables.additionalCompletionMessages.push(`   ${engineVariables.packageManager.getInstallCommand("cordova", true)}`);
            }
            return ret;
        });
    }
}
Cordova.PLATFORM = "Cordova";
Cordova.FILENAME = "platform-cordova.js";
Cordova.FILENAME_PROJ = "cordova.jsproj";
exports.Cordova = Cordova;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3BsYXRmb3JtL2NvcmRvdmEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQVFBLG9FQUFpRTtBQUVqRSxhQUFxQixTQUFRLG1DQUFnQjtJQUtsQyxhQUFhLENBQUMsa0JBQXNDLEVBQUUsZUFBZ0M7UUFDekYsTUFBTSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsa0JBQWtCLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNqRixDQUFDO0lBRVksU0FBUyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDLEVBQUUsYUFBc0I7OztZQUM3SixlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxhQUFhLElBQUksbUJBQWUsWUFBQyxrQkFBa0IsQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUUxSCxNQUFNLHVCQUF1QixHQUFHLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBMEIsWUFBWSxDQUFDLENBQUM7WUFDeEcsRUFBRSxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDO2dCQUMxQixFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO29CQUNoQixJQUFJLE9BQU8sQ0FBQztvQkFDWixJQUFJLGFBQWEsQ0FBQztvQkFDbEIsSUFBSSxXQUFXLENBQUM7b0JBQ2hCLElBQUksU0FBUyxDQUFDO29CQUNkLEVBQUUsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7d0JBQ2xDLE9BQU8sR0FBRyx1QkFBdUIsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO3dCQUNsRCxhQUFhLEdBQUcsdUJBQXVCLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQzt3QkFDOUQsV0FBVyxHQUFHLHVCQUF1QixDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7d0JBQzFELFNBQVMsR0FBRyx1QkFB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QUFDO2dCQUNoQixlQUFlLENBQUMsNEJBQTRCLENBQUMsSUFBSSxDQUFDLGtFQUFrRSxDQUFDLENBQUM7Z0JBQ3RILGVBQWUsQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLENBQUMsTUFBTSxlQUFlLENBQUMsY0FBYyxDQUFDLGlCQUFpQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDakksQ0FBQztZQUVELE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDZixDQUFDO0tBQUE7O0FBOUVjLGdCQUFRLEdBQVcsU0FBUyxDQUFDO0FBQzdCLGdCQUFRLEdBQVcscUJBQXFCLENBQUM7QUFDekMscUJBQWEsR0FBVyxnQkFBZ0IsQ0FBQztBQUg1RCwwQkFnRkMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9wbGF0Zm9ybS9jb3Jkb3ZhLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIHRvIGdlbmVyYXRlIGNvcmRvdmEgcGxhdGZvcm0gY29uZmlndXJhdGlvbi5cbiAqL1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBVbml0ZVRoZW1lQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZVRoZW1lL3VuaXRlVGhlbWVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuaW1wb3J0IHsgUGlwZWxpbmVTdGVwQmFzZSB9IGZyb20gXCIuLi8uLi9lbmdpbmUvcGlwZWxpbmVTdGVwQmFzZVwiO1xuXG5leHBvcnQgY2xhc3MgQ29yZG92YSBleHRlbmRzIFBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHByaXZhdGUgc3RhdGljIFBMQVRGT1JNOiBzdHJpbmcgPSBcIkNvcmRvdmFcIjtcbiAgICBwcml2YXRlIHN0YXRpYyBGSUxFTkFNRTogc3RyaW5nID0gXCJwbGF0Zm9ybS1jb3Jkb3ZhLmpzXCI7XG4gICAgcHJpdmF0ZSBzdGF0aWMgRklMRU5BTUVfUFJPSjogc3RyaW5nID0gXCJjb3Jkb3ZhLmpzcHJvalwiO1xuXG4gICAgcHVibGljIG1haW5Db25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogYm9vbGVhbiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiBzdXBlci5vYmplY3RDb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLnBsYXRmb3JtcywgQ29yZG92YS5QTEFURk9STSk7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGNvbmZpZ3VyZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJ4bWwyanNcIl0sIG1haW5Db25kaXRpb24gJiYgc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi50YXNrTWFuYWdlciwgXCJHdWxwXCIpKTtcblxuICAgICAgICBjb25zdCB1bml0ZVRoZW1lQ29uZmlndXJhdGlvbiA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPFVuaXRlVGhlbWVDb25maWd1cmF0aW9uPihcIlVuaXRlVGhlbWVcIik7XG4gICAgICAgIGlmICh1bml0ZVRoZW1lQ29uZmlndXJhdGlvbikge1xuICAgICAgICAgICAgaWYgKG1haW5Db25kaXRpb24pIHtcbiAgICAgICAgICAgICAgICBsZXQgaGVhZGVycztcbiAgICAgICAgICAgICAgICBsZXQgc2NyaXB0SW5jbHVkZTtcbiAgICAgICAgICAgICAgICBsZXQgc2NyaXB0U3RhcnQ7XG4gICAgICAgICAgICAgICAgbGV0IHNjcmlwdEVuZDtcbiAgICAgICAgICAgICAgICBpZiAodW5pdGVUaGVtZUNvbmZpZ3VyYXRpb24uY29yZG92YSkge1xuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzID0gdW5pdGVUaGVtZUNvbmZpZ3VyYXRpb24uY29yZG92YS5oZWFkZXJzO1xuICAgICAgICAgICAgICAgICAgICBzY3JpcHRJbmNsdWRlID0gdW5pdGVUaGVtZUNvbmZpZ3VyYXRpb24uY29yZG92YS5zY3JpcHRJbmNsdWRlO1xuICAgICAgICAgICAgICAgICAgICBzY3JpcHRTdGFydCA9IHVuaXRlVGhlbWVDb25maWd1cmF0aW9uLmNvcmRvdmEuc2NyaXB0U3RhcnQ7XG4gICAgICAgICAgICAgICAgICAgIHNjcmlwdEVuZCA9IHVuaXRlVGhlbWVDb25maWd1cmF0aW9uLmNvcmRvdmEuc2NyaXB0RW5kO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB1bml0ZVRoZW1lQ29uZmlndXJhdGlvbi5jb3Jkb3ZhID0ge1xuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiBoZWFkZXJzIHx8IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtbGluZS1sZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiPG1ldGEgaHR0cC1lcXVpdj1cXFwiQ29udGVudC1TZWN1cml0eS1Qb2xpY3lcXFwiIGNvbnRlbnQ9XFxcImRlZmF1bHQtc3JjICdzZWxmJyBkYXRhOiBnYXA6IGh0dHBzOi8vc3NsLmdzdGF0aWMuY29tICd1bnNhZmUtZXZhbCcgJ3Vuc2FmZS1pbmxpbmUnOyBzdHlsZS1zcmMgJ3NlbGYnICd1bnNhZmUtaW5saW5lJzsgbWVkaWEtc3JjICo7IGltZy1zcmMgJ3NlbGYnIGRhdGE6IGNvbnRlbnQ6O1xcXCI+XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIjxtZXRhIG5hbWU9XFxcImZvcm1hdC1kZXRlY3Rpb25cXFwiIGNvbnRlbnQ9XFxcInRlbGVwaG9uZT1ub1xcXCI+XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIjxtZXRhIG5hbWU9XFxcIm1zYXBwbGljYXRpb24tdGFwLWhpZ2hsaWdodFxcXCIgY29udGVudD1cXFwibm9cXFwiPlwiXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGU6IHNjcmlwdEluY2x1ZGUgfHwgW1xuICAgICAgICAgICAgICAgICAgICAgICAgXCI8c2NyaXB0IHR5cGU9XFxcInRleHQvamF2YXNjcmlwdFxcXCIgc3JjPVxcXCIuL2NvcmRvdmEuanNcXFwiPjwvc2NyaXB0PlwiXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIHNjcmlwdFN0YXJ0OiBzY3JpcHRTdGFydCB8fCBbXG4gICAgICAgICAgICAgICAgICAgICAgICBcImRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RldmljZXJlYWR5JywgZnVuY3Rpb24oKSB7XCJcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgc2NyaXB0RW5kOiBzY3JpcHRFbmQgfHwgW1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJ9KTtcIlxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHVuaXRlVGhlbWVDb25maWd1cmF0aW9uLmNvcmRvdmE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmluYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgbGV0IHJldCA9IGF3YWl0IHN1cGVyLmZvbGRlckNyZWF0ZShsb2dnZXIsIGZpbGVTeXN0ZW0sIGVuZ2luZVZhcmlhYmxlcy5wbGF0Zm9ybVJvb3RGb2xkZXIpO1xuXG4gICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGJ1aWxkVGFza3MgPSBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy53d3cuYnVpbGRGb2xkZXIsIFwiL3Rhc2tzL1wiKTtcbiAgICAgICAgICAgIGNvbnN0IGJ1aWxkQXNzZXRQbGF0Zm9ybSA9IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLnd3dy5idWlsZEZvbGRlciwgXCIvYXNzZXRzL3BsYXRmb3JtL2NvcmRvdmEvXCIpO1xuXG4gICAgICAgICAgICBpZiAobWFpbkNvbmRpdGlvbiAmJiBzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLnRhc2tNYW5hZ2VyLCBcIkd1bHBcIikpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhc3NldFRhc2tzUGxhdGZvcm0gPSBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy5lbmdpbmVBc3NldHNGb2xkZXIsIFwiZ3VscC90YXNrcy9wbGF0Zm9ybS9cIik7XG4gICAgICAgICAgICAgICAgcmV0ID0gYXdhaXQgdGhpcy5jb3B5RmlsZShsb2dnZXIsIGZpbGVTeXN0ZW0sIGFzc2V0VGFza3NQbGF0Zm9ybSwgQ29yZG92YS5GSUxFTkFNRSwgYnVpbGRUYXNrcywgQ29yZG92YS5GSUxFTkFNRSwgZW5naW5lVmFyaWFibGVzLmZvcmNlKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGFzc2V0UGxhdGZvcm0gPSBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy5lbmdpbmVBc3NldHNGb2xkZXIsIFwiZ3VscC9hc3NldHMvcGxhdGZvcm0vY29yZG92YS9cIik7XG4gICAgICAgICAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXQgPSBhd2FpdCB0aGlzLmNvcHlGaWxlKGxvZ2dlciwgZmlsZVN5c3RlbSwgYXNzZXRQbGF0Zm9ybSwgQ29yZG92YS5GSUxFTkFNRV9QUk9KLCBidWlsZEFzc2V0UGxhdGZvcm0sIENvcmRvdmEuRklMRU5BTUVfUFJPSiwgZW5naW5lVmFyaWFibGVzLmZvcmNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldCA9IGF3YWl0IHN1cGVyLmZpbGVEZWxldGVUZXh0KGxvZ2dlciwgZmlsZVN5c3RlbSwgYnVpbGRUYXNrcywgQ29yZG92YS5GSUxFTkFNRSwgZW5naW5lVmFyaWFibGVzLmZvcmNlKTtcbiAgICAgICAgICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IGF3YWl0IHN1cGVyLmZpbGVEZWxldGVUZXh0KGxvZ2dlciwgZmlsZVN5c3RlbSwgYnVpbGRBc3NldFBsYXRmb3JtLCBDb3Jkb3ZhLkZJTEVOQU1FX1BST0osIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1haW5Db25kaXRpb24pIHtcbiAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5hZGRpdGlvbmFsQ29tcGxldGlvbk1lc3NhZ2VzLnB1c2goXCJNYWtlIHN1cmUgeW91IGhhdmUgaW5zdGFsbGVkIHRoZSBjb3Jkb3ZhIHBhY2thZ2UgZ2xvYmFsbHkgdXNpbmc6XCIpO1xuICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLmFkZGl0aW9uYWxDb21wbGV0aW9uTWVzc2FnZXMucHVzaChgICAgJHtlbmdpbmVWYXJpYWJsZXMucGFja2FnZU1hbmFnZXIuZ2V0SW5zdGFsbENvbW1hbmQoXCJjb3Jkb3ZhXCIsIHRydWUpfWApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG59XG4iXX0=
