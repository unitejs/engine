/**
 * Pipeline step to generate unite.json.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class UniteConfigurationJson extends PipelineStepBase {
    private static FILENAME: string = "unite.json";

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        return super.fileToggleJson(logger,
                                    fileSystem,
                                    engineVariables.rootFolder,
                                    UniteConfigurationJson.FILENAME,
                                    engineVariables.force,
                                    mainCondition,
                                    async() => {
                                        uniteConfiguration.uniteVersion = engineVariables.engineVersion;
                                        return uniteConfiguration;
                                   });
    }
}
