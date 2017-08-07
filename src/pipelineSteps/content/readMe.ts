/**
 * Pipeline step to generate README.md.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class ReadMe extends EnginePipelineStepBase {
    private static FILENAME: string = "README.md";

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            const hasGeneratedMarker = await super.fileHasGeneratedMarker(fileSystem, engineVariables.wwwFolder, ReadMe.FILENAME);

            if (hasGeneratedMarker) {
                logger.info(`Generating ${ReadMe.FILENAME}`, { wwwFolder: engineVariables.wwwFolder});

                const lines = await fileSystem.fileReadLines(engineVariables.packageAssetsDirectory, ReadMe.FILENAME);

                lines.unshift("");
                lines.unshift(`# ${uniteConfiguration.title}`);

                lines.push("---");
                lines.push(super.wrapGeneratedMarker("*", "* :zap:"));

                await fileSystem.fileWriteLines(engineVariables.wwwFolder, ReadMe.FILENAME, lines);
            } else {
                logger.info(`Skipping ${ReadMe.FILENAME} as it has no generated marker`);
            }

            return 0;
        } catch (err) {
            logger.error(`Generating ${ReadMe.FILENAME} failed`, err);
            return 1;
        }
    }
}
