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
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger.info("Generating directories configuration", { wwwFolder: engineVariables.wwwFolder });
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
                logger.error("Generating directories configuration failed", err, { wwwFolder: engineVariables.wwwFolder });
                return 1;
            }
        });
    }
}
exports.UniteConfigurationDirectories = UniteConfigurationDirectories;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3NjYWZmb2xkL3VuaXRlQ29uZmlndXJhdGlvbkRpcmVjdG9yaWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFNQSx3RkFBcUY7QUFDckYsZ0ZBQTZFO0FBRzdFLG1DQUEyQyxTQUFRLCtDQUFzQjtJQUN4RCxPQUFPLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7O1lBQ25JLElBQUksQ0FBQztnQkFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLHNDQUFzQyxFQUFFLEVBQUUsU0FBUyxFQUFFLGVBQWUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO2dCQUU5RixrQkFBa0IsQ0FBQyxXQUFXLEdBQUcsSUFBSSxtQ0FBZ0IsRUFBRSxDQUFDO2dCQUN4RCxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsR0FBRyxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLGVBQWUsQ0FBQyxTQUFTLEVBQUUsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xKLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMscUJBQXFCLENBQUMsZUFBZSxDQUFDLFNBQVMsRUFBRSxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFFcEosRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsY0FBYyxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQy9DLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMscUJBQXFCLENBQUMsZUFBZSxDQUFDLFNBQVMsRUFBRSxlQUFlLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztvQkFDNUosa0JBQWtCLENBQUMsV0FBVyxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7b0JBQ2xLLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxZQUFZLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMscUJBQXFCLENBQUMsZUFBZSxDQUFDLFNBQVMsRUFBRSxlQUFlLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO2dCQUN4SyxDQUFDO2dCQUVELGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMscUJBQXFCLENBQUMsZUFBZSxDQUFDLFNBQVMsRUFBRSxlQUFlLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDeEosa0JBQWtCLENBQUMsV0FBVyxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFLGVBQWUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUUxSixFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDOUMsa0JBQWtCLENBQUMsV0FBVyxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFLGVBQWUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO29CQUMxSixrQkFBa0IsQ0FBQyxXQUFXLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLGVBQWUsQ0FBQyxTQUFTLEVBQUUsZUFBZSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztvQkFDaEssa0JBQWtCLENBQUMsV0FBVyxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RLLENBQUM7Z0JBRUQsa0JBQWtCLENBQUMsV0FBVyxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFLGVBQWUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUUxSixrQkFBa0IsQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLGVBQWUsQ0FBQyxTQUFTLEVBQUUsZUFBZSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQ3hKLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxZQUFZLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMscUJBQXFCLENBQUMsZUFBZSxDQUFDLFNBQVMsRUFBRSxlQUFlLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO2dCQUNwSyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsTUFBTSxDQUFDLEtBQUssQ0FBQyw2Q0FBNkMsRUFBRSxHQUFHLEVBQUUsRUFBRSxTQUFTLEVBQUUsZUFBZSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7Z0JBQzNHLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1FBQ0wsQ0FBQztLQUFBO0NBQ0o7QUFsQ0Qsc0VBa0NDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvc2NhZmZvbGQvdW5pdGVDb25maWd1cmF0aW9uRGlyZWN0b3JpZXMuanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
