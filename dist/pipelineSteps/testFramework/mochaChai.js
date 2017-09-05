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
const pipelineKey_1 = require("../../engine/pipelineKey");
const pipelineStepBase_1 = require("../../engine/pipelineStepBase");
class MochaChai extends pipelineStepBase_1.PipelineStepBase {
    influences() {
        return [
            new pipelineKey_1.PipelineKey("unite", "uniteConfigurationJson"),
            new pipelineKey_1.PipelineKey("content", "packageJson"),
            new pipelineKey_1.PipelineKey("linter", "esLint"),
            new pipelineKey_1.PipelineKey("unitTestRunner", "karma"),
            new pipelineKey_1.PipelineKey("e2eTestRunner", "protractor"),
            new pipelineKey_1.PipelineKey("e2eTestRunner", "webdriverIo")
        ];
    }
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3Rlc3RGcmFtZXdvcmsvbW9jaGFDaGFpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDRFQUF5RTtBQUN6RSw4RUFBMkU7QUFTM0UsMERBQXVEO0FBQ3ZELG9FQUFpRTtBQUVqRSxlQUF1QixTQUFRLG1DQUFnQjtJQUNwQyxVQUFVO1FBQ2IsTUFBTSxDQUFDO1lBQ0gsSUFBSSx5QkFBVyxDQUFDLE9BQU8sRUFBRSx3QkFBd0IsQ0FBQztZQUNsRCxJQUFJLHlCQUFXLENBQUMsU0FBUyxFQUFFLGFBQWEsQ0FBQztZQUN6QyxJQUFJLHlCQUFXLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQztZQUNuQyxJQUFJLHlCQUFXLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDO1lBQzFDLElBQUkseUJBQVcsQ0FBQyxlQUFlLEVBQUUsWUFBWSxDQUFDO1lBQzlDLElBQUkseUJBQVcsQ0FBQyxlQUFlLEVBQUUsYUFBYSxDQUFDO1NBQ2xELENBQUM7SUFDTixDQUFDO0lBRVksT0FBTyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDbkksTUFBTSxDQUFDLElBQUksQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO1lBRWxELE1BQU0sTUFBTSxHQUFHLG1CQUFlLFlBQUMsa0JBQWtCLENBQUMsaUJBQWlCLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFDbEYsTUFBTSxLQUFLLEdBQUcsbUJBQWUsWUFBQyxrQkFBa0IsQ0FBQyxnQkFBZ0IsRUFBRSxXQUFXLENBQUMsQ0FBQztZQUNoRixNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksS0FBSyxDQUFDO1lBRWpDLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3pELGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLGNBQWMsRUFBRSxhQUFhLENBQUMsRUFBRSxtQkFBZSxZQUFDLGtCQUFrQixDQUFDLGNBQWMsRUFBRSxZQUFZLEtBQUssUUFBUSxDQUFDLENBQUM7WUFFbkosZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsYUFBYSxFQUFFLFlBQVksQ0FBQyxFQUFFLG1CQUFlLFlBQUMsa0JBQWtCLENBQUMsY0FBYyxFQUFFLE9BQU8sS0FBSyxNQUFNLENBQUMsQ0FBQztZQUUxSSxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyx5QkFBeUIsQ0FBQyxFQUFFLG1CQUFlLFlBQUMsa0JBQWtCLENBQUMsYUFBYSxFQUFFLFlBQVksS0FBSyxLQUFLLENBQUMsQ0FBQztZQUUzSSxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxFQUFFLG1CQUFlLFlBQUMsa0JBQWtCLENBQUMsYUFBYSxFQUFFLGFBQWEsS0FBSyxLQUFLLENBQUMsQ0FBQztZQUV6SSxlQUFlLENBQUMsbUJBQW1CLENBQy9CLE1BQU0sRUFDTixTQUFTLEVBQ1QsU0FBUyxFQUNULFNBQVMsRUFDVCxJQUFJLEVBQ0osTUFBTSxFQUNOLE1BQU0sRUFDTixLQUFLLEVBQ0wsU0FBUyxFQUNULFNBQVMsRUFDVCxTQUFTLEVBQ1QsUUFBUSxDQUFDLENBQUM7WUFFZCxNQUFNLG1CQUFtQixHQUFHLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBc0IsUUFBUSxDQUFDLENBQUM7WUFDNUYsRUFBRSxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO2dCQUN0QiwyQkFBWSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztZQUM3RSxDQUFDO1lBRUQsTUFBTSxrQkFBa0IsR0FBRyxlQUFlLENBQUMsZ0JBQWdCLENBQXFCLE9BQU8sQ0FBQyxDQUFDO1lBQ3pGLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztnQkFDckIseUJBQVcsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztZQUMxRSxDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDUixNQUFNLHVCQUF1QixHQUFHLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBMEIsWUFBWSxDQUFDLENBQUM7Z0JBQ3hHLEVBQUUsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQztvQkFDMUIsdUJBQXVCLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztvQkFFNUMsTUFBTSxhQUFhLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxlQUFlLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7b0JBRTFJLHVCQUF1QixDQUFDLFNBQVMsR0FBRzt3QkFDaEMsUUFBUSxFQUFFLHlCQUF5Qjt3QkFDbkMsZUFBZSxFQUFFOzRCQUNiLFNBQVMsRUFBRSxHQUFHLGFBQWEsT0FBTzs0QkFDbEMsVUFBVSxFQUFFLE9BQU87NEJBQ25CLG9CQUFvQixFQUFFLElBQUk7eUJBQzdCO3dCQUNELE9BQU8sRUFBRSxLQUFLO3FCQUNqQixDQUFDO2dCQUNOLENBQUM7Z0JBRUQsTUFBTSx3QkFBd0IsR0FBRyxlQUFlLENBQUMsZ0JBQWdCLENBQTJCLGFBQWEsQ0FBQyxDQUFDO2dCQUMzRyxFQUFFLENBQUMsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUM7b0JBQzNCLHdCQUF3QixDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7Z0JBQ2pELENBQUM7WUFDTCxDQUFDO1lBRUQsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtDQUNKO0FBOUVELDhCQThFQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL3Rlc3RGcmFtZXdvcmsvbW9jaGFDaGFpLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIHRvIGdlbmVyYXRlIG1vY2hhIGNvbmZpZ3VyYXRpb24uXG4gKi9cbmltcG9ydCB7IEFycmF5SGVscGVyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaGVscGVycy9hcnJheUhlbHBlclwiO1xuaW1wb3J0IHsgT2JqZWN0SGVscGVyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaGVscGVycy9vYmplY3RIZWxwZXJcIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgRXNMaW50Q29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy9lc2xpbnQvZXNMaW50Q29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgS2FybWFDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL2thcm1hL2thcm1hQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgUHJvdHJhY3RvckNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvcHJvdHJhY3Rvci9wcm90cmFjdG9yQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgV2ViZHJpdmVySW9Db25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3dlYmRyaXZlcklvL3dlYmRyaXZlcklvQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcbmltcG9ydCB7IFBpcGVsaW5lS2V5IH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9waXBlbGluZUtleVwiO1xuaW1wb3J0IHsgUGlwZWxpbmVTdGVwQmFzZSB9IGZyb20gXCIuLi8uLi9lbmdpbmUvcGlwZWxpbmVTdGVwQmFzZVwiO1xuXG5leHBvcnQgY2xhc3MgTW9jaGFDaGFpIGV4dGVuZHMgUGlwZWxpbmVTdGVwQmFzZSB7XG4gICAgcHVibGljIGluZmx1ZW5jZXMoKTogUGlwZWxpbmVLZXlbXSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICBuZXcgUGlwZWxpbmVLZXkoXCJ1bml0ZVwiLCBcInVuaXRlQ29uZmlndXJhdGlvbkpzb25cIiksXG4gICAgICAgICAgICBuZXcgUGlwZWxpbmVLZXkoXCJjb250ZW50XCIsIFwicGFja2FnZUpzb25cIiksXG4gICAgICAgICAgICBuZXcgUGlwZWxpbmVLZXkoXCJsaW50ZXJcIiwgXCJlc0xpbnRcIiksXG4gICAgICAgICAgICBuZXcgUGlwZWxpbmVLZXkoXCJ1bml0VGVzdFJ1bm5lclwiLCBcImthcm1hXCIpLFxuICAgICAgICAgICAgbmV3IFBpcGVsaW5lS2V5KFwiZTJlVGVzdFJ1bm5lclwiLCBcInByb3RyYWN0b3JcIiksXG4gICAgICAgICAgICBuZXcgUGlwZWxpbmVLZXkoXCJlMmVUZXN0UnVubmVyXCIsIFwid2ViZHJpdmVySW9cIilcbiAgICAgICAgXTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgcHJvY2Vzcyhsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBsb2dnZXIuaW5mbyhcIkdlbmVyYXRpbmcgTW9jaGFDaGFpIENvbmZpZ3VyYXRpb25cIik7XG5cbiAgICAgICAgY29uc3QgaXNVbml0ID0gc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdEZyYW1ld29yaywgXCJNb2NoYUNoYWlcIik7XG4gICAgICAgIGNvbnN0IGlzRTJFID0gc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0RnJhbWV3b3JrLCBcIk1vY2hhQ2hhaVwiKTtcbiAgICAgICAgY29uc3QgaXNFaXRoZXIgPSBpc1VuaXQgfHwgaXNFMkU7XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1wibW9jaGFcIl0sIGlzRWl0aGVyKTtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1wiQHR5cGVzL21vY2hhXCIsIFwiQHR5cGVzL2NoYWlcIl0sIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uc291cmNlTGFuZ3VhZ2UsIFwiVHlwZVNjcmlwdFwiKSAmJiBpc0VpdGhlcik7XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1wia2FybWEtbW9jaGFcIiwgXCJrYXJtYS1jaGFpXCJdLCBzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0UnVubmVyLCBcIkthcm1hXCIpICYmIGlzVW5pdCk7XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1wibW9jaGF3ZXNvbWUtc2NyZWVuc2hvdHNcIl0sIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdFJ1bm5lciwgXCJQcm90cmFjdG9yXCIpICYmIGlzRTJFKTtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJ3ZGlvLW1vY2hhLWZyYW1ld29ya1wiXSwgc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0UnVubmVyLCBcIldlYmRyaXZlcklPXCIpICYmIGlzRTJFKTtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlQ2xpZW50UGFja2FnZShcbiAgICAgICAgICAgIFwiY2hhaVwiLFxuICAgICAgICAgICAgXCJjaGFpLmpzXCIsXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICB0cnVlLFxuICAgICAgICAgICAgXCJ0ZXN0XCIsXG4gICAgICAgICAgICBcIm5vbmVcIixcbiAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgaXNFaXRoZXIpO1xuXG4gICAgICAgIGNvbnN0IGVzTGludENvbmZpZ3VyYXRpb24gPSBlbmdpbmVWYXJpYWJsZXMuZ2V0Q29uZmlndXJhdGlvbjxFc0xpbnRDb25maWd1cmF0aW9uPihcIkVTTGludFwiKTtcbiAgICAgICAgaWYgKGVzTGludENvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgICAgIE9iamVjdEhlbHBlci5hZGRSZW1vdmUoZXNMaW50Q29uZmlndXJhdGlvbi5lbnYsIFwibW9jaGFcIiwgdHJ1ZSwgaXNFaXRoZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qga2FybWFDb25maWd1cmF0aW9uID0gZW5naW5lVmFyaWFibGVzLmdldENvbmZpZ3VyYXRpb248S2FybWFDb25maWd1cmF0aW9uPihcIkthcm1hXCIpO1xuICAgICAgICBpZiAoa2FybWFDb25maWd1cmF0aW9uKSB7XG4gICAgICAgICAgICBBcnJheUhlbHBlci5hZGRSZW1vdmUoa2FybWFDb25maWd1cmF0aW9uLmZyYW1ld29ya3MsIFwibW9jaGFcIiwgaXNVbml0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0UyRSkge1xuICAgICAgICAgICAgY29uc3QgcHJvdHJhY3RvckNvbmZpZ3VyYXRpb24gPSBlbmdpbmVWYXJpYWJsZXMuZ2V0Q29uZmlndXJhdGlvbjxQcm90cmFjdG9yQ29uZmlndXJhdGlvbj4oXCJQcm90cmFjdG9yXCIpO1xuICAgICAgICAgICAgaWYgKHByb3RyYWN0b3JDb25maWd1cmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgcHJvdHJhY3RvckNvbmZpZ3VyYXRpb24uZnJhbWV3b3JrID0gXCJtb2NoYVwiO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgcmVwb3J0c0ZvbGRlciA9IGZpbGVTeXN0ZW0ucGF0aFRvV2ViKGZpbGVTeXN0ZW0ucGF0aEZpbGVSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgZW5naW5lVmFyaWFibGVzLnd3dy5yZXBvcnRzRm9sZGVyKSk7XG5cbiAgICAgICAgICAgICAgICBwcm90cmFjdG9yQ29uZmlndXJhdGlvbi5tb2NoYU9wdHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcG9ydGVyOiBcIm1vY2hhd2Vzb21lLXNjcmVlbnNob3RzXCIsXG4gICAgICAgICAgICAgICAgICAgIHJlcG9ydGVyT3B0aW9uczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVwb3J0RGlyOiBgJHtyZXBvcnRzRm9sZGVyfS9lMmUvYCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcG9ydE5hbWU6IFwiaW5kZXhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHRha2VQYXNzZWRTY3JlZW5zaG90OiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHRpbWVvdXQ6IDEwMDAwXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3Qgd2ViZHJpdmVySW9Db25maWd1cmF0aW9uID0gZW5naW5lVmFyaWFibGVzLmdldENvbmZpZ3VyYXRpb248V2ViZHJpdmVySW9Db25maWd1cmF0aW9uPihcIldlYmRyaXZlcklPXCIpO1xuICAgICAgICAgICAgaWYgKHdlYmRyaXZlcklvQ29uZmlndXJhdGlvbikge1xuICAgICAgICAgICAgICAgIHdlYmRyaXZlcklvQ29uZmlndXJhdGlvbi5mcmFtZXdvcmsgPSBcIm1vY2hhXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG59XG4iXX0=
