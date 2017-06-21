/**
 * Pipeline step to generate .gitignore.
 */
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";
import { IDisplay } from "../../interfaces/IDisplay";
import { IFileSystem } from "../../interfaces/IFileSystem";
import { ILogger } from "../../interfaces/ILogger";

export class GitIgnore extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            super.log(logger, display, "Writing .gitignore");

            engineVariables.gitIgnore.push("node_modules");

            await fileSystem.fileWriteLines(engineVariables.rootFolder, ".gitignore", engineVariables.gitIgnore);

            return 0;
        } catch (err) {
            super.error(logger, display, "Writing .gitignore failed", err);
            return 1;
        }
    }
}