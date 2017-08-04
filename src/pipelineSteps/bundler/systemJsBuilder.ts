/**
 * Pipeline step to generate configuration for systemjs builder.
 */
import { IDisplay } from "unitejs-framework/dist/interfaces/IDisplay";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class SystemJsBuilder extends EnginePipelineStepBase {
    public async prerequisites(logger: ILogger,
                               display: IDisplay,
                               fileSystem: IFileSystem,
                               uniteConfiguration: UniteConfiguration,
                               engineVariables: EngineVariables): Promise<number> {
        if (uniteConfiguration.bundler === "SystemJSBuilder") {
            if (uniteConfiguration.moduleType !== "SystemJS") {
                super.error(logger, display, "You can only use SystemJS modules with SystemJSBuilder");
                return 1;
            }
        }
        return 0;
    }

    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["systemjs-builder"], uniteConfiguration.bundler === "SystemJSBuilder");

        return 0;

    }
}
