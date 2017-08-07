/**
 * Pipeline step to generate handle css styling.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class Css extends EnginePipelineStepBase {
    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        if (uniteConfiguration.cssPre === "Css") {
            try {
                engineVariables.cssSrcFolder = fileSystem.pathCombine(engineVariables.wwwFolder, "cssSrc");

                logger.info("Creating cssSrc folder", { cssSrcFolder: engineVariables.cssSrcFolder });

                engineVariables.styleLanguageExt = "css";

                await fileSystem.directoryCreate(engineVariables.cssSrcFolder);
                await fileSystem.directoryCreate(engineVariables.cssDistFolder);

                return 0;
            } catch (err) {
                logger.error("Generating css folder failed", err, { cssSrcFolder: engineVariables.cssSrcFolder });
                return 1;
            }
        }

        return 0;
    }
}
