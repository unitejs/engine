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
class Babel extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (uniteConfiguration.sourceLanguage === "JavaScript") {
                try {
                    _super("log").call(this, logger, display, "Generating .babelrc", { rootFolder: engineVariables.rootFolder });
                    const babelConfiguration = new babelConfiguration_1.BabelConfiguration();
                    babelConfiguration.plugins = [];
                    engineVariables.requiredDevDependencies.push("babel-preset-es2015");
                    let modules = "";
                    if (uniteConfiguration.moduleLoader === "RequireJS") {
                        modules = "amd";
                    }
                    else if (uniteConfiguration.moduleLoader === "SystemJS") {
                        modules = "systemjs";
                    }
                    else {
                        modules = "commonjs";
                    }
                    babelConfiguration.presets = [
                        ["es2015", { modules }]
                    ];
                    yield fileSystem.fileWriteJson(engineVariables.rootFolder, ".babelrc", babelConfiguration);
                    return 0;
                }
                catch (err) {
                    _super("error").call(this, logger, display, "Generating .babelrc failed", err, { rootFolder: engineVariables.rootFolder });
                    return 1;
                }
            }
            return 0;
        });
    }
}
exports.Babel = Babel;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvYmFiZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gseUZBQXNGO0FBRXRGLDZFQUEwRTtBQU0xRSxXQUFtQixTQUFRLCtDQUFzQjtJQUNoQyxPQUFPLENBQUMsTUFBZSxFQUFFLE9BQWlCLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBRXRKLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLGNBQWMsS0FBSyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUNyRCxJQUFJLENBQUM7b0JBQ0QsYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsRUFBRSxVQUFVLEVBQUUsZUFBZSxDQUFDLFVBQVUsRUFBRSxFQUFFO29CQUU5RixNQUFNLGtCQUFrQixHQUFHLElBQUksdUNBQWtCLEVBQUUsQ0FBQztvQkFDcEQsa0JBQWtCLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztvQkFFaEMsZUFBZSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO29CQUVwRSxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7b0JBQ2pCLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLFlBQVksS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDO3dCQUNsRCxPQUFPLEdBQUcsS0FBSyxDQUFDO29CQUNwQixDQUFDO29CQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQzt3QkFDeEQsT0FBTyxHQUFHLFVBQVUsQ0FBQztvQkFDekIsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDSixPQUFPLEdBQUcsVUFBVSxDQUFDO29CQUN6QixDQUFDO29CQUNELGtCQUFrQixDQUFDLE9BQU8sR0FBRzt3QkFDRyxDQUFDLFFBQVEsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDO3FCQUN6QixDQUFDO29CQUUvQixNQUFNLFVBQVUsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztvQkFDM0YsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsZUFBVyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsR0FBRyxFQUFFLEVBQUUsVUFBVSxFQUFFLGVBQWUsQ0FBQyxVQUFVLEVBQUUsRUFBRTtvQkFDNUcsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO1lBQ0wsQ0FBQztZQUVELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7Q0FDSjtBQWxDRCxzQkFrQ0MiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9iYWJlbC5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMifQ==
