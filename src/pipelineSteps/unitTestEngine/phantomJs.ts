/**
 * Pipeline step to generate phantom JS configuration.
 */
import { ArrayHelper } from "unitejs-framework/dist/helpers/arrayHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { KarmaConfiguration } from "../../configuration/models/karma/karmaConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class PhantomJs extends PipelineStepBase {
    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): boolean | undefined {
        return super.condition(uniteConfiguration.unitTestEngine, "PhantomJS");
    }

    public async configure(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        engineVariables.toggleDevDependency(["karma-phantomjs-launcher", "bluebird", "es6-shim"], mainCondition && super.condition(uniteConfiguration.unitTestRunner, "Karma"));

        const karmaConfiguration = engineVariables.getConfiguration<KarmaConfiguration>("Karma");
        if (karmaConfiguration) {
            ArrayHelper.addRemove(karmaConfiguration.browsers, "PhantomJS", mainCondition && super.condition(uniteConfiguration.unitTestRunner, "Karma"));

            const es6ShimInclude = fileSystem.pathToWeb(
                fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.package, "es6-shim/es6-shim.js")));

            ArrayHelper.addRemove(karmaConfiguration.files, { pattern: es6ShimInclude, included: true, includeType: "polyfill" },
                                  mainCondition && super.condition(uniteConfiguration.unitTestRunner, "Karma"),
                                  (obj, item) => obj.pattern === item.pattern);

            const bbInclude = fileSystem.pathToWeb(
                fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.package, "bluebird/js/browser/bluebird.js")));

            ArrayHelper.addRemove(karmaConfiguration.files, { pattern: bbInclude, included: true, includeType: "polyfill" },
                                  mainCondition && super.condition(uniteConfiguration.unitTestRunner, "Karma"),
                                  (obj, item) => obj.pattern === item.pattern);
        }

        return 0;
    }
}
