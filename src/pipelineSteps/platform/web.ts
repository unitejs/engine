/**
 * Pipeline step to generate web platform configuration.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class Web extends PipelineStepBase {
    private static PLATFORM: string = "Web";
    private static FILENAME: string = "platform-web.js";

    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables) : boolean | undefined {
        return super.objectCondition(uniteConfiguration.platforms, Web.PLATFORM);
    }

    public async install(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["archiver"], super.condition(uniteConfiguration.taskManager, "Gulp"));

        return 0;
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        if (super.condition(uniteConfiguration.taskManager, "Gulp")) {
            const buildTasks = fileSystem.pathCombine(engineVariables.www.buildFolder, "/tasks/");
            const assetTasksPlatform = fileSystem.pathCombine(engineVariables.engineAssetsFolder, "gulp/tasks/platform/");
            return await this.copyFile(logger, fileSystem, assetTasksPlatform, Web.FILENAME, buildTasks, Web.FILENAME, engineVariables.force);
        }
        return 0;
    }

    public async uninstall(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["archiver"], false);

        const buildTasks = fileSystem.pathCombine(engineVariables.www.buildFolder, "/tasks/");
        return await super.deleteFileText(logger, fileSystem, buildTasks, Web.FILENAME, engineVariables.force);
    }
}
