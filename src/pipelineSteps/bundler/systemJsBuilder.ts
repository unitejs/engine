/**
 * Pipeline step to generate configuration for systemjs builder.
 */
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";
import { IDisplay } from "../../interfaces/IDisplay";
import { IFileSystem } from "../../interfaces/IFileSystem";
import { ILogger } from "../../interfaces/ILogger";

export class SystemJsBuilder extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDependencies(["systemjs-builder"], uniteConfiguration.bundler === "SystemJSBuilder", true);

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