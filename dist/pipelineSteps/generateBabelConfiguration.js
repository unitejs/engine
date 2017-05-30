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
const uniteLanguage_1 = require("../configuration/models/unite/uniteLanguage");
const uniteModuleLoader_1 = require("../configuration/models/unite/uniteModuleLoader");
const enginePipelineStepBase_1 = require("../engine/enginePipelineStepBase");
class GenerateBabelConfiguration extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (engineVariables.uniteLanguage === uniteLanguage_1.UniteLanguage.ES5 || engineVariables.uniteLanguage === uniteLanguage_1.UniteLanguage.ES6) {
                try {
                    _super("log").call(this, logger, display, "Generating .babelrc", { outputDirectory: uniteConfiguration.outputDirectory });
                    uniteConfiguration.devDependencies["gulp-babel"] = "^6.1.2";
                    const babelConfiguration = new babelConfiguration_1.BabelConfiguration();
                    babelConfiguration.plugins = [];
                    uniteConfiguration.devDependencies["babel-preset-es2015"] = "^6.24.1";
                    let modules = "";
                    if (engineVariables.uniteModuleLoader === uniteModuleLoader_1.UniteModuleLoader.RequireJS) {
                        modules = "amd";
                    }
                    else if (engineVariables.uniteModuleLoader === uniteModuleLoader_1.UniteModuleLoader.JSPM) {
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvZ2VuZXJhdGVCYWJlbENvbmZpZ3VyYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gseUZBQXNGO0FBRXRGLCtFQUE0RTtBQUM1RSx1RkFBb0Y7QUFDcEYsNkVBQTBFO0FBTTFFLGdDQUF3QyxTQUFRLCtDQUFzQjtJQUNyRCxPQUFPLENBQUMsTUFBZSxFQUFFLE9BQWlCLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBRXRKLEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxhQUFhLEtBQUssNkJBQWEsQ0FBQyxHQUFHLElBQUksZUFBZSxDQUFDLGFBQWEsS0FBSyw2QkFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQzdHLElBQUksQ0FBQztvQkFDRCxhQUFTLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxFQUFFLGVBQWUsRUFBRSxrQkFBa0IsQ0FBQyxlQUFlLEVBQUUsRUFBRTtvQkFFM0csa0JBQWtCLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxHQUFHLFFBQVEsQ0FBQztvQkFFNUQsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLHVDQUFrQixFQUFFLENBQUM7b0JBQ3BELGtCQUFrQixDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7b0JBRWhDLGtCQUFrQixDQUFDLGVBQWUsQ0FBQyxxQkFBcUIsQ0FBQyxHQUFHLFNBQVMsQ0FBQztvQkFFdEUsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDO29CQUNqQixFQUFFLENBQUMsQ0FBQyxlQUFlLENBQUMsaUJBQWlCLEtBQUsscUNBQWlCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzt3QkFDcEUsT0FBTyxHQUFHLEtBQUssQ0FBQztvQkFDcEIsQ0FBQztvQkFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsZUFBZSxDQUFDLGlCQUFpQixLQUFLLHFDQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7d0JBQ3RFLE9BQU8sR0FBRyxVQUFVLENBQUM7b0JBQ3pCLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osT0FBTyxHQUFHLFVBQVUsQ0FBQztvQkFDekIsQ0FBQztvQkFDRCxrQkFBa0IsQ0FBQyxPQUFPLEdBQUc7d0JBQ0csQ0FBQyxRQUFRLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQztxQkFDekIsQ0FBQztvQkFFL0IsTUFBTSxVQUFVLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLGVBQWUsRUFBRSxVQUFVLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztvQkFDbkcsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsZUFBVyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsR0FBRyxFQUFFLEVBQUUsZUFBZSxFQUFFLGtCQUFrQixDQUFDLGVBQWUsRUFBRSxFQUFFO29CQUN6SCxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7WUFDTCxDQUFDO1lBRUQsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtDQUNKO0FBcENELGdFQW9DQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2dlbmVyYXRlQmFiZWxDb25maWd1cmF0aW9uLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
