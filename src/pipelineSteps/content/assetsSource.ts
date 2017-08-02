/**
 * Pipeline step to create asset sources.
 */
import { IDisplay } from "unitejs-framework/dist/interfaces/IDisplay";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class AssetsSource extends EnginePipelineStepBase {
    private static FILENAME: string = "logo-tile.svg";
    private static FILENAME2: string = "logo-transparent.svg";

    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["unitejs-image-cli"], true);

        try {
            super.log(logger, display, "Creating Directory", { rootFolder: engineVariables.assetsSourceFolder });

            await fileSystem.directoryCreate(engineVariables.assetsSourceFolder);
        } catch (err) {
            super.error(logger, display, "Creating Assets Source folder failed", err);
            return 1;
        }

        try {
            super.log(logger, display, "Creating Directory", { rootFolder: engineVariables.assetsFolder });

            await fileSystem.directoryCreate(engineVariables.assetsFolder);

        } catch (err) {
            super.error(logger, display, "Creating Assets folder failed", err);
            return 1;
        }

        try {
            const sourceThemeFolder = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, "assetsSource/theme/");
            const destThemeFolder = fileSystem.pathCombine(engineVariables.assetsSourceFolder, "theme/");

            await super.copyFile(logger, display, fileSystem, sourceThemeFolder, AssetsSource.FILENAME, destThemeFolder, AssetsSource.FILENAME);
            await super.copyFile(logger, display, fileSystem, sourceThemeFolder, AssetsSource.FILENAME2, destThemeFolder, AssetsSource.FILENAME2);

            return 0;
        } catch (err) {
            super.error(logger, display, "Copy Assets failed", err);
            return 1;
        }
    }
}
