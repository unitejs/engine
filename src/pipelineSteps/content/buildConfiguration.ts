/**
 * Pipeline step to generate build configurations.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class BuildConfiguration extends PipelineStepBase {
    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        const ret = await super.folderCreate(logger, fileSystem, engineVariables.www.configuration);

        if (ret === 0) {
            let names = ["common"];

            if (uniteConfiguration.buildConfigurations) {
                names = names.concat(Object.keys(uniteConfiguration.buildConfigurations));
            }

            for (let i = 0; i < names.length; i++) {
                const filename = `${names[i]}.json`;
                try {
                    const exists = await fileSystem.fileExists(engineVariables.www.configuration, filename);
                    if (!exists) {
                        await fileSystem.fileWriteJson(engineVariables.www.configuration, filename, {
                            name: names[i]
                        });
                    }
                } catch (err) {
                    logger.error(`Creating configuration file ${filename} failed`, err);
                    return 1;
                }
            }
        }

        return ret;
    }
}
