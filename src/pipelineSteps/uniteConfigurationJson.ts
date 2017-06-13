/**
 * Pipeline step to generate unite.json.
 */
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../engine/enginePipelineStepBase";
import { EngineVariables } from "../engine/engineVariables";
import { IDisplay } from "../interfaces/IDisplay";
import { IFileSystem } from "../interfaces/IFileSystem";
import { ILogger } from "../interfaces/ILogger";

export class UniteConfigurationJson extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            super.log(logger, display, "Generating unite.json in", { rootFolder: engineVariables.rootFolder });

            await fileSystem.fileWriteJson(engineVariables.rootFolder, "unite.json", uniteConfiguration);
            return 0;
        } catch (err) {
            super.error(logger, display, "Generating unite.json failed", err, { rootFolder: engineVariables.rootFolder });
            return 1;
        }
    }
}