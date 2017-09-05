/**
 * Pipeline step to generate handle less styling.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineKey } from "../../engine/pipelineKey";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class Less extends PipelineStepBase {
    public influences(): PipelineKey[] {
        return [
            new PipelineKey("unite", "uniteConfigurationJson"),
            new PipelineKey("content", "packageJson")
        ];
    }

    public async initialise(logger: ILogger,
                            fileSystem: IFileSystem,
                            uniteConfiguration: UniteConfiguration,
                            engineVariables: EngineVariables): Promise<number> {
        if (super.condition(uniteConfiguration.cssPre, "Less")) {
            engineVariables.styleLanguageExt = "less";
            engineVariables.www.cssSrcFolder = fileSystem.pathCombine(engineVariables.wwwRootFolder, "less");
        }
        return 0;
    }

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["less"], super.condition(uniteConfiguration.cssPre, "Less"));

        if (super.condition(uniteConfiguration.cssPre, "Less")) {
            try {
                logger.info("Creating Less folder", { cssSrcFolder: engineVariables.www.cssSrcFolder });

                await fileSystem.directoryCreate(engineVariables.www.cssSrcFolder);

                logger.info("Creating cssDist folder", { cssSrcFolder: engineVariables.www.cssDistFolder });

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
