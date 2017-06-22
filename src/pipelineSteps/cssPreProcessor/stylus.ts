/**
 * Pipeline step to generate handle stylus styling.
 */
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";
import { IDisplay } from "../../interfaces/IDisplay";
import { IFileSystem } from "../../interfaces/IFileSystem";
import { ILogger } from "../../interfaces/ILogger";

export class Stylus extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        if (uniteConfiguration.cssPre === "Stylus") {
            try {
                super.log(logger, display, "Creating Stylus folder", { cssSrcFolder: engineVariables.cssSrcFolder });

                engineVariables.cssSrcFolder = fileSystem.pathCombine(engineVariables.rootFolder, "\\stylus");

                await fileSystem.directoryCreate(engineVariables.cssSrcFolder);
                await fileSystem.directoryCreate(engineVariables.cssDistFolder);

                engineVariables.requiredDevDependencies.push("gulp-stylus");

                const assetCssFolder = fileSystem.pathCombine(engineVariables.assetsDirectory, "scaffold/css/stylus");

                const exists = await fileSystem.fileExists(engineVariables.cssSrcFolder, "app.styl");
                if (!exists) {
                    super.copyFile(logger, display, fileSystem, assetCssFolder, "app.styl", engineVariables.cssSrcFolder, "app.styl");
                }
                super.copyFile(logger, display, fileSystem, assetCssFolder, "main.styl", engineVariables.cssSrcFolder, "main.styl");
                super.copyFile(logger, display, fileSystem, assetCssFolder, "reset.styl", engineVariables.cssSrcFolder, "reset.styl");
                return 0;
            } catch (err) {
                super.error(logger, display, "Generating Stylus folder failed", err, { cssSrcFolder: engineVariables.cssSrcFolder });
                return 1;
            }
        }

        return 0;
    }
}