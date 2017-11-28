/**
 * Pipeline step to generate unite.json.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { UniteDirectories } from "../../configuration/models/unite/uniteDirectories";
import { UniteWwwDirectories } from "../../configuration/models/unite/uniteWwwDirectories";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class UniteConfigurationDirectories extends PipelineStepBase {
    public async configure(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        uniteConfiguration.dirs = new UniteDirectories();

        uniteConfiguration.dirs.wwwRoot = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.wwwRootFolder));
        uniteConfiguration.dirs.packagedRoot = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.packagedRootFolder));
        uniteConfiguration.dirs.platformRoot = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.platformRootFolder));
        uniteConfiguration.dirs.docsRoot = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.docsRootFolder));

        uniteConfiguration.dirs.www = new UniteWwwDirectories();
        uniteConfiguration.dirs.www.src = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.src));
        uniteConfiguration.dirs.www.dist = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.dist));

        if (!super.condition(uniteConfiguration.unitTestRunner, "None")) {
            uniteConfiguration.dirs.www.unitTest = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.unitRoot));
            uniteConfiguration.dirs.www.unitTestSrc = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.unit));
            uniteConfiguration.dirs.www.unitTestDist = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.unitDist));
        }

        uniteConfiguration.dirs.www.cssSrc = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.css));
        uniteConfiguration.dirs.www.cssDist = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.cssDist));

        if (!super.condition(uniteConfiguration.e2eTestRunner, "None")) {
            uniteConfiguration.dirs.www.e2eTest = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.e2eRoot));
            uniteConfiguration.dirs.www.e2eTestSrc = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.e2e));
            uniteConfiguration.dirs.www.e2eTestDist = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.e2eDist));
        }

        uniteConfiguration.dirs.www.reports = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.reports));
        uniteConfiguration.dirs.www.package = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.package));
        uniteConfiguration.dirs.www.build = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.build));

        uniteConfiguration.dirs.www.assets = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.assets));
        uniteConfiguration.dirs.www.assetsSrc = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.assetsSrc));

        uniteConfiguration.dirs.www.configuration = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.configuration));
        return 0;
    }
}
