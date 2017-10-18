/**
 * Pipeline step to generate docker platform configuration.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class Docker extends PipelineStepBase {
    private static PLATFORM: string = "Docker";
    private static FILENAME: string = "platform-docker.js";

    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables) : boolean | undefined {
        return super.objectCondition(uniteConfiguration.platforms, Docker.PLATFORM);
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        let ret = await super.folderCreate(logger, fileSystem, engineVariables.platformRootFolder);

        if (ret === 0) {
            const buildTasks = fileSystem.pathCombine(engineVariables.www.buildFolder, "/tasks/");

            if (mainCondition && super.condition(uniteConfiguration.taskManager, "Gulp")) {
                const assetTasksPlatform = fileSystem.pathCombine(engineVariables.engineAssetsFolder, "gulp/tasks/platform/");
                ret = await this.copyFile(logger, fileSystem, assetTasksPlatform, Docker.FILENAME, buildTasks, Docker.FILENAME, engineVariables.force);
            } else {
                ret = await super.fileDeleteText(logger, fileSystem, buildTasks, Docker.FILENAME, engineVariables.force);
            }
        }
        return ret;
    }
}
