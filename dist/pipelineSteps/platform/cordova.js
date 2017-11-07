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
            return 0;
        });
    }
    finalise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            const buildTasks = fileSystem.pathCombine(engineVariables.www.buildFolder, "/tasks/");
            if (mainCondition && _super("condition").call(this, uniteConfiguration.taskManager, "Gulp")) {
                const assetTasksPlatform = fileSystem.pathCombine(engineVariables.engineAssetsFolder, "gulp/tasks/platform/");
                return this.copyFile(logger, fileSystem, assetTasksPlatform, Cordova.FILENAME, buildTasks, Cordova.FILENAME, engineVariables.force);
            }
            else {
                return _super("fileDeleteText").call(this, logger, fileSystem, buildTasks, Cordova.FILENAME, engineVariables.force);
            }
        });
    }
}
Cordova.PLATFORM = "Cordova";
Cordova.FILENAME = "platform-cordova.js";
exports.Cordova = Cordova;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3BsYXRmb3JtL2NvcmRvdmEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQVFBLG9FQUFpRTtBQUVqRSxhQUFxQixTQUFRLG1DQUFnQjtJQUlsQyxhQUFhLENBQUMsa0JBQXNDLEVBQUUsZUFBZ0M7UUFDekYsTUFBTSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsa0JBQWtCLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNqRixDQUFDO0lBRVksU0FBUyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDLEVBQUUsYUFBc0I7OztZQUM3SixlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxhQUFhLElBQUksbUJBQWUsWUFBQyxrQkFBa0IsQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUUxSCxNQUFNLHVCQUF1QixHQUFHLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBMEIsWUFBWSxDQUFDLENBQUM7WUFDeEcsRUFBRSxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDO2dCQUMxQixJQUFJLE9BQU8sQ0FBQztnQkFDWixJQUFJLGFBQWEsQ0FBQztnQkFDbEIsSUFBSSxXQUFXLENBQUM7Z0JBQ2hCLElBQUksU0FBUyxDQUFDO2dCQUNkLEVBQUUsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQ2xDLE9BQU8sR0FBRyx1QkFBdUIsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO29CQUNsRCxhQUFhLEdBQUcsdUJBQXVCLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQztvQkFDOUQsV0FBVyxHQUFHLHVCQUF1QixDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7b0JBQzFELFNBQVMsR0FBRyx1QkFBdUIsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO2dCQUMxRCxDQUFDO2dCQUNELHVCQUF1QixDQUFDLE9BQU8sR0FBRztvQkFDOUIsT0FBTyxFQUFFLE9BQU8sSUFBSTt3QkFDaEIsMkNBQTJDO3dCQUMzQyw4TkFBOE47d0JBQzlOLDJEQUEyRDt3QkFDM0QsNERBQTREO3FCQUMvRDtvQkFDRCxhQUFhLEVBQUUsYUFBYSxJQUFJO3dCQUM1QixpRUFBaUU7cUJBQ3BFO29CQUNELFdBQVcsRUFBRSxXQUFXLElBQUk7d0JBQ3hCLHVEQUF1RDtxQkFDMUQ7b0JBQ0QsU0FBUyxFQUFFLFNBQVMsSUFBSTt3QkFDcEIsS0FBSztxQkFDUjtpQkFDSixDQUFDO1lBQ04sQ0FBQztZQUVELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7SUFFWSxRQUFRLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0MsRUFBRSxhQUFzQjs7O1lBQzVKLE1BQU0sVUFBVSxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDdEYsRUFBRSxDQUFDLENBQUMsYUFBYSxJQUFJLG1CQUFlLFlBQUMsa0JBQWtCLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDM0UsTUFBTSxrQkFBa0IsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO2dCQUM5RyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUUsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3hJLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixNQUFNLENBQUMsd0JBQW9CLFlBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFBRSxlQUFlLENBQUMsS0FBSyxFQUFFO1lBQ3pHLENBQUM7UUFDTCxDQUFDO0tBQUE7O0FBcERjLGdCQUFRLEdBQVcsU0FBUyxDQUFDO0FBQzdCLGdCQUFRLEdBQVcscUJBQXFCLENBQUM7QUFGNUQsMEJBc0RDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvcGxhdGZvcm0vY29yZG92YS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgc3RlcCB0byBnZW5lcmF0ZSBjb3Jkb3ZhIHBsYXRmb3JtIGNvbmZpZ3VyYXRpb24uXG4gKi9cbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgVW5pdGVUaGVtZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGVUaGVtZS91bml0ZVRoZW1lQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcbmltcG9ydCB7IFBpcGVsaW5lU3RlcEJhc2UgfSBmcm9tIFwiLi4vLi4vZW5naW5lL3BpcGVsaW5lU3RlcEJhc2VcIjtcblxuZXhwb3J0IGNsYXNzIENvcmRvdmEgZXh0ZW5kcyBQaXBlbGluZVN0ZXBCYXNlIHtcbiAgICBwcml2YXRlIHN0YXRpYyBQTEFURk9STTogc3RyaW5nID0gXCJDb3Jkb3ZhXCI7XG4gICAgcHJpdmF0ZSBzdGF0aWMgRklMRU5BTUU6IHN0cmluZyA9IFwicGxhdGZvcm0tY29yZG92YS5qc1wiO1xuXG4gICAgcHVibGljIG1haW5Db25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogYm9vbGVhbiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiBzdXBlci5vYmplY3RDb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLnBsYXRmb3JtcywgQ29yZG92YS5QTEFURk9STSk7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGNvbmZpZ3VyZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJ4bWwyanNcIl0sIG1haW5Db25kaXRpb24gJiYgc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi50YXNrTWFuYWdlciwgXCJHdWxwXCIpKTtcblxuICAgICAgICBjb25zdCB1bml0ZVRoZW1lQ29uZmlndXJhdGlvbiA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPFVuaXRlVGhlbWVDb25maWd1cmF0aW9uPihcIlVuaXRlVGhlbWVcIik7XG4gICAgICAgIGlmICh1bml0ZVRoZW1lQ29uZmlndXJhdGlvbikge1xuICAgICAgICAgICAgbGV0IGhlYWRlcnM7XG4gICAgICAgICAgICBsZXQgc2NyaXB0SW5jbHVkZTtcbiAgICAgICAgICAgIGxldCBzY3JpcHRTdGFydDtcbiAgICAgICAgICAgIGxldCBzY3JpcHRFbmQ7XG4gICAgICAgICAgICBpZiAodW5pdGVUaGVtZUNvbmZpZ3VyYXRpb24uY29yZG92YSkge1xuICAgICAgICAgICAgICAgIGhlYWRlcnMgPSB1bml0ZVRoZW1lQ29uZmlndXJhdGlvbi5jb3Jkb3ZhLmhlYWRlcnM7XG4gICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZSA9IHVuaXRlVGhlbWVDb25maWd1cmF0aW9uLmNvcmRvdmEuc2NyaXB0SW5jbHVkZTtcbiAgICAgICAgICAgICAgICBzY3JpcHRTdGFydCA9IHVuaXRlVGhlbWVDb25maWd1cmF0aW9uLmNvcmRvdmEuc2NyaXB0U3RhcnQ7XG4gICAgICAgICAgICAgICAgc2NyaXB0RW5kID0gdW5pdGVUaGVtZUNvbmZpZ3VyYXRpb24uY29yZG92YS5zY3JpcHRFbmQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB1bml0ZVRoZW1lQ29uZmlndXJhdGlvbi5jb3Jkb3ZhID0ge1xuICAgICAgICAgICAgICAgIGhlYWRlcnM6IGhlYWRlcnMgfHwgW1xuICAgICAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgIFwiPG1ldGEgaHR0cC1lcXVpdj1cXFwiQ29udGVudC1TZWN1cml0eS1Qb2xpY3lcXFwiIGNvbnRlbnQ9XFxcImRlZmF1bHQtc3JjICdzZWxmJyBkYXRhOiBnYXA6IGh0dHBzOi8vc3NsLmdzdGF0aWMuY29tICd1bnNhZmUtZXZhbCcgJ3Vuc2FmZS1pbmxpbmUnOyBzdHlsZS1zcmMgJ3NlbGYnICd1bnNhZmUtaW5saW5lJzsgbWVkaWEtc3JjICo7IGltZy1zcmMgJ3NlbGYnIGRhdGE6IGNvbnRlbnQ6O1xcXCI+XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiPG1ldGEgbmFtZT1cXFwiZm9ybWF0LWRldGVjdGlvblxcXCIgY29udGVudD1cXFwidGVsZXBob25lPW5vXFxcIj5cIixcbiAgICAgICAgICAgICAgICAgICAgXCI8bWV0YSBuYW1lPVxcXCJtc2FwcGxpY2F0aW9uLXRhcC1oaWdobGlnaHRcXFwiIGNvbnRlbnQ9XFxcIm5vXFxcIj5cIlxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZTogc2NyaXB0SW5jbHVkZSB8fCBbXG4gICAgICAgICAgICAgICAgICAgIFwiPHNjcmlwdCB0eXBlPVxcXCJ0ZXh0L2phdmFzY3JpcHRcXFwiIHNyYz1cXFwiLi9jb3Jkb3ZhLmpzXFxcIj48L3NjcmlwdD5cIlxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgc2NyaXB0U3RhcnQ6IHNjcmlwdFN0YXJ0IHx8IFtcbiAgICAgICAgICAgICAgICAgICAgXCJkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2VyZWFkeScsIGZ1bmN0aW9uKCkge1wiXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBzY3JpcHRFbmQ6IHNjcmlwdEVuZCB8fCBbXG4gICAgICAgICAgICAgICAgICAgIFwifSk7XCJcbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbmFsaXNlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGNvbnN0IGJ1aWxkVGFza3MgPSBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy53d3cuYnVpbGRGb2xkZXIsIFwiL3Rhc2tzL1wiKTtcbiAgICAgICAgaWYgKG1haW5Db25kaXRpb24gJiYgc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi50YXNrTWFuYWdlciwgXCJHdWxwXCIpKSB7XG4gICAgICAgICAgICBjb25zdCBhc3NldFRhc2tzUGxhdGZvcm0gPSBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy5lbmdpbmVBc3NldHNGb2xkZXIsIFwiZ3VscC90YXNrcy9wbGF0Zm9ybS9cIik7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb3B5RmlsZShsb2dnZXIsIGZpbGVTeXN0ZW0sIGFzc2V0VGFza3NQbGF0Zm9ybSwgQ29yZG92YS5GSUxFTkFNRSwgYnVpbGRUYXNrcywgQ29yZG92YS5GSUxFTkFNRSwgZW5naW5lVmFyaWFibGVzLmZvcmNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBzdXBlci5maWxlRGVsZXRlVGV4dChsb2dnZXIsIGZpbGVTeXN0ZW0sIGJ1aWxkVGFza3MsIENvcmRvdmEuRklMRU5BTUUsIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
