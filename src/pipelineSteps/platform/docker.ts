/**
 * Pipeline step to generate docker platform configuration.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class Docker extends PipelineStepBase {
    private static readonly PLATFORM: string = "Docker";
    private static readonly FILENAME: string = "platform-docker.js";

    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables) : boolean | undefined {
        return super.objectCondition(uniteConfiguration.platforms, Docker.PLATFORM);
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        let ret = await super.folderCreate(logger, fileSystem, engineVariables.platformRootFolder);

        if (ret === 0) {
            const buildTasks = fileSystem.pathCombine(engineVariables.www.build, "/tasks/");

            if (mainCondition && super.condition(uniteConfiguration.taskManager, "Gulp")) {
                const assetTasksPlatform = fileSystem.pathCombine(engineVariables.engineAssetsFolder, "gulp/dist/tasks/platform/");
                ret = await this.copyFile(logger, fileSystem, assetTasksPlatform, Docker.FILENAME, buildTasks, Docker.FILENAME, engineVariables.force, false,
                                          { "\\\"../util/": ["\"./util/"] });
            } else {
                ret = await super.fileDeleteText(logger, fileSystem, buildTasks, Docker.FILENAME, engineVariables.force);
            }
        }

        if (mainCondition) {
            engineVariables.additionalCompletionMessages.push("Make sure you have docker installed and running before trying to run any of the new tasks.");
            engineVariables.additionalCompletionMessages.push("   see https://docs.docker.com/engine/installation/ for more details");
        }

        return ret;
    }
}
