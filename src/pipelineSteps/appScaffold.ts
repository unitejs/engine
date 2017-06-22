/**
 * Pipeline step to generate scaffolding for app.
 */
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../engine/enginePipelineStepBase";
import { EngineVariables } from "../engine/engineVariables";
import { IDisplay } from "../interfaces/IDisplay";
import { IFileSystem } from "../interfaces/IFileSystem";
import { ILogger } from "../interfaces/ILogger";

export class AppScaffold extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            super.log(logger, display, "Creating App Source Directory", { appSourceFolder: engineVariables.srcFolder });
            await fileSystem.directoryCreate(engineVariables.srcFolder);
        } catch (err) {
            super.error(logger, display, "Creating App Source Directory failed", err, { appSourceFolder: engineVariables.srcFolder });
            return 1;
        }

        const scaffoldFolder = fileSystem.pathCombine(engineVariables.assetsDirectory, "\\scaffold\\src\\" + uniteConfiguration.sourceLanguage.toLowerCase());

        try {
            super.log(logger, display, "Generating Main in", { appSourceFolder: engineVariables.srcFolder });

            await this.copyFile(logger, display, fileSystem,
                                scaffoldFolder,
                                "main." + engineVariables.sourceLanguageExt,
                                engineVariables.srcFolder,
                                "main." + engineVariables.sourceLanguageExt);
        } catch (err) {
            super.error(logger, display, "Generating Main failed", err, { appSourceFolder: engineVariables.srcFolder });
            return 1;
        }

        try {
            super.log(logger, display, "Generating EntryPoint in", { appSourceFolder: engineVariables.srcFolder });

            await this.copyFile(logger, display, fileSystem,
                                scaffoldFolder,
                                "entryPoint." + engineVariables.sourceLanguageExt,
                                engineVariables.srcFolder,
                                "entryPoint." + engineVariables.sourceLanguageExt);
        } catch (err) {
            super.error(logger, display, "Generating EntryPoint failed", err, { appSourceFolder: engineVariables.srcFolder });
            return 1;
        }

        try {
            const fileExists = await fileSystem.fileExists(engineVariables.srcFolder, "app." + engineVariables.sourceLanguageExt);
            if (!fileExists) {
                await this.copyFile(logger, display, fileSystem, scaffoldFolder, "app." + engineVariables.sourceLanguageExt, engineVariables.srcFolder, "app." + engineVariables.sourceLanguageExt);
            }
            return 0;
        } catch (err) {
            super.error(logger, display, "Generating App failed", err, { appSourceFolder: engineVariables.srcFolder });
            return 1;
        }
    }
}