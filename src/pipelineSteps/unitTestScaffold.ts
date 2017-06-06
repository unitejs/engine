/**
 * Pipeline step to generate scaffolding for unit tests.
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
        if (uniteConfiguration.unitTestRunner === "Karma") {
            engineVariables.unitTestRootFolder = fileSystem.pathCombine(uniteConfiguration.outputDirectory, "\\test\\unit");
            engineVariables.unitTestSrcFolder = fileSystem.pathCombine(uniteConfiguration.outputDirectory, "\\test\\unit\\src");
            engineVariables.unitTestDistFolder = fileSystem.pathCombine(uniteConfiguration.outputDirectory, "\\test\\unit\\dist");

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
                                                                 StringHelper.toCamelCase(uniteConfiguration.sourceLanguage) + "/" +
                                                                 StringHelper.toCamelCase(uniteConfiguration.unitTestFramework) + "/");

                const unitTestsScaffoldModuleLoader = fileSystem.pathCombine(engineVariables.assetsDirectory,
                                                                             "scaffold/test/unit/src/" +
                                                                             StringHelper.toCamelCase(uniteConfiguration.moduleLoader) + "/");

                const unitFrameworks: { [id: string]: string} = {};
                let bootstrapReplacer: ((line: string) => string) | undefined;

                if (uniteConfiguration.unitTestFramework === "Mocha-Chai") {
                    engineVariables.requiredDevDependencies.push("mocha");
                    engineVariables.requiredDevDependencies.push("chai");

                    unitFrameworks.chai = "node_modules/chai/chai";
                } else if (uniteConfiguration.unitTestFramework === "Jasmine") {
                    engineVariables.requiredDevDependencies.push("jasmine-core");
                }

                await this.copyFile(logger, display, fileSystem, unitTestsScaffold,
                                    "main.spec." + engineVariables.sourceLanguageExt,
                                    engineVariables.unitTestSrcFolder,
                                    "main.spec." + engineVariables.sourceLanguageExt);

                await this.copyFile(logger, display, fileSystem, unitTestsScaffold,
                                    "app.spec." + engineVariables.sourceLanguageExt,
                                    engineVariables.unitTestSrcFolder,
                                    "app.spec." + engineVariables.sourceLanguageExt);

                const keys = Object.keys(unitFrameworks);
                let requirePaths = "";
                const requirePackages = "";
                for (let i = 0; i < keys.length; i++) {
                    requirePaths += "paths['" + keys[i] + "'] = '" + unitFrameworks[keys[i]] + "';\n";
                }

                bootstrapReplacer = (line) => {
                    line = line.replace("{REQUIRE_PATHS}", requirePaths);
                    line = line.replace("{REQUIRE_PACKAGES}", requirePackages);
                    return line;
                };

                await this.copyFile(logger, display, fileSystem, unitTestsScaffoldModuleLoader,
                                    "unitBootstrap.js",
                                    engineVariables.unitTestRootFolder,
                                    "unitBootstrap.js", bootstrapReplacer);

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