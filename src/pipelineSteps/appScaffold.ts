/**
 * Pipeline step to generate scaffolding for app.
 */
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { StringHelper } from "../core/stringHelper";
import { EnginePipelineStepBase } from "../engine/enginePipelineStepBase";
import { EngineVariables } from "../engine/engineVariables";
import { IDisplay } from "../interfaces/IDisplay";
import { IFileSystem } from "../interfaces/IFileSystem";
import { ILogger } from "../interfaces/ILogger";

export class AppScaffold extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.sourceFolder = fileSystem.pathCombine(uniteConfiguration.outputDirectory, "\\src");
        engineVariables.distFolder = fileSystem.pathCombine(uniteConfiguration.outputDirectory, "\\dist");

        try {
            super.log(logger, display, "Creating App Source Directory", { appSourceFolder: engineVariables.sourceFolder });
            await fileSystem.directoryCreate(engineVariables.sourceFolder);
        } catch (err) {
            super.error(logger, display, "Creating App Source Directory failed", err, { appSourceFolder: engineVariables.sourceFolder });
            return 1;
        }

        const scaffoldFolder = fileSystem.pathCombine(engineVariables.assetsDirectory, "\\scaffold\\src\\" + StringHelper.toCamelCase(uniteConfiguration.sourceLanguage));

        try {
            super.log(logger, display, "Generating Main in", { appSourceFolder: engineVariables.sourceFolder });

            await this.copyFile(logger, display, fileSystem, scaffoldFolder, "main." + engineVariables.sourceLanguageExt, engineVariables.sourceFolder, "main." + engineVariables.sourceLanguageExt);
        } catch (err) {
            super.error(logger, display, "Generating Main failed", err, { appSourceFolder: engineVariables.sourceFolder });
            return 1;
        }

        try {
            const fileExists = await fileSystem.fileExists(engineVariables.sourceFolder, "app." + engineVariables.sourceLanguageExt);
            if (!fileExists) {
                await this.copyFile(logger, display, fileSystem, scaffoldFolder, "app." + engineVariables.sourceLanguageExt, engineVariables.sourceFolder, "app." + engineVariables.sourceLanguageExt);
            }
            return 0;
        } catch (err) {
            super.error(logger, display, "Generating App failed", err, { appSourceFolder: engineVariables.sourceFolder });
            return 1;
        }
    }
}