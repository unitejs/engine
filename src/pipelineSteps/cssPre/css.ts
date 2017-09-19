/**
 * Pipeline step to generate handle css styling.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class Css extends PipelineStepBase {
    private static FOLDER: string = "cssSrc";

    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables) : boolean | undefined {
        return super.condition(uniteConfiguration.cssPre, "Css");
    }

    public async initialise(logger: ILogger,
                            fileSystem: IFileSystem,
                            uniteConfiguration: UniteConfiguration,
                            engineVariables: EngineVariables): Promise<number> {
        uniteConfiguration.styleExtension = "css";
        engineVariables.www.cssSrcFolder = fileSystem.pathCombine(engineVariables.wwwRootFolder, Css.FOLDER);
        return 0;
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        return await super.createFolder(logger, fileSystem, engineVariables.www.cssSrcFolder);
    }

    public async uninstall(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        return await super.deleteFolder(logger, fileSystem, fileSystem.pathCombine(engineVariables.wwwRootFolder, Css.FOLDER), engineVariables.force);
    }
}
