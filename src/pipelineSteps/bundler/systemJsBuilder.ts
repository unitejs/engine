/**
 * Pipeline step to generate configuration for systemjs builder.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class SystemJsBuilder extends EnginePipelineStepBase {
    public async initialise(logger: ILogger,
                            fileSystem: IFileSystem,
                            uniteConfiguration: UniteConfiguration,
                            engineVariables: EngineVariables): Promise<number> {
        if (super.condition(uniteConfiguration.bundler, "SystemJSBuilder")) {
            if (!super.condition(uniteConfiguration.moduleType, "SystemJS")) {
                logger.error("You can only use SystemJS modules with SystemJSBuilder");
                return 1;
            }
        }
        return 0;
    }

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["systemjs-builder"], super.condition(uniteConfiguration.bundler, "SystemJSBuilder"));

        return 0;

    }
}
