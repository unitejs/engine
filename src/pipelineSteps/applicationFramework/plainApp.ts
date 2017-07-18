/**
 * Pipeline step to generate scaffolding for app.
 */
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";
import { IDisplay } from "../../interfaces/IDisplay";
import { IFileSystem } from "../../interfaces/IFileSystem";
import { ILogger } from "../../interfaces/ILogger";

export class PlainApp extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        if (uniteConfiguration.applicationFramework === "PlainApp") {
            let ret = await this.generateApp(logger, display, fileSystem, uniteConfiguration, engineVariables);

            if (ret === 0) {
                ret = await this.generateE2eTest(logger, display, fileSystem, uniteConfiguration, engineVariables);

                if (ret === 0) {
                    ret = await this.generateUnitTest(logger, display, fileSystem, uniteConfiguration, engineVariables);

                    if (ret === 0) {
                        ret = await this.generateCss(logger, display, fileSystem, uniteConfiguration, engineVariables);
                    }
                }
            }

            return ret;
        }
        return 0;
    }

    private async generateApp(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        const scaffoldFolder = fileSystem.pathCombine(engineVariables.assetsDirectory, "appFramework/" +
                                                                                       uniteConfiguration.applicationFramework.toLowerCase() +
                                                                                       "/src/" +
                                                                                       uniteConfiguration.sourceLanguage.toLowerCase());

        try {
            super.log(logger, display, "Generating Main in", { appSourceFolder: engineVariables.srcFolder });

            await this.copyFile(logger, display, fileSystem,
                                scaffoldFolder,
                                "main." + engineVariables.sourceLanguageExt,
                                engineVariables.srcFolder,
                                "main." + engineVariables.sourceLanguageExt);
        } catch (err) {
            super.error(logger, display, "Generating Main failed", err, { appSourceFolder: engineVariables.srcFolder });
            return 1;
        }

        try {
            super.log(logger, display, "Generating EntryPoint in", { appSourceFolder: engineVariables.srcFolder });

            await this.copyFile(logger, display, fileSystem,
                                scaffoldFolder,
                                "entryPoint." + engineVariables.sourceLanguageExt,
                                engineVariables.srcFolder,
                                "entryPoint." + engineVariables.sourceLanguageExt);
        } catch (err) {
            super.error(logger, display, "Generating EntryPoint failed", err, { appSourceFolder: engineVariables.srcFolder });
            return 1;
        }

        try {
            await this.copyFile(logger, display, fileSystem, scaffoldFolder, "app." + engineVariables.sourceLanguageExt, engineVariables.srcFolder, "app." + engineVariables.sourceLanguageExt);
            return 0;
        } catch (err) {
            super.error(logger, display, "Generating App failed", err, { appSourceFolder: engineVariables.srcFolder });
            return 1;
        }
    }

    private async generateUnitTest(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        if (uniteConfiguration.unitTestRunner !== "None") {
            try {
                super.log(logger, display, "Generating unit test scaffold", { unitTestSrcFolder: engineVariables.unitTestSrcFolder });

                const unitTestsScaffold = fileSystem.pathCombine(engineVariables.assetsDirectory,
                                                                 "appFramework/" +
                                                                 uniteConfiguration.applicationFramework.toLowerCase() +
                                                                 "/test/unit/src/sourceLanguage/" +
                                                                 uniteConfiguration.sourceLanguage.toLowerCase() + "/" +
                                                                 uniteConfiguration.unitTestFramework.toLowerCase() + "/");

                const unitTestsScaffoldModuleType = fileSystem.pathCombine(engineVariables.assetsDirectory,
                                                                             "appFramework/" +
                                                                             uniteConfiguration.applicationFramework.toLowerCase() +
                                                                             "/test/unit/src/moduleType/" +
                                                                             uniteConfiguration.moduleType.toLowerCase() + "/");

                await this.copyFile(logger, display, fileSystem, unitTestsScaffold,
                                    "main.spec." + engineVariables.sourceLanguageExt,
                                    engineVariables.unitTestSrcFolder,
                                    "main.spec." + engineVariables.sourceLanguageExt);

                await this.copyFile(logger, display, fileSystem, unitTestsScaffold,
                                    "app.spec." + engineVariables.sourceLanguageExt,
                                    engineVariables.unitTestSrcFolder,
                                    "app.spec." + engineVariables.sourceLanguageExt);

                await this.copyFile(logger, display, fileSystem, unitTestsScaffoldModuleType,
                                    "unit-bootstrap.js",
                                    engineVariables.unitTestFolder,
                                    "unit-bootstrap.js");

                return 0;
            } catch (err) {
                super.error(logger, display, "Generating application unit test failed", err, { unitTestSrcFolder: engineVariables.unitTestSrcFolder });
                return 1;
            }
        } else {
            return 0;
        }
    }

    private async generateE2eTest(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        if (uniteConfiguration.e2eTestRunner !== "None") {
            try {
                super.log(logger, display, "Generating e2e test scaffold", { unitTestSrcFolder: engineVariables.e2eTestSrcFolder });

                const e2eTestsScaffold = fileSystem.pathCombine(engineVariables.assetsDirectory,
                                                                "appFramework/" +
                                                                uniteConfiguration.applicationFramework.toLowerCase() +
                                                                "/test/e2e/src/e2eTestRunner/" +
                                                                uniteConfiguration.e2eTestRunner.toLowerCase() + "/" +
                                                                "/sourceLanguage/" +
                                                                uniteConfiguration.sourceLanguage.toLowerCase() + "/" +
                                                                uniteConfiguration.e2eTestFramework.toLowerCase() + "/");

                const e2eTestsScaffoldRunner = fileSystem.pathCombine(engineVariables.assetsDirectory,
                                                                      "appFramework/" +
                                                                      uniteConfiguration.applicationFramework.toLowerCase() +
                                                                      "/test/e2e/e2eTestRunner/" +
                                                                      uniteConfiguration.e2eTestRunner.toLowerCase());

                await this.copyFile(logger, display, fileSystem, e2eTestsScaffold,
                                    "app.spec." + engineVariables.sourceLanguageExt,
                                    engineVariables.e2eTestSrcFolder,
                                    "app.spec." + engineVariables.sourceLanguageExt);

                await this.copyFile(logger, display, fileSystem, e2eTestsScaffoldRunner,
                                    "e2e-bootstrap.js",
                                    engineVariables.e2eTestFolder,
                                    "e2e-bootstrap.js");
                return 0;
            } catch (err) {
                super.error(logger, display, "Generating application e2e test failed", err, { unitTestSrcFolder: engineVariables.e2eTestSrcFolder });
                return 1;
            }
        } else {
            return 0;
        }
    }

    private async generateCss(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            super.log(logger, display, "Generating application css scaffold");

            const assetCssFolder = fileSystem.pathCombine(engineVariables.assetsDirectory, "appFramework/" +
                                                                                           uniteConfiguration.applicationFramework.toLowerCase() +
                                                                                           "/css/" +
                                                                                           uniteConfiguration.cssPre.toLowerCase());

            super.copyFile(logger, display, fileSystem, assetCssFolder, "app." + engineVariables.styleLanguageExt, engineVariables.cssSrcFolder, "app." + engineVariables.styleLanguageExt);
            super.copyFile(logger, display, fileSystem, assetCssFolder, "main." + engineVariables.styleLanguageExt, engineVariables.cssSrcFolder, "main." + engineVariables.styleLanguageExt);
            super.copyFile(logger, display, fileSystem, assetCssFolder, "reset." + engineVariables.styleLanguageExt, engineVariables.cssSrcFolder, "reset." + engineVariables.styleLanguageExt);

            return 0;
        } catch (err) {
            super.error(logger, display, "Generating application css failed", err);
            return 1;
        }
    }
}