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

            buildConfiguration.srcFolder = "./src/";
            buildConfiguration.distFolder = "./dist/";
            buildConfiguration.unitTestFolder = "./test/unit/";
            buildConfiguration.e2eTestFolder = "./test/e2e/";
            buildConfiguration.sourceMaps = uniteConfiguration.sourceMaps;

            await fileSystem.fileWriteJson(engineVariables.gulpBuildFolder, "build.config.json", buildConfiguration);

            return 0;
        } catch (err) {
            super.error(logger, display, "Generating gulp build.config.json failed", err, { gulpBuildFolder: engineVariables.gulpBuildFolder });
            return 1;
        }
    }
}