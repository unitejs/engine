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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3BsYXRmb3JtL2NvcmRvdmEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQVFBLG9FQUFpRTtBQUVqRSxhQUFxQixTQUFRLG1DQUFnQjtJQUlsQyxhQUFhLENBQUMsa0JBQXNDLEVBQUUsZUFBZ0M7UUFDekYsTUFBTSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsa0JBQWtCLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNqRixDQUFDO0lBRVksU0FBUyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDLEVBQUUsYUFBc0I7OztZQUM3SixlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxhQUFhLElBQUksbUJBQWUsWUFBQyxrQkFBa0IsQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUUxSCxNQUFNLHVCQUF1QixHQUFHLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBMEIsWUFBWSxDQUFDLENBQUM7WUFDeEcsRUFBRSxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDO2dCQUMxQixFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO29CQUNoQixJQUFJLE9BQU8sQ0FBQztvQkFDWixJQUFJLGFBQWEsQ0FBQztvQkFDbEIsSUFBSSxXQUFXLENBQUM7b0JBQ2hCLElBQUksU0FBUyxDQUFDO29CQUNkLEVBQUUsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7d0JBQ2xDLE9BQU8sR0FBRyx1QkFBdUIsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO3dCQUNsRCxhQUFhLEdBQUcsdUJBQXVCLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQzt3QkFDOUQsV0FBVyxHQUFHLHVCQUF1QixDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7d0JBQzFELFNBQVMsR0FBRyx1QkFBdUIsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO29CQUMxRCxDQUFDO29CQUNELHVCQUF1QixDQUFDLE9BQU8sR0FBRzt3QkFDOUIsT0FBTyxFQUFFLE9BQU8sSUFBSTs0QkFDaEIsMkNBQTJDOzRCQUMzQyw4TkFBOE47NEJBQzlOLDJEQUEyRDs0QkFDM0QsNERBQTREO3lCQUMvRDt3QkFDRCxhQUFhLEVBQUUsYUFBYSxJQUFJOzRCQUM1QixpRUFBaUU7eUJBQ3BFO3dCQUNELFdBQVcsRUFBRSxXQUFXLElBQUk7NEJBQ3hCLHVEQUF1RDt5QkFDMUQ7d0JBQ0QsU0FBUyxFQUFFLFNBQVMsSUFBSTs0QkFDcEIsS0FBSzt5QkFDUjtxQkFDSixDQUFDO2dCQUNOLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osT0FBTyx1QkFBdUIsQ0FBQyxPQUFPLENBQUM7Z0JBQzNDLENBQUM7WUFDTCxDQUFDO1lBRUQsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtJQUVZLFFBQVEsQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQyxFQUFFLGFBQXNCOzs7WUFDNUosTUFBTSxVQUFVLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUN0RixFQUFFLENBQUMsQ0FBQyxhQUFhLElBQUksbUJBQWUsWUFBQyxrQkFBa0IsQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzRSxNQUFNLGtCQUFrQixHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLGtCQUFrQixFQUFFLHNCQUFzQixDQUFDLENBQUM7Z0JBQzlHLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsa0JBQWtCLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFBRSxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDeEksQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLE1BQU0sQ0FBQyx3QkFBb0IsWUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsUUFBUSxFQUFFLGVBQWUsQ0FBQyxLQUFLLEVBQUU7WUFDekcsQ0FBQztRQUNMLENBQUM7S0FBQTs7QUF4RGMsZ0JBQVEsR0FBVyxTQUFTLENBQUM7QUFDN0IsZ0JBQVEsR0FBVyxxQkFBcUIsQ0FBQztBQUY1RCwwQkEwREMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9wbGF0Zm9ybS9jb3Jkb3ZhLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIHRvIGdlbmVyYXRlIGNvcmRvdmEgcGxhdGZvcm0gY29uZmlndXJhdGlvbi5cbiAqL1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBVbml0ZVRoZW1lQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZVRoZW1lL3VuaXRlVGhlbWVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuaW1wb3J0IHsgUGlwZWxpbmVTdGVwQmFzZSB9IGZyb20gXCIuLi8uLi9lbmdpbmUvcGlwZWxpbmVTdGVwQmFzZVwiO1xuXG5leHBvcnQgY2xhc3MgQ29yZG92YSBleHRlbmRzIFBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHByaXZhdGUgc3RhdGljIFBMQVRGT1JNOiBzdHJpbmcgPSBcIkNvcmRvdmFcIjtcbiAgICBwcml2YXRlIHN0YXRpYyBGSUxFTkFNRTogc3RyaW5nID0gXCJwbGF0Zm9ybS1jb3Jkb3ZhLmpzXCI7XG5cbiAgICBwdWJsaWMgbWFpbkNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBib29sZWFuIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLm9iamVjdENvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24ucGxhdGZvcm1zLCBDb3Jkb3ZhLlBMQVRGT1JNKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgY29uZmlndXJlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVEZXZEZXBlbmRlbmN5KFtcInhtbDJqc1wiXSwgbWFpbkNvbmRpdGlvbiAmJiBzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLnRhc2tNYW5hZ2VyLCBcIkd1bHBcIikpO1xuXG4gICAgICAgIGNvbnN0IHVuaXRlVGhlbWVDb25maWd1cmF0aW9uID0gZW5naW5lVmFyaWFibGVzLmdldENvbmZpZ3VyYXRpb248VW5pdGVUaGVtZUNvbmZpZ3VyYXRpb24+KFwiVW5pdGVUaGVtZVwiKTtcbiAgICAgICAgaWYgKHVuaXRlVGhlbWVDb25maWd1cmF0aW9uKSB7XG4gICAgICAgICAgICBpZiAobWFpbkNvbmRpdGlvbikge1xuICAgICAgICAgICAgICAgIGxldCBoZWFkZXJzO1xuICAgICAgICAgICAgICAgIGxldCBzY3JpcHRJbmNsdWRlO1xuICAgICAgICAgICAgICAgIGxldCBzY3JpcHRTdGFydDtcbiAgICAgICAgICAgICAgICBsZXQgc2NyaXB0RW5kO1xuICAgICAgICAgICAgICAgIGlmICh1bml0ZVRoZW1lQ29uZmlndXJhdGlvbi5jb3Jkb3ZhKSB7XG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnMgPSB1bml0ZVRoZW1lQ29uZmlndXJhdGlvbi5jb3Jkb3ZhLmhlYWRlcnM7XG4gICAgICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGUgPSB1bml0ZVRoZW1lQ29uZmlndXJhdGlvbi5jb3Jkb3ZhLnNjcmlwdEluY2x1ZGU7XG4gICAgICAgICAgICAgICAgICAgIHNjcmlwdFN0YXJ0ID0gdW5pdGVUaGVtZUNvbmZpZ3VyYXRpb24uY29yZG92YS5zY3JpcHRTdGFydDtcbiAgICAgICAgICAgICAgICAgICAgc2NyaXB0RW5kID0gdW5pdGVUaGVtZUNvbmZpZ3VyYXRpb24uY29yZG92YS5zY3JpcHRFbmQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHVuaXRlVGhlbWVDb25maWd1cmF0aW9uLmNvcmRvdmEgPSB7XG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IGhlYWRlcnMgfHwgW1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxuICAgICAgICAgICAgICAgICAgICAgICAgXCI8bWV0YSBodHRwLWVxdWl2PVxcXCJDb250ZW50LVNlY3VyaXR5LVBvbGljeVxcXCIgY29udGVudD1cXFwiZGVmYXVsdC1zcmMgJ3NlbGYnIGRhdGE6IGdhcDogaHR0cHM6Ly9zc2wuZ3N0YXRpYy5jb20gJ3Vuc2FmZS1ldmFsJyAndW5zYWZlLWlubGluZSc7IHN0eWxlLXNyYyAnc2VsZicgJ3Vuc2FmZS1pbmxpbmUnOyBtZWRpYS1zcmMgKjsgaW1nLXNyYyAnc2VsZicgZGF0YTogY29udGVudDo7XFxcIj5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiPG1ldGEgbmFtZT1cXFwiZm9ybWF0LWRldGVjdGlvblxcXCIgY29udGVudD1cXFwidGVsZXBob25lPW5vXFxcIj5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiPG1ldGEgbmFtZT1cXFwibXNhcHBsaWNhdGlvbi10YXAtaGlnaGxpZ2h0XFxcIiBjb250ZW50PVxcXCJub1xcXCI+XCJcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZTogc2NyaXB0SW5jbHVkZSB8fCBbXG4gICAgICAgICAgICAgICAgICAgICAgICBcIjxzY3JpcHQgdHlwZT1cXFwidGV4dC9qYXZhc2NyaXB0XFxcIiBzcmM9XFxcIi4vY29yZG92YS5qc1xcXCI+PC9zY3JpcHQ+XCJcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgc2NyaXB0U3RhcnQ6IHNjcmlwdFN0YXJ0IHx8IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZGV2aWNlcmVhZHknLCBmdW5jdGlvbigpIHtcIlxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICBzY3JpcHRFbmQ6IHNjcmlwdEVuZCB8fCBbXG4gICAgICAgICAgICAgICAgICAgICAgICBcIn0pO1wiXG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgdW5pdGVUaGVtZUNvbmZpZ3VyYXRpb24uY29yZG92YTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaW5hbGlzZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBjb25zdCBidWlsZFRhc2tzID0gZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3LmJ1aWxkRm9sZGVyLCBcIi90YXNrcy9cIik7XG4gICAgICAgIGlmIChtYWluQ29uZGl0aW9uICYmIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24udGFza01hbmFnZXIsIFwiR3VscFwiKSkge1xuICAgICAgICAgICAgY29uc3QgYXNzZXRUYXNrc1BsYXRmb3JtID0gZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMuZW5naW5lQXNzZXRzRm9sZGVyLCBcImd1bHAvdGFza3MvcGxhdGZvcm0vXCIpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29weUZpbGUobG9nZ2VyLCBmaWxlU3lzdGVtLCBhc3NldFRhc2tzUGxhdGZvcm0sIENvcmRvdmEuRklMRU5BTUUsIGJ1aWxkVGFza3MsIENvcmRvdmEuRklMRU5BTUUsIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gc3VwZXIuZmlsZURlbGV0ZVRleHQobG9nZ2VyLCBmaWxlU3lzdGVtLCBidWlsZFRhc2tzLCBDb3Jkb3ZhLkZJTEVOQU1FLCBlbmdpbmVWYXJpYWJsZXMuZm9yY2UpO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19
