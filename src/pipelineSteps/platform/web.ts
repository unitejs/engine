/**
 * Pipeline step to generate web platform configuration.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class Web extends EnginePipelineStepBase {
    private static PLATFORM: string = "Web";
    private static FILENAME: string = "platform-web.js";

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["archiver"], super.condition(uniteConfiguration.taskManager, "Gulp") && super.objectCondition(uniteConfiguration.platforms, Web.PLATFORM));

        const buildTasks = fileSystem.pathCombine(engineVariables.www.buildFolder, "/tasks/");
        if (super.condition(uniteConfiguration.taskManager, "Gulp") && super.objectCondition(uniteConfiguration.platforms, Web.PLATFORM)) {
            const assetTasksPlatform = fileSystem.pathCombine(engineVariables.engineAssetsFolder, "gulp/tasks/platform/");
            return await this.copyFile(logger, fileSystem, assetTasksPlatform, Web.FILENAME, buildTasks, Web.FILENAME, engineVariables.force);
        } else {
            return await super.deleteFile(logger, fileSystem, buildTasks, Web.FILENAME, engineVariables.force);
        }
    }
}
