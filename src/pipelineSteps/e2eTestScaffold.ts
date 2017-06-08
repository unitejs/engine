/**
 * Pipeline step to generate scaffolding for e2e tests.
 */
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../engine/enginePipelineStepBase";
import { EngineVariables } from "../engine/engineVariables";
import { IDisplay } from "../interfaces/IDisplay";
import { IFileSystem } from "../interfaces/IFileSystem";
import { ILogger } from "../interfaces/ILogger";

export class E2eTestScaffold extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.e2eTestSrcFolder = fileSystem.pathCombine(engineVariables.rootFolder, "\\test\\e2e\\src");
        engineVariables.e2eTestDistFolder = fileSystem.pathCombine(engineVariables.rootFolder, "\\test\\e2e\\dist");

        try {
            super.log(logger, display, "Creating E2E Test Directory", { e2eTestSrcFolder: engineVariables.e2eTestSrcFolder });
            await fileSystem.directoryCreate(engineVariables.e2eTestSrcFolder);
            return 0;
        } catch (err) {
            super.error(logger, display, "Creating E2E Test Directory failed", err, { e2eTestSrcFolder: engineVariables.e2eTestSrcFolder });
            return 1;
        }
    }
}