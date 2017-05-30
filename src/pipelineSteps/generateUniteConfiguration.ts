/**
 * Pipeline step to generate unite.json.
 */
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../engine/enginePipelineStepBase";
import { IDisplay } from "../interfaces/IDisplay";
import { IFileSystem } from "../interfaces/IFileSystem";
import { ILogger } from "../interfaces/ILogger";

export class GenerateUniteConfiguration extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration): Promise<number> {
        try {
            super.log(logger, display, "Generating unite.json in", { outputDirectory: uniteConfiguration.outputDirectory });
            await fileSystem.fileWriteJson(uniteConfiguration.outputDirectory, "unite.json", uniteConfiguration);
            return 0;
        } catch (err) {
            super.error(logger, display, "Generating unite.json failed", err, { outputDirectory: uniteConfiguration.outputDirectory });
            return 1;
        }
    }
}