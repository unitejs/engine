/**
 * Pipeline step to generate configuration for requirejs optimizer.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class RequireJs extends PipelineStepBase {
    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): boolean | undefined {
        return super.condition(uniteConfiguration.bundler, "RequireJS");
    }

    public async initialise(logger: ILogger,
                            fileSystem: IFileSystem,
                            uniteConfiguration: UniteConfiguration,
                            engineVariables: EngineVariables,
                            mainCondition: boolean): Promise<number> {
        if (mainCondition) {
            if (!super.condition(uniteConfiguration.moduleType, "AMD")) {
                logger.error("You can only use RequireJS with AMD modules");
                return 1;
            }
        }

        return 0;
    }

    public async configure(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        engineVariables.toggleDevDependency(["requirejs"], mainCondition);

        return 0;
    }
}
