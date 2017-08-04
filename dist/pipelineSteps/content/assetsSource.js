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
class AssetsSource extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["unitejs-image-cli"], true);
            try {
                _super("log").call(this, logger, display, "Creating Directory", { assetsSourceFolder: engineVariables.assetsSourceFolder });
                yield fileSystem.directoryCreate(engineVariables.assetsSourceFolder);
            }
            catch (err) {
                _super("error").call(this, logger, display, "Creating Assets Source folder failed", err);
                return 1;
            }
            try {
                _super("log").call(this, logger, display, "Creating Directory", { assetsFolder: engineVariables.assetsFolder });
                yield fileSystem.directoryCreate(engineVariables.assetsFolder);
            }
            catch (err) {
                _super("error").call(this, logger, display, "Creating Assets folder failed", err);
                return 1;
            }
            try {
                const sourceThemeFolder = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, "assetsSource/theme/");
                const destThemeFolder = fileSystem.pathCombine(engineVariables.assetsSourceFolder, "theme/");
                yield _super("copyFile").call(this, logger, display, fileSystem, sourceThemeFolder, AssetsSource.FILENAME, destThemeFolder, AssetsSource.FILENAME);
                yield _super("copyFile").call(this, logger, display, fileSystem, sourceThemeFolder, AssetsSource.FILENAME2, destThemeFolder, AssetsSource.FILENAME2);
                return 0;
            }
            catch (err) {
                _super("error").call(this, logger, display, "Copy Assets failed", err);
                return 1;
            }
        });
    }
}
AssetsSource.FILENAME = "logo-tile.svg";
AssetsSource.FILENAME2 = "logo-transparent.svg";
exports.AssetsSource = AssetsSource;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2NvbnRlbnQvYXNzZXRzU291cmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFPQSxnRkFBNkU7QUFHN0Usa0JBQTBCLFNBQVEsK0NBQXNCO0lBSXZDLE9BQU8sQ0FBQyxNQUFlLEVBQUUsT0FBaUIsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDdEosZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsbUJBQW1CLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUVqRSxJQUFJLENBQUM7Z0JBQ0QsYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLENBQUMsa0JBQWtCLEVBQUUsRUFBRTtnQkFFN0csTUFBTSxVQUFVLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQ3pFLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLHNDQUFzQyxFQUFFLEdBQUcsRUFBRTtnQkFDMUUsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFFRCxJQUFJLENBQUM7Z0JBQ0QsYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsRUFBRSxZQUFZLEVBQUUsZUFBZSxDQUFDLFlBQVksRUFBRSxFQUFFO2dCQUVqRyxNQUFNLFVBQVUsQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBRW5FLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLCtCQUErQixFQUFFLEdBQUcsRUFBRTtnQkFDbkUsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFFRCxJQUFJLENBQUM7Z0JBQ0QsTUFBTSxpQkFBaUIsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxzQkFBc0IsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO2dCQUNoSCxNQUFNLGVBQWUsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFFN0YsTUFBTSxrQkFBYyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLGlCQUFpQixFQUFFLFlBQVksQ0FBQyxRQUFRLEVBQUUsZUFBZSxFQUFFLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDcEksTUFBTSxrQkFBYyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLGlCQUFpQixFQUFFLFlBQVksQ0FBQyxTQUFTLEVBQUUsZUFBZSxFQUFFLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFFdEksTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLEdBQUcsRUFBRTtnQkFDeEQsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7UUFDTCxDQUFDO0tBQUE7O0FBckNjLHFCQUFRLEdBQVcsZUFBZSxDQUFDO0FBQ25DLHNCQUFTLEdBQVcsc0JBQXNCLENBQUM7QUFGOUQsb0NBdUNDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvY29udGVudC9hc3NldHNTb3VyY2UuanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
