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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2xhbmd1YWdlL3R5cGVTY3JpcHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUtBLCtHQUE0RztBQUM1RywyR0FBd0c7QUFFeEcsZ0ZBQTZFO0FBRzdFLGdCQUF3QixTQUFRLCtDQUFzQjtJQUdyQyxPQUFPLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUNuSSxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxZQUFZLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxjQUFjLEtBQUssWUFBWSxDQUFDLENBQUM7WUFFeEcsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsY0FBYyxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQ3JELElBQUksQ0FBQztvQkFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsVUFBVSxDQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLGVBQWUsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO29CQUUvRixNQUFNLHVCQUF1QixHQUFHLElBQUksaURBQXVCLEVBQUUsQ0FBQztvQkFDOUQsdUJBQXVCLENBQUMsZUFBZSxHQUFHLElBQUkscURBQXlCLEVBQUUsQ0FBQztvQkFFMUUsdUJBQXVCLENBQUMsZUFBZSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7b0JBQ3ZELHVCQUF1QixDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsR0FBRyxNQUFNLENBQUM7b0JBQ2xFLHVCQUF1QixDQUFDLGVBQWUsQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO29CQUM3RCx1QkFBdUIsQ0FBQyxlQUFlLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztvQkFDOUQsdUJBQXVCLENBQUMsZUFBZSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQztvQkFFakUsdUJBQXVCLENBQUMsZUFBZSxDQUFDLEdBQUcsR0FBRyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztvQkFFaEUsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsVUFBVSxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7d0JBQzFDLHVCQUF1QixDQUFDLGVBQWUsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO29CQUMzRCxDQUFDO29CQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQzt3QkFDdEQsdUJBQXVCLENBQUMsZUFBZSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUM7b0JBQzlELENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osdUJBQXVCLENBQUMsZUFBZSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUM7b0JBQ2hFLENBQUM7b0JBRUQsTUFBTSxVQUFVLEdBQXlCLEVBQUUsQ0FBQztvQkFDNUMsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLElBQUksZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQzt3QkFDcEQsRUFBRSxDQUFDLENBQUMsZUFBZSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7NEJBQ3BELFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxlQUFlLENBQUMsbUJBQW1CLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO3dCQUN0RSxDQUFDO29CQUNMLENBQUM7b0JBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxlQUFlLEVBQUUsVUFBVSxDQUFDLENBQUM7b0JBRW5FLE1BQU0sVUFBVSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFLFVBQVUsQ0FBQyxRQUFRLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztvQkFFNUcsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsTUFBTSxDQUFDLEtBQUssQ0FBQyxjQUFjLFVBQVUsQ0FBQyxRQUFRLFNBQVMsRUFBRSxHQUFHLEVBQUUsRUFBRSxTQUFTLEVBQUUsZUFBZSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7b0JBQzVHLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztZQUNMLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixNQUFNLENBQUMsTUFBTSxvQkFBZ0IsWUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGVBQWUsQ0FBQyxhQUFhLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzFHLENBQUM7UUFDTCxDQUFDO0tBQUE7O0FBOUNjLG1CQUFRLEdBQVcsZUFBZSxDQUFDO0FBRHRELGdDQWdEQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2xhbmd1YWdlL3R5cGVTY3JpcHQuanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
