/**
 * Pipeline step to generate configuration for webpack.
 */
import { IDisplay } from "unitejs-framework/dist/interfaces/IDisplay";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class Webpack extends EnginePipelineStepBase {
    public async prerequisites(logger: ILogger,
                               display: IDisplay,
                               fileSystem: IFileSystem,
                               uniteConfiguration: UniteConfiguration,
                               engineVariables: EngineVariables): Promise<number> {
        if (uniteConfiguration.bundler === "Webpack") {
            if (uniteConfiguration.moduleType !== "CommonJS") {
                super.error(logger, display, "You can only use CommonJS modules with Webpack");
                return 1;
            }
        }
        return 0;
    }

    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["webpack", "source-map-loader", "uglifyjs-webpack-plugin"], uniteConfiguration.bundler === "Webpack");

        return 0;
    }
}
