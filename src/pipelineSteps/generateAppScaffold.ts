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
            let ext = "";

            switch (engineVariables.uniteSourceLanguage) {
                case UniteSourceLanguage.JavaScript: this.buildJavaScriptAppMain(lines); ext = "js"; break;
                // case UniteSourceLanguage.TypeScript: this.buildTypeScriptAppMain(lines); break;
                default: break;
            }

            await fileSystem.fileWriteLines(engineVariables.appSourceFolder, "main." + ext, lines);
            return 0;
        } catch (err) {
            super.error(logger, display, "Generating App main failed", err, { appSourceFolder: engineVariables.appSourceFolder });
            return 1;
        }
    }

    private buildJavaScriptAppMain(lines: string[]): void {
        lines.push("/**");
        lines.push(" * Main entry point for app.");
        lines.push(" */");
        lines.push("export function entryPoint() {");
        lines.push("    console.log('Hello JavaScript UniteJS World');");
        lines.push("}");
    }
}