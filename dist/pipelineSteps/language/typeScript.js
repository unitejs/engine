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
const typeScriptCompilerOptions_1 = require("../../configuration/models/typeScript/typeScriptCompilerOptions");
const typeScriptConfiguration_1 = require("../../configuration/models/typeScript/typeScriptConfiguration");
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class TypeScript extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["typescript"], uniteConfiguration.sourceLanguage === "TypeScript");
            if (uniteConfiguration.sourceLanguage === "TypeScript") {
                try {
                    logger.info(`Generating ${TypeScript.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });
                    const typeScriptConfiguration = new typeScriptConfiguration_1.TypeScriptConfiguration();
                    typeScriptConfiguration.compilerOptions = new typeScriptCompilerOptions_1.TypeScriptCompilerOptions();
                    typeScriptConfiguration.compilerOptions.target = "es5";
                    typeScriptConfiguration.compilerOptions.moduleResolution = "node";
                    typeScriptConfiguration.compilerOptions.noImplicitAny = true;
                    typeScriptConfiguration.compilerOptions.noImplicitThis = true;
                    typeScriptConfiguration.compilerOptions.noImplicitReturns = true;
                    typeScriptConfiguration.compilerOptions.lib = ["dom", "es2015"];
                    if (uniteConfiguration.moduleType === "AMD") {
                        typeScriptConfiguration.compilerOptions.module = "amd";
                    }
                    else if (uniteConfiguration.moduleType === "SystemJS") {
                        typeScriptConfiguration.compilerOptions.module = "system";
                    }
                    else {
                        typeScriptConfiguration.compilerOptions.module = "commonjs";
                    }
                    const additional = {};
                    for (const key in engineVariables.transpileProperties) {
                        if (engineVariables.transpileProperties[key].required) {
                            additional[key] = engineVariables.transpileProperties[key].object;
                        }
                    }
                    Object.assign(typeScriptConfiguration.compilerOptions, additional);
                    yield fileSystem.fileWriteJson(engineVariables.wwwRootFolder, TypeScript.FILENAME, typeScriptConfiguration);
                    return 0;
                }
                catch (err) {
                    logger.error(`Generating ${TypeScript.FILENAME} failed`, err, { wwwFolder: engineVariables.wwwRootFolder });
                    return 1;
                }
            }
            else {
                return yield _super("deleteFile").call(this, logger, fileSystem, engineVariables.wwwRootFolder, TypeScript.FILENAME);
            }
        });
    }
}
TypeScript.FILENAME = "tsconfig.json";
exports.TypeScript = TypeScript;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2xhbmd1YWdlL3R5cGVTY3JpcHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUtBLCtHQUE0RztBQUM1RywyR0FBd0c7QUFFeEcsZ0ZBQTZFO0FBRzdFLGdCQUF3QixTQUFRLCtDQUFzQjtJQUdyQyxPQUFPLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUNuSSxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxZQUFZLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxjQUFjLEtBQUssWUFBWSxDQUFDLENBQUM7WUFFeEcsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsY0FBYyxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQ3JELElBQUksQ0FBQztvQkFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsVUFBVSxDQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLGVBQWUsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO29CQUUvRixNQUFNLHVCQUF1QixHQUFHLElBQUksaURBQXVCLEVBQUUsQ0FBQztvQkFDOUQsdUJBQXVCLENBQUMsZUFBZSxHQUFHLElBQUkscURBQXlCLEVBQUUsQ0FBQztvQkFFMUUsdUJBQXVCLENBQUMsZUFBZSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7b0JBQ3ZELHVCQUF1QixDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsR0FBRyxNQUFNLENBQUM7b0JBQ2xFLHVCQUF1QixDQUFDLGVBQWUsQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO29CQUM3RCx1QkFBdUIsQ0FBQyxlQUFlLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztvQkFDOUQsdUJBQXVCLENBQUMsZUFBZSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQztvQkFFakUsdUJBQXVCLENBQUMsZUFBZSxDQUFDLEdBQUcsR0FBRyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztvQkFFaEUsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsVUFBVSxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7d0JBQzFDLHVCQUF1QixDQUFDLGVBQWUsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO29CQUMzRCxDQUFDO29CQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQzt3QkFDdEQsdUJBQXVCLENBQUMsZUFBZSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUM7b0JBQzlELENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osdUJBQXVCLENBQUMsZUFBZSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUM7b0JBQ2hFLENBQUM7b0JBRUQsTUFBTSxVQUFVLEdBQXlCLEVBQUUsQ0FBQztvQkFDNUMsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLElBQUksZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQzt3QkFDcEQsRUFBRSxDQUFDLENBQUMsZUFBZSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7NEJBQ3BELFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxlQUFlLENBQUMsbUJBQW1CLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO3dCQUN0RSxDQUFDO29CQUNMLENBQUM7b0JBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxlQUFlLEVBQUUsVUFBVSxDQUFDLENBQUM7b0JBRW5FLE1BQU0sVUFBVSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFLFVBQVUsQ0FBQyxRQUFRLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztvQkFFNUcsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsTUFBTSxDQUFDLEtBQUssQ0FBQyxjQUFjLFVBQVUsQ0FBQyxRQUFRLFNBQVMsRUFBRSxHQUFHLEVBQUUsRUFBRSxTQUFTLEVBQUUsZUFBZSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7b0JBQzVHLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztZQUNMLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixNQUFNLENBQUMsTUFBTSxvQkFBZ0IsWUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGVBQWUsQ0FBQyxhQUFhLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzFHLENBQUM7UUFDTCxDQUFDO0tBQUE7O0FBOUNjLG1CQUFRLEdBQVcsZUFBZSxDQUFDO0FBRHRELGdDQWdEQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2xhbmd1YWdlL3R5cGVTY3JpcHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFBpcGVsaW5lIHN0ZXAgdG8gZ2VuZXJhdGUgVHlwZVNjcmlwdCBjb25maWd1cmF0aW9uLlxuICovXG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IFR5cGVTY3JpcHRDb21waWxlck9wdGlvbnMgfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdHlwZVNjcmlwdC90eXBlU2NyaXB0Q29tcGlsZXJPcHRpb25zXCI7XG5pbXBvcnQgeyBUeXBlU2NyaXB0Q29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy90eXBlU2NyaXB0L3R5cGVTY3JpcHRDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVQaXBlbGluZVN0ZXBCYXNlXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuXG5leHBvcnQgY2xhc3MgVHlwZVNjcmlwdCBleHRlbmRzIEVuZ2luZVBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHByaXZhdGUgc3RhdGljIEZJTEVOQU1FOiBzdHJpbmcgPSBcInRzY29uZmlnLmpzb25cIjtcblxuICAgIHB1YmxpYyBhc3luYyBwcm9jZXNzKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVEZXZEZXBlbmRlbmN5KFtcInR5cGVzY3JpcHRcIl0sIHVuaXRlQ29uZmlndXJhdGlvbi5zb3VyY2VMYW5ndWFnZSA9PT0gXCJUeXBlU2NyaXB0XCIpO1xuXG4gICAgICAgIGlmICh1bml0ZUNvbmZpZ3VyYXRpb24uc291cmNlTGFuZ3VhZ2UgPT09IFwiVHlwZVNjcmlwdFwiKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBHZW5lcmF0aW5nICR7VHlwZVNjcmlwdC5GSUxFTkFNRX1gLCB7IHd3d0ZvbGRlcjogZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIgfSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB0eXBlU2NyaXB0Q29uZmlndXJhdGlvbiA9IG5ldyBUeXBlU2NyaXB0Q29uZmlndXJhdGlvbigpO1xuICAgICAgICAgICAgICAgIHR5cGVTY3JpcHRDb25maWd1cmF0aW9uLmNvbXBpbGVyT3B0aW9ucyA9IG5ldyBUeXBlU2NyaXB0Q29tcGlsZXJPcHRpb25zKCk7XG5cbiAgICAgICAgICAgICAgICB0eXBlU2NyaXB0Q29uZmlndXJhdGlvbi5jb21waWxlck9wdGlvbnMudGFyZ2V0ID0gXCJlczVcIjtcbiAgICAgICAgICAgICAgICB0eXBlU2NyaXB0Q29uZmlndXJhdGlvbi5jb21waWxlck9wdGlvbnMubW9kdWxlUmVzb2x1dGlvbiA9IFwibm9kZVwiO1xuICAgICAgICAgICAgICAgIHR5cGVTY3JpcHRDb25maWd1cmF0aW9uLmNvbXBpbGVyT3B0aW9ucy5ub0ltcGxpY2l0QW55ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0eXBlU2NyaXB0Q29uZmlndXJhdGlvbi5jb21waWxlck9wdGlvbnMubm9JbXBsaWNpdFRoaXMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHR5cGVTY3JpcHRDb25maWd1cmF0aW9uLmNvbXBpbGVyT3B0aW9ucy5ub0ltcGxpY2l0UmV0dXJucyA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICB0eXBlU2NyaXB0Q29uZmlndXJhdGlvbi5jb21waWxlck9wdGlvbnMubGliID0gW1wiZG9tXCIsIFwiZXMyMDE1XCJdO1xuXG4gICAgICAgICAgICAgICAgaWYgKHVuaXRlQ29uZmlndXJhdGlvbi5tb2R1bGVUeXBlID09PSBcIkFNRFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGVTY3JpcHRDb25maWd1cmF0aW9uLmNvbXBpbGVyT3B0aW9ucy5tb2R1bGUgPSBcImFtZFwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodW5pdGVDb25maWd1cmF0aW9uLm1vZHVsZVR5cGUgPT09IFwiU3lzdGVtSlNcIikge1xuICAgICAgICAgICAgICAgICAgICB0eXBlU2NyaXB0Q29uZmlndXJhdGlvbi5jb21waWxlck9wdGlvbnMubW9kdWxlID0gXCJzeXN0ZW1cIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0eXBlU2NyaXB0Q29uZmlndXJhdGlvbi5jb21waWxlck9wdGlvbnMubW9kdWxlID0gXCJjb21tb25qc1wiO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IGFkZGl0aW9uYWw6IHsgW2lkOiBzdHJpbmddOiBhbnl9ID0ge307XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gZW5naW5lVmFyaWFibGVzLnRyYW5zcGlsZVByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVuZ2luZVZhcmlhYmxlcy50cmFuc3BpbGVQcm9wZXJ0aWVzW2tleV0ucmVxdWlyZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxba2V5XSA9IGVuZ2luZVZhcmlhYmxlcy50cmFuc3BpbGVQcm9wZXJ0aWVzW2tleV0ub2JqZWN0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24odHlwZVNjcmlwdENvbmZpZ3VyYXRpb24uY29tcGlsZXJPcHRpb25zLCBhZGRpdGlvbmFsKTtcblxuICAgICAgICAgICAgICAgIGF3YWl0IGZpbGVTeXN0ZW0uZmlsZVdyaXRlSnNvbihlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgVHlwZVNjcmlwdC5GSUxFTkFNRSwgdHlwZVNjcmlwdENvbmZpZ3VyYXRpb24pO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoYEdlbmVyYXRpbmcgJHtUeXBlU2NyaXB0LkZJTEVOQU1FfSBmYWlsZWRgLCBlcnIsIHsgd3d3Rm9sZGVyOiBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCBzdXBlci5kZWxldGVGaWxlKGxvZ2dlciwgZmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIFR5cGVTY3JpcHQuRklMRU5BTUUpO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19
