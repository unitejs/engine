/**
 * Pipeline step to generate electron platform configuration.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class Electron extends EnginePipelineStepBase {
    public static PLATFORM: string = "Electron";
    private static FILENAME: string = "platform-electron.js";
    private static FILENAME2: string = "main.js";

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["archiver",
                                            "electron-packager",
                                            "unitejs-image-cli"],
                                            uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.platforms[Electron.PLATFORM] !== undefined);

        const buildAssetPlatform = fileSystem.pathCombine(engineVariables.www.buildFolder, "/assets/platform/electron/");
        const buildTasks = fileSystem.pathCombine(engineVariables.www.buildFolder, "/tasks/");
        if (uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.platforms[Electron.PLATFORM] !== undefined) {
            try {
                const assetTasksPlatform = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, "gulp/tasks/platform/");
                await this.copyFile(logger, fileSystem, assetTasksPlatform, Electron.FILENAME, buildTasks, Electron.FILENAME);
            } catch (err) {
                logger.error(`Generating ${Electron.FILENAME} failed`, err);
                return 1;
            }

            try {
                const assetPlatform = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, "gulp/assets/platform/electron/");
                await this.copyFile(logger, fileSystem, assetPlatform, Electron.FILENAME2, buildAssetPlatform, Electron.FILENAME2);
                return 0;
            } catch (err) {
                logger.error(`Generating ${Electron.FILENAME2} failed`, err);
                return 1;
            }
        } else {
            let ret = await super.deleteFile(logger, fileSystem, buildTasks, Electron.FILENAME);
            if (ret === 0) {
                ret = await super.deleteFile(logger, fileSystem, buildAssetPlatform, Electron.FILENAME2);
            }
            return ret;
        }
    }
}
