/**
 * Pipeline step to generate jasmine configuration.
 */
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../engine/enginePipelineStepBase";
import { EngineVariables } from "../engine/engineVariables";
import { IDisplay } from "../interfaces/IDisplay";
import { IFileSystem } from "../interfaces/IFileSystem";
import { ILogger } from "../interfaces/ILogger";

export class Jasmine extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {

        if (uniteConfiguration.unitTestFramework === "Jasmine") {
            try {
                super.log(logger, display, "Generating Jasmine Configuration");

                engineVariables.requiredDevDependencies.push("jasmine-core");

                if (uniteConfiguration.sourceLanguage === "TypeScript") {
                    engineVariables.requiredDevDependencies.push("@types/jasmine");
                }

                return 0;
            } catch (err) {
                super.error(logger, display, "Generating Jasmine Configuration failed", err);
                return 1;
            }
        }

        return 0;
    }
}