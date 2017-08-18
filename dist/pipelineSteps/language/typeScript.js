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
 * Pipeline step to generate TypeScript configuration.
 */
const objectHelper_1 = require("unitejs-framework/dist/helpers/objectHelper");
const typeScriptCompilerOptions_1 = require("../../configuration/models/typeScript/typeScriptCompilerOptions");
const typeScriptConfiguration_1 = require("../../configuration/models/typeScript/typeScriptConfiguration");
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class TypeScript extends enginePipelineStepBase_1.EnginePipelineStepBase {
    preProcess(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            if (uniteConfiguration.sourceLanguage === "TypeScript") {
                engineVariables.sourceLanguageExt = "ts";
                logger.info(`Initialising ${TypeScript.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });
                try {
                    const exists = yield fileSystem.fileExists(engineVariables.wwwRootFolder, TypeScript.FILENAME);
                    if (exists) {
                        this._configuration = yield fileSystem.fileReadJson(engineVariables.wwwRootFolder, TypeScript.FILENAME);
                    }
                }
                catch (err) {
                    logger.error(`Reading existing ${TypeScript.FILENAME} failed`, err);
                    return 1;
                }
                this.configDefaults(engineVariables);
            }
            return 0;
        });
    }
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["typescript"], uniteConfiguration.sourceLanguage === "TypeScript");
            if (uniteConfiguration.sourceLanguage === "TypeScript") {
                try {
                    logger.info(`Generating ${TypeScript.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });
                    yield fileSystem.fileWriteJson(engineVariables.wwwRootFolder, TypeScript.FILENAME, this._configuration);
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
    configDefaults(engineVariables) {
        const defaultConfiguration = new typeScriptConfiguration_1.TypeScriptConfiguration();
        defaultConfiguration.compilerOptions = new typeScriptCompilerOptions_1.TypeScriptCompilerOptions();
        defaultConfiguration.compilerOptions.target = "es5";
        defaultConfiguration.compilerOptions.moduleResolution = "node";
        defaultConfiguration.compilerOptions.noImplicitAny = true;
        defaultConfiguration.compilerOptions.noImplicitThis = true;
        defaultConfiguration.compilerOptions.noImplicitReturns = true;
        defaultConfiguration.compilerOptions.lib = ["dom", "es2015"];
        this._configuration = objectHelper_1.ObjectHelper.merge(defaultConfiguration, this._configuration);
        engineVariables.setConfiguration("TypeScript", this._configuration);
    }
}
TypeScript.FILENAME = "tsconfig.json";
exports.TypeScript = TypeScript;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2xhbmd1YWdlL3R5cGVTY3JpcHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsOEVBQTJFO0FBRzNFLCtHQUE0RztBQUM1RywyR0FBd0c7QUFFeEcsZ0ZBQTZFO0FBRzdFLGdCQUF3QixTQUFRLCtDQUFzQjtJQUtyQyxVQUFVLENBQUMsTUFBZSxFQUNmLFVBQXVCLEVBQ3ZCLGtCQUFzQyxFQUN0QyxlQUFnQzs7WUFDcEQsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsY0FBYyxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQ3JELGVBQWUsQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7Z0JBRXpDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLFVBQVUsQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxlQUFlLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztnQkFFakcsSUFBSSxDQUFDO29CQUNELE1BQU0sTUFBTSxHQUFHLE1BQU0sVUFBVSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDL0YsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzt3QkFDVCxJQUFJLENBQUMsY0FBYyxHQUFHLE1BQU0sVUFBVSxDQUFDLFlBQVksQ0FBMEIsZUFBZSxDQUFDLGFBQWEsRUFBRSxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ3JJLENBQUM7Z0JBQ0wsQ0FBQztnQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsb0JBQW9CLFVBQVUsQ0FBQyxRQUFRLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDcEUsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUVELElBQUksQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDekMsQ0FBQztZQUNELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7SUFFWSxPQUFPLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUNuSSxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxZQUFZLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxjQUFjLEtBQUssWUFBWSxDQUFDLENBQUM7WUFFeEcsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsY0FBYyxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQ3JELElBQUksQ0FBQztvQkFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsVUFBVSxDQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLGVBQWUsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO29CQUUvRixNQUFNLFVBQVUsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxVQUFVLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztvQkFFeEcsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsTUFBTSxDQUFDLEtBQUssQ0FBQyxjQUFjLFVBQVUsQ0FBQyxRQUFRLFNBQVMsRUFBRSxHQUFHLEVBQUUsRUFBRSxTQUFTLEVBQUUsZUFBZSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7b0JBQzVHLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztZQUNMLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixNQUFNLENBQUMsTUFBTSxvQkFBZ0IsWUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGVBQWUsQ0FBQyxhQUFhLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzFHLENBQUM7UUFDTCxDQUFDO0tBQUE7SUFFTyxjQUFjLENBQUMsZUFBZ0M7UUFDbkQsTUFBTSxvQkFBb0IsR0FBRyxJQUFJLGlEQUF1QixFQUFFLENBQUM7UUFFM0Qsb0JBQW9CLENBQUMsZUFBZSxHQUFHLElBQUkscURBQXlCLEVBQUUsQ0FBQztRQUV2RSxvQkFBb0IsQ0FBQyxlQUFlLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUNwRCxvQkFBb0IsQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLEdBQUcsTUFBTSxDQUFDO1FBQy9ELG9CQUFvQixDQUFDLGVBQWUsQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1FBQzFELG9CQUFvQixDQUFDLGVBQWUsQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO1FBQzNELG9CQUFvQixDQUFDLGVBQWUsQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7UUFFOUQsb0JBQW9CLENBQUMsZUFBZSxDQUFDLEdBQUcsR0FBRyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztRQUU3RCxJQUFJLENBQUMsY0FBYyxHQUFHLDJCQUFZLENBQUMsS0FBSyxDQUFDLG9CQUFvQixFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUVwRixlQUFlLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUN4RSxDQUFDOztBQS9EYyxtQkFBUSxHQUFXLGVBQWUsQ0FBQztBQUR0RCxnQ0FpRUMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9sYW5ndWFnZS90eXBlU2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIHRvIGdlbmVyYXRlIFR5cGVTY3JpcHQgY29uZmlndXJhdGlvbi5cbiAqL1xuaW1wb3J0IHsgT2JqZWN0SGVscGVyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaGVscGVycy9vYmplY3RIZWxwZXJcIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgVHlwZVNjcmlwdENvbXBpbGVyT3B0aW9ucyB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy90eXBlU2NyaXB0L3R5cGVTY3JpcHRDb21waWxlck9wdGlvbnNcIjtcbmltcG9ydCB7IFR5cGVTY3JpcHRDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3R5cGVTY3JpcHQvdHlwZVNjcmlwdENvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZVBpcGVsaW5lU3RlcEJhc2UgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVBpcGVsaW5lU3RlcEJhc2VcIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5cbmV4cG9ydCBjbGFzcyBUeXBlU2NyaXB0IGV4dGVuZHMgRW5naW5lUGlwZWxpbmVTdGVwQmFzZSB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgRklMRU5BTUU6IHN0cmluZyA9IFwidHNjb25maWcuanNvblwiO1xuXG4gICAgcHJpdmF0ZSBfY29uZmlndXJhdGlvbjogVHlwZVNjcmlwdENvbmZpZ3VyYXRpb247XG5cbiAgICBwdWJsaWMgYXN5bmMgcHJlUHJvY2Vzcyhsb2dnZXI6IElMb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBpZiAodW5pdGVDb25maWd1cmF0aW9uLnNvdXJjZUxhbmd1YWdlID09PSBcIlR5cGVTY3JpcHRcIikge1xuICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLnNvdXJjZUxhbmd1YWdlRXh0ID0gXCJ0c1wiO1xuXG4gICAgICAgICAgICBsb2dnZXIuaW5mbyhgSW5pdGlhbGlzaW5nICR7VHlwZVNjcmlwdC5GSUxFTkFNRX1gLCB7IHd3d0ZvbGRlcjogZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIgfSk7XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXhpc3RzID0gYXdhaXQgZmlsZVN5c3RlbS5maWxlRXhpc3RzKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBUeXBlU2NyaXB0LkZJTEVOQU1FKTtcbiAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24gPSBhd2FpdCBmaWxlU3lzdGVtLmZpbGVSZWFkSnNvbjxUeXBlU2NyaXB0Q29uZmlndXJhdGlvbj4oZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIFR5cGVTY3JpcHQuRklMRU5BTUUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgUmVhZGluZyBleGlzdGluZyAke1R5cGVTY3JpcHQuRklMRU5BTUV9IGZhaWxlZGAsIGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuY29uZmlnRGVmYXVsdHMoZW5naW5lVmFyaWFibGVzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgcHJvY2Vzcyhsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJ0eXBlc2NyaXB0XCJdLCB1bml0ZUNvbmZpZ3VyYXRpb24uc291cmNlTGFuZ3VhZ2UgPT09IFwiVHlwZVNjcmlwdFwiKTtcblxuICAgICAgICBpZiAodW5pdGVDb25maWd1cmF0aW9uLnNvdXJjZUxhbmd1YWdlID09PSBcIlR5cGVTY3JpcHRcIikge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgR2VuZXJhdGluZyAke1R5cGVTY3JpcHQuRklMRU5BTUV9YCwgeyB3d3dGb2xkZXI6IGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyIH0pO1xuXG4gICAgICAgICAgICAgICAgYXdhaXQgZmlsZVN5c3RlbS5maWxlV3JpdGVKc29uKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBUeXBlU2NyaXB0LkZJTEVOQU1FLCB0aGlzLl9jb25maWd1cmF0aW9uKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBHZW5lcmF0aW5nICR7VHlwZVNjcmlwdC5GSUxFTkFNRX0gZmFpbGVkYCwgZXJyLCB7IHd3d0ZvbGRlcjogZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgc3VwZXIuZGVsZXRlRmlsZShsb2dnZXIsIGZpbGVTeXN0ZW0sIGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBUeXBlU2NyaXB0LkZJTEVOQU1FKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgY29uZmlnRGVmYXVsdHMoZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZGVmYXVsdENvbmZpZ3VyYXRpb24gPSBuZXcgVHlwZVNjcmlwdENvbmZpZ3VyYXRpb24oKTtcblxuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5jb21waWxlck9wdGlvbnMgPSBuZXcgVHlwZVNjcmlwdENvbXBpbGVyT3B0aW9ucygpO1xuXG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmNvbXBpbGVyT3B0aW9ucy50YXJnZXQgPSBcImVzNVwiO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5jb21waWxlck9wdGlvbnMubW9kdWxlUmVzb2x1dGlvbiA9IFwibm9kZVwiO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5jb21waWxlck9wdGlvbnMubm9JbXBsaWNpdEFueSA9IHRydWU7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmNvbXBpbGVyT3B0aW9ucy5ub0ltcGxpY2l0VGhpcyA9IHRydWU7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmNvbXBpbGVyT3B0aW9ucy5ub0ltcGxpY2l0UmV0dXJucyA9IHRydWU7XG5cbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uY29tcGlsZXJPcHRpb25zLmxpYiA9IFtcImRvbVwiLCBcImVzMjAxNVwiXTtcblxuICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uID0gT2JqZWN0SGVscGVyLm1lcmdlKGRlZmF1bHRDb25maWd1cmF0aW9uLCB0aGlzLl9jb25maWd1cmF0aW9uKTtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuc2V0Q29uZmlndXJhdGlvbihcIlR5cGVTY3JpcHRcIiwgdGhpcy5fY29uZmlndXJhdGlvbik7XG4gICAgfVxufVxuIl19
