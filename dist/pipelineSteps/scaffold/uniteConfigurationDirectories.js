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
const uniteWwwDirectories_1 = require("../../configuration/models/unite/uniteWwwDirectories");
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class UniteConfigurationDirectories extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger.info("Generating directories configuration", { wwwFolder: engineVariables.wwwRootFolder });
                uniteConfiguration.dirs = new uniteDirectories_1.UniteDirectories();
                uniteConfiguration.dirs.wwwRoot = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.wwwRootFolder));
                uniteConfiguration.dirs.packagedRoot = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.packagedRootFolder));
                uniteConfiguration.dirs.www = new uniteWwwDirectories_1.UniteWwwDirectories();
                uniteConfiguration.dirs.www.src = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.srcFolder));
                uniteConfiguration.dirs.www.dist = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.distFolder));
                if (uniteConfiguration.unitTestRunner !== "None") {
                    uniteConfiguration.dirs.www.unitTest = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.unitTestFolder));
                    uniteConfiguration.dirs.www.unitTestSrc = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.unitTestSrcFolder));
                    uniteConfiguration.dirs.www.unitTestDist = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.unitTestDistFolder));
                }
                uniteConfiguration.dirs.www.cssSrc = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.cssSrcFolder));
                uniteConfiguration.dirs.www.cssDist = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.cssDistFolder));
                if (uniteConfiguration.e2eTestRunner !== "None") {
                    uniteConfiguration.dirs.www.e2eTest = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.e2eTestFolder));
                    uniteConfiguration.dirs.www.e2eTestSrc = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.e2eTestSrcFolder));
                    uniteConfiguration.dirs.www.e2eTestDist = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.e2eTestDistFolder));
                }
                uniteConfiguration.dirs.www.reports = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.reportsFolder));
                uniteConfiguration.dirs.www.package = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.packageFolder));
                uniteConfiguration.dirs.www.assets = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.assetsFolder));
                uniteConfiguration.dirs.www.assetsSource = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.assetsSourceFolder));
                return 0;
            }
            catch (err) {
                logger.error("Generating directories configuration failed", err, { wwwFolder: engineVariables.wwwRootFolder });
                return 1;
            }
        });
    }
}
exports.UniteConfigurationDirectories = UniteConfigurationDirectories;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3NjYWZmb2xkL3VuaXRlQ29uZmlndXJhdGlvbkRpcmVjdG9yaWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFNQSx3RkFBcUY7QUFDckYsOEZBQTJGO0FBQzNGLGdGQUE2RTtBQUc3RSxtQ0FBMkMsU0FBUSwrQ0FBc0I7SUFDeEQsT0FBTyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOztZQUNuSSxJQUFJLENBQUM7Z0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxzQ0FBc0MsRUFBRSxFQUFFLFNBQVMsRUFBRSxlQUFlLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztnQkFFbEcsa0JBQWtCLENBQUMsSUFBSSxHQUFHLElBQUksbUNBQWdCLEVBQUUsQ0FBQztnQkFFakQsa0JBQWtCLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUNwSixrQkFBa0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsZUFBZSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztnQkFFOUosa0JBQWtCLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLHlDQUFtQixFQUFFLENBQUM7Z0JBQ3hELGtCQUFrQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLGVBQWUsQ0FBQyxhQUFhLEVBQUUsZUFBZSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUN2SixrQkFBa0IsQ0FBQyxJQUFJLENBQUMs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QWtCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMscUJBQXFCLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxlQUFlLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQzdKLGtCQUFrQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLGVBQWUsQ0FBQyxhQUFhLEVBQUUsZUFBZSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pLLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxNQUFNLENBQUMsS0FBSyxDQUFDLDZDQUE2QyxFQUFFLEdBQUcsRUFBRSxFQUFFLFNBQVMsRUFBRSxlQUFlLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztnQkFDL0csTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7UUFDTCxDQUFDO0tBQUE7Q0FDSjtBQXhDRCxzRUF3Q0MiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9zY2FmZm9sZC91bml0ZUNvbmZpZ3VyYXRpb25EaXJlY3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMifQ==
