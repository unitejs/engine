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
                _super("log").call(this, logger, display, "Generating directories configuration", { rootFolder: engineVariables.rootFolder });
                uniteConfiguration.directories = new uniteDirectories_1.UniteDirectories();
                uniteConfiguration.directories.src = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.srcFolder));
                uniteConfiguration.directories.dist = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.distFolder));
                if (uniteConfiguration.unitTestRunner !== "None") {
                    uniteConfiguration.directories.unitTest = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.unitTestFolder));
                    uniteConfiguration.directories.unitTestSrc = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.unitTestSrcFolder));
                    uniteConfiguration.directories.unitTestDist = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.unitTestDistFolder));
                }
                uniteConfiguration.directories.cssSrc = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.cssSrcFolder));
                uniteConfiguration.directories.cssDist = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.cssDistFolder));
                if (uniteConfiguration.e2eTestRunner !== "None") {
                    uniteConfiguration.directories.e2eTest = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.e2eTestFolder));
                    uniteConfiguration.directories.e2eTestSrc = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.e2eTestSrcFolder));
                    uniteConfiguration.directories.e2eTestDist = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.e2eTestDistFolder));
                }
                uniteConfiguration.directories.reports = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.reportsFolder));
                return 0;
            }
            catch (err) {
                _super("error").call(this, logger, display, "Generating directories configuration failed", err, { rootFolder: engineVariables.rootFolder });
                return 1;
            }
        });
    }
}
exports.UniteConfigurationDirectories = UniteConfigurationDirectories;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3NjYWZmb2xkL3VuaXRlQ29uZmlndXJhdGlvbkRpcmVjdG9yaWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFPQSx3RkFBcUY7QUFDckYsZ0ZBQTZFO0FBRzdFLG1DQUEyQyxTQUFRLCtDQUFzQjtJQUN4RCxPQUFPLENBQUMsTUFBZSxFQUFFLE9BQWlCLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQ3RKLElBQUksQ0FBQztnQkFDRCxhQUFTLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxzQ0FBc0MsRUFBRSxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsVUFBVSxFQUFFLEVBQUU7Z0JBRS9HLGtCQUFrQixDQUFDLFdBQVcsR0FBRyxJQUFJLG1DQUFnQixFQUFFLENBQUM7Z0JBQ3hELGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxHQUFHLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMscUJBQXFCLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDbkosa0JBQWtCLENBQUMsV0FBVyxDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUNySixFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDL0Msa0JBQWtCLENBQUMsV0FBVyxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO29CQUM3SixrQkFBa0IsQ0FBQyxXQUFXLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsZUFBZSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztvQkFDbkssa0JBQWtCLENBQUMsV0FBVyxDQUFDLFlBQVksR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pLLENBQUM7Z0JBQ0Qsa0JBQWtCLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUN6SixrQkFBa0IsQ0FBQyxXQUFXLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQzNKLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLGFBQWEsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUM5QyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7b0JBQzNKLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMscUJBQXFCLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO29CQUNqSyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsZUFBZSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztnQkFDdkssQ0FBQztnQkFDRCxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQzNKLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxlQUFXLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSw2Q0FBNkMsRUFBRSxHQUFHLEVBQUUsRUFBRSxVQUFVLEVBQUUsZUFBZSxDQUFDLFVBQVUsRUFBRSxFQUFFO2dCQUM3SCxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztRQUNMLENBQUM7S0FBQTtDQUNKO0FBM0JELHNFQTJCQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL3NjYWZmb2xkL3VuaXRlQ29uZmlndXJhdGlvbkRpcmVjdG9yaWVzLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
