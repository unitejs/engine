/**
 * Pipeline step to generate scaffolding for shared application.
 */
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";
import { IDisplay } from "../../interfaces/IDisplay";
import { IFileSystem } from "../../interfaces/IFileSystem";
import { ILogger } from "../../interfaces/ILogger";

export abstract class SharedAppFramework extends EnginePipelineStepBase {
    protected async generateAppSource(logger: ILogger,
                                      display: IDisplay,
                                      fileSystem: IFileSystem,
                                      uniteConfiguration: UniteConfiguration,
                                      engineVariables: EngineVariables,
                                      files: string[]): Promise<number> {
        const scaffoldFolder = fileSystem.pathCombine(engineVariables.assetsDirectory, "appFramework/" +
                                                                                       uniteConfiguration.applicationFramework.toLowerCase() +
                                                                                       "/src/" +
                                                                                       uniteConfiguration.sourceLanguage.toLowerCase());

        try {
            super.log(logger, display, "Generating App Source in", { appSourceFolder: engineVariables.srcFolder });

            for (const file of files) {
                await this.copyFile(logger, display, fileSystem,
                                    scaffoldFolder,
                                    file + "." + engineVariables.sourceLanguageExt,
                                    engineVariables.srcFolder,
                                    file + "." + engineVariables.sourceLanguageExt);
            }

            return 0;
        } catch (err) {
            super.error(logger, display, "Generating App Source failed", err, { appSourceFolder: engineVariables.srcFolder });
            return 1;
        }
    }

    protected async generateAppHtml(logger: ILogger,
                                    display: IDisplay,
                                    fileSystem: IFileSystem,
                                    uniteConfiguration: UniteConfiguration,
                                    engineVariables: EngineVariables,
                                    htmlFiles: string[]): Promise<number> {
        const scaffoldFolder = fileSystem.pathCombine(engineVariables.assetsDirectory, "appFramework/" +
                                                                                       uniteConfiguration.applicationFramework.toLowerCase() +
                                                                                       "/src/html/");

        try {
            super.log(logger, display, "Generating App HTML in", { appSourceFolder: engineVariables.srcFolder });

            for (const htmlFile of htmlFiles) {
                await this.copyFile(logger, display, fileSystem,
                                    scaffoldFolder,
                                    htmlFile + ".html",
                                    engineVariables.srcFolder,
                                    htmlFile + ".html");
            }

            return 0;
        } catch (err) {
            super.error(logger, display, "Generating App HTML failed", err, { appSourceFolder: engineVariables.srcFolder });
            return 1;
        }
    }

    protected async generateAppCss(logger: ILogger,
                                   display: IDisplay,
                                   fileSystem: IFileSystem,
                                   uniteConfiguration: UniteConfiguration,
                                   engineVariables: EngineVariables,
                                   cssFiles: string[]): Promise<number> {
        const scaffoldFolder = fileSystem.pathCombine(engineVariables.assetsDirectory, "appFramework/" +
                                                                                       uniteConfiguration.applicationFramework.toLowerCase() +
                                                                                       "/src/css/" + uniteConfiguration.cssPre.toLowerCase() + "/");

        try {
            super.log(logger, display, "Generating App CSS in", { appSourceFolder: engineVariables.srcFolder });

            for (const cssFile of cssFiles) {
                await this.copyFile(logger, display, fileSystem,
                                    scaffoldFolder,
                                    cssFile + "." + engineVariables.styleLanguageExt,
                                    engineVariables.srcFolder,
                                    cssFile + "." + engineVariables.styleLanguageExt);
            }

            return 0;
        } catch (err) {
            super.error(logger, display, "Generating CSS HTML failed", err, { appSourceFolder: engineVariables.srcFolder });
            return 1;
        }
    }

    protected async generateUnitTest(logger: ILogger,
                                     display: IDisplay,
                                     fileSystem: IFileSystem,
                                     uniteConfiguration: UniteConfiguration,
                                     engineVariables: EngineVariables,
                                     specs: string[]): Promise<number> {
        if (uniteConfiguration.unitTestRunner !== "None") {
            try {
                super.log(logger, display, "Generating unit test scaffold shared", { unitTestSrcFolder: engineVariables.unitTestSrcFolder });

                const unitTestsScaffold = fileSystem.pathCombine(engineVariables.assetsDirectory,
                                                                 "appFramework/" +
                                                                 uniteConfiguration.applicationFramework.toLowerCase() +
                                                                 "/test/unit/src/sourceLanguage/" +
                                                                 uniteConfiguration.sourceLanguage.toLowerCase() + "/" +
                                                                 uniteConfiguration.unitTestFramework.toLowerCase() + "/");

                const unitTestsScaffoldModuleType = fileSystem.pathCombine(engineVariables.assetsDirectory,
                                                                             "appFramework/shared/test/unit/moduleType/" +
                                                                             uniteConfiguration.moduleType.toLowerCase() + "/");

                for (const spec of specs) {
                    await this.copyFile(logger, display, fileSystem, unitTestsScaffold,
                                        spec + ".spec." + engineVariables.sourceLanguageExt,
                                        engineVariables.unitTestSrcFolder,
                                        spec + ".spec." + engineVariables.sourceLanguageExt);
                }

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

    protected async generateE2eTest(logger: ILogger,
                                    display: IDisplay,
                                    fileSystem: IFileSystem,
                                    uniteConfiguration: UniteConfiguration,
                                    engineVariables: EngineVariables,
                                    specs: string[]): Promise<number> {
        if (uniteConfiguration.e2eTestRunner !== "None") {
            try {
                super.log(logger, display, "Generating e2e test scaffold shared", { unitTestSrcFolder: engineVariables.e2eTestSrcFolder });

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

                for (const spec of specs) {
                    await this.copyFile(logger, display, fileSystem, e2eTestsScaffold,
                        spec + ".spec." + engineVariables.sourceLanguageExt,
                        engineVariables.e2eTestSrcFolder,
                        spec + ".spec." + engineVariables.sourceLanguageExt);
                }

                await this.copyFile(logger, display, fileSystem, e2eTestsScaffoldRunner,
                    "e2e-bootstrap.js",
                    engineVariables.e2eTestFolder,
                    "e2e-bootstrap.js");

                if (uniteConfiguration.sourceLanguage === "TypeScript") {
                    await this.copyFile(logger, display, fileSystem, e2eTestsScaffoldRunner,
                        "e2e-bootstrap.d.ts",
                        engineVariables.e2eTestFolder,
                        "e2e-bootstrap.d.ts");
                }
                return 0;
            } catch (err) {
                super.error(logger, display, "Generating application e2e test failed", err, { unitTestSrcFolder: engineVariables.e2eTestSrcFolder });
                return 1;
            }
        } else {
            return 0;
        }
    }

    protected async generateCss(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            super.log(logger, display, "Generating application css scaffold shared");

            const assetCssFolder = fileSystem.pathCombine(engineVariables.assetsDirectory, "appFramework/shared/css/" +
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