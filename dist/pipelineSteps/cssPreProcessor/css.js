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
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class Css extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (uniteConfiguration.cssPre === "Css") {
                try {
                    _super("log").call(this, logger, display, "Creating cssSrc folder", { cssSrcFolder: engineVariables.cssSrcFolder });
                    engineVariables.cssSrcFolder = fileSystem.pathCombine(engineVariables.rootFolder, "\\cssSrc");
                    yield fileSystem.directoryCreate(engineVariables.cssSrcFolder);
                    yield fileSystem.directoryCreate(engineVariables.cssDistFolder);
                    const assetCssFolder = fileSystem.pathCombine(engineVariables.assetsDirectory, "scaffold/css/css");
                    const exists = yield fileSystem.fileExists(engineVariables.cssSrcFolder, "app.css");
                    if (!exists) {
                        _super("copyFile").call(this, logger, display, fileSystem, assetCssFolder, "app.css", engineVariables.cssSrcFolder, "app.css");
                    }
                    _super("copyFile").call(this, logger, display, fileSystem, assetCssFolder, "main.css", engineVariables.cssSrcFolder, "main.css");
                    _super("copyFile").call(this, logger, display, fileSystem, assetCssFolder, "reset.css", engineVariables.cssSrcFolder, "reset.css");
                    return 0;
                }
                catch (err) {
                    _super("error").call(this, logger, display, "Generating css folder failed", err, { cssSrcFolder: engineVariables.cssSrcFolder });
                    return 1;
                }
            }
            return 0;
        });
    }
}
exports.Css = Css;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvY3NzUHJlUHJvY2Vzc29yL2Nzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBSUEsZ0ZBQTZFO0FBTTdFLFNBQWlCLFNBQVEsK0NBQXNCO0lBQzlCLE9BQU8sQ0FBQyxNQUFlLEVBQUUsT0FBaUIsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDdEosRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsTUFBTSxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ3RDLElBQUksQ0FBQztvQkFDRCxhQUFTLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxFQUFFLFlBQVksRUFBRSxlQUFlLENBQUMsWUFBWSxFQUFFLEVBQUU7b0JBRXJHLGVBQWUsQ0FBQyxZQUFZLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO29CQUU5RixNQUFNLFVBQVUsQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxDQUFDO29CQUMvRCxNQUFNLFVBQVUsQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUVoRSxNQUFNLGNBQWMsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxlQUFlLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztvQkFFbkcsTUFBTSxNQUFNLEdBQUcsTUFBTSxVQUFVLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxZQUFZLEVBQUUsU0FBUyxDQUFDLENBQUM7b0JBQ3BGLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzt3QkFDVixrQkFBYyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLGNBQWMsRUFBRSxTQUFTLEVBQUUsZUFBZSxDQUFDLFlBQVksRUFBRSxTQUFTLEVBQUU7b0JBQ3BILENBQUM7b0JBQ0Qsa0JBQWMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQUUsVUFBVSxFQUFFLGVBQWUsQ0FBQyxZQUFZLEVBQUUsVUFBVSxFQUFFO29CQUNsSCxrQkFBYyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLGNBQWMsRUFBRSxXQUFXLEVBQUUsZUFBZSxDQUFDLFlBQVksRUFBRSxXQUFXLEVBQUU7b0JBQ3BILE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztnQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNYLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLDhCQUE4QixFQUFFLEdBQUcsRUFBRSxFQUFFLFlBQVksRUFBRSxlQUFlLENBQUMsWUFBWSxFQUFFLEVBQUU7b0JBQ2xILE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztZQUNMLENBQUM7WUFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0NBQ0o7QUE1QkQsa0JBNEJDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvY3NzUHJlUHJvY2Vzc29yL2Nzcy5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMifQ==
