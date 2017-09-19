/**
 * Pipeline step to generate handle stylus styling.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class Stylus extends PipelineStepBase {
    private static FOLDER: string = "stylus";

    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables) : boolean | undefined {
        return super.condition(uniteConfiguration.cssPre, "Stylus");
    }

    public async initialise(logger: ILogger,
                            fileSystem: IFileSystem,
                            uniteConfiguration: UniteConfiguration,
                            engineVariables: EngineVariables): Promise<number> {
        uniteConfiguration.styleExtension = "styl";
        engineVariables.www.cssSrcFolder = fileSystem.pathCombine(engineVariables.wwwRootFolder, Stylus.FOLDER);
        return 0;
    }

    public async install(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["stylus"], true);

        return 0;
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        return await super.createFolder(logger, fileSystem, engineVariables.www.cssSrcFolder);
    }

    public async uninstall(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["stylus"], false);

        return await super.deleteFolder(logger, fileSystem, fileSystem.pathCombine(engineVariables.wwwRootFolder, Stylus.FOLDER), engineVariables.force);
    }
}
