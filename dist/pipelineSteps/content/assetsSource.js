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
                _super("log").call(this, logger, display, "Creating Directory", { rootFolder: engineVariables.assetsSourceFolder });
                yield fileSystem.directoryCreate(engineVariables.assetsSourceFolder);
            }
            catch (err) {
                _super("error").call(this, logger, display, "Creating Assets Source folder failed", err);
                return 1;
            }
            try {
                _super("log").call(this, logger, display, "Creating Directory", { rootFolder: engineVariables.assetsFolder });
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2NvbnRlbnQvYXNzZXRzU291cmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFPQSxnRkFBNkU7QUFHN0Usa0JBQTBCLFNBQVEsK0NBQXNCO0lBSXZDLE9BQU8sQ0FBQyxNQUFlLEVBQUUsT0FBaUIsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDdEosZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsbUJBQW1CLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUVqRSxJQUFJLENBQUM7Z0JBQ0QsYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsRUFBRSxVQUFVLEVBQUUsZUFBZSxDQUFDLGtCQUFrQixFQUFFLEVBQUU7Z0JBRXJHLE1BQU0sVUFBVSxDQUFDLGVBQWUsQ0FBQyxlQUFlLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUN6RSxDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxlQUFXLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxzQ0FBc0MsRUFBRSxHQUFHLEVBQUU7Z0JBQzFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBRUQsSUFBSSxDQUFDO2dCQUNELGFBQVMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLEVBQUUsVUFBVSxFQUFFLGVBQWUsQ0FBQyxZQUFZLEVBQUUsRUFBRTtnQkFFL0YsTUFBTSxVQUFVLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUVuRSxDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxlQUFXLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSwrQkFBK0IsRUFBRSxHQUFHLEVBQUU7Z0JBQ25FLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBRUQsSUFBSSxDQUFDO2dCQUNELE1BQU0saUJBQWlCLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsc0JBQXNCLEVBQUUscUJBQXFCLENBQUMsQ0FBQztnQkFDaEgsTUFBTSxlQUFlLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsa0JBQWtCLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBRTdGLE1BQU0sa0JBQWMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSxZQUFZLENBQUMsUUFBUSxFQUFFLGVBQWUsRUFBRSxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ3BJLE1BQU0sa0JBQWMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSxZQUFZLENBQUMsU0FBUyxFQUFFLGVBQWUsRUFBRSxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBRXRJLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxlQUFXLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxHQUFHLEVBQUU7Z0JBQ3hELE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1FBQ0wsQ0FBQztLQUFBOztBQXJDYyxxQkFBUSxHQUFXLGVBQWUsQ0FBQztBQUNuQyxzQkFBUyxHQUFXLHNCQUFzQixDQUFDO0FBRjlELG9DQXVDQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2NvbnRlbnQvYXNzZXRzU291cmNlLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
