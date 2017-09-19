/**
 * Pipeline step to create output directory.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class OutputDirectory extends PipelineStepBase {
    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        let ret = await super.createFolder(logger, fileSystem, engineVariables.rootFolder);

        if (ret === 0) {
            ret = await super.createFolder(logger, fileSystem, engineVariables.wwwRootFolder);

            if (ret === 0) {
                ret = await super.createFolder(logger, fileSystem, engineVariables.packagedRootFolder);
            }
        }

        return ret;
    }
}
