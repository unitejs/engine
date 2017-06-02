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
 * Pipeline step to generate gulp tasks for build.
 */
const buildConfiguration_1 = require("../configuration/models/build/buildConfiguration");
const enginePipelineStepBase_1 = require("../engine/enginePipelineStepBase");
class GulpBuild extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            try {
                _super("log").call(this, logger, display, "Generating gulp build.config.json in", { gulpBuildFolder: engineVariables.gulpBuildFolder });
                const buildConfiguration = new buildConfiguration_1.BuildConfiguration();
                buildConfiguration.srcFolder = fileSystem.pathRelative(uniteConfiguration.outputDirectory, engineVariables.sourceFolder);
                buildConfiguration.distFolder = fileSystem.pathRelative(uniteConfiguration.outputDirectory, engineVariables.distFolder);
                buildConfiguration.unitTestSrcFolder = fileSystem.pathRelative(uniteConfiguration.outputDirectory, engineVariables.unitTestSrcFolder);
                buildConfiguration.unitTestDistFolder = fileSystem.pathRelative(uniteConfiguration.outputDirectory, engineVariables.unitTestDistFolder);
                buildConfiguration.e2eTestSrcFolder = fileSystem.pathRelative(uniteConfiguration.outputDirectory, engineVariables.e2eTestSrcFolder);
                buildConfiguration.e2eTestDistFolder = fileSystem.pathRelative(uniteConfiguration.outputDirectory, engineVariables.e2eTestDistFolder);
                buildConfiguration.sourceMaps = uniteConfiguration.sourceMaps;
                yield fileSystem.fileWriteJson(engineVariables.gulpBuildFolder, "build.config.json", buildConfiguration);
                return 0;
            }
            catch (err) {
                _super("error").call(this, logger, display, "Generating gulp build.config.json failed", err, { gulpBuildFolder: engineVariables.gulpBuildFolder });
                return 1;
            }
        });
    }
}
exports.GulpBuild = GulpBuild;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvZ3VscEJ1aWxkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILHlGQUFzRjtBQUV0Riw2RUFBMEU7QUFNMUUsZUFBdUIsU0FBUSwrQ0FBc0I7SUFDcEMsT0FBTyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUN0SixJQUFJLENBQUM7Z0JBQ0QsYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsc0NBQXNDLEVBQUUsRUFBRSxlQUFlLEVBQUUsZUFBZSxDQUFDLGVBQWUsRUFBRSxFQUFFO2dCQUV6SCxNQUFNLGtCQUFrQixHQUFHLElBQUksdUNBQWtCLEVBQUUsQ0FBQztnQkFFcEQsa0JBQWtCLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQyxZQUFZLENBQUMsa0JBQWtCLENBQUMsZUFBZSxFQUFFLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDekgsa0JBQWtCLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxZQUFZLENBQUMsa0JBQWtCLENBQUMsZUFBZSxFQUFFLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDeEgsa0JBQWtCLENBQUMsaUJBQWlCLEdBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLEVBQUUsZUFBZSxDQUFDLGlCQUFpQixDQUFDLENBQUM7Z0JBQ3RJLGtCQUFrQixDQUFDLGtCQUFrQixHQUFHLFVBQVUsQ0FBQyxZQUFZLENBQUMsa0JBQWtCLENBQUMsZUFBZSxFQUFFLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2dCQUN4SSxrQkFBa0IsQ0FBQyxnQkFBZ0IsR0FBRyxVQUFVLENBQUMsWUFBWSxDQUFDLGtCQUFrQixDQUFDLGVBQWUsRUFBRSxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFDcEksa0JBQWtCLENBQUMsaUJBQWlCLEdBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLEVBQUUsZUFBZSxDQUFDLGlCQUFpQixDQUFDLENBQUM7Z0JBQ3RJLGtCQUFrQixDQUFDLFVBQVUsR0FBRyxrQkFBa0IsQ0FBQyxVQUFVLENBQUM7Z0JBRTlELE1BQU0sVUFBVSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsZUFBZSxFQUFFLG1CQUFtQixFQUFFLGtCQUFrQixDQUFDLENBQUM7Z0JBRXpHLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxlQUFXLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSwwQ0FBMEMsRUFBRSxHQUFHLEVBQUUsRUFBRSxlQUFlLEVBQUUsZUFBZSxDQUFDLGVBQWUsRUFBRSxFQUFFO2dCQUNwSSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztRQUNMLENBQUM7S0FBQTtDQUNKO0FBdkJELDhCQXVCQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2d1bHBCdWlsZC5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMifQ==
