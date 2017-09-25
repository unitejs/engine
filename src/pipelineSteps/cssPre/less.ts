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

    private _cssSrcFolder: string;

    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): boolean | null {
        return super.condition(uniteConfiguration.cssPre, "Less");
    }

    public async initialise(logger: ILogger,
                            fileSystem: IFileSystem,
                            uniteConfiguration: UniteConfiguration,
                            engineVariables: EngineVariables,
                            mainCondition: boolean): Promise<number> {
        this._cssSrcFolder = fileSystem.pathCombine(engineVariables.wwwRootFolder, Less.FOLDER);

        if (mainCondition) {
            uniteConfiguration.styleExtension = "less";
            engineVariables.www.cssSrcFolder = fileSystem.pathCombine(engineVariables.wwwRootFolder, Less.FOLDER);
        }
        return 0;
    }

    public async configure(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        engineVariables.toggleDevDependency(["less"], mainCondition);

        return 0;
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        return await super.folderToggle(logger, fileSystem, this._cssSrcFolder, engineVariables.force, mainCondition);
    }
}
