/**
 * Pipeline step to generate scaffolding for unit tests.
 */
import { IDisplay } from "unitejs-framework/dist/interfaces/IDisplay";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class UnitTestScaffold extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        if (uniteConfiguration.unitTestRunner !== "None") {
            try {
                super.log(logger, display, "Creating Unit Test Directory", { unitTestSrcFolder: engineVariables.unitTestSrcFolder });
                await fileSystem.directoryCreate(engineVariables.unitTestSrcFolder);
            } catch (err) {
                super.error(logger, display, "Creating Unit Test Directory failed", err, { unitTestSrcFolder: engineVariables.unitTestSrcFolder });
                return 1;
            }
        }

        return 0;
    }
}
