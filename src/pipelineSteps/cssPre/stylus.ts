/**
 * Pipeline step to generate handle stylus styling.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class Stylus extends PipelineStepBase {
    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables) : boolean | undefined {
        return super.condition(uniteConfiguration.cssPre, "Stylus");
    }

    public async initialise(logger: ILogger,
                            fileSystem: IFileSystem,
                            uniteConfiguration: UniteConfiguration,
                            engineVariables: EngineVariables): Promise<number> {
        uniteConfiguration.styleExtension = "styl";
        engineVariables.www.cssSrcFolder = fileSystem.pathCombine(engineVariables.wwwRootFolder, "stylus");
        return 0;
    }

    public async install(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["stylus"], true);

        return 0;
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            logger.info("Creating Stylus folder", { cssSrcFolder: engineVariables.www.cssSrcFolder });

            await fileSystem.directoryCreate(engineVariables.www.cssSrcFolder);

            logger.info("Creating cssDist folder", { cssSrcFolder: engineVariables.www.cssDistFolder });

            await fileSystem.directoryCreate(engineVariables.www.cssDistFolder);
        } catch (err) {
            logger.error("Generating Stylus folder failed", err, { cssSrcFolder: engineVariables.www.cssSrcFolder });
            return 1;
        }

        return 0;
    }

    public async uninstall(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["stylus"], false);

        try {
            await fileSystem.directoryDelete(engineVariables.www.cssSrcFolder);
        } catch (err) {
            logger.error("Deleting Stylus folder failed", err, { cssSrcFolder: engineVariables.www.cssSrcFolder });
            return 1;
        }

        return 0;
    }}
