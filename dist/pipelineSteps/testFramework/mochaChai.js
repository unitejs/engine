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
/**
 * Pipeline step to generate mocha configuration.
 */
const arrayHelper_1 = require("unitejs-framework/dist/helpers/arrayHelper");
const objectHelper_1 = require("unitejs-framework/dist/helpers/objectHelper");
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class MochaChai extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info("Generating Mocha-Chai Configuration");
            const isUnit = uniteConfiguration.unitTestFramework === "Mocha-Chai";
            const isE2E = uniteConfiguration.e2eTestFramework === "Mocha-Chai";
            const isEither = isUnit || isE2E;
            engineVariables.toggleDevDependency(["mocha"], isEither);
            engineVariables.toggleDevDependency(["@types/mocha", "@types/chai"], uniteConfiguration.sourceLanguage === "TypeScript" && isEither);
            engineVariables.toggleDevDependency(["karma-mocha", "karma-chai"], uniteConfiguration.unitTestRunner === "Karma" && isUnit);
            engineVariables.toggleDevDependency(["mochawesome-screenshots"], uniteConfiguration.e2eTestRunner === "Protractor" && isE2E);
            engineVariables.toggleDevDependency(["wdio-mocha-framework"], uniteConfiguration.e2eTestRunner === "WebdriverIO" && isE2E);
            const esLintConfiguration = engineVariables.getConfiguration("ESLint");
            if (esLintConfiguration) {
                objectHelper_1.ObjectHelper.addRemove(esLintConfiguration.env, "mocha", true, isEither);
            }
            const karmaConfiguration = engineVariables.getConfiguration("Karma");
            if (karmaConfiguration) {
                arrayHelper_1.ArrayHelper.addRemove(karmaConfiguration.frameworks, "mocha", isUnit);
                arrayHelper_1.ArrayHelper.addRemove(karmaConfiguration.frameworks, "chai", isUnit);
            }
            if (isE2E) {
                const protractorConfiguration = engineVariables.getConfiguration("Protractor");
                if (protractorConfiguration) {
                    protractorConfiguration.framework = "mocha";
                    const reportsFolder = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, engineVariables.www.reportsFolder));
                    protractorConfiguration.mochaOpts = {
                        reporter: "mochawesome-screenshots",
                        reporterOptions: {
                            reportDir: `${reportsFolder}/e2e/`,
                            reportName: "index",
                            takePassedScreenshot: true
                        },
                        timeout: 10000
                    };
                }
                const webdriverIoConfiguration = engineVariables.getConfiguration("WebdriverIO");
                if (webdriverIoConfiguration) {
                    webdriverIoConfiguration.framework = "mocha";
                }
            }
            return 0;
        });
    }
}
exports.MochaChai = MochaChai;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3Rlc3RGcmFtZXdvcmsvbW9jaGFDaGFpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDRFQUF5RTtBQUN6RSw4RUFBMkU7QUFRM0UsZ0ZBQTZFO0FBRzdFLGVBQXVCLFNBQVEsK0NBQXNCO0lBQ3BDLE9BQU8sQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7WUFDbkksTUFBTSxDQUFDLElBQUksQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO1lBRW5ELE1BQU0sTUFBTSxHQUFHLGtCQUFrQixDQUFDLGlCQUFpQixLQUFLLFlBQVksQ0FBQztZQUNyRSxNQUFNLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxnQkFBZ0IsS0FBSyxZQUFZLENBQUM7WUFDbkUsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLEtBQUssQ0FBQztZQUVqQyxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUN6RCxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxjQUFjLEVBQUUsYUFBYSxDQUFDLEVBQUUsa0JBQWtCLENBQUMsY0FBYyxLQUFLLFlBQVksSUFBSSxRQUFRLENBQUMsQ0FBQztZQUVySSxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxhQUFhLEVBQUUsWUFBWSxDQUFDLEVBQUUsa0JBQWtCLENBQUMsY0FBYyxLQUFLLE9BQU8sSUFBSSxNQUFNLENBQUMsQ0FBQztZQUU1SCxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyx5QkFBeUIsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLGFBQWEsS0FBSyxZQUFZLElBQUksS0FBSyxDQUFDLENBQUM7WUFFN0gsZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsc0JBQXNCLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxhQUFhLEtBQUssYUFBYSxJQUFJLEtBQUssQ0FBQyxDQUFDO1lBRTNILE1BQU0sbUJBQW1CLEdBQUcsZUFBZSxDQUFDLGdCQUFnQixDQUFzQixRQUFRLENBQUMsQ0FBQztZQUM1RixFQUFFLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLDJCQUFZLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQzdFLENBQUM7WUFFRCxNQUFNLGtCQUFrQixHQUFHLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBcUIsT0FBTyxDQUFDLENBQUM7WUFDekYsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO2dCQUNyQix5QkFBVyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUN0RSx5QkFBVyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ3pFLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNSLE1BQU0sdUJBQXVCLEdBQUcsZUFBZSxDQUFDLGdCQUFnQixDQUEwQixZQUFZLENBQUMsQ0FBQztnQkFDeEcsRUFBRSxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDO29CQUMxQix1QkFBdUIsQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO29CQUU1QyxNQUFNLGFBQWEsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFLGVBQWUsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztvQkFFMUksdUJBQXVCLENBQUMsU0FBUyxHQUFHO3dCQUNoQyxRQUFRLEVBQUUseUJBQXlCO3dCQUNuQyxlQUFlLEVBQUU7NEJBQ2IsU0FBUyxFQUFFLEdBQUcsYUFBYSxPQUFPOzRCQUNsQyxVQUFVLEVBQUUsT0FBTzs0QkFDbkIsb0JBQW9CLEVBQUUsSUFBSTt5QkFDN0I7d0JBQ0QsT0FBTyxFQUFFLEtBQUs7cUJBQ2pCLENBQUM7Z0JBQ04sQ0FBQztnQkFFRCxNQUFNLHdCQUF3QixHQUFHLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBMkIsYUFBYSxDQUFDLENBQUM7Z0JBQzNHLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQztvQkFDM0Isd0JBQXdCLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztnQkFDakQsQ0FBQztZQUNMLENBQUM7WUFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0NBQ0o7QUF0REQsOEJBc0RDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvdGVzdEZyYW1ld29yay9tb2NoYUNoYWkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFBpcGVsaW5lIHN0ZXAgdG8gZ2VuZXJhdGUgbW9jaGEgY29uZmlndXJhdGlvbi5cbiAqL1xuaW1wb3J0IHsgQXJyYXlIZWxwZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL2FycmF5SGVscGVyXCI7XG5pbXBvcnQgeyBPYmplY3RIZWxwZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL29iamVjdEhlbHBlclwiO1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBFc0xpbnRDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL2VzbGludC9lc0xpbnRDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBLYXJtYUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMva2FybWEva2FybWFDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBQcm90cmFjdG9yQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy9wcm90cmFjdG9yL3Byb3RyYWN0b3JDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBXZWJkcml2ZXJJb0NvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvd2ViZHJpdmVySW8vd2ViZHJpdmVySW9Db25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVQaXBlbGluZVN0ZXBCYXNlXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuXG5leHBvcnQgY2xhc3MgTW9jaGFDaGFpIGV4dGVuZHMgRW5naW5lUGlwZWxpbmVTdGVwQmFzZSB7XG4gICAgcHVibGljIGFzeW5jIHByb2Nlc3MobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgbG9nZ2VyLmluZm8oXCJHZW5lcmF0aW5nIE1vY2hhLUNoYWkgQ29uZmlndXJhdGlvblwiKTtcblxuICAgICAgICBjb25zdCBpc1VuaXQgPSB1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RGcmFtZXdvcmsgPT09IFwiTW9jaGEtQ2hhaVwiO1xuICAgICAgICBjb25zdCBpc0UyRSA9IHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0RnJhbWV3b3JrID09PSBcIk1vY2hhLUNoYWlcIjtcbiAgICAgICAgY29uc3QgaXNFaXRoZXIgPSBpc1VuaXQgfHwgaXNFMkU7XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1wibW9jaGFcIl0sIGlzRWl0aGVyKTtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1wiQHR5cGVzL21vY2hhXCIsIFwiQHR5cGVzL2NoYWlcIl0sIHVuaXRlQ29uZmlndXJhdGlvbi5zb3VyY2VMYW5ndWFnZSA9PT0gXCJUeXBlU2NyaXB0XCIgJiYgaXNFaXRoZXIpO1xuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVEZXZEZXBlbmRlbmN5KFtcImthcm1hLW1vY2hhXCIsIFwia2FybWEtY2hhaVwiXSwgdW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0UnVubmVyID09PSBcIkthcm1hXCIgJiYgaXNVbml0KTtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJtb2NoYXdlc29tZS1zY3JlZW5zaG90c1wiXSwgdW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RSdW5uZXIgPT09IFwiUHJvdHJhY3RvclwiICYmIGlzRTJFKTtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJ3ZGlvLW1vY2hhLWZyYW1ld29ya1wiXSwgdW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RSdW5uZXIgPT09IFwiV2ViZHJpdmVySU9cIiAmJiBpc0UyRSk7XG5cbiAgICAgICAgY29uc3QgZXNMaW50Q29uZmlndXJhdGlvbiA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPEVzTGludENvbmZpZ3VyYXRpb24+KFwiRVNMaW50XCIpO1xuICAgICAgICBpZiAoZXNMaW50Q29uZmlndXJhdGlvbikge1xuICAgICAgICAgICAgT2JqZWN0SGVscGVyLmFkZFJlbW92ZShlc0xpbnRDb25maWd1cmF0aW9uLmVudiwgXCJtb2NoYVwiLCB0cnVlLCBpc0VpdGhlcik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBrYXJtYUNvbmZpZ3VyYXRpb24gPSBlbmdpbmVWYXJpYWJsZXMuZ2V0Q29uZmlndXJhdGlvbjxLYXJtYUNvbmZpZ3VyYXRpb24+KFwiS2FybWFcIik7XG4gICAgICAgIGlmIChrYXJtYUNvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgICAgIEFycmF5SGVscGVyLmFkZFJlbW92ZShrYXJtYUNvbmZpZ3VyYXRpb24uZnJhbWV3b3JrcywgXCJtb2NoYVwiLCBpc1VuaXQpO1xuICAgICAgICAgICAgQXJyYXlIZWxwZXIuYWRkUmVtb3ZlKGthcm1hQ29uZmlndXJhdGlvbi5mcmFtZXdvcmtzLCBcImNoYWlcIiwgaXNVbml0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0UyRSkge1xuICAgICAgICAgICAgY29uc3QgcHJvdHJhY3RvckNvbmZpZ3VyYXRpb24gPSBlbmdpbmVWYXJpYWJsZXMuZ2V0Q29uZmlndXJhdGlvbjxQcm90cmFjdG9yQ29uZmlndXJhdGlvbj4oXCJQcm90cmFjdG9yXCIpO1xuICAgICAgICAgICAgaWYgKHByb3RyYWN0b3JDb25maWd1cmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgcHJvdHJhY3RvckNvbmZpZ3VyYXRpb24uZnJhbWV3b3JrID0gXCJtb2NoYVwiO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgcmVwb3J0c0ZvbGRlciA9IGZpbGVTeXN0ZW0ucGF0aFRvV2ViKGZpbGVTeXN0ZW0ucGF0aEZpbGVSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgZW5naW5lVmFyaWFibGVzLnd3dy5yZXBvcnRzRm9sZGVyKSk7XG5cbiAgICAgICAgICAgICAgICBwcm90cmFjdG9yQ29uZmlndXJhdGlvbi5tb2NoYU9wdHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcG9ydGVyOiBcIm1vY2hhd2Vzb21lLXNjcmVlbnNob3RzXCIsXG4gICAgICAgICAgICAgICAgICAgIHJlcG9ydGVyT3B0aW9uczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVwb3J0RGlyOiBgJHtyZXBvcnRzRm9sZGVyfS9lMmUvYCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcG9ydE5hbWU6IFwiaW5kZXhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHRha2VQYXNzZWRTY3JlZW5zaG90OiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHRpbWVvdXQ6IDEwMDAwXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3Qgd2ViZHJpdmVySW9Db25maWd1cmF0aW9uID0gZW5naW5lVmFyaWFibGVzLmdldENvbmZpZ3VyYXRpb248V2ViZHJpdmVySW9Db25maWd1cmF0aW9uPihcIldlYmRyaXZlcklPXCIpO1xuICAgICAgICAgICAgaWYgKHdlYmRyaXZlcklvQ29uZmlndXJhdGlvbikge1xuICAgICAgICAgICAgICAgIHdlYmRyaXZlcklvQ29uZmlndXJhdGlvbi5mcmFtZXdvcmsgPSBcIm1vY2hhXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG59XG4iXX0=
