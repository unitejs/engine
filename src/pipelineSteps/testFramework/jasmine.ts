/**
 * Pipeline step to generate jasmine configuration.
 */
import { IDisplay } from "unitejs-framework/dist/interfaces/IDisplay";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class Jasmine extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["jasmine-core"], uniteConfiguration.unitTestFramework === "Jasmine" || uniteConfiguration.e2eTestFramework === "Jasmine");
        engineVariables.toggleDevDependency(["@types/jasmine"],
                                            (uniteConfiguration.unitTestFramework === "Jasmine" || uniteConfiguration.e2eTestFramework === "Jasmine")
                                            && uniteConfiguration.sourceLanguage === "TypeScript");

        engineVariables.lintEnv.jasmine = uniteConfiguration.linter === "ESLint" && (uniteConfiguration.unitTestFramework === "Jasmine" || uniteConfiguration.e2eTestFramework === "Jasmine");

        if (uniteConfiguration.unitTestFramework === "Jasmine" || uniteConfiguration.e2eTestFramework === "Jasmine") {
            try {
                super.log(logger, display, "Generating Jasmine Configuration");

                return 0;
            } catch (err) {
                super.error(logger, display, "Generating Jasmine Configuration failed", err);
                return 1;
            }
        }

        return 0;
    }
}
