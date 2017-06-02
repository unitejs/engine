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
const typeScriptCompilerOptions_1 = require("../configuration/models/typeScript/typeScriptCompilerOptions");
const typeScriptConfiguration_1 = require("../configuration/models/typeScript/typeScriptConfiguration");
const enginePipelineStepBase_1 = require("../engine/enginePipelineStepBase");
class TypeScript extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (uniteConfiguration.sourceLanguage === "TypeScript") {
                try {
                    _super("log").call(this, logger, display, "Generating tsconfig.json", { outputDirectory: uniteConfiguration.outputDirectory });
                    const typeScriptConfiguration = new typeScriptConfiguration_1.TypeScriptConfiguration();
                    typeScriptConfiguration.compilerOptions = new typeScriptCompilerOptions_1.TypeScriptCompilerOptions();
                    typeScriptConfiguration.compilerOptions.target = "es5";
                    typeScriptConfiguration.compilerOptions.moduleResolution = "node";
                    typeScriptConfiguration.compilerOptions.strict = true;
                    if (uniteConfiguration.moduleLoader === "RequireJS") {
                        typeScriptConfiguration.compilerOptions.module = "amd";
                    }
                    else if (uniteConfiguration.moduleLoader === "JSPM") {
                        typeScriptConfiguration.compilerOptions.module = "system";
                    }
                    else {
                        typeScriptConfiguration.compilerOptions.module = "commonjs";
                    }
                    yield fileSystem.fileWriteJson(uniteConfiguration.outputDirectory, "tsconfig.json", typeScriptConfiguration);
                    return 0;
                }
                catch (err) {
                    _super("error").call(this, logger, display, "Generating tsconfig.json failed", err, { outputDirectory: uniteConfiguration.outputDirectory });
                    return 1;
                }
            }
            return 0;
        });
    }
}
exports.TypeScript = TypeScript;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvdHlwZVNjcmlwdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCw0R0FBeUc7QUFDekcsd0dBQXFHO0FBRXJHLDZFQUEwRTtBQU0xRSxnQkFBd0IsU0FBUSwrQ0FBc0I7SUFDckMsT0FBTyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUV0SixFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDckQsSUFBSSxDQUFDO29CQUNELGFBQVMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLDBCQUEwQixFQUFFLEVBQUUsZUFBZSxFQUFFLGtCQUFrQixDQUFDLGVBQWUsRUFBRSxFQUFFO29CQUVoSCxNQUFNLHVCQUF1QixHQUFHLElBQUksaURBQXVCLEVBQUUsQ0FBQztvQkFDOUQsdUJBQXVCLENBQUMsZUFBZSxHQUFHLElBQUkscURBQXlCLEVBQUUsQ0FBQztvQkFFMUUsdUJBQXVCLENBQUMsZUFBZSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7b0JBQ3ZELHVCQUF1QixDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsR0FBRyxNQUFNLENBQUM7b0JBQ2xFLHVCQUF1QixDQUFDLGVBQWUsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO29CQUV0RCxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQzt3QkFDbEQsdUJBQXVCLENBQUMsZUFBZSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7b0JBQzNELENBQUM7b0JBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLFlBQVksS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO3dCQUNwRCx1QkFBdUIsQ0FBQyxlQUFlLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQztvQkFDOUQsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDSix1QkFBdUIsQ0FBQyxlQUFlLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQztvQkFDaEUsQ0FBQztvQkFFRCxNQUFNLFVBQVUsQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUMsZUFBZSxFQUFFLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO29CQUM3RyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7Z0JBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDWCxlQUFXLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxpQ0FBaUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxlQUFlLEVBQUUsa0JBQWtCLENBQUMsZUFBZSxFQUFFLEVBQUU7b0JBQzlILE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztZQUNMLENBQUM7WUFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0NBQ0o7QUFoQ0QsZ0NBZ0NDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvdHlwZVNjcmlwdC5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMifQ==
