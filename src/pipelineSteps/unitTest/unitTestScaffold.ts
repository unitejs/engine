/**
 * Pipeline step to generate scaffolding for unit tests.
 */
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";
import { IDisplay } from "../../interfaces/IDisplay";
import { IFileSystem } from "../../interfaces/IFileSystem";
import { ILogger } from "../../interfaces/ILogger";

export class UnitTestScaffold extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        if (uniteConfiguration.unitTestRunner === "Karma") {
            try {
                super.log(logger, display, "Creating Unit Test Directory", { unitTestSrcFolder: engineVariables.unitTestSrcFolder });
                await fileSystem.directoryCreate(engineVariables.unitTestSrcFolder);
            } catch (err) {
                super.error(logger, display, "Creating Unit Test Directory failed", err, { unitTestSrcFolder: engineVariables.unitTestSrcFolder });
                return 1;
            }

            try {
                super.log(logger, display, "Generating unit test scaffold", { unitTestSrcFolder: engineVariables.unitTestSrcFolder });

                const unitTestsScaffold = fileSystem.pathCombine(engineVariables.assetsDirectory,
                                                                 "scaffold/test/unit/src/" +
                                                                 uniteConfiguration.sourceLanguage.toLowerCase() + "/" +
                                                                 uniteConfiguration.unitTestFramework.toLowerCase() + "/");

                const unitTestsScaffoldModuleLoader = fileSystem.pathCombine(engineVariables.assetsDirectory,
                                                                             "scaffold/test/unit/src/" +
                                                                             uniteConfiguration.moduleLoader.toLowerCase() + "/");

                await this.copyFile(logger, display, fileSystem, unitTestsScaffold,
                                    "main.spec." + engineVariables.sourceLanguageExt,
                                    engineVariables.unitTestSrcFolder,
                                    "main.spec." + engineVariables.sourceLanguageExt);

                await this.copyFile(logger, display, fileSystem, unitTestsScaffold,
                                    "app.spec." + engineVariables.sourceLanguageExt,
                                    engineVariables.unitTestSrcFolder,
                                    "app.spec." + engineVariables.sourceLanguageExt);

                await this.copyFile(logger, display, fileSystem, unitTestsScaffoldModuleLoader,
                                    "unit-bootstrap.js",
                                    engineVariables.unitTestFolder,
                                    "unit-bootstrap.js");

                return 0;
            } catch (err) {
                super.error(logger, display, "Generating unit test scaffold failed", err, { unitTestSrcFolder: engineVariables.unitTestSrcFolder });
                return 1;
            }
        } else {
            return 0;
        }
    }
}