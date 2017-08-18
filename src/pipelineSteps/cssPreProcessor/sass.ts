/**
 * Pipeline step to generate handle sass styling.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class Sass extends EnginePipelineStepBase {
    public async preProcess(logger: ILogger,
                            fileSystem: IFileSystem,
                            uniteConfiguration: UniteConfiguration,
                            engineVariables: EngineVariables): Promise<number> {
        if (uniteConfiguration.cssPre === "Sass") {
            engineVariables.styleLanguageExt = "scss";
        }
        return 0;
    }

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["node-sass"], uniteConfiguration.cssPre === "Sass");

        if (uniteConfiguration.cssPre === "Sass") {
            try {
                engineVariables.www.cssSrcFolder = fileSystem.pathCombine(engineVariables.wwwRootFolder, "sass");

                logger.info("Creating Sass folder", { cssSrcFolder: engineVariables.www.cssSrcFolder });

                await fileSystem.directoryCreate(engineVariables.www.cssSrcFolder);

                logger.info("Creating cssDist folder", { cssSrcFolder: engineVariables.www.cssDistFolder });

                await fileSystem.directoryCreate(engineVariables.www.cssDistFolder);

                return 0;
            } catch (err) {
                logger.error("Generating Sass folder failed", err, { cssSrcFolder: engineVariables.www.cssSrcFolder });
                return 1;
            }
        }

        return 0;
    }
}
