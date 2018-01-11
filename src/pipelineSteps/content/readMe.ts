/**
 * Pipeline step to generate README.md.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class ReadMe extends PipelineStepBase {
    private static readonly FILENAMEROOT: string = "README-ROOT.md";
    private static readonly FILENAME: string = "README.md";

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        let ret = await super.fileToggleLines(logger,
                                              fileSystem,
                                              engineVariables.rootFolder,
                                              ReadMe.FILENAME,
                                              engineVariables.force,
                                              mainCondition,
                                              async () => {
            const lines = await fileSystem.fileReadLines(engineVariables.engineAssetsFolder, ReadMe.FILENAMEROOT);

            if (engineVariables.meta && engineVariables.meta) {
                lines[0] = `# ${engineVariables.meta.title}`;
            }

            return lines;
        });

        if (ret === 0) {
            ret = await super.fileToggleLines(logger,
                                              fileSystem,
                                              engineVariables.wwwRootFolder,
                                              ReadMe.FILENAME,
                                              engineVariables.force,
                                              mainCondition,
                                              async () => {
                const lines = await fileSystem.fileReadLines(engineVariables.engineAssetsFolder, ReadMe.FILENAME);

                if (engineVariables.meta && engineVariables.meta) {
                    lines[0] = `# ${engineVariables.meta.title}`;
                }

                return lines;
            });
        }

        return ret;
    }
}
