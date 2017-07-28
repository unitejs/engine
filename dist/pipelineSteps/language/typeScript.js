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
                    const additional = {};
                    for (const key in engineVariables.transpileProperties) {
                        if (engineVariables.transpileProperties[key].required) {
                            additional[key] = engineVariables.transpileProperties[key].object;
                        }
                    }
                    Object.assign(typeScriptConfiguration.compilerOptions, additional);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2xhbmd1YWdlL3R5cGVTY3JpcHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQU1BLCtHQUE0RztBQUM1RywyR0FBd0c7QUFFeEcsZ0ZBQTZFO0FBRzdFLGdCQUF3QixTQUFRLCtDQUFzQjtJQUdyQyxPQUFPLENBQUMsTUFBZSxFQUFFLE9BQWlCLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQ3RKLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLFlBQVksQ0FBQyxFQUFFLGtCQUFrQixDQUFDLGNBQWMsS0FBSyxZQUFZLENBQUMsQ0FBQztZQUV4RyxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDckQsSUFBSSxDQUFDO29CQUNELGFBQVMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGNBQWMsVUFBVSxDQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLGVBQWUsQ0FBQyxVQUFVLEVBQUUsRUFBRTtvQkFFNUcsTUFBTSx1QkFBdUIsR0FBRyxJQUFJLGlEQUF1QixFQUFFLENBQUM7b0JBQzlELHVCQUF1QixDQUFDLGVBQWUsR0FBRyxJQUFJLHFEQUF5QixFQUFFLENBQUM7b0JBRTFFLHVCQUF1QixDQUFDLGVBQWUsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO29CQUN2RCx1QkFBdUIsQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLEdBQUcsTUFBTSxDQUFDO29CQUNsRSx1QkFBdUIsQ0FBQyxlQUFlLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztvQkFDN0QsdUJBQXVCLENBQUMsZUFBZSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7b0JBQzlELHVCQUF1QixDQUFDLGVBQWUsQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7b0JBRWpFLHVCQUF1QixDQUFDLGVBQWUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7b0JBRWhFLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO3dCQUMxQyx1QkFBdUIsQ0FBQyxlQUFlLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztvQkFDM0QsQ0FBQztvQkFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsVUFBVSxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUM7d0JBQ3RELHVCQUF1QixDQUFDLGVBQWUsQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDO29CQUM5RCxDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNKLHVCQUF1QixDQUFDLGVBQWUsQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDO29CQUNoRSxDQUFDO29CQUVELE1BQU0sVUFBVSxHQUF5QixFQUFFLENBQUM7b0JBQzVDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sR0FBRyxJQUFJLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7d0JBQ3BELEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDOzRCQUNwRCxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsZUFBZSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQzt3QkFDdEUsQ0FBQztvQkFDTCxDQUFDO29CQUNELE1BQU0sQ0FBQyxNQUFNLENBQUMsdUJBQXVCLENBQUMsZUFBZSxFQUFFLFVBQVUsQ0FBQyxDQUFDO29CQUVuRSxNQUFNLFVBQVUsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsUUFBUSxFQUFFLHVCQUF1QixDQUFDLENBQUM7b0JBRXpHLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztnQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNYLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGNBQWMsVUFBVSxDQUFDLFFBQVEsU0FBUyxFQUFFLEdBQUcsRUFBRSxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsVUFBVSxFQUFFLEVBQUU7b0JBQzFILE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztZQUNMLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixNQUFNLENBQUMsTUFBTSxvQkFBZ0IsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNoSCxDQUFDO1FBQ0wsQ0FBQztLQUFBOztBQTlDYyxtQkFBUSxHQUFXLGVBQWUsQ0FBQztBQUR0RCxnQ0FnREMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9sYW5ndWFnZS90eXBlU2NyaXB0LmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
