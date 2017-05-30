/**
 * Pipeline step to create output directory.
 */
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../engine/enginePipelineStepBase";
import { IDisplay } from "../interfaces/IDisplay";
import { IFileSystem } from "../interfaces/IFileSystem";
import { ILogger } from "../interfaces/ILogger";

export class CreateOutputDirectory extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration): Promise<number> {
        try {
            super.log(logger, display, "Creating Directory", { outputDirectory: uniteConfiguration.outputDirectory });
            await fileSystem.directoryCreate(uniteConfiguration.outputDirectory);
            return 0;
        } catch (err) {
            super.error(logger, display, "Creating Directory failed", err, { outputDirectory: uniteConfiguration.outputDirectory });
            return 1;
        }
    }
}