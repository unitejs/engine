/**
 * Pipeline step to generate scaffolding for gulp.
 */
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { UniteModuleLoader } from "../configuration/models/unite/uniteModuleLoader";
import { EnginePipelineStepBase } from "../engine/enginePipelineStepBase";
import { EngineVariables } from "../engine/engineVariables";
import { IDisplay } from "../interfaces/IDisplay";
import { IFileSystem } from "../interfaces/IFileSystem";
import { ILogger } from "../interfaces/ILogger";

export class GenerateModuleLoaderScaffold extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            super.log(logger, display, "Generating Module Loader Scaffold", { });

            switch (engineVariables.uniteModuleLoader) {
                case UniteModuleLoader.RequireJS: uniteConfiguration.dependencies.requirejs = "^2.3.3"; break;
                default: break;
            }

            return 0;
        } catch (err) {
            super.error(logger, display, "Generating Module Loader Scaffold failed", err, { outputDirectory: uniteConfiguration.outputDirectory });
            return 1;
        }
    }
}