/**
 * Pipeline step to generate handle less styling.
 */
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";
import { IDisplay } from "../../interfaces/IDisplay";
import { IFileSystem } from "../../interfaces/IFileSystem";
import { ILogger } from "../../interfaces/ILogger";

export class Less extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        if (uniteConfiguration.cssPre === "Less") {
            try {
                super.log(logger, display, "Creating Less folder", { cssSrcFolder: engineVariables.cssSrcFolder });

                engineVariables.cssSrcFolder = fileSystem.pathCombine(engineVariables.rootFolder, "\\less");

                await fileSystem.directoryCreate(engineVariables.cssSrcFolder);
                await fileSystem.directoryCreate(engineVariables.cssDistFolder);

                engineVariables.requiredDevDependencies.push("gulp-less");

                const assetCssFolder = fileSystem.pathCombine(engineVariables.assetsDirectory, "scaffold/css/less");

                const exists = await fileSystem.fileExists(engineVariables.cssSrcFolder, "app.less");
                if (!exists) {
                    super.copyFile(logger, display, fileSystem, assetCssFolder, "app.less", engineVariables.cssSrcFolder, "app.less");
                }
                super.copyFile(logger, display, fileSystem, assetCssFolder, "main.less", engineVariables.cssSrcFolder, "main.less");
                super.copyFile(logger, display, fileSystem, assetCssFolder, "reset.less", engineVariables.cssSrcFolder, "reset.less");
                return 0;
            } catch (err) {
                super.error(logger, display, "Generating Less folder failed", err, { cssSrcFolder: engineVariables.cssSrcFolder });
                return 1;
            }
        }

        return 0;
    }
}