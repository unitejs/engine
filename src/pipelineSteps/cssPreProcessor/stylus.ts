/**
 * Pipeline step to generate handle stylus styling.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class Stylus extends EnginePipelineStepBase {
    public async preProcess(logger: ILogger,
                            fileSystem: IFileSystem,
                            uniteConfiguration: UniteConfiguration,
                            engineVariables: EngineVariables): Promise<number> {
        if (uniteConfiguration.cssPre === "Stylus") {
            engineVariables.styleLanguageExt = "styl";
        }
        return 0;
    }

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["stylus"], uniteConfiguration.cssPre === "Stylus");

        if (uniteConfiguration.cssPre === "Stylus") {
            try {
                engineVariables.www.cssSrcFolder = fileSystem.pathCombine(engineVariables.wwwRootFolder, "stylus");

                logger.info("Creating Stylus folder", { cssSrcFolder: engineVariables.www.cssSrcFolder });

                await fileSystem.directoryCreate(engineVariables.www.cssSrcFolder);

                logger.info("Creating cssDist folder", { cssSrcFolder: engineVariables.www.cssDistFolder });

                await fileSystem.directoryCreate(engineVariables.www.cssDistFolder);

                return 0;
            } catch (err) {
                logger.error("Generating Stylus folder failed", err, { cssSrcFolder: engineVariables.www.cssSrcFolder });
                return 1;
            }
        }

        return 0;
    }
}
