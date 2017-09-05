/**
 * Pipeline step to generate unite.json.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { UniteDirectories } from "../../configuration/models/unite/uniteDirectories";
import { UniteWwwDirectories } from "../../configuration/models/unite/uniteWwwDirectories";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineKey } from "../../engine/pipelineKey";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class UniteConfigurationDirectories extends PipelineStepBase {
    public influences(): PipelineKey[] {
        return [
            new PipelineKey("unite", "uniteConfigurationJson")
        ];
    }

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            logger.info("Generating directories configuration", { wwwFolder: engineVariables.wwwRootFolder });

            uniteConfiguration.dirs = new UniteDirectories();

            uniteConfiguration.dirs.wwwRoot = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.wwwRootFolder));
            uniteConfiguration.dirs.packagedRoot = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.packagedRootFolder));

            uniteConfiguration.dirs.www = new UniteWwwDirectories();
            uniteConfiguration.dirs.www.src = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.srcFolder));
            uniteConfiguration.dirs.www.dist = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.distFolder));

            if (!super.condition(uniteConfiguration.unitTestRunner, "None")) {
                uniteConfiguration.dirs.www.unitTest = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.unitTestFolder));
                uniteConfiguration.dirs.www.unitTestSrc = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.unitTestSrcFolder));
                uniteConfiguration.dirs.www.unitTestDist = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.unitTestDistFolder));
            }

            uniteConfiguration.dirs.www.cssSrc = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.cssSrcFolder));
            uniteConfiguration.dirs.www.cssDist = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.cssDistFolder));

            if (!super.condition(uniteConfiguration.e2eTestRunner, "None")) {
                uniteConfiguration.dirs.www.e2eTest = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.e2eTestFolder));
                uniteConfiguration.dirs.www.e2eTestSrc = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.e2eTestSrcFolder));
                uniteConfiguration.dirs.www.e2eTestDist = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.e2eTestDistFolder));
            }

            uniteConfiguration.dirs.www.reports = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.reportsFolder));
            uniteConfiguration.dirs.www.package = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.packageFolder));
            uniteConfiguration.dirs.www.build = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.buildFolder));

            uniteConfiguration.dirs.www.assets = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.assetsFolder));
            uniteConfiguration.dirs.www.assetsSrc = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.assetsSrcFolder));
            return 0;
        } catch (err) {
            logger.error("Generating directories configuration failed", err, { wwwFolder: engineVariables.wwwRootFolder });
            return 1;
        }
    }
}
