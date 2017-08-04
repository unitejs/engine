/**
 * Pipeline step to generate LICENSE.
 */
import { IDisplay } from "unitejs-framework/dist/interfaces/IDisplay";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class License extends EnginePipelineStepBase {
    private static FILENAME: string = "LICENSE";

    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            super.log(logger, display, `Writing ${License.FILENAME}`);

            await fileSystem.fileWriteLines(engineVariables.wwwFolder, License.FILENAME, engineVariables.license.licenseText.split("\n"));

            return 0;
        } catch (err) {
            super.error(logger, display, `Writing ${License.FILENAME} failed`, err);
            return 1;
        }
    }
}
