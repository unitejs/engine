/**
 * Pipeline step to generate scaffolding for e2e tests.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class E2eTestScaffold extends EnginePipelineStepBase {
    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        if (uniteConfiguration.e2eTestRunner !== "None") {
            try {
                logger.info("Creating E2E Test Directory", { e2eTestSrcFolder: engineVariables.e2eTestSrcFolder });
                await fileSystem.directoryCreate(engineVariables.e2eTestSrcFolder);
                return 0;
            } catch (err) {
                logger.error("Creating E2E Test Directory failed", err, { e2eTestSrcFolder: engineVariables.e2eTestSrcFolder });
                return 1;
            }
        }

        return 0;
    }
}
