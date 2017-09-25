/**
 * Pipeline step to generate README.md.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class ReadMe extends PipelineStepBase {
    private static FILENAME: string = "README.md";

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        return super.fileToggleLines(logger,
                                     fileSystem,
                                     engineVariables.wwwRootFolder,
                                     ReadMe.FILENAME,
                                     engineVariables.force,
                                     mainCondition,
                                     async () => {
            const lines = await fileSystem.fileReadLines(engineVariables.engineAssetsFolder, ReadMe.FILENAME);

            lines.unshift("");
            lines.unshift(`# ${uniteConfiguration.title}`);

            lines.push("---");
            lines.push(super.wrapGeneratedMarker("*", "* :zap:"));

            return lines;
        });
    }
}
