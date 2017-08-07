/**
 * Pipeline step to generate browsersync configuration.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class BrowserSync extends EnginePipelineStepBase {
    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["browser-sync"], uniteConfiguration.server === "BrowserSync");

        if (uniteConfiguration.server === "BrowserSync") {
            try {
                logger.info("Generating BrowserSync Configuration", { wwwFolder: engineVariables.wwwRootFolder});

                return 0;
            } catch (err) {
                logger.error("Generating BrowserSync configuration failed", err);
                return 1;
            }
        }

        return 0;
    }
}
