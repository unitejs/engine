/**
 * Pipeline step to generate handle css styling.
 */
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";
import { IDisplay } from "../../interfaces/IDisplay";
import { IFileSystem } from "../../interfaces/IFileSystem";
import { ILogger } from "../../interfaces/ILogger";

export class Css extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        if (uniteConfiguration.cssPre === "Css") {
            try {
                super.log(logger, display, "Creating cssSrc folder", { cssSrcFolder: engineVariables.cssSrcFolder });

                engineVariables.cssSrcFolder = fileSystem.pathCombine(engineVariables.rootFolder, "\\cssSrc");

                await fileSystem.directoryCreate(engineVariables.cssSrcFolder);
                await fileSystem.directoryCreate(engineVariables.cssDistFolder);

                const assetCssFolder = fileSystem.pathCombine(engineVariables.assetsDirectory, "scaffold/css/css");

                const exists = await fileSystem.fileExists(engineVariables.cssSrcFolder, "app.css");
                if (!exists) {
                    super.copyFile(logger, display, fileSystem, assetCssFolder, "app.css", engineVariables.cssSrcFolder, "app.css");
                }
                super.copyFile(logger, display, fileSystem, assetCssFolder, "main.css", engineVariables.cssSrcFolder, "main.css");
                super.copyFile(logger, display, fileSystem, assetCssFolder, "reset.css", engineVariables.cssSrcFolder, "reset.css");
                return 0;
            } catch (err) {
                super.error(logger, display, "Generating css folder failed", err, { cssSrcFolder: engineVariables.cssSrcFolder });
                return 1;
            }
        }

        return 0;
    }
}