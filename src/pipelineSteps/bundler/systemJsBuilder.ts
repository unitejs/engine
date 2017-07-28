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
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["systemjs-builder"], uniteConfiguration.bundler === "SystemJSBuilder");

        if (uniteConfiguration.bundler === "SystemJSBuilder") {
            try {
                if (uniteConfiguration.moduleType !== "SystemJS") {
                    throw new Error("You can only use SystemJS modules with SystemJS Builder");
                }

                return 0;
            } catch (err) {
                super.error(logger, display, "Generating Bundler configuration failed", err);
                return 1;
            }
        }
        return 0;

    }
}
