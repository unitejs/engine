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
const typeScriptCompilerOptions_1 = require("../../configuration/models/typeScript/typeScriptCompilerOptions");
const typeScriptConfiguration_1 = require("../../configuration/models/typeScript/typeScriptConfiguration");
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class TypeScript extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["typescript"], uniteConfiguration.sourceLanguage === "TypeScript");
            if (uniteConfiguration.sourceLanguage === "TypeScript") {
                try {
                    _super("log").call(this, logger, display, `Generating ${TypeScript.FILENAME}`, { rootFolder: engineVariables.rootFolder });
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
                    yield fileSystem.fileWriteJson(engineVariables.rootFolder, TypeScript.FILENAME, typeScriptConfiguration);
                    return 0;
                }
                catch (err) {
                    _super("error").call(this, logger, display, `Generating ${TypeScript.FILENAME} failed`, err, { rootFolder: engineVariables.rootFolder });
                    return 1;
                }
            }
            else {
                return yield _super("deleteFile").call(this, logger, display, fileSystem, engineVariables.rootFolder, TypeScript.FILENAME);
            }
        });
    }
}
TypeScript.FILENAME = "tsconfig.json";
exports.TypeScript = TypeScript;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9waXBlbGluZVN0ZXBzL2xhbmd1YWdlL3R5cGVTY3JpcHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsK0dBQTRHO0FBQzVHLDJHQUF3RztBQUV4RyxnRkFBNkU7QUFNN0UsZ0JBQXdCLFNBQVEsK0NBQXNCO0lBR3JDLE9BQU8sQ0FBQyxNQUFlLEVBQUUsT0FBaUIsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDdEosZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsWUFBWSxDQUFDLEVBQUUsa0JBQWtCLENBQUMsY0FBYyxLQUFLLFlBQVksQ0FBQyxDQUFDO1lBRXhHLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLGNBQWMsS0FBSyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUNyRCxJQUFJLENBQUM7b0JBQ0QsYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsY0FBYyxVQUFVLENBQUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsZUFBZSxDQUFDLFVBQVUsRUFBRSxFQUFFO29CQUU1RyxNQUFNLHVCQUF1QixHQUFHLElBQUksaURBQXVCLEVBQUUsQ0FBQztvQkFDOUQsdUJBQXVCLENBQUMsZUFBZSxHQUFHLElBQUkscURBQXlCLEVBQUUsQ0FBQztvQkFFMUUsdUJBQXVCLENBQUMsZUFBZSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7b0JBQ3ZELHVCQUF1QixDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsR0FBRyxNQUFNLENBQUM7b0JBQ2xFLHVCQUF1QixDQUFDLGVBQWUsQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO29CQUM3RCx1QkFBdUIsQ0FBQyxlQUFlLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztvQkFDOUQsdUJBQXVCLENBQUMsZUFBZSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQztvQkFFakUsdUJBQXVCLENBQUMsZUFBZSxDQUFDLEdBQUcsR0FBRyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztvQkFFaEUsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsVUFBVSxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7d0JBQzFDLHVCQUF1QixDQUFDLGVBQWUsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO29CQUMzRCxDQUFDO29CQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQzt3QkFDdEQsdUJBQXVCLENBQUMsZUFBZSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUM7b0JBQzlELENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osdUJBQXVCLENBQUMsZUFBZSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUM7b0JBQ2hFLENBQUM7b0JBRUQsTUFBTSxVQUFVLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLFFBQVEsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO29CQUN6RyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7Z0JBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDWCxlQUFXLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxjQUFjLFVBQVUsQ0FBQyxRQUFRLFNBQVMsRUFBRSxHQUFHLEVBQUUsRUFBRSxVQUFVLEVBQUUsZUFBZSxDQUFDLFVBQVUsRUFBRSxFQUFFO29CQUMxSCxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7WUFDTCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osTUFBTSxDQUFDLE1BQU0sb0JBQWdCLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsZUFBZSxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDaEgsQ0FBQztRQUNMLENBQUM7S0FBQTs7QUFyQ2MsbUJBQVEsR0FBVyxlQUFlLENBQUM7QUFEdEQsZ0NBdUNDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvbGFuZ3VhZ2UvdHlwZVNjcmlwdC5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMifQ==
