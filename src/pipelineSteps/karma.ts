/**
 * Pipeline step to generate karma configuration.
 */
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../engine/enginePipelineStepBase";
import { EngineVariables } from "../engine/engineVariables";
import { IDisplay } from "../interfaces/IDisplay";
import { IFileSystem } from "../interfaces/IFileSystem";
import { ILogger } from "../interfaces/ILogger";

export class Karma extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {

        if (uniteConfiguration.unitTestRunner === "Karma") {
            try {
                super.log(logger, display, "Generating Karma Configuration");

                engineVariables.requiredDevDependencies.push("karma");

                return 0;
            } catch (err) {
                super.error(logger, display, "Generating Karma Configuration failed", err);
                return 1;
            }
        }

        return 0;
    }
}