/**
 * Pipeline step to generate electron platform configuration.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class Electron extends PipelineStepBase {
    private static PLATFORM: string = "Electron";
    private static FILENAME: string = "platform-electron.js";
    private static FILENAME_MAIN_DEV: string = "main-dev.js";
    private static FILENAME_MAIN_PROD: string = "main.js";

    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables) : boolean | undefined {
        return super.objectCondition(uniteConfiguration.platforms, Electron.PLATFORM);
    }

    public async configure(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        engineVariables.toggleDevDependency(["archiver",
                                            "electron-packager",
                                            "unitejs-image-cli"],
                                            mainCondition && super.condition(uniteConfiguration.taskManager, "Gulp"));

        return 0;
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        let ret = await super.folderCreate(logger, fileSystem, engineVariables.platformRootFolder);

        if (ret === 0) {
            const buildTasks = fileSystem.pathCombine(engineVariables.www.buildFolder, "/tasks/");
            const buildAssetPlatform = fileSystem.pathCombine(engineVariables.www.buildFolder, "/assets/platform/electron/");

            if (mainCondition && super.condition(uniteConfiguration.taskManager, "Gulp")) {
                const assetTasksPlatform = fileSystem.pathCombine(engineVariables.engineAssetsFolder, "gulp/tasks/platform/");
                ret = await this.copyFile(logger, fileSystem, assetTasksPlatform, Electron.FILENAME, buildTasks, Electron.FILENAME, engineVariables.force);

                const assetPlatform = fileSystem.pathCombine(engineVariables.engineAssetsFolder, "gulp/assets/platform/electron/");
                if (ret === 0) {
                    ret = await this.copyFile(logger, fileSystem, assetPlatform, Electron.FILENAME_MAIN_DEV, buildAssetPlatform, Electron.FILENAME_MAIN_DEV, engineVariables.force);
                }

                if (ret === 0) {
                    ret = await this.copyFile(logger, fileSystem, assetPlatform, Electron.FILENAME_MAIN_PROD, buildAssetPlatform, Electron.FILENAME_MAIN_PROD, engineVariables.force);
                }

            } else {
                ret = await super.fileDeleteText(logger, fileSystem, buildTasks, Electron.FILENAME, engineVariables.force);
                if (ret === 0) {
                    ret = await super.fileDeleteText(logger, fileSystem, buildAssetPlatform, Electron.FILENAME_MAIN_DEV, engineVariables.force);
                }
                if (ret === 0) {
                    ret = await super.fileDeleteText(logger, fileSystem, buildAssetPlatform, Electron.FILENAME_MAIN_PROD, engineVariables.force);
                }
            }
        }
        return ret;
    }
}
