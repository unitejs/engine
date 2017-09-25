/**
 * Pipeline step to create asset sources.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class Assets extends PipelineStepBase {
    private static FILENAME: string = "logo-tile.svg";
    private static FILENAME2: string = "logo-transparent.svg";

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

                ret = await super.copyFile(logger, fileSystem, sourceThemeFolder, Assets.FILENAME, destThemeFolder, Assets.FILENAME, engineVariables.force);

                if (ret === 0) {
                    ret = await super.copyFile(logger, fileSystem, sourceThemeFolder, Assets.FILENAME2, destThemeFolder, Assets.FILENAME2, engineVariables.force);
                }
            }
        }

        return ret;
    }
}
