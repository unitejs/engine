/**
 * Pipeline step to generate browsersync configuration.
 */
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";
import { IDisplay } from "../../interfaces/IDisplay";
import { IFileSystem } from "../../interfaces/IFileSystem";
import { ILogger } from "../../interfaces/ILogger";

export class BrowserSync extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDependencies(["browser-sync"], uniteConfiguration.server === "BrowserSync", true);

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