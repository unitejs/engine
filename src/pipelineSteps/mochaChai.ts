/**
 * Pipeline step to generate mocha configuration.
 */
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../engine/enginePipelineStepBase";
import { EngineVariables } from "../engine/engineVariables";
import { IDisplay } from "../interfaces/IDisplay";
import { IFileSystem } from "../interfaces/IFileSystem";
import { ILogger } from "../interfaces/ILogger";

export class MochaChai extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {

        if (uniteConfiguration.unitTestFramework === "Mocha-Chai") {
            try {
                super.log(logger, display, "Generating Mocha-Chai Configuration");

                engineVariables.requiredDevDependencies.push("mocha");
                engineVariables.requiredDevDependencies.push("chai");

                if (uniteConfiguration.sourceLanguage === "TypeScript") {
                    engineVariables.requiredDevDependencies.push("@types/mocha");
                    engineVariables.requiredDevDependencies.push("@types/chai");
                }

                engineVariables.requiredDevDependencies.push("mocha");
                engineVariables.requiredDevDependencies.push("chai");

                uniteConfiguration.clientPackages.chai = { version: "^3.5.0", main: "chai.js", preload: true, includeMode: "test" };

                return 0;
            } catch (err) {
                super.error(logger, display, "Generating Mocha-Chai Configuration failed", err);
                return 1;
            }
        }

        return 0;
    }
}