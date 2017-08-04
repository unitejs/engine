/**
 * Pipeline step to generate unite.json.
 */
import { IDisplay } from "unitejs-framework/dist/interfaces/IDisplay";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class UniteConfigurationJson extends EnginePipelineStepBase {
    private static FILENAME: string = "unite.json";

    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            super.log(logger, display, `Generating ${UniteConfigurationJson.FILENAME} in`, { wwwFolder: engineVariables.wwwFolder });

            await fileSystem.fileWriteJson(engineVariables.wwwFolder, UniteConfigurationJson.FILENAME, uniteConfiguration);
            return 0;
        } catch (err) {
            super.error(logger, display, `Generating ${UniteConfigurationJson.FILENAME} failed`, err, { wwwFolder: engineVariables.wwwFolder });
            return 1;
        }
    }
}
