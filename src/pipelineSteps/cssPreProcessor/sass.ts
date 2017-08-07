/**
 * Pipeline step to generate handle sass styling.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class Sass extends EnginePipelineStepBase {
    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["node-sass"], uniteConfiguration.cssPre === "Sass");

        if (uniteConfiguration.cssPre === "Sass") {
            try {
                engineVariables.cssSrcFolder = fileSystem.pathCombine(engineVariables.wwwFolder, "sass");

                logger.info("Creating Sass folder", { cssSrcFolder: engineVariables.cssSrcFolder });

                engineVariables.styleLanguageExt = "scss";

                await fileSystem.directoryCreate(engineVariables.cssSrcFolder);
                await fileSystem.directoryCreate(engineVariables.cssDistFolder);

                return 0;
            } catch (err) {
                logger.error("Generating Sass folder failed", err, { cssSrcFolder: engineVariables.cssSrcFolder });
                return 1;
            }
        }

        return 0;
    }
}
