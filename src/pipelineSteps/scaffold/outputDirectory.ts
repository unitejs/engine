/**
 * Pipeline step to create output directory.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineKey } from "../../engine/pipelineKey";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class OutputDirectory extends PipelineStepBase {
    public influences(): PipelineKey[] {
        return [
            new PipelineKey("applicationFramework", "*"),
            new PipelineKey("bundler", "*"),
            new PipelineKey("content", "*"),
            new PipelineKey("cssPost", "*"),
            new PipelineKey("cssPre", "*"),
            new PipelineKey("e2eTestRunner", "*"),
            new PipelineKey("language", "*"),
            new PipelineKey("linter", "*"),
            new PipelineKey("moduleType", "*"),
            new PipelineKey("packageManager", "*"),
            new PipelineKey("platform", "*"),
            new PipelineKey("scaffold", "appScaffold"),
            new PipelineKey("scaffold", "e2eTestScaffold"),
            new PipelineKey("scaffold", "unitTestScaffold"),
            new PipelineKey("server", "*"),
            new PipelineKey("taskManager", "*"),
            new PipelineKey("testFramework", "*"),
            new PipelineKey("unite", "*"),
            new PipelineKey("unitTestEngine", "*"),
            new PipelineKey("unitTestRunner", "*")
        ];
    }

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            logger.info("Creating Root Directory", { rootFolder: engineVariables.rootFolder });
            await fileSystem.directoryCreate(engineVariables.rootFolder);
        } catch (err) {
            logger.error("Creating Root Directory failed", err, { wwwFolder: engineVariables.rootFolder });
            return 1;
        }

        try {
            logger.info("Creating WWW Directory", { wwwFolder: engineVariables.wwwRootFolder });
            await fileSystem.directoryCreate(engineVariables.wwwRootFolder);
        } catch (err) {
            logger.error("Creating WWW Directory failed", err, { wwwFolder: engineVariables.wwwRootFolder });
            return 1;
        }

        try {
            logger.info("Creating Packaged Directory", { wwwFolder: engineVariables.packagedRootFolder });
            await fileSystem.directoryCreate(engineVariables.packagedRootFolder);
            return 0;
        } catch (err) {
            logger.error("Creating Packaged Directory failed", err, { wwwFolder: engineVariables.packagedRootFolder });
            return 1;
        }
    }
}
