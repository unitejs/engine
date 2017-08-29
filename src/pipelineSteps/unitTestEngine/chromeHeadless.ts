/**
 * Pipeline step to generate chrome headless configuration.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { KarmaConfiguration } from "../../configuration/models/karma/karmaConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class ChromeHeadless extends EnginePipelineStepBase {
    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["karma-chrome-launcher"], uniteConfiguration.unitTestRunner === "Karma" && uniteConfiguration.unitTestEngine === "ChromeHeadless");

        if (uniteConfiguration.unitTestRunner === "Karma" && uniteConfiguration.unitTestEngine === "ChromeHeadless") {
            const karmaConfiguration = engineVariables.getConfiguration<KarmaConfiguration>("Karma");
            if (karmaConfiguration) {
                karmaConfiguration.browsers.push("ChromeHeadless");
            }
        }

        return 0;
    }
}
