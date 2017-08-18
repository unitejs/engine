/**
 * Pipeline step to generate configuration for requirejs optimizer.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class RequireJs extends EnginePipelineStepBase {
    public async preProcess(logger: ILogger,
                            fileSystem: IFileSystem,
                            uniteConfiguration: UniteConfiguration,
                            engineVariables: EngineVariables): Promise<number> {
        if (uniteConfiguration.bundler === "RequireJS") {
            if (uniteConfiguration.moduleType !== "AMD") {
                logger.error("You can only use AMD modules with RequireJS");
                return 1;
            }
        }
        return 0;
    }

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["requirejs"], uniteConfiguration.bundler === "RequireJS");

        return 0;
    }
}
