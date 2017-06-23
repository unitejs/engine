/**
 * Pipeline step to generate LICENSE.
 */
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";
import { IDisplay } from "../../interfaces/IDisplay";
import { IFileSystem } from "../../interfaces/IFileSystem";
import { ILogger } from "../../interfaces/ILogger";

export class License extends EnginePipelineStepBase {
    private static FILENAME: string = "LICENSE";

    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            super.log(logger, display, `Writing ${License.FILENAME}`);

            await fileSystem.fileWriteLines(engineVariables.rootFolder, License.FILENAME, engineVariables.license.licenseText.split("\n"));

            return 0;
        } catch (err) {
            super.error(logger, display, `Writing ${License.FILENAME} failed`, err);
            return 1;
        }
    }
}