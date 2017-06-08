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
const uniteDirectories_1 = require("../configuration/models/unite/uniteDirectories");
const enginePipelineStepBase_1 = require("../engine/enginePipelineStepBase");
class UniteConfigurationJson extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            try {
                _super("log").call(this, logger, display, "Generating unite.json in", { rootFolder: engineVariables.rootFolder });
                uniteConfiguration.directories = new uniteDirectories_1.UniteDirectories();
                uniteConfiguration.directories.src = fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.sourceFolder);
                uniteConfiguration.directories.dist = fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.distFolder);
                if (uniteConfiguration.unitTestRunner !== "None") {
                    uniteConfiguration.directories.unitTest = fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.unitTestFolder);
                    uniteConfiguration.directories.unitTestSrc = fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.unitTestSrcFolder);
                    uniteConfiguration.directories.unitTestDist = fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.unitTestDistFolder);
                }
                uniteConfiguration.directories.e2eTestSrc = fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.e2eTestSrcFolder);
                uniteConfiguration.directories.e2eTestDist = fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.e2eTestDistFolder);
                yield fileSystem.fileWriteJson(engineVariables.rootFolder, "unite.json", uniteConfiguration);
                return 0;
            }
            catch (err) {
                _super("error").call(this, logger, display, "Generating unite.json failed", err, { rootFolder: engineVariables.rootFolder });
                return 1;
            }
        });
    }
}
exports.UniteConfigurationJson = UniteConfigurationJson;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvdW5pdGVDb25maWd1cmF0aW9uSnNvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBSUEscUZBQWtGO0FBQ2xGLDZFQUEwRTtBQU0xRSw0QkFBb0MsU0FBUSwrQ0FBc0I7SUFDakQsT0FBTyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUN0SixJQUFJLENBQUM7Z0JBQ0QsYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsRUFBRSxVQUFVLEVBQUUsZUFBZSxDQUFDLFVBQVUsRUFBRSxFQUFFO2dCQUVuRyxrQkFBa0IsQ0FBQyxXQUFXLEdBQUcsSUFBSSxtQ0FBZ0IsRUFBRSxDQUFDO2dCQUN4RCxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsR0FBRyxHQUFHLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDaEksa0JBQWtCLENBQUMsV0FBVyxDQUFDLElBQUksR0FBRyxVQUFVLENBQUMscUJBQXFCLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQy9ILEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLGNBQWMsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUMvQyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxjQUFjLENBQUMsQ0FBQztvQkFDdkksa0JBQWtCLENBQUMsV0FBVyxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUMscUJBQXFCLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxlQUFlLENBQUMsaUJBQWlCLENBQUMsQ0FBQztvQkFDN0ksa0JBQWtCLENBQUMsV0FBVyxDQUFDLFlBQVksR0FBRyxVQUFVLENBQUMscUJBQXFCLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxlQUFlLENBQUMsa0JBQWtCLENBQUMsQ0FBQztnQkFDbkosQ0FBQztnQkFDRCxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUMzSSxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2dCQUU3SSxNQUFNLFVBQVUsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxZQUFZLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztnQkFDN0YsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLDhCQUE4QixFQUFFLEdBQUcsRUFBRSxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsVUFBVSxFQUFFLEVBQUU7Z0JBQzlHLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1FBQ0wsQ0FBQztLQUFBO0NBQ0o7QUF2QkQsd0RBdUJDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvdW5pdGVDb25maWd1cmF0aW9uSnNvbi5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMifQ==
