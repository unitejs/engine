/**
 * Pipeline step to generate handle stylus styling.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class Stylus extends EnginePipelineStepBase {
    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["stylus"], uniteConfiguration.cssPre === "Stylus");

        if (uniteConfiguration.cssPre === "Stylus") {
            try {
                engineVariables.cssSrcFolder = fileSystem.pathCombine(engineVariables.wwwFolder, "stylus");

                logger.info("Creating Stylus folder", { cssSrcFolder: engineVariables.cssSrcFolder });

                engineVariables.styleLanguageExt = "styl";

                await fileSystem.directoryCreate(engineVariables.cssSrcFolder);
                await fileSystem.directoryCreate(engineVariables.cssDistFolder);

                return 0;
            } catch (err) {
                logger.error("Generating Stylus folder failed", err, { cssSrcFolder: engineVariables.cssSrcFolder });
                return 1;
            }
        }

        return 0;
    }
}
