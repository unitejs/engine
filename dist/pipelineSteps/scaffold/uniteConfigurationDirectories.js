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
const uniteDirectories_1 = require("../../configuration/models/unite/uniteDirectories");
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class UniteConfigurationDirectories extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            try {
                _super("log").call(this, logger, display, "Generating directories configuration", { wwwFolder: engineVariables.wwwFolder });
                uniteConfiguration.directories = new uniteDirectories_1.UniteDirectories();
                uniteConfiguration.directories.src = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwFolder, engineVariables.srcFolder));
                uniteConfiguration.directories.dist = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwFolder, engineVariables.distFolder));
                if (uniteConfiguration.unitTestRunner !== "None") {
                    uniteConfiguration.directories.unitTest = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwFolder, engineVariables.unitTestFolder));
                    uniteConfiguration.directories.unitTestSrc = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwFolder, engineVariables.unitTestSrcFolder));
                    uniteConfiguration.directories.unitTestDist = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwFolder, engineVariables.unitTestDistFolder));
                }
                uniteConfiguration.directories.cssSrc = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwFolder, engineVariables.cssSrcFolder));
                uniteConfiguration.directories.cssDist = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwFolder, engineVariables.cssDistFolder));
                if (uniteConfiguration.e2eTestRunner !== "None") {
                    uniteConfiguration.directories.e2eTest = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwFolder, engineVariables.e2eTestFolder));
                    uniteConfiguration.directories.e2eTestSrc = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwFolder, engineVariables.e2eTestSrcFolder));
                    uniteConfiguration.directories.e2eTestDist = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwFolder, engineVariables.e2eTestDistFolder));
                }
                uniteConfiguration.directories.reports = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwFolder, engineVariables.reportsFolder));
                uniteConfiguration.directories.assets = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwFolder, engineVariables.assetsFolder));
                uniteConfiguration.directories.assetsSource = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwFolder, engineVariables.assetsSourceFolder));
                return 0;
            }
            catch (err) {
                _super("error").call(this, logger, display, "Generating directories configuration failed", err, { wwwFolder: engineVariables.wwwFolder });
                return 1;
            }
        });
    }
}
exports.UniteConfigurationDirectories = UniteConfigurationDirectories;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3NjYWZmb2xkL3VuaXRlQ29uZmlndXJhdGlvbkRpcmVjdG9yaWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFPQSx3RkFBcUY7QUFDckYsZ0ZBQTZFO0FBRzdFLG1DQUEyQyxTQUFRLCtDQUFzQjtJQUN4RCxPQUFPLENBQUMsTUFBZSxFQUFFLE9BQWlCLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQ3RKLElBQUksQ0FBQztnQkFDRCxhQUFTLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxzQ0FBc0MsRUFBRSxFQUFFLFNBQVMsRUFBRSxlQUFlLENBQUMsU0FBUyxFQUFFLEVBQUU7Z0JBRTdHLGtCQUFrQixDQUFDLFdBQVcsR0FBRyxJQUFJLG1DQUFnQixFQUFFLENBQUM7Z0JBQ3hELGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxHQUFHLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMscUJBQXFCLENBQUMsZUFBZSxDQUFDLFNBQVMsRUFBRSxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDbEosa0JBQWtCLENBQUMsV0FBVyxDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUVwSixFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDL0Msa0JBQWtCLENBQUMsV0FBVyxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFLGVBQWUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO29CQUM1SixrQkFBa0IsQ0FBQyxXQUFXLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLGVBQWUsQ0FBQyxTQUFTLEVBQUUsZUFBZSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztvQkFDbEssa0JBQWtCLENBQUMsV0FBVyxDQUFDLFlBQVksR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hLLENBQUM7Z0JBRUQsa0JBQWtCLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUN4SixrQkFBa0IsQ0FBQyxXQUFXLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLGVBQWUsQ0FBQyxTQUFTLEVBQUUsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBRTFKLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLGFBQWEsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUM5QyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLGVBQWUsQ0FBQyxTQUFTLEVBQUUsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7b0JBQzFKLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMscUJBQXFCLENBQUMsZUFBZSxDQUFDLFNBQVMsRUFBRSxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO29CQUNoSyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLGVBQWUsQ0FBQyxTQUFTLEVBQUUsZUFBZSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztnQkFDdEssQ0FBQztnQkFFRCxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLGVBQWUsQ0FBQyxTQUFTLEVBQUUsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBRTFKLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMscUJBQXFCLENBQUMsZUFBZSxDQUFDLFNBQVMsRUFBRSxlQUFlLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDeEosa0JBQWtCLENBQUMsV0FBVyxDQUFDLFlBQVksR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BLLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxlQUFXLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSw2Q0FBNkMsRUFBRSxHQUFHLEVBQUUsRUFBRSxTQUFTLEVBQUUsZUFBZSxDQUFDLFNBQVMsRUFBRSxFQUFFO2dCQUMzSCxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztRQUNMLENBQUM7S0FBQTtDQUNKO0FBbENELHNFQWtDQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL3NjYWZmb2xkL3VuaXRlQ29uZmlndXJhdGlvbkRpcmVjdG9yaWVzLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
