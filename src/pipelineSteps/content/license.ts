/**
 * Pipeline step to generate LICENSE.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineKey } from "../../engine/pipelineKey";

export class License extends EnginePipelineStepBase {
    private static FILENAME: string = "LICENSE";

    public influences(): PipelineKey[] {
        return [
            new PipelineKey("scaffold", "uniteConfigurationJson")
        ];
    }

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            logger.info(`Generating ${License.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder});

            const yearString = new Date().getFullYear().toString();
            const replaced = engineVariables.license.licenseText.replace(/<year>/gi, yearString);

            await fileSystem.fileWriteText(engineVariables.wwwRootFolder, License.FILENAME, replaced);

            return 0;
        } catch (err) {
            logger.error(`Generating ${License.FILENAME} failed`, err);
            return 1;
        }
    }
}
