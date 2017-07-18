/**
 * Pipeline step to generate mocha configuration.
 */
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";
import { IDisplay } from "../../interfaces/IDisplay";
import { IFileSystem } from "../../interfaces/IFileSystem";
import { ILogger } from "../../interfaces/ILogger";

export class MochaChai extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDependencies(["mocha", "chai"], uniteConfiguration.unitTestFramework === "Mocha-Chai" || uniteConfiguration.e2eTestFramework === "Mocha-Chai", true);
        engineVariables.toggleDependencies(["@types/mocha", "@types/chai"],
                                           (uniteConfiguration.unitTestFramework === "Mocha-Chai" || uniteConfiguration.e2eTestFramework === "Mocha-Chai")
                                             && uniteConfiguration.sourceLanguage === "TypeScript",
                                           true);

        if (uniteConfiguration.unitTestFramework === "Mocha-Chai" || uniteConfiguration.e2eTestFramework === "Mocha-Chai") {
            try {
                super.log(logger, display, "Generating Mocha-Chai Configuration");

                uniteConfiguration.clientPackages.chai = { version: engineVariables.findDependencyVersion("chai"), main: "chai.js", preload: true, includeMode: "test" };

                return 0;
            } catch (err) {
                super.error(logger, display, "Generating Mocha-Chai Configuration failed", err);
                return 1;
            }
        }

        return 0;
    }
}