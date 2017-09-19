/**
 * Pipeline step to generate LICENSE.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class License extends PipelineStepBase {
    private static FILENAME: string = "LICENSE";

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        return super.fileWriteText(logger,
                                   fileSystem,
                                   engineVariables.wwwRootFolder,
                                   License.FILENAME,
                                   engineVariables.force,
                                   async() => {
            const yearString = new Date().getFullYear().toString();
            return engineVariables.license.licenseText.replace(/<year>/gi, yearString);
        });
    }
}
