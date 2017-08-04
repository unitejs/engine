/**
 * Pipeline step to generate README.md.
 */
import { IDisplay } from "unitejs-framework/dist/interfaces/IDisplay";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class ReadMe extends EnginePipelineStepBase {
    private static FILENAME: string = "README.md";

    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            const hasGeneratedMarker = await super.fileHasGeneratedMarker(fileSystem, engineVariables.wwwFolder, ReadMe.FILENAME);

            if (hasGeneratedMarker) {
                super.log(logger, display, `Writing ${ReadMe.FILENAME}`);

                const lines = await fileSystem.fileReadLines(engineVariables.packageAssetsDirectory, ReadMe.FILENAME);

                lines.unshift("");
                lines.unshift(`# ${uniteConfiguration.title}`);

                lines.push("---");
                lines.push(super.wrapGeneratedMarker("*", "* :zap:"));

                await fileSystem.fileWriteLines(engineVariables.wwwFolder, ReadMe.FILENAME, lines);
            } else {
                super.log(logger, display, `Skipping ${ReadMe.FILENAME} as it has no generated marker`);
            }

            return 0;
        } catch (err) {
            super.error(logger, display, `Writing ${ReadMe.FILENAME} failed`, err);
            return 1;
        }
    }
}
