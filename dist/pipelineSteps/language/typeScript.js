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
            engineVariables.toggleDependencies(["typescript"], uniteConfiguration.sourceLanguage === "TypeScript", true);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9waXBlbGluZVN0ZXBzL2xhbmd1YWdlL3R5cGVTY3JpcHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsK0dBQTRHO0FBQzVHLDJHQUF3RztBQUV4RyxnRkFBNkU7QUFNN0UsZ0JBQXdCLFNBQVEsK0NBQXNCO0lBR3JDLE9BQU8sQ0FBQyxNQUFlLEVBQUUsT0FBaUIsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDdEosZUFBZSxDQUFDLGtCQUFrQixDQUFDLENBQUMsWUFBWSxDQUFDLEVBQUUsa0JBQWtCLENBQUMsY0FBYyxLQUFLLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUU3RyxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDckQsSUFBSSxDQUFDO29CQUNELGFBQVMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGNBQWMsVUFBVSxDQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLGVBQWUsQ0FBQyxVQUFVLEVBQUUsRUFBRTtvQkFFNUcsTUFBTSx1QkFBdUIsR0FBRyxJQUFJLGlEQUF1QixFQUFFLENBQUM7b0JBQzlELHVCQUF1QixDQUFDLGVBQWUsR0FBRyxJQUFJLHFEQUF5QixFQUFFLENBQUM7b0JBRTFFLHVCQUF1QixDQUFDLGVBQWUsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO29CQUN2RCx1QkFBdUIsQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLEdBQUcsTUFBTSxDQUFDO29CQUNsRSx1QkFBdUIsQ0FBQyxlQUFlLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztvQkFDN0QsdUJBQXVCLENBQUMsZUFBZSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7b0JBQzlELHVCQUF1QixDQUFDLGVBQWUsQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7b0JBRWpFLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO3dCQUMxQyx1QkFBdUIsQ0FBQyxlQUFlLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztvQkFDM0QsQ0FBQztvQkFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsVUFBVSxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUM7d0JBQ3RELHVCQUF1QixDQUFDLGVBQWUsQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDO29CQUM5RCxDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNKLHVCQUF1QixDQUFDLGVBQWUsQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDO29CQUNoRSxDQUFDO29CQUVELE1BQU0sVUFBVSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxRQUFRLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztvQkFDekcsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsZUFBVyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsY0FBYyxVQUFVLENBQUMsUUFBUSxTQUFTLEVBQUUsR0FBRyxFQUFFLEVBQUUsVUFBVSxFQUFFLGVBQWUsQ0FBQyxVQUFVLEVBQUUsRUFBRTtvQkFDMUgsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO1lBQ0wsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLE1BQU0sQ0FBQyxNQUFNLG9CQUFnQixZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLGVBQWUsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2hILENBQUM7UUFDTCxDQUFDO0tBQUE7O0FBbkNjLG1CQUFRLEdBQVcsZUFBZSxDQUFDO0FBRHRELGdDQXFDQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2xhbmd1YWdlL3R5cGVTY3JpcHQuanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
