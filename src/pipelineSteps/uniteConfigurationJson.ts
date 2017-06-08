/**
 * Pipeline step to generate unite.json.
 */
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { UniteDirectories } from "../configuration/models/unite/uniteDirectories";
import { EnginePipelineStepBase } from "../engine/enginePipelineStepBase";
import { EngineVariables } from "../engine/engineVariables";
import { IDisplay } from "../interfaces/IDisplay";
import { IFileSystem } from "../interfaces/IFileSystem";
import { ILogger } from "../interfaces/ILogger";

export class UniteConfigurationJson extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            super.log(logger, display, "Generating unite.json in", { rootFolder: engineVariables.rootFolder });

            uniteConfiguration.directories = new UniteDirectories();
            uniteConfiguration.directories.src = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.sourceFolder));
            uniteConfiguration.directories.dist = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.distFolder));
            if (uniteConfiguration.unitTestRunner !== "None") {
                uniteConfiguration.directories.unitTest = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.unitTestFolder));
                uniteConfiguration.directories.unitTestSrc = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.unitTestSrcFolder));
                uniteConfiguration.directories.unitTestDist = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.unitTestDistFolder));
            }
            uniteConfiguration.directories.e2eTestSrc = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.e2eTestSrcFolder));
            uniteConfiguration.directories.e2eTestDist = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.e2eTestDistFolder));
            uniteConfiguration.directories.reports = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.reportsFolder));

            await fileSystem.fileWriteJson(engineVariables.rootFolder, "unite.json", uniteConfiguration);
            return 0;
        } catch (err) {
            super.error(logger, display, "Generating unite.json failed", err, { rootFolder: engineVariables.rootFolder });
            return 1;
        }
    }
}