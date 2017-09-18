/**
 * Pipeline step to generate handle css styling.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class Css extends PipelineStepBase {
    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables) : boolean | undefined {
        return super.condition(uniteConfiguration.cssPre, "Css");
    }

    public async initialise(logger: ILogger,
                            fileSystem: IFileSystem,
                            uniteConfiguration: UniteConfiguration,
                            engineVariables: EngineVariables): Promise<number> {
        uniteConfiguration.styleExtension = "css";
        engineVariables.www.cssSrcFolder = fileSystem.pathCombine(engineVariables.wwwRootFolder, "cssSrc");
        return 0;
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            logger.info("Creating cssSrc folder", { cssSrcFolder: engineVariables.www.cssSrcFolder });

            await fileSystem.directoryCreate(engineVariables.www.cssSrcFolder);

            logger.info("Creating cssDist folder", { cssSrcFolder: engineVariables.www.cssDistFolder });

            await fileSystem.directoryCreate(engineVariables.www.cssDistFolder);

            return 0;
        } catch (err) {
            logger.error("Generating css folder failed", err, { cssSrcFolder: engineVariables.www.cssSrcFolder });
            return 1;
        }
    }

    public async uninstall(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            await fileSystem.directoryDelete(engineVariables.www.cssSrcFolder);
        } catch (err) {
            logger.error("Deleting css folder failed", err, { cssSrcFolder: engineVariables.www.cssSrcFolder });
            return 1;
        }

        return 0;
    }
}
