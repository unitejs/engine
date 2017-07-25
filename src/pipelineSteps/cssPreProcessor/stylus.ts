/**
 * Pipeline step to generate handle stylus styling.
 */
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";
import { IDisplay } from "../../interfaces/IDisplay";
import { IFileSystem } from "../../interfaces/IFileSystem";
import { ILogger } from "../../interfaces/ILogger";

export class Stylus extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["stylus"], uniteConfiguration.cssPre === "Stylus");

        if (uniteConfiguration.cssPre === "Stylus") {
            try {
                super.log(logger, display, "Creating Stylus folder", { cssSrcFolder: engineVariables.cssSrcFolder });

                engineVariables.cssSrcFolder = fileSystem.pathCombine(engineVariables.rootFolder, "stylus");
                engineVariables.styleLanguageExt = "styl";

                await fileSystem.directoryCreate(engineVariables.cssSrcFolder);
                await fileSystem.directoryCreate(engineVariables.cssDistFolder);

                return 0;
            } catch (err) {
                super.error(logger, display, "Generating Stylus folder failed", err, { cssSrcFolder: engineVariables.cssSrcFolder });
                return 1;
            }
        }

        return 0;
    }
}