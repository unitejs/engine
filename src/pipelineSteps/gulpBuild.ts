/**
 * Pipeline step to generate gulp tasks for build.
 */
import { BuildConfiguration } from "../configuration/models/build/buildConfiguration";
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../engine/enginePipelineStepBase";
import { EngineVariables } from "../engine/engineVariables";
import { IDisplay } from "../interfaces/IDisplay";
import { IFileSystem } from "../interfaces/IFileSystem";
import { ILogger } from "../interfaces/ILogger";

export class GulpBuild extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            super.log(logger, display, "Generating gulp build.config.json in", { gulpBuildFolder: engineVariables.gulpBuildFolder });

            const buildConfiguration = new BuildConfiguration();

            buildConfiguration.srcFolder = fileSystem.pathRelative(uniteConfiguration.outputDirectory, engineVariables.sourceFolder);
            buildConfiguration.distFolder = fileSystem.pathRelative(uniteConfiguration.outputDirectory, engineVariables.distFolder);
            buildConfiguration.unitTestSrcFolder = fileSystem.pathRelative(uniteConfiguration.outputDirectory, engineVariables.unitTestSrcFolder);
            buildConfiguration.unitTestDistFolder = fileSystem.pathRelative(uniteConfiguration.outputDirectory, engineVariables.unitTestDistFolder);
            buildConfiguration.e2eTestSrcFolder = fileSystem.pathRelative(uniteConfiguration.outputDirectory, engineVariables.e2eTestSrcFolder);
            buildConfiguration.e2eTestDistFolder = fileSystem.pathRelative(uniteConfiguration.outputDirectory, engineVariables.e2eTestDistFolder);
            buildConfiguration.sourceMaps = uniteConfiguration.sourceMaps;

            await fileSystem.fileWriteJson(engineVariables.gulpBuildFolder, "build.config.json", buildConfiguration);

            return 0;
        } catch (err) {
            super.error(logger, display, "Generating gulp build.config.json failed", err, { gulpBuildFolder: engineVariables.gulpBuildFolder });
            return 1;
        }
    }
}