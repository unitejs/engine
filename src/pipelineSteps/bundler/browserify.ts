/**
 * Pipeline step to generate configuration for browserify.
 */
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";
import { IDisplay } from "../../interfaces/IDisplay";
import { IFileSystem } from "../../interfaces/IFileSystem";
import { ILogger } from "../../interfaces/ILogger";

export class Browserify extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDependencies(["browserify"], uniteConfiguration.bundler === "Browserify", true);

        if (uniteConfiguration.bundler === "Browserify") {
             try {
                if (uniteConfiguration.moduleType !== "CommonJS") {
                    throw new Error("You can only use CommonJS modules with Browserify");
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