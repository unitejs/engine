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
const uniteModuleLoader_1 = require("../configuration/models/unite/uniteModuleLoader");
const uniteSourceLanguage_1 = require("../configuration/models/unite/uniteSourceLanguage");
const enginePipelineStepBase_1 = require("../engine/enginePipelineStepBase");
class GenerateBabelConfiguration extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (engineVariables.uniteSourceLanguage === uniteSourceLanguage_1.UniteSourceLanguage.JavaScript) {
                try {
                    _super("log").call(this, logger, display, "Generating .babelrc", { outputDirectory: uniteConfiguration.outputDirectory });
                    engineVariables.requiredDevDependencies.push("gulp-babel");
                    const babelConfiguration = new babelConfiguration_1.BabelConfiguration();
                    babelConfiguration.plugins = [];
                    engineVariables.requiredDevDependencies.push("babel-preset-es2015");
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvZ2VuZXJhdGVCYWJlbENvbmZpZ3VyYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gseUZBQXNGO0FBRXRGLHVGQUFvRjtBQUNwRiwyRkFBd0Y7QUFDeEYsNkVBQTBFO0FBTTFFLGdDQUF3QyxTQUFRLCtDQUFzQjtJQUNyRCxPQUFPLENBQUMsTUFBZSxFQUFFLE9BQWlCLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBRXRKLEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxtQkFBbUIsS0FBSyx5Q0FBbUIsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUN6RSxJQUFJLENBQUM7b0JBQ0QsYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsRUFBRSxlQUFlLEVBQUUsa0JBQWtCLENBQUMsZUFBZSxFQUFFLEVBQUU7b0JBRTNHLGVBQWUsQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7b0JBRTNELE1BQU0sa0JBQWtCLEdBQUcsSUFBSSx1Q0FBa0IsRUFBRSxDQUFDO29CQUNwRCxrQkFBa0IsQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO29CQUVoQyxlQUFlLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUM7b0JBRXBFLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztvQkFDakIsRUFBRSxDQUFDLENBQUMsZUFBZSxDQUFDLGlCQUFpQixLQUFLLHFDQUFpQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7d0JBQ3BFLE9BQU8sR0FBRyxLQUFLLENBQUM7b0JBQ3BCLENBQUM7b0JBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxpQkFBaUIsS0FBSyxxQ0FBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO3dCQUN0RSxPQUFPLEdBQUcsVUFBVSxDQUFDO29CQUN6QixDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNKLE9BQU8sR0FBRyxVQUFVLENBQUM7b0JBQ3pCLENBQUM7b0JBQ0Qsa0JBQWtCLENBQUMsT0FBTyxHQUFHO3dCQUNHLENBQUMsUUFBUSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUM7cUJBQ3pCLENBQUM7b0JBRS9CLE1BQU0sVUFBVSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixDQUFDLENBQUM7b0JBQ25HLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztnQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNYLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLDRCQUE0QixFQUFFLEdBQUcsRUFBRSxFQUFFLGVBQWUsRUFBRSxrQkFBa0IsQ0FBQyxlQUFlLEVBQUUsRUFBRTtvQkFDekgsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO1lBQ0wsQ0FBQztZQUVELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7Q0FDSjtBQXBDRCxnRUFvQ0MiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9nZW5lcmF0ZUJhYmVsQ29uZmlndXJhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMifQ==
