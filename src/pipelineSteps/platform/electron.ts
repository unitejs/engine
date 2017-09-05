/**
 * Pipeline step to generate electron platform configuration.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineKey } from "../../engine/pipelineKey";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class Electron extends PipelineStepBase {
    private static PLATFORM: string = "Electron";
    private static FILENAME: string = "platform-electron.js";
    private static FILENAME2: string = "main.js";

    public influences(): PipelineKey[] {
        return [
            new PipelineKey("unite", "uniteConfigurationJson"),
            new PipelineKey("content", "packageJson")
        ];
    }

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["archiver",
                                            "electron-packager",
                                            "unitejs-image-cli"],
                                            super.condition(uniteConfiguration.taskManager, "Gulp") &&
                                            super.objectCondition(uniteConfiguration.platforms, Electron.PLATFORM));

        const buildAssetPlatform = fileSystem.pathCombine(engineVariables.www.buildFolder, "/assets/platform/electron/");
        const buildTasks = fileSystem.pathCombine(engineVariables.www.buildFolder, "/tasks/");
        if (super.condition(uniteConfiguration.taskManager, "Gulp") && super.objectCondition(uniteConfiguration.platforms, Electron.PLATFORM)) {
            const assetTasksPlatform = fileSystem.pathCombine(engineVariables.engineAssetsFolder, "gulp/tasks/platform/");
            let ret = await this.copyFile(logger, fileSystem, assetTasksPlatform, Electron.FILENAME, buildTasks, Electron.FILENAME, engineVariables.force);

            if (ret === 0) {
                const assetPlatform = fileSystem.pathCombine(engineVariables.engineAssetsFolder, "gulp/assets/platform/electron/");
                ret = await this.copyFile(logger, fileSystem, assetPlatform, Electron.FILENAME2, buildAssetPlatform, Electron.FILENAME2, engineVariables.force);
            }

            return ret;
        } else {
            let ret = await super.deleteFile(logger, fileSystem, buildTasks, Electron.FILENAME, engineVariables.force);
            if (ret === 0) {
                ret = await super.deleteFile(logger, fileSystem, buildAssetPlatform, Electron.FILENAME2, engineVariables.force);
            }
            return ret;
        }
    }
}
