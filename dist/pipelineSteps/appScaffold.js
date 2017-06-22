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
const enginePipelineStepBase_1 = require("../engine/enginePipelineStepBase");
class AppScaffold extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            try {
                _super("log").call(this, logger, display, "Creating App Source Directory", { appSourceFolder: engineVariables.srcFolder });
                yield fileSystem.directoryCreate(engineVariables.srcFolder);
            }
            catch (err) {
                _super("error").call(this, logger, display, "Creating App Source Directory failed", err, { appSourceFolder: engineVariables.srcFolder });
                return 1;
            }
            const scaffoldFolder = fileSystem.pathCombine(engineVariables.assetsDirectory, "\\scaffold\\src\\" + uniteConfiguration.sourceLanguage.toLowerCase());
            try {
                _super("log").call(this, logger, display, "Generating Main in", { appSourceFolder: engineVariables.srcFolder });
                yield this.copyFile(logger, display, fileSystem, scaffoldFolder, "main." + engineVariables.sourceLanguageExt, engineVariables.srcFolder, "main." + engineVariables.sourceLanguageExt);
            }
            catch (err) {
                _super("error").call(this, logger, display, "Generating Main failed", err, { appSourceFolder: engineVariables.srcFolder });
                return 1;
            }
            try {
                _super("log").call(this, logger, display, "Generating EntryPoint in", { appSourceFolder: engineVariables.srcFolder });
                yield this.copyFile(logger, display, fileSystem, scaffoldFolder, "entryPoint." + engineVariables.sourceLanguageExt, engineVariables.srcFolder, "entryPoint." + engineVariables.sourceLanguageExt);
            }
            catch (err) {
                _super("error").call(this, logger, display, "Generating EntryPoint failed", err, { appSourceFolder: engineVariables.srcFolder });
                return 1;
            }
            try {
                const fileExists = yield fileSystem.fileExists(engineVariables.srcFolder, "app." + engineVariables.sourceLanguageExt);
                if (!fileExists) {
                    yield this.copyFile(logger, display, fileSystem, scaffoldFolder, "app." + engineVariables.sourceLanguageExt, engineVariables.srcFolder, "app." + engineVariables.sourceLanguageExt);
                }
                return 0;
            }
            catch (err) {
                _super("error").call(this, logger, display, "Generating App failed", err, { appSourceFolder: engineVariables.srcFolder });
                return 1;
            }
        });
    }
}
exports.AppScaffold = AppScaffold;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvYXBwU2NhZmZvbGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUlBLDZFQUEwRTtBQU0xRSxpQkFBeUIsU0FBUSwrQ0FBc0I7SUFDdEMsT0FBTyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUN0SixJQUFJLENBQUM7Z0JBQ0QsYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsK0JBQStCLEVBQUUsRUFBRSxlQUFlLEVBQUUsZUFBZSxDQUFDLFNBQVMsRUFBRSxFQUFFO2dCQUM1RyxNQUFNLFVBQVUsQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ2hFLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLHNDQUFzQyxFQUFFLEdBQUcsRUFBRSxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUMsU0FBUyxFQUFFLEVBQUU7Z0JBQzFILE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBRUQsTUFBTSxjQUFjLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsZUFBZSxFQUFFLG1CQUFtQixHQUFHLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO1lBRXRKLElBQUksQ0FBQztnQkFDRCxhQUFTLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUMsU0FBUyxFQUFFLEVBQUU7Z0JBRWpHLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFDM0IsY0FBYyxFQUNkLE9BQU8sR0FBRyxlQUFlLENBQUMsaUJBQWlCLEVBQzNDLGVBQWUsQ0FBQyxTQUFTLEVBQ3pCLE9BQU8sR0FBRyxlQUFlLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUNyRSxDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxlQUFXLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxHQUFHLEVBQUUsRUFBRSxlQUFlLEVBQUUsZUFBZSxDQUFDLFNBQVMsRUFBRSxFQUFFO2dCQUM1RyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUVELElBQUksQ0FBQztnQkFDRCxhQUFTLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUMsU0FBUyxFQUFFLEVBQUU7Z0JBRXZHLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFDM0IsY0FBYyxFQUNkLGFBQWEsR0FBRyxlQUFlLENBQUMsaUJBQWlCLEVBQ2pELGVBQWUsQ0FBQyxTQUFTLEVBQ3pCLGFBQWEsR0FBRyxlQUFlLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUMzRSxDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxlQUFXLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSw4QkFBOEIsRUFBRSxHQUFHLEVBQUUsRUFBRSxlQUFlLEVBQUUsZUFBZSxDQUFDLFNBQVMsRUFBRSxFQUFFO2dCQUNsSCxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUVELElBQUksQ0FBQztnQkFDRCxNQUFNLFVBQVUsR0FBRyxNQUFNLFVBQVUsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLFNBQVMsRUFBRSxNQUFNLEdBQUcsZUFBZSxDQUFDLGlCQUFpQixDQUFDLENBQUM7Z0JBQ3RILEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztvQkFDZCxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLE1BQU0sR0FBRyxlQUFlLENBQUMsaUJBQWlCLEVBQUUsZUFBZSxDQUFDLFNBQVMsRUFBRSxNQUFNLEdBQUcsZUFBZSxDQUFDLGlCQUFpQixDQUFDLENBQUM7Z0JBQ3hMLENBQUM7Z0JBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLEdBQUcsRUFBRSxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUMsU0FBUyxFQUFFLEVBQUU7Z0JBQzNHLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1FBQ0wsQ0FBQztLQUFBO0NBQ0o7QUFqREQsa0NBaURDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvYXBwU2NhZmZvbGQuanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
