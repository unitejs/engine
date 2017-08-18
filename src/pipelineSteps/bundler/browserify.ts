/**
 * Pipeline step to generate configuration for browserify.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class Browserify extends EnginePipelineStepBase {
    public async preProcess(logger: ILogger,
                            fileSystem: IFileSystem,
                            uniteConfiguration: UniteConfiguration,
                            engineVariables: EngineVariables): Promise<number> {
        if (uniteConfiguration.bundler === "Browserify") {
            if (uniteConfiguration.moduleType !== "CommonJS") {
                logger.error("You can only use CommonJS modules with Browserify");
                return 1;
            }
        }
        return 0;
    }

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["browserify"], uniteConfiguration.bundler === "Browserify");

        return 0;
    }
}
