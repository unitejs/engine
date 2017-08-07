/**
 * Pipeline step to generate handle less styling.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class Less extends EnginePipelineStepBase {
    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["less"], uniteConfiguration.cssPre === "Less");

        if (uniteConfiguration.cssPre === "Less") {
            try {
                engineVariables.cssSrcFolder = fileSystem.pathCombine(engineVariables.wwwFolder, "less");

                logger.info("Creating Less folder", { cssSrcFolder: engineVariables.cssSrcFolder });

                engineVariables.styleLanguageExt = "less";

                await fileSystem.directoryCreate(engineVariables.cssSrcFolder);
                await fileSystem.directoryCreate(engineVariables.cssDistFolder);

                return 0;
            } catch (err) {
                logger.error("Generating Less folder failed", err, { cssSrcFolder: engineVariables.cssSrcFolder });
                return 1;
            }
        }

        return 0;
    }
}
