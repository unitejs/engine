/**
 * Pipeline step to generate scaffolding for app.
 */
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { UniteLanguage } from "../configuration/models/unite/uniteLanguage";
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

            switch (engineVariables.uniteLanguage) {
                case UniteLanguage.ES5: this.buildES5AppMain(lines); ext = "js"; break;
                // case UniteLanguage.ES6: this.buildES6AppMain(lines); break;
                // case UniteLanguage.TypeScript: this.buildTypeScriptAppMain(lines); break;
                default: break;
            }

            await fileSystem.fileWriteLines(engineVariables.appSourceFolder, "main." + ext, lines);
            return 0;
        } catch (err) {
            super.error(logger, display, "Generating App main failed", err, { appSourceFolder: engineVariables.appSourceFolder });
            return 1;
        }
    }

    private buildES5AppMain(lines: string[]): void {
        lines.push("/**");
        lines.push(" * Main entry point for app.");
        lines.push(" */");
        lines.push("\"use strict\";");
        lines.push("function main() {");
        lines.push("    console.log('Hello ES5 UniteJS World');");
        lines.push("}");
    }
}