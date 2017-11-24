/**
 * Pipeline step to generate scaffolding for shared application.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../engine/engineVariables";
import { PipelineStepBase } from "../engine/pipelineStepBase";
import { TemplateHelper } from "../helpers/templateHelper";

export abstract class SharedAppFramework extends PipelineStepBase {
    protected async generateAppSource(logger: ILogger,
                                      fileSystem: IFileSystem,
                                      uniteConfiguration: UniteConfiguration,
                                      engineVariables: EngineVariables,
                                      files: string[],
                                      isShared: boolean): Promise<number> {
        const appFramework = isShared ? "shared" : uniteConfiguration.applicationFramework.toLowerCase();

        const scaffoldFolder = fileSystem.pathCombine(engineVariables.engineAssetsFolder,
                                                      `appFramework/${appFramework}/src/${uniteConfiguration.sourceLanguage.toLowerCase()}`);

        logger.info("Generating App Source in", { appSourceFolder: engineVariables.www.srcFolder });

        for (const file of files) {
            const ret = await this.copyFile(logger, fileSystem,
                                            scaffoldFolder,
                                            file,
                                            engineVariables.www.srcFolder,
                                            file,
                                            engineVariables.force,
                                            engineVariables.noCreateSource,
                                            TemplateHelper.createCodeSubstitutions(engineVariables));

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
                                            `${htmlFile}`,
                                            engineVariables.www.srcFolder,
                                            `${htmlFile}`,
                                            engineVariables.force,
                                            engineVariables.noCreateSource);
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
                                            `${cssFile}.${uniteConfiguration.styleExtension}`,
                                            engineVariables.www.srcFolder,
                                            `${cssFile}.${uniteConfiguration.styleExtension}`,
                                            engineVariables.force,
                                            engineVariables.noCreateSource);

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
                                     specs: string[],
                                     isShared: boolean): Promise<number> {
        if (!super.condition(uniteConfiguration.unitTestRunner, "None")) {
            logger.info("Generating unit test scaffold shared", { unitTestSrcFolder: engineVariables.www.unitTestSrcFolder });

            const appFramework = isShared ? "shared" : uniteConfiguration.applicationFramework.toLowerCase();

            const unitTestsScaffold = fileSystem.pathCombine(engineVariables.engineAssetsFolder,
                                                             `appFramework/${appFramework}/test/unit/src/sourceLanguage/${uniteConfiguration.sourceLanguage.toLowerCase()}/` +
                                                                `${uniteConfiguration.unitTestFramework.toLowerCase()}/`);

            const unitTestsRunner = fileSystem.pathCombine(engineVariables.engineAssetsFolder,
                                                           `appFramework/shared/test/unit/unitTestRunner/${uniteConfiguration.unitTestRunner.toLowerCase()}/`);

            for (const spec of specs) {
                const ret = await this.copyFile(logger, fileSystem, unitTestsScaffold,
                                                `${spec}`,
                                                engineVariables.www.unitTestSrcFolder,
                                                `${spec}`,
                                                engineVariables.force,
                                                engineVariables.noCreateSource,
                                                TemplateHelper.createCodeSubstitutions(engineVariables));
                if (ret !== 0) {
                    return ret;
                }
            }

            return this.copyFile(logger, fileSystem, unitTestsRunner,
                                 "unit-bootstrap.js",
                                 engineVariables.www.unitTestFolder,
                                 "unit-bootstrap.js",
                                 engineVariables.force,
                                 engineVariables.noCreateSource);

        } else {
            return 0;
        }
    }

    protected async generateE2eTest(logger: ILogger,
                                    fileSystem: IFileSystem,
                                    uniteConfiguration: UniteConfiguration,
                                    engineVariables: EngineVariables,
                                    specs: string[],
                                    isShared: boolean): Promise<number> {
        if (!super.condition(uniteConfiguration.e2eTestRunner, "None")) {
            logger.info("Generating e2e test scaffold shared", { unitTestSrcFolder: engineVariables.www.e2eTestSrcFolder });

            const appFramework = isShared ? "shared" : uniteConfiguration.applicationFramework.toLowerCase();

            const e2eTestsScaffold = fileSystem.pathCombine(engineVariables.engineAssetsFolder,
                                                            `appFramework/${appFramework}/test/e2e/src/` +
                                                            `${uniteConfiguration.e2eTestRunner.toLowerCase()}/` +
                                                            `${uniteConfiguration.e2eTestFramework.toLowerCase()}/`);

            for (const spec of specs) {
                const ret = await this.copyFile(logger, fileSystem, e2eTestsScaffold,
                                                `${spec}`,
                                                engineVariables.www.e2eTestSrcFolder,
                                                `${spec}`,
                                                engineVariables.force,
                                                engineVariables.noCreateSource);

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
                                             `${style}.${uniteConfiguration.styleExtension}`, engineVariables.www.cssSrcFolder, `${style}.${uniteConfiguration.styleExtension}`,
                                             engineVariables.force,
                                             engineVariables.noCreateSource);

            if (ret !== 0) {
                return ret;
            }
        }

        return 0;
    }

    protected createLoaderReplacement(engineVariables: EngineVariables, extension: string, loader: string, includeRequires: boolean) : void {
        if (includeRequires) {
            engineVariables.buildTranspileInclude.push("const replace = require(\"gulp-replace\");");
        }
        engineVariables.buildTranspilePreBuild.push(`        .pipe(replace(/import(.*?)("|'|\`)(.*?).${extension}\\2/g, "import$1$2${loader}!$3.${extension}$2"))`);
    }

    protected createLoaderTypeMapReplacement(engineVariables: EngineVariables, extension: string, loader: string) : void {
        engineVariables.buildTranspileInclude.push("const replace = require(\"gulp-replace\");");
        engineVariables.buildTranspileInclude.push("const clientPackages = require(\"./util/client-packages\");");

        const typeMapLoader = `\${clientPackages.getTypeMap(uniteConfig, "${loader}", buildConfiguration.minify)}`;
        engineVariables.buildTranspilePreBuild.push(`        .pipe(replace(/import(.*?)("|'|\`)(.*?).${extension}\\2/g, \`import$1$2${typeMapLoader}!$3.${extension}$2\`))`);
    }
}
