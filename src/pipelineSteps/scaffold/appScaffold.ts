/**
 * Pipeline step to generate scaffolding for app.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineKey } from "../../engine/pipelineKey";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class AppScaffold extends PipelineStepBase {
    public influences(): PipelineKey[] {
        return [new PipelineKey("applicationFramework", "*")];
    }

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            logger.info("Creating App Source Directory", { appSourceFolder: engineVariables.www.srcFolder });
            await fileSystem.directoryCreate(engineVariables.www.srcFolder);
            return 0;
        } catch (err) {
            logger.error("Creating App Source Directory failed", err, { appSourceFolder: engineVariables.www.srcFolder });
            return 1;
        }
    }
}
