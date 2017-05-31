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
 * Pipeline step to generate babel configuration.
 */
const babelConfiguration_1 = require("../configuration/models/babel/babelConfiguration");
const enginePipelineStepBase_1 = require("../engine/enginePipelineStepBase");
class GenerateBabelConfiguration extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (engineVariables.uniteSourceLanguage === "JavaScript") {
                try {
                    _super("log").call(this, logger, display, "Generating .babelrc", { outputDirectory: uniteConfiguration.outputDirectory });
                    const babelConfiguration = new babelConfiguration_1.BabelConfiguration();
                    babelConfiguration.plugins = [];
                    engineVariables.requiredDevDependencies.push("babel-preset-es2015");
                    let modules = "";
                    if (engineVariables.uniteModuleLoader === "RequireJS") {
                        modules = "amd";
                    }
                    else if (engineVariables.uniteModuleLoader === "JSPM") {
                        modules = "systemjs";
                    }
                    else {
                        modules = "commonjs";
                    }
                    babelConfiguration.presets = [
                        ["es2015", { modules }]
                    ];
                    yield fileSystem.fileWriteJson(uniteConfiguration.outputDirectory, ".babelrc", babelConfiguration);
                    return 0;
                }
                catch (err) {
                    _super("error").call(this, logger, display, "Generating .babelrc failed", err, { outputDirectory: uniteConfiguration.outputDirectory });
                    return 1;
                }
            }
            return 0;
        });
    }
}
exports.GenerateBabelConfiguration = GenerateBabelConfiguration;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvZ2VuZXJhdGVCYWJlbENvbmZpZ3VyYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gseUZBQXNGO0FBRXRGLDZFQUEwRTtBQU0xRSxnQ0FBd0MsU0FBUSwrQ0FBc0I7SUFDckQsT0FBTyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUV0SixFQUFFLENBQUMsQ0FBQyxlQUFlLENBQUMsbUJBQW1CLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDdkQsSUFBSSxDQUFDO29CQUNELGFBQVMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLEVBQUUsZUFBZSxFQUFFLGtCQUFrQixDQUFDLGVBQWUsRUFBRSxFQUFFO29CQUUzRyxNQUFNLGtCQUFrQixHQUFHLElBQUksdUNBQWtCLEVBQUUsQ0FBQztvQkFDcEQsa0JBQWtCLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztvQkFFaEMsZUFBZSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO29CQUVwRSxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7b0JBQ2pCLEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxpQkFBaUIsS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDO3dCQUNwRCxPQUFPLEdBQUcsS0FBSyxDQUFDO29CQUNwQixDQUFDO29CQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxlQUFlLENBQUMsaUJBQWlCLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQzt3QkFDdEQsT0FBTyxHQUFHLFVBQVUsQ0FBQztvQkFDekIsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDSixPQUFPLEdBQUcsVUFBVSxDQUFDO29CQUN6QixDQUFDO29CQUNELGtCQUFrQixDQUFDLE9BQU8sR0FBRzt3QkFDRyxDQUFDLFFBQVEsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDO3FCQUN6QixDQUFDO29CQUUvQixNQUFNLFVBQVUsQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUMsZUFBZSxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO29CQUNuRyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7Z0JBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDWCxlQUFXLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxHQUFHLEVBQUUsRUFBRSxlQUFlLEVBQUUsa0JBQWtCLENBQUMsZUFBZSxFQUFFLEVBQUU7b0JBQ3pILE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztZQUNMLENBQUM7WUFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0NBQ0o7QUFsQ0QsZ0VBa0NDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvZ2VuZXJhdGVCYWJlbENvbmZpZ3VyYXRpb24uanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
