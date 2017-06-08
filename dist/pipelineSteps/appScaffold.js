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
const stringHelper_1 = require("../core/stringHelper");
const enginePipelineStepBase_1 = require("../engine/enginePipelineStepBase");
class AppScaffold extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.sourceFolder = fileSystem.pathCombine(engineVariables.rootFolder, "\\src");
            engineVariables.distFolder = fileSystem.pathCombine(engineVariables.rootFolder, "\\dist");
            try {
                _super("log").call(this, logger, display, "Creating App Source Directory", { appSourceFolder: engineVariables.sourceFolder });
                yield fileSystem.directoryCreate(engineVariables.sourceFolder);
            }
            catch (err) {
                _super("error").call(this, logger, display, "Creating App Source Directory failed", err, { appSourceFolder: engineVariables.sourceFolder });
                return 1;
            }
            const scaffoldFolder = fileSystem.pathCombine(engineVariables.assetsDirectory, "\\scaffold\\src\\" + stringHelper_1.StringHelper.toCamelCase(uniteConfiguration.sourceLanguage));
            try {
                _super("log").call(this, logger, display, "Generating Main in", { appSourceFolder: engineVariables.sourceFolder });
                yield this.copyFile(logger, display, fileSystem, scaffoldFolder, "main." + engineVariables.sourceLanguageExt, engineVariables.sourceFolder, "main." + engineVariables.sourceLanguageExt);
            }
            catch (err) {
                _super("error").call(this, logger, display, "Generating Main failed", err, { appSourceFolder: engineVariables.sourceFolder });
                return 1;
            }
            if (uniteConfiguration.moduleLoader === "Webpack") {
                try {
                    _super("log").call(this, logger, display, "Generating EntryPoint in", { appSourceFolder: engineVariables.sourceFolder });
                    yield this.copyFile(logger, display, fileSystem, scaffoldFolder, "entryPoint." + engineVariables.sourceLanguageExt, engineVariables.sourceFolder, "entryPoint." + engineVariables.sourceLanguageExt);
                }
                catch (err) {
                    _super("error").call(this, logger, display, "Generating EntryPoint failed", err, { appSourceFolder: engineVariables.sourceFolder });
                    return 1;
                }
            }
            try {
                const fileExists = yield fileSystem.fileExists(engineVariables.sourceFolder, "app." + engineVariables.sourceLanguageExt);
                if (!fileExists) {
                    yield this.copyFile(logger, display, fileSystem, scaffoldFolder, "app." + engineVariables.sourceLanguageExt, engineVariables.sourceFolder, "app." + engineVariables.sourceLanguageExt);
                }
                return 0;
            }
            catch (err) {
                _super("error").call(this, logger, display, "Generating App failed", err, { appSourceFolder: engineVariables.sourceFolder });
                return 1;
            }
        });
    }
}
exports.AppScaffold = AppScaffold;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvYXBwU2NhZmZvbGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUlBLHVEQUFvRDtBQUNwRCw2RUFBMEU7QUFNMUUsaUJBQXlCLFNBQVEsK0NBQXNCO0lBQ3RDLE9BQU8sQ0FBQyxNQUFlLEVBQUUsT0FBaUIsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDdEosZUFBZSxDQUFDLFlBQVksR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDM0YsZUFBZSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFFMUYsSUFBSSxDQUFDO2dCQUNELGFBQVMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLCtCQUErQixFQUFFLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBQyxZQUFZLEVBQUUsRUFBRTtnQkFDL0csTUFBTSxVQUFVLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNuRSxDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxlQUFXLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxzQ0FBc0MsRUFBRSxHQUFHLEVBQUUsRUFBRSxlQUFlLEVBQUUsZUFBZSxDQUFDLFlBQVksRUFBRSxFQUFFO2dCQUM3SCxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUVELE1BQU0sY0FBYyxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLGVBQWUsRUFBRSxtQkFBbUIsR0FBRywyQkFBWSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1lBRWxLLElBQUksQ0FBQztnQkFDRCxhQUFTLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUMsWUFBWSxFQUFFLEVBQUU7Z0JBRXBHLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFDM0IsY0FBYyxFQUNkLE9BQU8sR0FBRyxlQUFlLENBQUMsaUJBQWlCLEVBQzNDLGVBQWUsQ0FBQyxZQUFZLEVBQzVCLE9BQU8sR0FBRyxlQUFlLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUNyRSxDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxlQUFXLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxHQUFHLEVBQUUsRUFBRSxlQUFlLEVBQUUsZUFBZSxDQUFDLFlBQVksRUFBRSxFQUFFO2dCQUMvRyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLFlBQVksS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUNoRCxJQUFJLENBQUM7b0JBQ0QsYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsRUFBRSxlQUFlLEVBQUUsZUFBZSxDQUFDLFlBQVksRUFBRSxFQUFFO29CQUUxRyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQzNCLGNBQWMsRUFDZCxhQUFhLEdBQUcsZUFBZSxDQUFDLGlCQUFpQixFQUNqRCxlQUFlLENBQUMsWUFBWSxFQUM1QixhQUFhLEdBQUcsZUFBZSxDQUFDLGlCQUFpQixDQUFDLENBQUM7Z0JBQzNFLENBQUM7Z0JBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDWCxlQUFXLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSw4QkFBOEIsRUFBRSxHQUFHLEVBQUUsRUFBRSxlQUFlLEVBQUUsZUFBZSxDQUFDLFlBQVksRUFBRSxFQUFFO29CQUNySCxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7WUFDTCxDQUFDO1lBRUQsSUFBSSxDQUFDO2dCQUNELE1BQU0sVUFBVSxHQUFHLE1BQU0sVUFBVSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsWUFBWSxFQUFFLE1BQU0sR0FBRyxlQUFlLENBQUMsaUJBQWlCLENBQUMsQ0FBQztnQkFDekgsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO29CQUNkLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQUUsTUFBTSxHQUFHLGVBQWUsQ0FBQyxpQkFBaUIsRUFBRSxlQUFlLENBQUMsWUFBWSxFQUFFLE1BQU0sR0FBRyxlQUFlLENBQUMsaUJBQWlCLENBQUMsQ0FBQztnQkFDM0wsQ0FBQztnQkFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsZUFBVyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsR0FBRyxFQUFFLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBQyxZQUFZLEVBQUUsRUFBRTtnQkFDOUcsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7UUFDTCxDQUFDO0tBQUE7Q0FDSjtBQXRERCxrQ0FzREMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9hcHBTY2FmZm9sZC5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMifQ==
