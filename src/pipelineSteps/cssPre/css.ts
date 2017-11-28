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

    private _cssSrcFolder: string;

    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): boolean | undefined {
        return super.condition(uniteConfiguration.cssPre, "Css");
    }

    public async initialise(logger: ILogger,
                            fileSystem: IFileSystem,
                            uniteConfiguration: UniteConfiguration,
                            engineVariables: EngineVariables,
                            mainCondition: boolean): Promise<number> {
        this._cssSrcFolder = fileSystem.pathCombine(engineVariables.wwwRootFolder, Css.FOLDER);

        if (mainCondition) {
            uniteConfiguration.styleExtension = "css";
            engineVariables.www.css = this._cssSrcFolder;
        }
        return 0;
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        return super.folderToggle(logger, fileSystem, this._cssSrcFolder, engineVariables.force, mainCondition);
    }
}
