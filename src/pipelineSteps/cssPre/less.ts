/**
 * Pipeline step to generate handle less styling.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class Less extends PipelineStepBase {
    private static FOLDER: string = "less";

    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): boolean | null {
        return super.condition(uniteConfiguration.cssPre, "Less");
    }

    public async initialise(logger: ILogger,
                            fileSystem: IFileSystem,
                            uniteConfiguration: UniteConfiguration,
                            engineVariables: EngineVariables): Promise<number> {
        uniteConfiguration.styleExtension = "less";
        engineVariables.www.cssSrcFolder = fileSystem.pathCombine(engineVariables.wwwRootFolder, Less.FOLDER);
        return 0;
    }

    public async install(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["less"], true);

        return 0;
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        return await super.createFolder(logger, fileSystem, engineVariables.www.cssSrcFolder);
    }

    public async uninstall(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["less"], false);

        return await super.deleteFolder(logger, fileSystem, fileSystem.pathCombine(engineVariables.wwwRootFolder, Less.FOLDER), engineVariables.force);
    }
}
