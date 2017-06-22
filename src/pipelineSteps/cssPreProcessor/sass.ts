/**
 * Pipeline step to generate handle sass styling.
 */
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";
import { IDisplay } from "../../interfaces/IDisplay";
import { IFileSystem } from "../../interfaces/IFileSystem";
import { ILogger } from "../../interfaces/ILogger";

export class Sass extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        if (uniteConfiguration.cssPre === "Sass") {
            try {
                super.log(logger, display, "Creating Sass folder", { cssSrcFolder: engineVariables.cssSrcFolder });

                engineVariables.cssSrcFolder = fileSystem.pathCombine(engineVariables.rootFolder, "\\sass");

                await fileSystem.directoryCreate(engineVariables.cssSrcFolder);
                await fileSystem.directoryCreate(engineVariables.cssDistFolder);

                engineVariables.requiredDevDependencies.push("gulp-sass");

                const assetCssFolder = fileSystem.pathCombine(engineVariables.assetsDirectory, "scaffold/css/sass");

                const exists = await fileSystem.fileExists(engineVariables.cssSrcFolder, "app.scss");
                if (!exists) {
                    super.copyFile(logger, display, fileSystem, assetCssFolder, "app.scss", engineVariables.cssSrcFolder, "app.scss");
                }
                super.copyFile(logger, display, fileSystem, assetCssFolder, "main.scss", engineVariables.cssSrcFolder, "main.scss");
                super.copyFile(logger, display, fileSystem, assetCssFolder, "reset.scss", engineVariables.cssSrcFolder, "reset.scss");
                return 0;
            } catch (err) {
                super.error(logger, display, "Generating Sass folder failed", err, { cssSrcFolder: engineVariables.cssSrcFolder });
                return 1;
            }
        }

        return 0;
    }
}