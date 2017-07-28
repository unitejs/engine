/**
 * Pipeline step to generate browsersync configuration.
 */
import { IDisplay } from "unitejs-framework/dist/interfaces/IDisplay";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class BrowserSync extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["browser-sync"], uniteConfiguration.server === "BrowserSync");

        if (uniteConfiguration.server === "BrowserSync") {
            try {
                super.log(logger, display, "Generating BrowserSync Configuration");

                return 0;
            } catch (err) {
                super.error(logger, display, "Generating BrowserSync configuration failed", err);
                return 1;
            }
        }

        return 0;
    }
}
