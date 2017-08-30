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
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            logger.info("Generating MochaChai Configuration");
            const isUnit = _super("condition").call(this, uniteConfiguration.unitTestFramework, "MochaChai");
            const isE2E = _super("condition").call(this, uniteConfiguration.e2eTestFramework, "MochaChai");
            const isEither = isUnit || isE2E;
            engineVariables.toggleDevDependency(["mocha"], isEither);
            engineVariables.toggleDevDependency(["@types/mocha", "@types/chai"], _super("condition").call(this, uniteConfiguration.sourceLanguage, "TypeScript") && isEither);
            engineVariables.toggleDevDependency(["karma-mocha", "karma-chai"], _super("condition").call(this, uniteConfiguration.unitTestRunner, "Karma") && isUnit);
            engineVariables.toggleDevDependency(["mochawesome-screenshots"], _super("condition").call(this, uniteConfiguration.e2eTestRunner, "Protractor") && isE2E);
            engineVariables.toggleDevDependency(["wdio-mocha-framework"], _super("condition").call(this, uniteConfiguration.e2eTestRunner, "WebdriverIO") && isE2E);
            engineVariables.toggleClientPackage("chai", "chai.js", undefined, undefined, true, "test", "none", false, undefined, undefined, undefined, isEither);
            const esLintConfiguration = engineVariables.getConfiguration("ESLint");
            if (esLintConfiguration) {
                objectHelper_1.ObjectHelper.addRemove(esLintConfiguration.env, "mocha", true, isEither);
            }
            const karmaConfiguration = engineVariables.getConfiguration("Karma");
            if (karmaConfiguration) {
                arrayHelper_1.ArrayHelper.addRemove(karmaConfiguration.frameworks, "mocha", isUnit);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3Rlc3RGcmFtZXdvcmsvbW9jaGFDaGFpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDRFQUF5RTtBQUN6RSw4RUFBMkU7QUFRM0UsZ0ZBQTZFO0FBRzdFLGVBQXVCLFNBQVEsK0NBQXNCO0lBQ3BDLE9BQU8sQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQ25JLE1BQU0sQ0FBQyxJQUFJLENBQUMsb0NBQW9DLENBQUMsQ0FBQztZQUVsRCxNQUFNLE1BQU0sR0FBRyxtQkFBZSxZQUFDLGtCQUFrQixDQUFDLGlCQUFpQixFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQ2xGLE1BQU0sS0FBSyxHQUFHLG1CQUFlLFlBQUMsa0JBQWtCLENBQUMsZ0JBQWdCLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFDaEYsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLEtBQUssQ0FBQztZQUVqQyxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUN6RCxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxjQUFjLEVBQUUsYUFBYSxDQUFDLEVBQUUsbUJBQWUsWUFBQyxrQkFBa0IsQ0FBQyxjQUFjLEVBQUUsWUFBWSxLQUFLLFFBQVEsQ0FBQyxDQUFDO1lBRW5KLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLGFBQWEsRUFBRSxZQUFZLENBQUMsRUFBRSxtQkFBZSxZQUFDLGtCQUFrQixDQUFDLGNBQWMsRUFBRSxPQUFPLEtBQUssTUFBTSxDQUFDLENBQUM7WUFFMUksZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMseUJBQXlCLENBQUMsRUFBRSxtQkFBZSxZQUFDLGtCQUFrQixDQUFDLGFBQWEsRUFBRSxZQUFZLEtBQUssS0FBSyxDQUFDLENBQUM7WUFFM0ksZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsc0JBQXNCLENBQUMsRUFBRSxtQkFBZSxZQUFDLGtCQUFrQixDQUFDLGFBQWEsRUFBRSxhQUFhLEtBQUssS0FBSyxDQUFDLENBQUM7WUFFekksZUFBZSxDQUFDLG1CQUFtQixDQUMvQixNQUFNLEVBQ04sU0FBUyxFQUNULFNBQVMsRUFDVCxTQUFTLEVBQ1QsSUFBSSxFQUNKLE1BQU0sRUFDTixNQUFNLEVBQ04sS0FBSyxFQUNMLFNBQVMsRUFDVCxTQUFTLEVBQ1QsU0FBUyxFQUNULFFBQVEsQ0FBQyxDQUFDO1lBRWQsTUFBTSxtQkFBbUIsR0FBRyxlQUFlLENBQUMsZ0JBQWdCLENBQXNCLFFBQVEsQ0FBQyxDQUFDO1lBQzVGLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQztnQkFDdEIsMkJBQVksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDN0UsQ0FBQztZQUVELE1BQU0sa0JBQWtCLEdBQUcsZUFBZSxDQUFDLGdCQUFnQixDQUFxQixPQUFPLENBQUMsQ0FBQztZQUN6RixFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JCLHlCQUFXLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDMUUsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsTUFBTSx1QkFBdUIsR0FBRyxlQUFlLENBQUMsZ0JBQWdCLENBQTBCLFlBQVksQ0FBQyxDQUFDO2dCQUN4RyxFQUFFLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUM7b0JBQzFCLHVCQUF1QixDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7b0JBRTVDLE1BQU0sYUFBYSxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxhQUFhLEVBQUUsZUFBZSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO29CQUUxSSx1QkFBdUIsQ0FBQyxTQUFTLEdBQUc7d0JBQ2hDLFFBQVEsRUFBRSx5QkFBeUI7d0JBQ25DLGVBQWUsRUFBRTs0QkFDYixTQUFTLEVBQUUsR0FBRyxhQUFhLE9BQU87NEJBQ2xDLFVBQVUsRUFBRSxPQUFPOzRCQUNuQixvQkFBb0IsRUFBRSxJQUFJO3lCQUM3Qjt3QkFDRCxPQUFPLEVBQUUsS0FBSztxQkFDakIsQ0FBQztnQkFDTixDQUFDO2dCQUVELE1BQU0sd0JBQXdCLEdBQUcsZUFBZSxDQUFDLGdCQUFnQixDQUEyQixhQUFhLENBQUMsQ0FBQztnQkFDM0csRUFBRSxDQUFDLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDO29CQUMzQix3QkFBd0IsQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO2dCQUNqRCxDQUFDO1lBQ0wsQ0FBQztZQUVELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7Q0FDSjtBQW5FRCw4QkFtRUMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy90ZXN0RnJhbWV3b3JrL21vY2hhQ2hhaS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgc3RlcCB0byBnZW5lcmF0ZSBtb2NoYSBjb25maWd1cmF0aW9uLlxuICovXG5pbXBvcnQgeyBBcnJheUhlbHBlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvYXJyYXlIZWxwZXJcIjtcbmltcG9ydCB7IE9iamVjdEhlbHBlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvb2JqZWN0SGVscGVyXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IEVzTGludENvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvZXNsaW50L2VzTGludENvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEthcm1hQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy9rYXJtYS9rYXJtYUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFByb3RyYWN0b3JDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3Byb3RyYWN0b3IvcHJvdHJhY3RvckNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFdlYmRyaXZlcklvQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy93ZWJkcml2ZXJJby93ZWJkcml2ZXJJb0NvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZVBpcGVsaW5lU3RlcEJhc2UgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVBpcGVsaW5lU3RlcEJhc2VcIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5cbmV4cG9ydCBjbGFzcyBNb2NoYUNoYWkgZXh0ZW5kcyBFbmdpbmVQaXBlbGluZVN0ZXBCYXNlIHtcbiAgICBwdWJsaWMgYXN5bmMgcHJvY2Vzcyhsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBsb2dnZXIuaW5mbyhcIkdlbmVyYXRpbmcgTW9jaGFDaGFpIENvbmZpZ3VyYXRpb25cIik7XG5cbiAgICAgICAgY29uc3QgaXNVbml0ID0gc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdEZyYW1ld29yaywgXCJNb2NoYUNoYWlcIik7XG4gICAgICAgIGNvbnN0IGlzRTJFID0gc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0RnJhbWV3b3JrLCBcIk1vY2hhQ2hhaVwiKTtcbiAgICAgICAgY29uc3QgaXNFaXRoZXIgPSBpc1VuaXQgfHwgaXNFMkU7XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1wibW9jaGFcIl0sIGlzRWl0aGVyKTtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1wiQHR5cGVzL21vY2hhXCIsIFwiQHR5cGVzL2NoYWlcIl0sIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uc291cmNlTGFuZ3VhZ2UsIFwiVHlwZVNjcmlwdFwiKSAmJiBpc0VpdGhlcik7XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1wia2FybWEtbW9jaGFcIiwgXCJrYXJtYS1jaGFpXCJdLCBzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0UnVubmVyLCBcIkthcm1hXCIpICYmIGlzVW5pdCk7XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1wibW9jaGF3ZXNvbWUtc2NyZWVuc2hvdHNcIl0sIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdFJ1bm5lciwgXCJQcm90cmFjdG9yXCIpICYmIGlzRTJFKTtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJ3ZGlvLW1vY2hhLWZyYW1ld29ya1wiXSwgc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0UnVubmVyLCBcIldlYmRyaXZlcklPXCIpICYmIGlzRTJFKTtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlQ2xpZW50UGFja2FnZShcbiAgICAgICAgICAgIFwiY2hhaVwiLFxuICAgICAgICAgICAgXCJjaGFpLmpzXCIsXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICB0cnVlLFxuICAgICAgICAgICAgXCJ0ZXN0XCIsXG4gICAgICAgICAgICBcIm5vbmVcIixcbiAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgaXNFaXRoZXIpO1xuXG4gICAgICAgIGNvbnN0IGVzTGludENvbmZpZ3VyYXRpb24gPSBlbmdpbmVWYXJpYWJsZXMuZ2V0Q29uZmlndXJhdGlvbjxFc0xpbnRDb25maWd1cmF0aW9uPihcIkVTTGludFwiKTtcbiAgICAgICAgaWYgKGVzTGludENvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgICAgIE9iamVjdEhlbHBlci5hZGRSZW1vdmUoZXNMaW50Q29uZmlndXJhdGlvbi5lbnYsIFwibW9jaGFcIiwgdHJ1ZSwgaXNFaXRoZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qga2FybWFDb25maWd1cmF0aW9uID0gZW5naW5lVmFyaWFibGVzLmdldENvbmZpZ3VyYXRpb248S2FybWFDb25maWd1cmF0aW9uPihcIkthcm1hXCIpO1xuICAgICAgICBpZiAoa2FybWFDb25maWd1cmF0aW9uKSB7XG4gICAgICAgICAgICBBcnJheUhlbHBlci5hZGRSZW1vdmUoa2FybWFDb25maWd1cmF0aW9uLmZyYW1ld29ya3MsIFwibW9jaGFcIiwgaXNVbml0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0UyRSkge1xuICAgICAgICAgICAgY29uc3QgcHJvdHJhY3RvckNvbmZpZ3VyYXRpb24gPSBlbmdpbmVWYXJpYWJsZXMuZ2V0Q29uZmlndXJhdGlvbjxQcm90cmFjdG9yQ29uZmlndXJhdGlvbj4oXCJQcm90cmFjdG9yXCIpO1xuICAgICAgICAgICAgaWYgKHByb3RyYWN0b3JDb25maWd1cmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgcHJvdHJhY3RvckNvbmZpZ3VyYXRpb24uZnJhbWV3b3JrID0gXCJtb2NoYVwiO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgcmVwb3J0c0ZvbGRlciA9IGZpbGVTeXN0ZW0ucGF0aFRvV2ViKGZpbGVTeXN0ZW0ucGF0aEZpbGVSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgZW5naW5lVmFyaWFibGVzLnd3dy5yZXBvcnRzRm9sZGVyKSk7XG5cbiAgICAgICAgICAgICAgICBwcm90cmFjdG9yQ29uZmlndXJhdGlvbi5tb2NoYU9wdHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcG9ydGVyOiBcIm1vY2hhd2Vzb21lLXNjcmVlbnNob3RzXCIsXG4gICAgICAgICAgICAgICAgICAgIHJlcG9ydGVyT3B0aW9uczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVwb3J0RGlyOiBgJHtyZXBvcnRzRm9sZGVyfS9lMmUvYCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcG9ydE5hbWU6IFwiaW5kZXhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHRha2VQYXNzZWRTY3JlZW5zaG90OiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHRpbWVvdXQ6IDEwMDAwXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3Qgd2ViZHJpdmVySW9Db25maWd1cmF0aW9uID0gZW5naW5lVmFyaWFibGVzLmdldENvbmZpZ3VyYXRpb248V2ViZHJpdmVySW9Db25maWd1cmF0aW9uPihcIldlYmRyaXZlcklPXCIpO1xuICAgICAgICAgICAgaWYgKHdlYmRyaXZlcklvQ29uZmlndXJhdGlvbikge1xuICAgICAgICAgICAgICAgIHdlYmRyaXZlcklvQ29uZmlndXJhdGlvbi5mcmFtZXdvcmsgPSBcIm1vY2hhXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG59XG4iXX0=
