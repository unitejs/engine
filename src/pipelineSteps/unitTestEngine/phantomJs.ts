/**
 * Pipeline step to generate phantom JS configuration.
 */
import { ArrayHelper } from "unitejs-framework/dist/helpers/arrayHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { KarmaConfiguration } from "../../configuration/models/karma/karmaConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineKey } from "../../engine/pipelineKey";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class PhantomJs extends PipelineStepBase {
    public influences(): PipelineKey[] {
        return [
            new PipelineKey("unite", "uniteConfigurationJson"),
            new PipelineKey("content", "packageJson"),
            new PipelineKey("unitTestRunner", "karma")
        ];
    }

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["karma-phantomjs-launcher", "bluebird"],
                                            super.condition(uniteConfiguration.unitTestRunner, "Karma") && super.condition(uniteConfiguration.unitTestEngine, "PhantomJS"));

        const karmaConfiguration = engineVariables.getConfiguration<KarmaConfiguration>("Karma");
        if (karmaConfiguration) {
            const addCond = super.condition(uniteConfiguration.unitTestRunner, "Karma") && super.condition(uniteConfiguration.unitTestEngine, "PhantomJS");

            ArrayHelper.addRemove(karmaConfiguration.browsers, "PhantomJS", addCond);

            const bbInclude = fileSystem.pathToWeb(
                fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.packageFolder, "bluebird/js/browser/bluebird.js")));

            ArrayHelper.addRemove(karmaConfiguration.files, { pattern: bbInclude, included: true, isPerm: true }, addCond, (obj, item) => obj.pattern === item.pattern);
        }

        return 0;
    }
}
