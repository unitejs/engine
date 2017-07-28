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
            const hasGeneratedMarker = await super.fileHasGeneratedMarker(fileSystem, engineVariables.rootFolder, ReadMe.FILENAME);

            if (hasGeneratedMarker) {
                super.log(logger, display, `Writing ${ReadMe.FILENAME}`);

                const lines: string[] = [];

                lines.push(`# ${uniteConfiguration.title}`);
                lines.push("");
                lines.push("## Installation");
                lines.push("");
                lines.push("The following pre-requisites are needed before you can build the app.");
                lines.push("");
                lines.push("\tnpm -g install gulp [or] yarn global add gulp");
                lines.push("");
                lines.push("You will then need to install the packages required by the tasks.");
                lines.push("");
                lines.push("\tnpm install [or] yarn install");
                lines.push("");
                lines.push("## Build");
                lines.push("");
                lines.push("To build your application execute the following command:");
                lines.push("");
                lines.push("\tgulp build");
                lines.push("");
                lines.push("## Unit Testing");
                lines.push("");
                lines.push("To unit test your code execute the following command (this will also generate unit and coverage reports in the reports folder):");
                lines.push("");
                lines.push("\tgulp unit");
                lines.push("");
                lines.push("## Serving");
                lines.push("");
                lines.push("To view your application execute the following command and enter the displayed url in your browser:");
                lines.push("");
                lines.push("---");
                lines.push(super.wrapGeneratedMarker("*", "* :zap:"));

                await fileSystem.fileWriteLines(engineVariables.rootFolder, ReadMe.FILENAME, lines);
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
