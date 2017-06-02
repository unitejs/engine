/**
 * Pipeline step to generate mocha configuration.
 */
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../engine/enginePipelineStepBase";
import { EngineVariables } from "../engine/engineVariables";
import { IDisplay } from "../interfaces/IDisplay";
import { IFileSystem } from "../interfaces/IFileSystem";
import { ILogger } from "../interfaces/ILogger";

export class Mocha extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {

        if (uniteConfiguration.unitTestRunner === "Mocha") {
            try {
                super.log(logger, display, "Generating Mocha Configuration");

                return 0;
            } catch (err) {
                super.error(logger, display, "Generating Mocha Configuration failed", err);
                return 1;
            }
        }

        return 0;
    }
}