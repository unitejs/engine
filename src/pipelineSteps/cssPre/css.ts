/**
 * Pipeline step to generate handle css styling.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class Css extends EnginePipelineStepBase {
    public async initialise(logger: ILogger,
                            fileSystem: IFileSystem,
                            uniteConfiguration: UniteConfiguration,
                            engineVariables: EngineVariables): Promise<number> {
        if (super.condition(uniteConfiguration.cssPre, "Css")) {
            engineVariables.styleLanguageExt = "css";
            engineVariables.www.cssSrcFolder = fileSystem.pathCombine(engineVariables.wwwRootFolder, "cssSrc");
        }
        return 0;
    }

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        if (super.condition(uniteConfiguration.cssPre, "Css")) {
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

        return 0;
    }
}