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
            engineVariables.toggleDevDependency(["babel-core", "babel-preset-es2015"], uniteConfiguration.sourceLanguage === "JavaScript");
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9waXBlbGluZVN0ZXBzL2xhbmd1YWdlL2JhYmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDRGQUF5RjtBQUV6RixnRkFBNkU7QUFNN0UsV0FBbUIsU0FBUSwrQ0FBc0I7SUFHaEMsT0FBTyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUN0SixlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxZQUFZLEVBQUUscUJBQXFCLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxjQUFjLEtBQUssWUFBWSxDQUFDLENBQUM7WUFFL0gsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsY0FBYyxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQ3JELElBQUksQ0FBQztvQkFDRCxhQUFTLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxjQUFjLEtBQUssQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsVUFBVSxFQUFFLEVBQUU7b0JBRXZHLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSx1Q0FBa0IsRUFBRSxDQUFDO29CQUNwRCxrQkFBa0IsQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO29CQUVoQyxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7b0JBQ2pCLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO3dCQUMxQyxPQUFPLEdBQUcsS0FBSyxDQUFDO29CQUNwQixDQUFDO29CQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQzt3QkFDdEQsT0FBTyxHQUFHLFVBQVUsQ0FBQztvQkFDekIsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDSixPQUFPLEdBQUcsVUFBVSxDQUFDO29CQUN6QixDQUFDO29CQUNELGtCQUFrQixDQUFDLE9BQU8sR0FBRzt3QkFDRyxDQUFDLFFBQVEsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDO3FCQUN6QixDQUFDO29CQUUvQixNQUFNLFVBQVUsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsUUFBUSxFQUFFLGtCQUFrQixDQUFDLENBQUM7b0JBQy9GLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztnQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNYLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGNBQWMsS0FBSyxDQUFDLFFBQVEsU0FBUyxFQUFFLEdBQUcsRUFBRSxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsVUFBVSxFQUFFLEVBQUU7b0JBQ3JILE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztZQUNMLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixNQUFNLENBQUMsTUFBTSxvQkFBZ0IsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMzRyxDQUFDO1FBQ0wsQ0FBQztLQUFBOztBQWpDYyxjQUFRLEdBQVcsVUFBVSxDQUFDO0FBRGpELHNCQW1DQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2xhbmd1YWdlL2JhYmVsLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
