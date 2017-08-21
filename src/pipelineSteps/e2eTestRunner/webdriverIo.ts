/**
 * Pipeline step to generate WebdriverIO configuration.
 */
import { ArrayHelper } from "unitejs-framework/dist/helpers/arrayHelper";
import { JsonHelper } from "unitejs-framework/dist/helpers/jsonHelper";
import { ObjectHelper } from "unitejs-framework/dist/helpers/objectHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { EsLintConfiguration } from "../../configuration/models/eslint/esLintConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { WebdriverIoConfiguration } from "../../configuration/models/webdriverIo/webdriverIoConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class WebdriverIo extends EnginePipelineStepBase {
    private static FILENAME: string = "wdio.conf.js";

    private _configuration: WebdriverIoConfiguration;
    private _plugins: string[];

    public async initialise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        if (uniteConfiguration.e2eTestRunner === "WebdriverIO") {
            this.configDefaults(fileSystem, engineVariables);
        }

        return 0;
    }

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["webdriverio",
                                            "wdio-spec-reporter",
                                            "wdio-allure-reporter",
                                            "browser-sync",
                                            "selenium-standalone",
                                            "allure-commandline"],
                                            uniteConfiguration.e2eTestRunner === "WebdriverIO");

        engineVariables.toggleDevDependency(["@types/webdriverio"], uniteConfiguration.e2eTestRunner === "WebdriverIO" && uniteConfiguration.sourceLanguage === "TypeScript");

        engineVariables.toggleDevDependency(["eslint-plugin-webdriverio"], uniteConfiguration.e2eTestRunner === "WebdriverIO" && uniteConfiguration.linter === "ESLint");

        const esLintConfiguration = engineVariables.getConfiguration<EsLintConfiguration>("ESLint");
        if (esLintConfiguration) {
            ArrayHelper.addRemove(esLintConfiguration.plugins, "webdriverio", uniteConfiguration.e2eTestRunner === "WebdriverIO");
            ObjectHelper.addRemove(esLintConfiguration.env, "webdriverio/wdio", true, uniteConfiguration.e2eTestRunner === "WebdriverIO");
        }

        if (uniteConfiguration.e2eTestRunner === "WebdriverIO") {
            try {
                const hasGeneratedMarker = await super.fileHasGeneratedMarker(fileSystem, engineVariables.wwwRootFolder, WebdriverIo.FILENAME);

                if (hasGeneratedMarker === "FileNotExist" || hasGeneratedMarker === "HasMarker") {
                    logger.info(`Generating ${WebdriverIo.FILENAME}`);

                    const lines: string[] = this.finaliseConfig(fileSystem, uniteConfiguration, engineVariables);
                    await fileSystem.fileWriteLines(engineVariables.wwwRootFolder, WebdriverIo.FILENAME, lines);
                } else {
                    logger.info(`Skipping ${WebdriverIo.FILENAME} as it has no generated marker`);
                }

                return 0;
            } catch (err) {
                logger.error(`Generating ${WebdriverIo.FILENAME} failed`, err);
                return 1;
            }
        } else {
            return await super.deleteFile(logger, fileSystem, engineVariables.wwwRootFolder, WebdriverIo.FILENAME);
        }
    }

    private configDefaults(fileSystem: IFileSystem, engineVariables: EngineVariables): void {
        const defaultConfiguration = new WebdriverIoConfiguration();

        const reportsFolder = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, engineVariables.www.reportsFolder));

        defaultConfiguration.baseUrl = "http://localhost:9000";
        defaultConfiguration.specs = [
            fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.e2eTestDistFolder, "**/*.spec.js")))
        ];
        defaultConfiguration.capabilities = [
            {
                browserName: "chrome"
            }
        ];
        defaultConfiguration.sync = false;

        defaultConfiguration.reporters = ["spec", "allure"];
        defaultConfiguration.reporterOptions = {
            allure: {
                outputDir: `${reportsFolder}/e2etemp/`
            }
        };

        this._configuration = ObjectHelper.merge(defaultConfiguration, this._configuration);
        this._plugins = [];

        engineVariables.setConfiguration("WebdriverIO", this._configuration);
        engineVariables.setConfiguration("WebdriverIO.Plugins", this._plugins);
    }

    private finaliseConfig(fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): string[] {
        const lines: string[] = [];
        lines.push(`exports.config = ${JsonHelper.codify(this._configuration)}`);
        lines.push("exports.config.before = () => {");
        this._plugins.forEach(plugin => {
            const pluginPath = fileSystem.pathToWeb(fileSystem.pathFileRelative
                (engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.packageFolder, `${plugin}/index.js`)));

            lines.push(`    require('${pluginPath}')();`);
        });
        lines.push("};");
        lines.push(super.wrapGeneratedMarker("/* ", " */"));
        return lines;
    }
}
