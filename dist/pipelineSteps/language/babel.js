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
const babelConfiguration_1 = require("../../configuration/models/babel/babelConfiguration");
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class Babel extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDependencies(["babel-core", "babel-preset-es2015"], uniteConfiguration.sourceLanguage === "JavaScript", true);
            if (uniteConfiguration.sourceLanguage === "JavaScript") {
                try {
                    _super("log").call(this, logger, display, `Generating ${Babel.FILENAME}`, { rootFolder: engineVariables.rootFolder });
                    const babelConfiguration = new babelConfiguration_1.BabelConfiguration();
                    babelConfiguration.plugins = [];
                    let modules = "";
                    if (uniteConfiguration.moduleType === "AMD") {
                        modules = "amd";
                    }
                    else if (uniteConfiguration.moduleType === "SystemJS") {
                        modules = "systemjs";
                    }
                    else {
                        modules = "commonjs";
                    }
                    babelConfiguration.presets = [
                        ["es2015", { modules }]
                    ];
                    yield fileSystem.fileWriteJson(engineVariables.rootFolder, Babel.FILENAME, babelConfiguration);
                    return 0;
                }
                catch (err) {
                    _super("error").call(this, logger, display, `Generating ${Babel.FILENAME} failed`, err, { rootFolder: engineVariables.rootFolder });
                    return 1;
                }
            }
            else {
                return yield _super("deleteFile").call(this, logger, display, fileSystem, engineVariables.rootFolder, Babel.FILENAME);
            }
        });
    }
}
Babel.FILENAME = ".babelrc";
exports.Babel = Babel;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9waXBlbGluZVN0ZXBzL2xhbmd1YWdlL2JhYmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDRGQUF5RjtBQUV6RixnRkFBNkU7QUFNN0UsV0FBbUIsU0FBUSwrQ0FBc0I7SUFHaEMsT0FBTyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUN0SixlQUFlLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxZQUFZLEVBQUUscUJBQXFCLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxjQUFjLEtBQUssWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBRXBJLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLGNBQWMsS0FBSyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUNyRCxJQUFJLENBQUM7b0JBQ0QsYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsY0FBYyxLQUFLLENBQUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsZUFBZSxDQUFDLFVBQVUsRUFBRSxFQUFFO29CQUV2RyxNQUFNLGtCQUFrQixHQUFHLElBQUksdUNBQWtCLEVBQUUsQ0FBQztvQkFDcEQsa0JBQWtCLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztvQkFFaEMsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDO29CQUNqQixFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQzt3QkFDMUMsT0FBTyxHQUFHLEtBQUssQ0FBQztvQkFDcEIsQ0FBQztvQkFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsVUFBVSxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUM7d0JBQ3RELE9BQU8sR0FBRyxVQUFVLENBQUM7b0JBQ3pCLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osT0FBTyxHQUFHLFVBQVUsQ0FBQztvQkFDekIsQ0FBQztvQkFDRCxrQkFBa0IsQ0FBQyxPQUFPLEdBQUc7d0JBQ0csQ0FBQyxRQUFRLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQztxQkFDekIsQ0FBQztvQkFFL0IsTUFBTSxVQUFVLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLFFBQVEsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO29CQUMvRixNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7Z0JBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDWCxlQUFXLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxjQUFjLEtBQUssQ0FBQyxRQUFRLFNBQVMsRUFBRSxHQUFHLEVBQUUsRUFBRSxVQUFVLEVBQUUsZUFBZSxDQUFDLFVBQVUsRUFBRSxFQUFFO29CQUNySCxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7WUFDTCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osTUFBTSxDQUFDLE1BQU0sb0JBQWdCLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsZUFBZSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDM0csQ0FBQztRQUNMLENBQUM7S0FBQTs7QUFqQ2MsY0FBUSxHQUFXLFVBQVUsQ0FBQztBQURqRCxzQkFtQ0MiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9sYW5ndWFnZS9iYWJlbC5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMifQ==
