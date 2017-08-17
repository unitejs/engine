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
        const scaffoldFolder = fileSystem.pathCombine(engineVariables.engineAssetsFolder,
                                                      `appFramework/${uniteConfiguration.applicationFramework.toLowerCase()}/src/${uniteConfiguration.sourceLanguage.toLowerCase()}`);

        logger.info("Generating App Source in", { appSourceFolder: engineVariables.www.srcFolder });

        for (let file of files) {
            if (file.indexOf("!") >= 0) {
                file = file.replace("!", ".");
            } else {
                file += `.${engineVariables.sourceLanguageExt}`;
            }
            const ret = await this.copyFile(logger, fileSystem,
                                            scaffoldFolder,
                                            file,
                                            engineVariables.www.srcFolder,
                                            file);

            if (ret !== 0) {
                return ret;
            }
        }

        return 0;
    }

    protected async generateAppHtml(logger: ILogger,
                                    fileSystem: IFileSystem,
                                    uniteConfiguration: UniteConfiguration,
                                    engineVariables: EngineVariables,
                                    htmlFiles: string[]): Promise<number> {
        const scaffoldFolder = fileSystem.pathCombine(engineVariables.engineAssetsFolder,
                                                      `appFramework/${uniteConfiguration.applicationFramework.toLowerCase()}/src/html/`);

        logger.info("Generating App HTML in", { appSourceFolder: engineVariables.www.srcFolder });

        for (const htmlFile of htmlFiles) {
            const ret = await this.copyFile(logger, fileSystem,
                                            scaffoldFolder,
                                            `${htmlFile}.html`,
                                            engineVariables.www.srcFolder,
                                            `${htmlFile}.html`);
            if (ret !== 0) {
                return ret;
            }
        }

        return 0;
    }

    protected async generateAppCss(logger: ILogger,
                                   fileSystem: IFileSystem,
                                   uniteConfiguration: UniteConfiguration,
                                   engineVariables: EngineVariables,
                                   cssFiles: string[]): Promise<number> {
        const scaffoldFolder = fileSystem.pathCombine(engineVariables.engineAssetsFolder,
                                                      `appFramework/${uniteConfiguration.applicationFramework.toLowerCase()}/src/css/${uniteConfiguration.cssPre.toLowerCase()}/`);
        logger.info("Generating App CSS in", { appSourceFolder: engineVariables.www.srcFolder });

        for (const cssFile of cssFiles) {
            const ret = await this.copyFile(logger, fileSystem,
                                            scaffoldFolder,
                                            `${cssFile}.${engineVariables.styleLanguageExt}`,
                                            engineVariables.www.srcFolder,
                                            `${cssFile}.${engineVariables.styleLanguageExt}`);

            if (ret !== 0) {
                return ret;
            }
        }

        return 0;
    }

    protected async generateUnitTest(logger: ILogger,
                                     fileSystem: IFileSystem,
                                     uniteConfiguration: UniteConfiguration,
                                     engineVariables: EngineVariables,
                                     specs: string[]): Promise<number> {
        if (uniteConfiguration.unitTestRunner !== "None") {
            logger.info("Generating unit test scaffold shared", { unitTestSrcFolder: engineVariables.www.unitTestSrcFolder });

            const unitTestsScaffold = fileSystem.pathCombine(engineVariables.engineAssetsFolder,
                                                             `appFramework/shared/test/unit/src/sourceLanguage/${uniteConfiguration.sourceLanguage.toLowerCase()}/` +
                                                                `${uniteConfiguration.unitTestFramework.toLowerCase()}/`);

            const unitTestsScaffoldModuleType = fileSystem.pathCombine(engineVariables.engineAssetsFolder,
                                                                       `appFramework/shared/test/unit/moduleType/${uniteConfiguration.moduleType.toLowerCase()}/`);

            for (const spec of specs) {
                const ret = await this.copyFile(logger, fileSystem, unitTestsScaffold,
                                                `${spec}.spec.${engineVariables.sourceLanguageExt}`,
                                                engineVariables.www.unitTestSrcFolder,
                                                `${spec}.spec.${engineVariables.sourceLanguageExt}`);
                if (ret !== 0) {
                    return ret;
                }
            }

            return await this.copyFile(logger, fileSystem, unitTestsScaffoldModuleType,
                                       "unit-bootstrap.js",
                                       engineVariables.www.unitTestFolder,
                                       "unit-bootstrap.js");

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
            logger.info("Generating e2e test scaffold shared", { unitTestSrcFolder: engineVariables.www.e2eTestSrcFolder });

            const e2eTestsScaffold = fileSystem.pathCombine(engineVariables.engineAssetsFolder,
                                                            `appFramework/${uniteConfiguration.applicationFramework.toLowerCase()}/test/e2e/src/e2eTestRunner/` +
                                                            `${uniteConfiguration.e2eTestRunner.toLowerCase()}/sourceLanguage/` +
                                                            `${uniteConfiguration.sourceLanguage.toLowerCase()}/${uniteConfiguration.e2eTestFramework.toLowerCase()}/`);

            for (const spec of specs) {
                const ret = await this.copyFile(logger, fileSystem, e2eTestsScaffold,
                                                `${spec}.spec.${engineVariables.sourceLanguageExt}`,
                                                engineVariables.www.e2eTestSrcFolder,
                                                `${spec}.spec.${engineVariables.sourceLanguageExt}`);

                if (ret !== 0) {
                    return ret;
                }
            }

            return 0;
        } else {
            return 0;
        }
    }

    protected async generateCss(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        logger.info("Generating application css scaffold shared", { cssSrcFolder: engineVariables.www.cssSrcFolder });

        const assetCssFolder = fileSystem.pathCombine(engineVariables.engineAssetsFolder, `appFramework/shared/css/${uniteConfiguration.cssPre.toLowerCase()}`);

        const styles = ["app", "main", "reset"];

        for (const style of styles) {
            const ret = await super.copyFile(logger, fileSystem, assetCssFolder,
                                             `${style}.${engineVariables.styleLanguageExt}`, engineVariables.www.cssSrcFolder, `${style}.${engineVariables.styleLanguageExt}`);

            if (ret !== 0) {
                return ret;
            }
        }

        return 0;
    }
}
