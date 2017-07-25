/**
 * Pipeline step to generate configuration for webpack.
 */
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";
import { IDisplay } from "../../interfaces/IDisplay";
import { IFileSystem } from "../../interfaces/IFileSystem";
import { ILogger } from "../../interfaces/ILogger";

export class Webpack extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["webpack", "source-map-loader", "uglifyjs-webpack-plugin"], uniteConfiguration.bundler === "Webpack");

        if (uniteConfiguration.bundler === "Webpack") {
             try {
                if (uniteConfiguration.moduleType !== "CommonJS") {
                    throw new Error("You can only use CommonJS modules with Webpack");
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