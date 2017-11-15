/**
 * Pipeline step to create asset sources.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class Assets extends PipelineStepBase {
    private static FILENAME_TILE: string = "logo-tile.svg";
    private static FILENAME_TILE_TRANSPARENT: string = "logo-transparent.svg";
    private static FILENAME_LOADER_CSS: string = "loader.css";
    private static FILENAME_LOADER_HTML: string = "loader.html";

    public async configure(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        engineVariables.toggleDevDependency(["unitejs-image-cli"], mainCondition);
        return 0;
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        let ret = await super.folderToggle(logger, fileSystem, engineVariables.www.assetsSrcFolder, engineVariables.force, mainCondition);

        if (ret === 0) {
            ret = await super.folderToggle(logger, fileSystem, engineVariables.www.assetsFolder, engineVariables.force, mainCondition);

            if (ret === 0) {
                const sourceThemeFolder = fileSystem.pathCombine(engineVariables.engineAssetsFolder, "assetsSrc/theme/");
                const destThemeFolder = fileSystem.pathCombine(engineVariables.www.assetsSrcFolder, "theme/");

                ret = await super.copyFile(logger, fileSystem, sourceThemeFolder, Assets.FILENAME_TILE, destThemeFolder, Assets.FILENAME_TILE, engineVariables.force);

                if (ret === 0) {
                    ret = await super.copyFile(logger, fileSystem, sourceThemeFolder, Assets.FILENAME_TILE_TRANSPARENT, destThemeFolder, Assets.FILENAME_TILE_TRANSPARENT, engineVariables.force);
                }

                if (ret === 0) {
                    ret = await super.copyFile(logger, fileSystem, sourceThemeFolder, Assets.FILENAME_LOADER_CSS, destThemeFolder, Assets.FILENAME_LOADER_CSS, engineVariables.force);
                }

                if (ret === 0) {
                    ret = await super.copyFile(logger, fileSystem, sourceThemeFolder, Assets.FILENAME_LOADER_HTML, destThemeFolder, Assets.FILENAME_LOADER_HTML, engineVariables.force);
                }
            }
        }

        return ret;
    }
}
