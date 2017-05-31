/**
 * Pipeline step to generate scaffolding for app.
 */
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { UniteSourceLanguage } from "../configuration/models/unite/uniteSourceLanguage";
import { EnginePipelineStepBase } from "../engine/enginePipelineStepBase";
import { EngineVariables } from "../engine/engineVariables";
import { IDisplay } from "../interfaces/IDisplay";
import { IFileSystem } from "../interfaces/IFileSystem";
import { ILogger } from "../interfaces/ILogger";

export class GenerateAppScaffold extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.appSourceFolder = fileSystem.directoryPathCombine(uniteConfiguration.outputDirectory, "\\src");
        try {
            super.log(logger, display, "Creating App Source Directory", { appSourceFolder: engineVariables.appSourceFolder });
            await fileSystem.directoryCreate(engineVariables.appSourceFolder);
        } catch (err) {
            super.error(logger, display, "Creating App Source Directory failed", err, { appSourceFolder: engineVariables.appSourceFolder });
            return 1;
        }

        try {
            super.log(logger, display, "Generating App Main in", { appSourceFolder: engineVariables.appSourceFolder });

            const lines: string[] = [];
            const ext = engineVariables.uniteSourceLanguage === "JavaScript" ? "js" : "ts";

            this.buildAppMain(lines, engineVariables.uniteSourceLanguage);

            await fileSystem.fileWriteLines(engineVariables.appSourceFolder, "main." + ext, lines);
            return 0;
        } catch (err) {
            super.error(logger, display, "Generating App main failed", err, { appSourceFolder: engineVariables.appSourceFolder });
            return 1;
        }
    }

    private buildAppMain(lines: string[], language: UniteSourceLanguage): void {
        const quote = language === "JavaScript" ? "'" : "\"";

        lines.push("/**");
        lines.push(" * Main entry point for app.");
        lines.push(" */");
        lines.push("export function entryPoint() {");
        lines.push("    document.body.innerHTML = " + quote + "Hello " + language + " UniteJS World!" + quote + ";");
        lines.push("}");
    }
}