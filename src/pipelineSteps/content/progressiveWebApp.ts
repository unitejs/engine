/**
 * Pipeline step to generate progressive web app configuration.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class ProgressiveWebApp extends PipelineStepBase {
    private static FILENAME: string = "service-worker-template.js";

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        const assetPwa = fileSystem.pathCombine(engineVariables.engineAssetsFolder, "pwa");
        const buildPwa = fileSystem.pathCombine(engineVariables.wwwRootFolder, "build/assets/pwa");
        return this.copyFile(logger, fileSystem, assetPwa, ProgressiveWebApp.FILENAME, buildPwa, ProgressiveWebApp.FILENAME, engineVariables.force, false);
    }
}
