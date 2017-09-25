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

    private _cssSrcFolder: string;

    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): boolean | undefined {
        return super.condition(uniteConfiguration.cssPre, "Stylus");
    }

    public async initialise(logger: ILogger,
                            fileSystem: IFileSystem,
                            uniteConfiguration: UniteConfiguration,
                            engineVariables: EngineVariables,
                            mainCondition: boolean): Promise<number> {
        this._cssSrcFolder = fileSystem.pathCombine(engineVariables.wwwRootFolder, Stylus.FOLDER);

        if (mainCondition) {
            uniteConfiguration.styleExtension = "styl";
            engineVariables.www.cssSrcFolder = this._cssSrcFolder;
        }
        return 0;
    }

    public async configure(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        engineVariables.toggleDevDependency(["stylus"], mainCondition);

        return 0;
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        return await super.folderToggle(logger, fileSystem, this._cssSrcFolder, engineVariables.force, mainCondition);
    }
}
