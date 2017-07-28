/**
 * Pipeline step to generate configuration for browserify.
 */
import { IDisplay } from "unitejs-framework/dist/interfaces/IDisplay";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class Browserify extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["browserify"], uniteConfiguration.bundler === "Browserify");

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
