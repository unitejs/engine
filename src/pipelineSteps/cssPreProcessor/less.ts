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
                engineVariables.www.cssSrcFolder = fileSystem.pathCombine(engineVariables.wwwRootFolder, "less");

                logger.info("Creating Less folder", { cssSrcFolder: engineVariables.www.cssSrcFolder });

                engineVariables.styleLanguageExt = "less";

                await fileSystem.directoryCreate(engineVariables.www.cssSrcFolder);
                await fileSystem.directoryCreate(engineVariables.www.cssDistFolder);

                return 0;
            } catch (err) {
                logger.error("Generating Less folder failed", err, { cssSrcFolder: engineVariables.www.cssSrcFolder });
                return 1;
            }
        }

        return 0;
    }
}
