/**
 * Pipeline step to generate scaffolding for app.
 */
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { StringHelper } from "../core/stringHelper";
import { EnginePipelineStepBase } from "../engine/enginePipelineStepBase";
import { EngineVariables } from "../engine/engineVariables";
import { IDisplay } from "../interfaces/IDisplay";
import { IFileSystem } from "../interfaces/IFileSystem";
import { ILogger } from "../interfaces/ILogger";

export class UnitTestScaffold extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.unitTestFolder = fileSystem.directoryPathCombine(uniteConfiguration.outputDirectory, "\\test\\unit");
        try {
            super.log(logger, display, "Creating Unit Test Directory", { unitTestFolder: engineVariables.unitTestFolder });
            await fileSystem.directoryCreate(engineVariables.unitTestFolder);
        } catch (err) {
            super.error(logger, display, "Creating Unit Test Directory failed", err, { unitTestFolder: engineVariables.unitTestFolder });
            return 1;
        }

        try {
            super.log(logger, display, "Generating unit test scaffold", { gulpTasksgulpTunitTestFolderasksFolderBuildFolder: engineVariables.unitTestFolder });

            const unitTestsScaffold = fileSystem.directoryPathCombine(engineVariables.assetsDirectory,
                                                                      "scaffold/test/unit/" +
                                                                      StringHelper.toCamelCase(uniteConfiguration.sourceLanguage) + "/" +
                                                                      StringHelper.toCamelCase(uniteConfiguration.unitTestFramework) + "/");

            if (uniteConfiguration.unitTestFramework === "Chai") {
                engineVariables.requiredDevDependencies.push("chai");
            } else if (uniteConfiguration.unitTestFramework === "Jasmine") {
                engineVariables.requiredDevDependencies.push("jasmine-core");
            }

            await this.copyFile(logger, display, fileSystem, unitTestsScaffold,
                                "main.spec." + engineVariables.sourceLanguageExt,
                                engineVariables.unitTestFolder,
                                "main.spec." + engineVariables.sourceLanguageExt);

            await this.copyFile(logger, display, fileSystem, unitTestsScaffold,
                                "app.spec." + engineVariables.sourceLanguageExt,
                                engineVariables.unitTestFolder,
                                "app.spec." + engineVariables.sourceLanguageExt);

            return 0;
        } catch (err) {
            super.error(logger, display, "Generating unit test scaffold failed", err, { unitTestFolder: engineVariables.unitTestFolder });
            return 1;
        }
    }
}