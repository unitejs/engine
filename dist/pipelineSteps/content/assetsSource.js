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
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["unitejs-image-cli"], true);
            try {
                logger.info("Creating Directory", { assetsSourceFolder: engineVariables.assetsSourceFolder });
                yield fileSystem.directoryCreate(engineVariables.assetsSourceFolder);
            }
            catch (err) {
                logger.error("Creating Assets Source folder failed", err);
                return 1;
            }
            try {
                logger.info("Creating Directory", { assetsFolder: engineVariables.assetsFolder });
                yield fileSystem.directoryCreate(engineVariables.assetsFolder);
            }
            catch (err) {
                logger.error("Creating Assets folder failed", err);
                return 1;
            }
            try {
                const sourceThemeFolder = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, "assetsSource/theme/");
                const destThemeFolder = fileSystem.pathCombine(engineVariables.assetsSourceFolder, "theme/");
                yield _super("copyFile").call(this, logger, fileSystem, sourceThemeFolder, AssetsSource.FILENAME, destThemeFolder, AssetsSource.FILENAME);
                yield _super("copyFile").call(this, logger, fileSystem, sourceThemeFolder, AssetsSource.FILENAME2, destThemeFolder, AssetsSource.FILENAME2);
                return 0;
            }
            catch (err) {
                logger.error("Copy Assets failed", err);
                return 1;
            }
        });
    }
}
AssetsSource.FILENAME = "logo-tile.svg";
AssetsSource.FILENAME2 = "logo-transparent.svg";
exports.AssetsSource = AssetsSource;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2NvbnRlbnQvYXNzZXRzU291cmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFNQSxnRkFBNkU7QUFHN0Usa0JBQTBCLFNBQVEsK0NBQXNCO0lBSXZDLE9BQU8sQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQ25JLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFakUsSUFBSSxDQUFDO2dCQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDO2dCQUU5RixNQUFNLFVBQVUsQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFDekUsQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsTUFBTSxDQUFDLEtBQUssQ0FBQyxzQ0FBc0MsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDMUQsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFFRCxJQUFJLENBQUM7Z0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLFlBQVksRUFBRSxlQUFlLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQztnQkFFbEYsTUFBTSxVQUFVLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUVuRSxDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxNQUFNLENBQUMsS0FBSyxDQUFDLCtCQUErQixFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUNuRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUVELElBQUksQ0FBQztnQkFDRCxNQUFNLGlCQUFpQixHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLHNCQUFzQixFQUFFLHFCQUFxQixDQUFDLENBQUM7Z0JBQ2hILE1BQU0sZUFBZSxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLGtCQUFrQixFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUU3RixNQUFNLGtCQUFjLFlBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSxZQUFZLENBQUMsUUFBUSxFQUFFLGVBQWUsRUFBRSxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQzNILE1BQU0sa0JBQWMsWUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGlCQUFpQixFQUFFLFlBQVksQ0FBQyxTQUFTLEVBQUUsZUFBZSxFQUFFLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFFN0gsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsb0JBQW9CLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ3hDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1FBQ0wsQ0FBQztLQUFBOztBQXJDYyxxQkFBUSxHQUFXLGVBQWUsQ0FBQztBQUNuQyxzQkFBUyxHQUFXLHNCQUFzQixDQUFDO0FBRjlELG9DQXVDQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2NvbnRlbnQvYXNzZXRzU291cmNlLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
