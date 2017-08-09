/**
 * Pipeline step to generate scaffolding for shared application.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export abstract class SharedAppFramework extends EnginePipelineStepBase {
    protected async generateAppSource(logger: ILogger,
                                      fileSystem: IFileSystem,
                                      uniteConfiguration: UniteConfiguration,
                                      engineVariables: EngineVariables,
                                      files: string[]): Promise<number> {
        const scaffoldFolder = fileSystem.pathCombine(engineVariables.packageAssetsDirectory,
                                                      `appFramework/${uniteConfiguration.applicationFramework.toLowerCase()}/src/${uniteConfiguration.sourceLanguage.toLowerCase()}`);

        try {
            logger.info("Generating App Source in", { appSourceFolder: engineVariables.www.srcFolder });

            for (let file of files) {
                if (file.indexOf("!") >= 0) {
                    file = file.replace("!", ".");
                } else {
                    file += `.${engineVariables.sourceLanguageExt}`;
                }
                await this.copyFile(logger, fileSystem,
                                    scaffoldFolder,
                                    file,
                                    engineVariables.www.srcFolder,
                                    file);
            }

            return 0;
        } catch (err) {
            logger.error("Generating App Source failed", err, { appSourceFolder: engineVariables.www.srcFolder });
            return 1;
        }
    }

    protected async generateAppHtml(logger: ILogger,
                                    fileSystem: IFileSystem,
                                    uniteConfiguration: UniteConfiguration,
                                    engineVariables: EngineVariables,
                                    htmlFiles: string[]): Promise<number> {
        const scaffoldFolder = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `appFramework/${uniteConfiguration.applicationFramework.toLowerCase()}/src/html/`);

        try {
            logger.info("Generating App HTML in", { appSourceFolder: engineVariables.www.srcFolder });

            for (const htmlFile of htmlFiles) {
                await this.copyFile(logger, fileSystem,
                                    scaffoldFolder,
                                    `${htmlFile}.html`,
                                    engineVariables.www.srcFolder,
                                    `${htmlFile}.html`);
            }

            return 0;
        } catch (err) {
            logger.error("Generating App HTML failed", err, { appSourceFolder: engineVariables.www.srcFolder });
            return 1;
        }
    }

    protected async generateAppCss(logger: ILogger,
                                   fileSystem: IFileSystem,
                                   uniteConfiguration: UniteConfiguration,
                                   engineVariables: EngineVariables,
                                   cssFiles: string[]): Promise<number> {
        const scaffoldFolder = fileSystem.pathCombine(engineVariables.packageAssetsDirectory,
                                                      `appFramework/${uniteConfiguration.applicationFramework.toLowerCase()}/src/css/${uniteConfiguration.cssPre.toLowerCase()}/`);

        try {
            logger.info("Generating App CSS in", { appSourceFolder: engineVariables.www.srcFolder });

            for (const cssFile of cssFiles) {
                await this.copyFile(logger, fileSystem,
                                    scaffoldFolder,
                                    `${cssFile}.${engineVariables.styleLanguageExt}`,
                                    engineVariables.www.srcFolder,
                                    `${cssFile}.${engineVariables.styleLanguageExt}`);
            }

            return 0;
        } catch (err) {
            logger.error("Generating CSS HTML failed", err, { appSourceFolder: engineVariables.www.srcFolder });
            return 1;
        }
    }

    protected async generateUnitTest(logger: ILogger,
                                     fileSystem: IFileSystem,
                                     uniteConfiguration: UniteConfiguration,
                                     engineVariables: EngineVariables,
                                     specs: string[]): Promise<number> {
        if (uniteConfiguration.unitTestRunner !== "None") {
            try {
                logger.info("Generating unit test scaffold shared", { unitTestSrcFolder: engineVariables.www.unitTestSrcFolder });

                const unitTestsScaffold = fileSystem.pathCombine(engineVariables.packageAssetsDirectory,
                                                                 `appFramework/shared/test/unit/src/sourceLanguage/${uniteConfiguration.sourceLanguage.toLowerCase()}/` +
                                                                 `${uniteConfiguration.unitTestFramework.toLowerCase()}/`);

                const unitTestsScaffoldModuleType = fileSystem.pathCombine(engineVariables.packageAssetsDirectory,
                                                                           `appFramework/shared/test/unit/moduleType/${uniteConfiguration.moduleType.toLowerCase()}/`);

                for (const spec of specs) {
                    await this.copyFile(logger, fileSystem, unitTestsScaffold,
                                        `${spec}.spec.${engineVariables.sourceLanguageExt}`,
                                        engineVariables.www.unitTestSrcFolder,
                                        `${spec}.spec.${engineVariables.sourceLanguageExt}`);
                }

                await this.copyFile(logger, fileSystem, unitTestsScaffoldModuleType,
                                    "unit-bootstrap.js",
                                    engineVariables.www.unitTestFolder,
                                    "unit-bootstrap.js");

                return 0;
            } catch (err) {
                logger.error("Generating application unit test failed", err, { unitTestSrcFolder: engineVariables.www.unitTestSrcFolder });
                return 1;
            }
        } else {
            return 0;
        }
    }

    protected async generateE2eTest(logger: ILogger,
                                    fileSystem: IFileSystem,
                                    uniteConfiguration: UniteConfiguration,
                                    engineVariables: EngineVariables,
                                    specs: string[]): Promise<number> {
        if (uniteConfiguration.e2eTestRunner !== "None") {
            try {
                logger.info("Generating e2e test scaffold shared", { unitTestSrcFolder: engineVariables.www.e2eTestSrcFolder });

                const e2eTestsScaffold = fileSystem.pathCombine(engineVariables.packageAssetsDirectory,
                                                                `appFramework/${uniteConfiguration.applicationFramework.toLowerCase()}/test/e2e/src/e2eTestRunner/` +
                                                                `${uniteConfiguration.e2eTestRunner.toLowerCase()}/sourceLanguage/` +
                                                                `${uniteConfiguration.sourceLanguage.toLowerCase()}/${uniteConfiguration.e2eTestFramework.toLowerCase()}/`);

                for (const spec of specs) {
                    await this.copyFile(logger, fileSystem, e2eTestsScaffold,
                                        `${spec}.spec.${engineVariables.sourceLanguageExt}`,
                                        engineVariables.www.e2eTestSrcFolder,
                                        `${spec}.spec.${engineVariables.sourceLanguageExt}`);
                }

                return 0;
            } catch (err) {
                logger.error("Generating application e2e test failed", err, { unitTestSrcFolder: engineVariables.www.e2eTestSrcFolder });
                return 1;
            }
        } else {
            return 0;
        }
    }

    protected async generateCss(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            logger.info("Generating application css scaffold shared", { cssSrcFolder: engineVariables.www.cssSrcFolder });

            const assetCssFolder = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `appFramework/shared/css/${uniteConfiguration.cssPre.toLowerCase()}`);

            await super.copyFile(logger, fileSystem, assetCssFolder, `app.${engineVariables.styleLanguageExt}`, engineVariables.www.cssSrcFolder, `app.${engineVariables.styleLanguageExt}`);
            await super.copyFile(logger, fileSystem, assetCssFolder, `main.${engineVariables.styleLanguageExt}`, engineVariables.www.cssSrcFolder, `main.${engineVariables.styleLanguageExt}`);
            await super.copyFile(logger, fileSystem, assetCssFolder, `reset.${engineVariables.styleLanguageExt}`, engineVariables.www.cssSrcFolder, `reset.${engineVariables.styleLanguageExt}`);

            return 0;
        } catch (err) {
            logger.error("Generating application css failed", err);
            return 1;
        }
    }
}
