/**
 * Pipeline step to generate .gitignore.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class GitIgnore extends EnginePipelineStepBase {
    private static FILENAME: string = ".gitignore";

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            const hasGeneratedMarker = await super.fileHasGeneratedMarker(fileSystem, engineVariables.wwwFolder, GitIgnore.FILENAME);

            if (hasGeneratedMarker) {
                logger.info(`Generating ${GitIgnore.FILENAME}`, { wwwFolder: engineVariables.wwwFolder});

                engineVariables.gitIgnore.push("node_modules");
                engineVariables.gitIgnore.push(super.wrapGeneratedMarker("# ", ""));

                await fileSystem.fileWriteLines(engineVariables.wwwFolder, GitIgnore.FILENAME, engineVariables.gitIgnore);
            } else {
                logger.info(`Skipping ${GitIgnore.FILENAME} as it has no generated marker`);
            }

            return 0;
        } catch (err) {
            logger.error(`Generating ${GitIgnore.FILENAME} failed`, err);
            return 1;
        }
    }
}
