/**
 * Pipeline step to generate configuration for browserify.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class Browserify extends PipelineStepBase {
    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): boolean | undefined {
        return super.condition(uniteConfiguration.bundler, "Browserify");
    }

    public async initialise(logger: ILogger,
                            fileSystem: IFileSystem,
                            uniteConfiguration: UniteConfiguration,
                            engineVariables: EngineVariables,
                            mainCondition: boolean): Promise<number> {
        if (mainCondition) {
            if (!super.condition(uniteConfiguration.moduleType, "CommonJS")) {
                logger.error("You can only use Browserify with CommonJS modules");
                return 1;
            }
        }
        return 0;
    }

    public async configure(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        engineVariables.toggleDevDependency(["browserify"], mainCondition);
        return 0;
    }
}
