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
 * Pipeline step to generate jasmine configuration.
 */
const arrayHelper_1 = require("unitejs-framework/dist/helpers/arrayHelper");
const objectHelper_1 = require("unitejs-framework/dist/helpers/objectHelper");
const pipelineKey_1 = require("../../engine/pipelineKey");
const pipelineStepBase_1 = require("../../engine/pipelineStepBase");
class Jasmine extends pipelineStepBase_1.PipelineStepBase {
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
            logger.info("Generating Jasmine Configuration");
            const isUnit = _super("condition").call(this, uniteConfiguration.unitTestFramework, "Jasmine");
            const isE2E = _super("condition").call(this, uniteConfiguration.e2eTestFramework, "Jasmine");
            const isEither = isUnit || isE2E;
            engineVariables.toggleDevDependency(["jasmine-core"], isEither);
            engineVariables.toggleDevDependency(["@types/jasmine"], _super("condition").call(this, uniteConfiguration.sourceLanguage, "TypeScript") && isEither);
            engineVariables.toggleDevDependency(["karma-jasmine"], _super("condition").call(this, uniteConfiguration.unitTestRunner, "Karma") && isUnit);
            engineVariables.toggleDevDependency(["protractor-jasmine2-html-reporter", "jasmine-spec-reporter"], _super("condition").call(this, uniteConfiguration.e2eTestRunner, "Protractor") && isE2E);
            engineVariables.toggleDevDependency(["wdio-jasmine-framework"], _super("condition").call(this, uniteConfiguration.e2eTestRunner, "WebdriverIO") && isE2E);
            const esLintConfiguration = engineVariables.getConfiguration("ESLint");
            if (esLintConfiguration) {
                objectHelper_1.ObjectHelper.addRemove(esLintConfiguration.env, "jasmine", true, isEither);
            }
            const karmaConfiguration = engineVariables.getConfiguration("Karma");
            if (karmaConfiguration) {
                arrayHelper_1.ArrayHelper.addRemove(karmaConfiguration.frameworks, "jasmine", isUnit);
            }
            if (isE2E) {
                const protractorConfiguration = engineVariables.getConfiguration("Protractor");
                if (protractorConfiguration) {
                    protractorConfiguration.framework = "jasmine";
                    protractorConfiguration.jasmineNodeOpts = { showColors: true };
                }
                const protractorScriptStart = engineVariables.getConfiguration("Protractor.ScriptStart");
                if (protractorScriptStart) {
                    protractorScriptStart.push("const Jasmine2HtmlReporter = require('protractor-jasmine2-html-reporter');");
                    protractorScriptStart.push("const SpecReporter = require('jasmine-spec-reporter').SpecReporter;");
                }
                const protractorScriptEnd = engineVariables.getConfiguration("Protractor.ScriptEnd");
                if (protractorScriptEnd) {
                    const reportsFolder = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, engineVariables.www.reportsFolder));
                    protractorScriptEnd.push("exports.config.onPrepare = () => {");
                    protractorScriptEnd.push("    jasmine.getEnv().clearReporters();");
                    protractorScriptEnd.push("    jasmine.getEnv().addReporter(");
                    protractorScriptEnd.push("        new Jasmine2HtmlReporter({");
                    protractorScriptEnd.push(`            savePath: '${reportsFolder}/e2e/',`);
                    protractorScriptEnd.push("            fileName: 'index'");
                    protractorScriptEnd.push("        })");
                    protractorScriptEnd.push("    );");
                    protractorScriptEnd.push("    jasmine.getEnv().addReporter(");
                    protractorScriptEnd.push("        new SpecReporter({");
                    protractorScriptEnd.push("            displayStacktrace: 'all'");
                    protractorScriptEnd.push("        })");
                    protractorScriptEnd.push("    );");
                    protractorScriptEnd.push("};");
                }
                const webdriverIoConfiguration = engineVariables.getConfiguration("WebdriverIO");
                if (webdriverIoConfiguration) {
                    webdriverIoConfiguration.framework = "jasmine";
                }
            }
            return 0;
        });
    }
}
exports.Jasmine = Jasmine;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3Rlc3RGcmFtZXdvcmsvamFzbWluZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCw0RUFBeUU7QUFDekUsOEVBQTJFO0FBUzNFLDBEQUF1RDtBQUN2RCxvRUFBaUU7QUFFakUsYUFBcUIsU0FBUSxtQ0FBZ0I7SUFDbEMsVUFBVTtRQUNiLE1BQU0sQ0FBQztZQUNILElBQUkseUJBQVcsQ0FBQyxPQUFPLEVBQUUsd0JBQXdCLENBQUM7WUFDbEQsSUFBSSx5QkFBVyxDQUFDLFNBQVMsRUFBRSxhQUFhLENBQUM7WUFDekMsSUFBSSx5QkFBVyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUM7WUFDbkMsSUFBSSx5QkFBVyxDQUFDLGdCQUFnQixFQUFFLE9BQU8sQ0FBQztZQUMxQyxJQUFJLHlCQUFXLENBQUMsZUFBZSxFQUFFLFlBQVksQ0FBQztZQUM5QyxJQUFJLHlCQUFXLENBQUMsZUFBZSxFQUFFLGFBQWEsQ0FBQztTQUNsRCxDQUFDO0lBQ04sQ0FBQztJQUVZLE9BQU8sQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQ25JLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0NBQWtDLENBQUMsQ0FBQztZQUVoRCxNQUFNLE1BQU0sR0FBRyxtQkFBZSxZQUFDLGtCQUFrQixDQUFDLGlCQUFpQixFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ2hGLE1BQU0sS0FBSyxHQUFHLG1CQUFlLFlBQUMsa0JBQWtCLENBQUMsZ0JBQWdCLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDOUUsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLEtBQUssQ0FBQztZQUVqQyxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxjQUFjLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUNoRSxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLG1CQUFlLFlB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QkFDdkMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUNuQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsbUNBQW1DLENBQUMsQ0FBQztvQkFDOUQsbUJBQW1CLENBQUMsSUFBSSxDQUFDLDRCQUE0QixDQUFDLENBQUM7b0JBQ3ZELG1CQUFtQixDQUFDLElBQUksQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO29CQUNqRSxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7b0JBQ3ZDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDbkMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNuQyxDQUFDO2dCQUVELE1BQU0sd0JBQXdCLEdBQUcsZUFBZSxDQUFDLGdCQUFnQixDQUEyQixhQUFhLENBQUMsQ0FBQztnQkFDM0csRUFBRSxDQUFDLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDO29CQUMzQix3QkFBd0IsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO2dCQUNuRCxDQUFDO1lBQ0wsQ0FBQztZQUVELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7Q0FDSjtBQWhGRCwwQkFnRkMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy90ZXN0RnJhbWV3b3JrL2phc21pbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFBpcGVsaW5lIHN0ZXAgdG8gZ2VuZXJhdGUgamFzbWluZSBjb25maWd1cmF0aW9uLlxuICovXG5pbXBvcnQgeyBBcnJheUhlbHBlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvYXJyYXlIZWxwZXJcIjtcbmltcG9ydCB7IE9iamVjdEhlbHBlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvb2JqZWN0SGVscGVyXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IEVzTGludENvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvZXNsaW50L2VzTGludENvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEthcm1hQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy9rYXJtYS9rYXJtYUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFByb3RyYWN0b3JDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3Byb3RyYWN0b3IvcHJvdHJhY3RvckNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFdlYmRyaXZlcklvQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy93ZWJkcml2ZXJJby93ZWJkcml2ZXJJb0NvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBQaXBlbGluZUtleSB9IGZyb20gXCIuLi8uLi9lbmdpbmUvcGlwZWxpbmVLZXlcIjtcbmltcG9ydCB7IFBpcGVsaW5lU3RlcEJhc2UgfSBmcm9tIFwiLi4vLi4vZW5naW5lL3BpcGVsaW5lU3RlcEJhc2VcIjtcblxuZXhwb3J0IGNsYXNzIEphc21pbmUgZXh0ZW5kcyBQaXBlbGluZVN0ZXBCYXNlIHtcbiAgICBwdWJsaWMgaW5mbHVlbmNlcygpOiBQaXBlbGluZUtleVtdIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIG5ldyBQaXBlbGluZUtleShcInVuaXRlXCIsIFwidW5pdGVDb25maWd1cmF0aW9uSnNvblwiKSxcbiAgICAgICAgICAgIG5ldyBQaXBlbGluZUtleShcImNvbnRlbnRcIiwgXCJwYWNrYWdlSnNvblwiKSxcbiAgICAgICAgICAgIG5ldyBQaXBlbGluZUtleShcImxpbnRlclwiLCBcImVzTGludFwiKSxcbiAgICAgICAgICAgIG5ldyBQaXBlbGluZUtleShcInVuaXRUZXN0UnVubmVyXCIsIFwia2FybWFcIiksXG4gICAgICAgICAgICBuZXcgUGlwZWxpbmVLZXkoXCJlMmVUZXN0UnVubmVyXCIsIFwicHJvdHJhY3RvclwiKSxcbiAgICAgICAgICAgIG5ldyBQaXBlbGluZUtleShcImUyZVRlc3RSdW5uZXJcIiwgXCJ3ZWJkcml2ZXJJb1wiKVxuICAgICAgICBdO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBwcm9jZXNzKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGxvZ2dlci5pbmZvKFwiR2VuZXJhdGluZyBKYXNtaW5lIENvbmZpZ3VyYXRpb25cIik7XG5cbiAgICAgICAgY29uc3QgaXNVbml0ID0gc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdEZyYW1ld29yaywgXCJKYXNtaW5lXCIpO1xuICAgICAgICBjb25zdCBpc0UyRSA9IHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdEZyYW1ld29yaywgXCJKYXNtaW5lXCIpO1xuICAgICAgICBjb25zdCBpc0VpdGhlciA9IGlzVW5pdCB8fCBpc0UyRTtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJqYXNtaW5lLWNvcmVcIl0sIGlzRWl0aGVyKTtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1wiQHR5cGVzL2phc21pbmVcIl0sIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uc291cmNlTGFuZ3VhZ2UsIFwiVHlwZVNjcmlwdFwiKSAmJiBpc0VpdGhlcik7XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1wia2FybWEtamFzbWluZVwiXSwgc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdFJ1bm5lciwgXCJLYXJtYVwiKSAmJiBpc1VuaXQpO1xuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVEZXZEZXBlbmRlbmN5KFtcInByb3RyYWN0b3ItamFzbWluZTItaHRtbC1yZXBvcnRlclwiLCBcImphc21pbmUtc3BlYy1yZXBvcnRlclwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0UnVubmVyLCBcIlByb3RyYWN0b3JcIikgJiYgaXNFMkUpO1xuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVEZXZEZXBlbmRlbmN5KFtcIndkaW8tamFzbWluZS1mcmFtZXdvcmtcIl0sIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdFJ1bm5lciwgXCJXZWJkcml2ZXJJT1wiKSAmJiBpc0UyRSk7XG5cbiAgICAgICAgY29uc3QgZXNMaW50Q29uZmlndXJhdGlvbiA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPEVzTGludENvbmZpZ3VyYXRpb24+KFwiRVNMaW50XCIpO1xuICAgICAgICBpZiAoZXNMaW50Q29uZmlndXJhdGlvbikge1xuICAgICAgICAgICAgT2JqZWN0SGVscGVyLmFkZFJlbW92ZShlc0xpbnRDb25maWd1cmF0aW9uLmVudiwgXCJqYXNtaW5lXCIsIHRydWUsIGlzRWl0aGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGthcm1hQ29uZmlndXJhdGlvbiA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPEthcm1hQ29uZmlndXJhdGlvbj4oXCJLYXJtYVwiKTtcbiAgICAgICAgaWYgKGthcm1hQ29uZmlndXJhdGlvbikge1xuICAgICAgICAgICAgQXJyYXlIZWxwZXIuYWRkUmVtb3ZlKGthcm1hQ29uZmlndXJhdGlvbi5mcmFtZXdvcmtzLCBcImphc21pbmVcIiwgaXNVbml0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0UyRSkge1xuICAgICAgICAgICAgY29uc3QgcHJvdHJhY3RvckNvbmZpZ3VyYXRpb24gPSBlbmdpbmVWYXJpYWJsZXMuZ2V0Q29uZmlndXJhdGlvbjxQcm90cmFjdG9yQ29uZmlndXJhdGlvbj4oXCJQcm90cmFjdG9yXCIpO1xuICAgICAgICAgICAgaWYgKHByb3RyYWN0b3JDb25maWd1cmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgcHJvdHJhY3RvckNvbmZpZ3VyYXRpb24uZnJhbWV3b3JrID0gXCJqYXNtaW5lXCI7XG4gICAgICAgICAgICAgICAgcHJvdHJhY3RvckNvbmZpZ3VyYXRpb24uamFzbWluZU5vZGVPcHRzID0geyBzaG93Q29sb3JzOiB0cnVlIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHByb3RyYWN0b3JTY3JpcHRTdGFydCA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPHN0cmluZ1tdPihcIlByb3RyYWN0b3IuU2NyaXB0U3RhcnRcIik7XG4gICAgICAgICAgICBpZiAocHJvdHJhY3RvclNjcmlwdFN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgcHJvdHJhY3RvclNjcmlwdFN0YXJ0LnB1c2goXCJjb25zdCBKYXNtaW5lMkh0bWxSZXBvcnRlciA9IHJlcXVpcmUoJ3Byb3RyYWN0b3ItamFzbWluZTItaHRtbC1yZXBvcnRlcicpO1wiKTtcbiAgICAgICAgICAgICAgICBwcm90cmFjdG9yU2NyaXB0U3RhcnQucHVzaChcImNvbnN0IFNwZWNSZXBvcnRlciA9IHJlcXVpcmUoJ2phc21pbmUtc3BlYy1yZXBvcnRlcicpLlNwZWNSZXBvcnRlcjtcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHByb3RyYWN0b3JTY3JpcHRFbmQgPSBlbmdpbmVWYXJpYWJsZXMuZ2V0Q29uZmlndXJhdGlvbjxzdHJpbmdbXT4oXCJQcm90cmFjdG9yLlNjcmlwdEVuZFwiKTtcbiAgICAgICAgICAgIGlmIChwcm90cmFjdG9yU2NyaXB0RW5kKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVwb3J0c0ZvbGRlciA9IGZpbGVTeXN0ZW0ucGF0aFRvV2ViKGZpbGVTeXN0ZW0ucGF0aEZpbGVSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgZW5naW5lVmFyaWFibGVzLnd3dy5yZXBvcnRzRm9sZGVyKSk7XG5cbiAgICAgICAgICAgICAgICBwcm90cmFjdG9yU2NyaXB0RW5kLnB1c2goXCJleHBvcnRzLmNvbmZpZy5vblByZXBhcmUgPSAoKSA9PiB7XCIpO1xuICAgICAgICAgICAgICAgIHByb3RyYWN0b3JTY3JpcHRFbmQucHVzaChcIiAgICBqYXNtaW5lLmdldEVudigpLmNsZWFyUmVwb3J0ZXJzKCk7XCIpO1xuICAgICAgICAgICAgICAgIHByb3RyYWN0b3JTY3JpcHRFbmQucHVzaChcIiAgICBqYXNtaW5lLmdldEVudigpLmFkZFJlcG9ydGVyKFwiKTtcbiAgICAgICAgICAgICAgICBwcm90cmFjdG9yU2NyaXB0RW5kLnB1c2goXCIgICAgICAgIG5ldyBKYXNtaW5lMkh0bWxSZXBvcnRlcih7XCIpO1xuICAgICAgICAgICAgICAgIHByb3RyYWN0b3JTY3JpcHRFbmQucHVzaChgICAgICAgICAgICAgc2F2ZVBhdGg6ICcke3JlcG9ydHNGb2xkZXJ9L2UyZS8nLGApO1xuICAgICAgICAgICAgICAgIHByb3RyYWN0b3JTY3JpcHRFbmQucHVzaChcIiAgICAgICAgICAgIGZpbGVOYW1lOiAnaW5kZXgnXCIpO1xuICAgICAgICAgICAgICAgIHByb3RyYWN0b3JTY3JpcHRFbmQucHVzaChcIiAgICAgICAgfSlcIik7XG4gICAgICAgICAgICAgICAgcHJvdHJhY3RvclNjcmlwdEVuZC5wdXNoKFwiICAgICk7XCIpO1xuICAgICAgICAgICAgICAgIHByb3RyYWN0b3JTY3JpcHRFbmQucHVzaChcIiAgICBqYXNtaW5lLmdldEVudigpLmFkZFJlcG9ydGVyKFwiKTtcbiAgICAgICAgICAgICAgICBwcm90cmFjdG9yU2NyaXB0RW5kLnB1c2goXCIgICAgICAgIG5ldyBTcGVjUmVwb3J0ZXIoe1wiKTtcbiAgICAgICAgICAgICAgICBwcm90cmFjdG9yU2NyaXB0RW5kLnB1c2goXCIgICAgICAgICAgICBkaXNwbGF5U3RhY2t0cmFjZTogJ2FsbCdcIik7XG4gICAgICAgICAgICAgICAgcHJvdHJhY3RvclNjcmlwdEVuZC5wdXNoKFwiICAgICAgICB9KVwiKTtcbiAgICAgICAgICAgICAgICBwcm90cmFjdG9yU2NyaXB0RW5kLnB1c2goXCIgICAgKTtcIik7XG4gICAgICAgICAgICAgICAgcHJvdHJhY3RvclNjcmlwdEVuZC5wdXNoKFwifTtcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHdlYmRyaXZlcklvQ29uZmlndXJhdGlvbiA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPFdlYmRyaXZlcklvQ29uZmlndXJhdGlvbj4oXCJXZWJkcml2ZXJJT1wiKTtcbiAgICAgICAgICAgIGlmICh3ZWJkcml2ZXJJb0NvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgICAgICAgICB3ZWJkcml2ZXJJb0NvbmZpZ3VyYXRpb24uZnJhbWV3b3JrID0gXCJqYXNtaW5lXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG59XG4iXX0=
