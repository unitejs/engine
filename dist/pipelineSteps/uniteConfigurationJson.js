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
                _super("log").call(this, logger, display, "Generating unite.json in", { outputDirectory: uniteConfiguration.outputDirectory });
                uniteConfiguration.directories = new uniteDirectories_1.UniteDirectories();
                uniteConfiguration.directories.src = fileSystem.pathDirectoryRelative(uniteConfiguration.outputDirectory, engineVariables.sourceFolder);
                uniteConfiguration.directories.dist = fileSystem.pathDirectoryRelative(uniteConfiguration.outputDirectory, engineVariables.distFolder);
                uniteConfiguration.directories.unitTest = fileSystem.pathDirectoryRelative(uniteConfiguration.outputDirectory, engineVariables.unitTestFolder);
                uniteConfiguration.directories.unitTestSrc = fileSystem.pathDirectoryRelative(uniteConfiguration.outputDirectory, engineVariables.unitTestSrcFolder);
                uniteConfiguration.directories.unitTestDist = fileSystem.pathDirectoryRelative(uniteConfiguration.outputDirectory, engineVariables.unitTestDistFolder);
                uniteConfiguration.directories.e2eTestSrc = fileSystem.pathDirectoryRelative(uniteConfiguration.outputDirectory, engineVariables.e2eTestSrcFolder);
                uniteConfiguration.directories.e2eTestDist = fileSystem.pathDirectoryRelative(uniteConfiguration.outputDirectory, engineVariables.e2eTestDistFolder);
                yield fileSystem.fileWriteJson(uniteConfiguration.outputDirectory, "unite.json", uniteConfiguration);
                return 0;
            }
            catch (err) {
                _super("error").call(this, logger, display, "Generating unite.json failed", err, { outputDirectory: uniteConfiguration.outputDirectory });
                return 1;
            }
        });
    }
}
exports.UniteConfigurationJson = UniteConfigurationJson;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvdW5pdGVDb25maWd1cmF0aW9uSnNvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBSUEscUZBQWtGO0FBQ2xGLDZFQUEwRTtBQU0xRSw0QkFBb0MsU0FBUSwrQ0FBc0I7SUFDakQsT0FBTyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUN0SixJQUFJLENBQUM7Z0JBQ0QsYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsRUFBRSxlQUFlLEVBQUUsa0JBQWtCLENBQUMsZUFBZSxFQUFFLEVBQUU7Z0JBRWhILGtCQUFrQixDQUFDLFdBQVcsR0FBRyxJQUFJLG1DQUFnQixFQUFFLENBQUM7Z0JBQ3hELGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxHQUFHLEdBQUcsVUFBVSxDQUFDLHFCQUFxQixDQUFDLGtCQUFrQixDQUFDLGVBQWUsRUFBRSxlQUFlLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQ3hJLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDLHFCQUFxQixDQUFDLGtCQUFrQixDQUFDLGVBQWUsRUFBRSxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQ3ZJLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLHFCQUFxQixDQUFDLGtCQUFrQixDQUFDLGVBQWUsRUFBRSxlQUFlLENBQUMsY0FBYyxDQUFDLENBQUM7Z0JBQy9JLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDLHFCQUFxQixDQUFDLGtCQUFrQixDQUFDLGVBQWUsRUFBRSxlQUFlLENBQUMsaUJBQWlCLENBQUMsQ0FBQztnQkFDckosa0JBQWtCLENBQUMsV0FBVyxDQUFDLFlBQVksR0FBRyxVQUFVLENBQUMscUJBQXFCLENBQUMsa0JBQWtCLENBQUMsZUFBZSxFQUFFLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2dCQUN2SixrQkFBa0IsQ0FBQyxXQUFXLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLEVBQUUsZUFBZSxDQUFDLGdCQUFnQixDQUFDLENBQUM7Z0JBQ25KLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDLHFCQUFxQixDQUFDLGtCQUFrQixDQUFDLGVBQWUsRUFBRSxlQUFlLENBQUMsaUJBQWlCLENBQUMsQ0FBQztnQkFFckosTUFBTSxVQUFVLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLGVBQWUsRUFBRSxZQUFZLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztnQkFDckcsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLDhCQUE4QixFQUFFLEdBQUcsRUFBRSxFQUFFLGVBQWUsRUFBRSxrQkFBa0IsQ0FBQyxlQUFlLEVBQUUsRUFBRTtnQkFDM0gsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7UUFDTCxDQUFDO0tBQUE7Q0FDSjtBQXJCRCx3REFxQkMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy91bml0ZUNvbmZpZ3VyYXRpb25Kc29uLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
