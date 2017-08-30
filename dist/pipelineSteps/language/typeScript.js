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
    initialise(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (_super("condition").call(this, uniteConfiguration.sourceLanguage, "TypeScript")) {
                engineVariables.sourceLanguageExt = "ts";
                logger.info(`Initialising ${TypeScript.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });
                if (!engineVariables.force) {
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
                }
                this.configDefaults(engineVariables);
            }
            return 0;
        });
    }
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["typescript", "unitejs-types"], _super("condition").call(this, uniteConfiguration.sourceLanguage, "TypeScript"));
            if (_super("condition").call(this, uniteConfiguration.sourceLanguage, "TypeScript")) {
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
                return yield _super("deleteFile").call(this, logger, fileSystem, engineVariables.wwwRootFolder, TypeScript.FILENAME, engineVariables.force);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2xhbmd1YWdlL3R5cGVTY3JpcHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsOEVBQTJFO0FBRzNFLCtHQUE0RztBQUM1RywyR0FBd0c7QUFFeEcsZ0ZBQTZFO0FBRzdFLGdCQUF3QixTQUFRLCtDQUFzQjtJQUtyQyxVQUFVLENBQUMsTUFBZSxFQUNmLFVBQXVCLEVBQ3ZCLGtCQUFzQyxFQUN0QyxlQUFnQzs7O1lBQ3BELEVBQUUsQ0FBQyxDQUFDLG1CQUFlLFlBQUMsa0JBQWtCLENBQUMsY0FBYyxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkUsZUFBZSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQztnQkFFekMsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsVUFBVSxDQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLGVBQWUsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO2dCQUVqRyxFQUFFLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUN6QixJQUFJLENBQUM7d0JBQ0QsTUFBTSxNQUFNLEdBQUcsTUFBTSxVQUFVLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxhQUFhLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO3dCQUMvRixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDOzRCQUNULElBQUksQ0FBQyxjQUFjLEdBQUcsTUFBTSxVQUFVLENBQUMsWUFBWSxDQUEwQixlQUFlLENBQUMsYUFBYSxFQUFFLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQzt3QkFDckksQ0FBQztvQkFDTCxDQUFDO29CQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ1gsTUFBTSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsVUFBVSxDQUFDLFFBQVEsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUNwRSxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUNiLENBQUM7Z0JBQ0wsQ0FBQztnQkFFRCxJQUFJLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ3pDLENBQUM7WUFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0lBRVksT0FBTyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDbkksZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsWUFBWSxFQUFFLGVBQWUsQ0FBQyxFQUFFLG1CQUFlLFlBQUMsa0JBQWtCLENBQUMsY0FBYyxFQUFFLFlBQVksRUFBRSxDQUFDO1lBRXZJLEVBQUUsQ0FBQyxDQUFDLG1CQUFlLFlBQUMsa0JBQWtCLENBQUMsY0FBYyxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkUsSUFBSSxDQUFDO29CQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxVQUFVLENBQUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsZUFBZSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7b0JBRS9GLE1BQU0sVUFBVSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFLFVBQVUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO29CQUV4RyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7Z0JBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDWCxNQUFNLENBQUMsS0FBSyxDQUFDLGNBQWMsVUFBVSxDQUFDLFFBQVEsU0FBUyxFQUFFLEdBQUcsRUFBRSxFQUFFLFNBQVMsRUFBRSxlQUFlLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztvQkFDNUcsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO1lBQ0wsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLE1BQU0sQ0FBQyxNQUFNLG9CQUFnQixZQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsZUFBZSxDQUFDLGFBQWEsRUFBRSxVQUFVLENBQUMsUUFBUSxFQUFFLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNqSSxDQUFDO1FBQ0wsQ0FBQztLQUFBO0lBRU8sY0FBYyxDQUFDLGVBQWdDO1FBQ25ELE1BQU0sb0JBQW9CLEdBQUcsSUFBSSxpREFBdUIsRUFBRSxDQUFDO1FBRTNELG9CQUFvQixDQUFDLGVBQWUsR0FBRyxJQUFJLHFEQUF5QixFQUFFLENBQUM7UUFFdkUsb0JBQW9CLENBQUMsZUFBZSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDcEQsb0JBQW9CLENBQUMsZUFBZSxDQUFDLGdCQUFnQixHQUFHLE1BQU0sQ0FBQztRQUMvRCxvQkFBb0IsQ0FBQyxlQUFlLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztRQUMxRCxvQkFBb0IsQ0FBQyxlQUFlLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztRQUMzRCxvQkFBb0IsQ0FBQyxlQUFlLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO1FBRTlELG9CQUFvQixDQUFDLGVBQWUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFN0QsSUFBSSxDQUFDLGNBQWMsR0FBRywyQkFBWSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFcEYsZUFBZSxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDeEUsQ0FBQzs7QUFqRWMsbUJBQVEsR0FBVyxlQUFlLENBQUM7QUFEdEQsZ0NBbUVDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvbGFuZ3VhZ2UvdHlwZVNjcmlwdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgc3RlcCB0byBnZW5lcmF0ZSBUeXBlU2NyaXB0IGNvbmZpZ3VyYXRpb24uXG4gKi9cbmltcG9ydCB7IE9iamVjdEhlbHBlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvb2JqZWN0SGVscGVyXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IFR5cGVTY3JpcHRDb21waWxlck9wdGlvbnMgfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdHlwZVNjcmlwdC90eXBlU2NyaXB0Q29tcGlsZXJPcHRpb25zXCI7XG5pbXBvcnQgeyBUeXBlU2NyaXB0Q29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy90eXBlU2NyaXB0L3R5cGVTY3JpcHRDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVQaXBlbGluZVN0ZXBCYXNlXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuXG5leHBvcnQgY2xhc3MgVHlwZVNjcmlwdCBleHRlbmRzIEVuZ2luZVBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHByaXZhdGUgc3RhdGljIEZJTEVOQU1FOiBzdHJpbmcgPSBcInRzY29uZmlnLmpzb25cIjtcblxuICAgIHByaXZhdGUgX2NvbmZpZ3VyYXRpb246IFR5cGVTY3JpcHRDb25maWd1cmF0aW9uO1xuXG4gICAgcHVibGljIGFzeW5jIGluaXRpYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgaWYgKHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uc291cmNlTGFuZ3VhZ2UsIFwiVHlwZVNjcmlwdFwiKSkge1xuICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLnNvdXJjZUxhbmd1YWdlRXh0ID0gXCJ0c1wiO1xuXG4gICAgICAgICAgICBsb2dnZXIuaW5mbyhgSW5pdGlhbGlzaW5nICR7VHlwZVNjcmlwdC5GSUxFTkFNRX1gLCB7IHd3d0ZvbGRlcjogZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIgfSk7XG5cbiAgICAgICAgICAgIGlmICghZW5naW5lVmFyaWFibGVzLmZvcmNlKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXhpc3RzID0gYXdhaXQgZmlsZVN5c3RlbS5maWxlRXhpc3RzKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBUeXBlU2NyaXB0LkZJTEVOQU1FKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV4aXN0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY29uZmlndXJhdGlvbiA9IGF3YWl0IGZpbGVTeXN0ZW0uZmlsZVJlYWRKc29uPFR5cGVTY3JpcHRDb25maWd1cmF0aW9uPihlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgVHlwZVNjcmlwdC5GSUxFTkFNRSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBSZWFkaW5nIGV4aXN0aW5nICR7VHlwZVNjcmlwdC5GSUxFTkFNRX0gZmFpbGVkYCwgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmNvbmZpZ0RlZmF1bHRzKGVuZ2luZVZhcmlhYmxlcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIHByb2Nlc3MobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1widHlwZXNjcmlwdFwiLCBcInVuaXRlanMtdHlwZXNcIl0sIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uc291cmNlTGFuZ3VhZ2UsIFwiVHlwZVNjcmlwdFwiKSk7XG5cbiAgICAgICAgaWYgKHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uc291cmNlTGFuZ3VhZ2UsIFwiVHlwZVNjcmlwdFwiKSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgR2VuZXJhdGluZyAke1R5cGVTY3JpcHQuRklMRU5BTUV9YCwgeyB3d3dGb2xkZXI6IGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyIH0pO1xuXG4gICAgICAgICAgICAgICAgYXdhaXQgZmlsZVN5c3RlbS5maWxlV3JpdGVKc29uKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBUeXBlU2NyaXB0LkZJTEVOQU1FLCB0aGlzLl9jb25maWd1cmF0aW9uKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBHZW5lcmF0aW5nICR7VHlwZVNjcmlwdC5GSUxFTkFNRX0gZmFpbGVkYCwgZXJyLCB7IHd3d0ZvbGRlcjogZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgc3VwZXIuZGVsZXRlRmlsZShsb2dnZXIsIGZpbGVTeXN0ZW0sIGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBUeXBlU2NyaXB0LkZJTEVOQU1FLCBlbmdpbmVWYXJpYWJsZXMuZm9yY2UpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjb25maWdEZWZhdWx0cyhlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IHZvaWQge1xuICAgICAgICBjb25zdCBkZWZhdWx0Q29uZmlndXJhdGlvbiA9IG5ldyBUeXBlU2NyaXB0Q29uZmlndXJhdGlvbigpO1xuXG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmNvbXBpbGVyT3B0aW9ucyA9IG5ldyBUeXBlU2NyaXB0Q29tcGlsZXJPcHRpb25zKCk7XG5cbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uY29tcGlsZXJPcHRpb25zLnRhcmdldCA9IFwiZXM1XCI7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmNvbXBpbGVyT3B0aW9ucy5tb2R1bGVSZXNvbHV0aW9uID0gXCJub2RlXCI7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmNvbXBpbGVyT3B0aW9ucy5ub0ltcGxpY2l0QW55ID0gdHJ1ZTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uY29tcGlsZXJPcHRpb25zLm5vSW1wbGljaXRUaGlzID0gdHJ1ZTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uY29tcGlsZXJPcHRpb25zLm5vSW1wbGljaXRSZXR1cm5zID0gdHJ1ZTtcblxuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5jb21waWxlck9wdGlvbnMubGliID0gW1wiZG9tXCIsIFwiZXMyMDE1XCJdO1xuXG4gICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24gPSBPYmplY3RIZWxwZXIubWVyZ2UoZGVmYXVsdENvbmZpZ3VyYXRpb24sIHRoaXMuX2NvbmZpZ3VyYXRpb24pO1xuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5zZXRDb25maWd1cmF0aW9uKFwiVHlwZVNjcmlwdFwiLCB0aGlzLl9jb25maWd1cmF0aW9uKTtcbiAgICB9XG59XG4iXX0=
