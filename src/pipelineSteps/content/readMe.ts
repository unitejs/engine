/**
 * Pipeline step to generate README.md.
 */
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";
import { IDisplay } from "../../interfaces/IDisplay";
import { IFileSystem } from "../../interfaces/IFileSystem";
import { ILogger } from "../../interfaces/ILogger";

export class ReadMe extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            super.log(logger, display, "Writing README.md");

            // If the current file has our marker at the end then overwrite, if its been removed then keep content
            const hasMarker = await super.fileHasMarker(fileSystem, engineVariables.rootFolder, "README.md");

            if (hasMarker) {
                const lines: string[] = [];

                lines.push("# " + uniteConfiguration.title);
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
                lines.push(super.wrapMarker("*", "* :zap:"));

                await fileSystem.fileWriteLines(engineVariables.rootFolder, "README.md", lines);
            } else {
                super.log(logger, display, "Skipping README.md as it has no marker");
            }

            return 0;
        } catch (err) {
            super.error(logger, display, "Writing README.md failed", err);
            return 1;
        }
    }
}