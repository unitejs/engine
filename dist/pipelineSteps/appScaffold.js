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
            engineVariables.sourceFolder = fileSystem.pathCombine(uniteConfiguration.outputDirectory, "\\src");
            engineVariables.distFolder = fileSystem.pathCombine(uniteConfiguration.outputDirectory, "\\dist");
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvYXBwU2NhZmZvbGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUlBLHVEQUFvRDtBQUNwRCw2RUFBMEU7QUFNMUUsaUJBQXlCLFNBQVEsK0NBQXNCO0lBQ3RDLE9BQU8sQ0FBQyxNQUFlLEVBQUUsT0FBaUIsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDdEosZUFBZSxDQUFDLFlBQVksR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGtCQUFrQixDQUFDLGVBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUNuRyxlQUFlLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsZUFBZSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBRWxHLElBQUksQ0FBQztnQkFDRCxhQUFTLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSwrQkFBK0IsRUFBRSxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUMsWUFBWSxFQUFFLEVBQUU7Z0JBQy9HLE1BQU0sVUFBVSxDQUFDLGVBQWUsQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDbkUsQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsZUFBVyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsc0NBQXNDLEVBQUUsR0FBRyxFQUFFLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBQyxZQUFZLEVBQUUsRUFBRTtnQkFDN0gsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFFRCxNQUFNLGNBQWMsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxlQUFlLEVBQUUsbUJBQW1CLEdBQUcsMkJBQVksQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztZQUVsSyxJQUFJLENBQUM7Z0JBQ0QsYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsRUFBRSxlQUFlLEVBQUUsZUFBZSxDQUFDLFlBQVksRUFBRSxFQUFFO2dCQUVwRyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQzNCLGNBQWMsRUFDZCxPQUFPLEdBQUcsZUFBZSxDQUFDLGlCQUFpQixFQUMzQyxlQUFlLENBQUMsWUFBWSxFQUM1QixPQUFPLEdBQUcsZUFBZSxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDckUsQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsZUFBVyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsR0FBRyxFQUFFLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBQyxZQUFZLEVBQUUsRUFBRTtnQkFDL0csTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDaEQsSUFBSSxDQUFDO29CQUNELGFBQVMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLDBCQUEwQixFQUFFLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBQyxZQUFZLEVBQUUsRUFBRTtvQkFFMUcsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUMzQixjQUFjLEVBQ2QsYUFBYSxHQUFHLGVBQWUsQ0FBQyxpQkFBaUIsRUFDakQsZUFBZSxDQUFDLFlBQVksRUFDNUIsYUFBYSxHQUFHLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2dCQUMzRSxDQUFDO2dCQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsZUFBVyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsOEJBQThCLEVBQUUsR0FBRyxFQUFFLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBQyxZQUFZLEVBQUUsRUFBRTtvQkFDckgsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO1lBQ0wsQ0FBQztZQUVELElBQUksQ0FBQztnQkFDRCxNQUFNLFVBQVUsR0FBRyxNQUFNLFVBQVUsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLFlBQVksRUFBRSxNQUFNLEdBQUcsZUFBZSxDQUFDLGlCQUFpQixDQUFDLENBQUM7Z0JBQ3pILEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztvQkFDZCxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLE1BQU0sR0FBRyxlQUFlLENBQUMsaUJBQWlCLEVBQUUsZUFBZSxDQUFDLFlBQVksRUFBRSxNQUFNLEdBQUcsZUFBZSxDQUFDLGlCQUFpQixDQUFDLENBQUM7Z0JBQzNMLENBQUM7Z0JBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLEdBQUcsRUFBRSxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUMsWUFBWSxFQUFFLEVBQUU7Z0JBQzlHLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1FBQ0wsQ0FBQztLQUFBO0NBQ0o7QUF0REQsa0NBc0RDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvYXBwU2NhZmZvbGQuanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
