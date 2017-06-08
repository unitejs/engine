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
            super.log(logger, display, "Generating unite.json in", { outputDirectory: uniteConfiguration.outputDirectory });

            uniteConfiguration.directories = new UniteDirectories();
            uniteConfiguration.directories.src = fileSystem.pathDirectoryRelative(uniteConfiguration.outputDirectory, engineVariables.sourceFolder);
            uniteConfiguration.directories.dist = fileSystem.pathDirectoryRelative(uniteConfiguration.outputDirectory, engineVariables.distFolder);
            uniteConfiguration.directories.unitTest = fileSystem.pathDirectoryRelative(uniteConfiguration.outputDirectory, engineVariables.unitTestFolder);
            uniteConfiguration.directories.unitTestSrc = fileSystem.pathDirectoryRelative(uniteConfiguration.outputDirectory, engineVariables.unitTestSrcFolder);
            uniteConfiguration.directories.unitTestDist = fileSystem.pathDirectoryRelative(uniteConfiguration.outputDirectory, engineVariables.unitTestDistFolder);
            uniteConfiguration.directories.e2eTestSrc = fileSystem.pathDirectoryRelative(uniteConfiguration.outputDirectory, engineVariables.e2eTestSrcFolder);
            uniteConfiguration.directories.e2eTestDist = fileSystem.pathDirectoryRelative(uniteConfiguration.outputDirectory, engineVariables.e2eTestDistFolder);

            await fileSystem.fileWriteJson(uniteConfiguration.outputDirectory, "unite.json", uniteConfiguration);
            return 0;
        } catch (err) {
            super.error(logger, display, "Generating unite.json failed", err, { outputDirectory: uniteConfiguration.outputDirectory });
            return 1;
        }
    }
}