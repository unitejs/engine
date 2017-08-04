/**
 * Pipeline step to generate unite.json.
 */
import { IDisplay } from "unitejs-framework/dist/interfaces/IDisplay";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { UniteDirectories } from "../../configuration/models/unite/uniteDirectories";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class UniteConfigurationDirectories extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            super.log(logger, display, "Generating directories configuration", { wwwFolder: engineVariables.wwwFolder });

            uniteConfiguration.directories = new UniteDirectories();
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
        } catch (err) {
            super.error(logger, display, "Generating directories configuration failed", err, { wwwFolder: engineVariables.wwwFolder });
            return 1;
        }
    }
}
