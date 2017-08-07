/**
 * Pipeline step to generate scaffolding for unit tests.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class UnitTestScaffold extends EnginePipelineStepBase {
    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        if (uniteConfiguration.unitTestRunner !== "None") {
            try {
                logger.info("Creating Unit Test Directory", { unitTestSrcFolder: engineVariables.unitTestSrcFolder });
                await fileSystem.directoryCreate(engineVariables.unitTestSrcFolder);
            } catch (err) {
                logger.error("Creating Unit Test Directory failed", err, { unitTestSrcFolder: engineVariables.unitTestSrcFolder });
                return 1;
            }
        }

        return 0;
    }
}
