/**
 * Pipeline step to generate LICENSE.
 */
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";
import { IDisplay } from "../../interfaces/IDisplay";
import { IFileSystem } from "../../interfaces/IFileSystem";
import { ILogger } from "../../interfaces/ILogger";

export class License extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            super.log(logger, display, "Writing LICENSE");

            await fileSystem.fileWriteLines(engineVariables.rootFolder, "LICENSE", engineVariables.license.licenseText.split("\n"));

            return 0;
        } catch (err) {
            super.error(logger, display, "Writing LICENSE failed", err);
            return 1;
        }
    }
}