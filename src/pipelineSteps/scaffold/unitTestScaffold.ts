/**
 * Pipeline step to generate scaffolding for unit tests.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineKey } from "../../engine/pipelineKey";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class UnitTestScaffold extends PipelineStepBase {
    public influences(): PipelineKey[] {
        return [new PipelineKey("applicationFramework", "*")];
    }

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        if (!super.condition(uniteConfiguration.unitTestRunner, "None")) {
            try {
                logger.info("Creating Unit Test Directory", { unitTestSrcFolder: engineVariables.www.unitTestSrcFolder });
                await fileSystem.directoryCreate(engineVariables.www.unitTestSrcFolder);
            } catch (err) {
                logger.error("Creating Unit Test Directory failed", err, { unitTestSrcFolder: engineVariables.www.unitTestSrcFolder });
                return 1;
            }
        }

        return 0;
    }
}
