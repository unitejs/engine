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
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class WebdriverIo extends PipelineStepBase {
    private static FILENAME: string = "wdio.conf.js";

    private _configuration: WebdriverIoConfiguration;
    private _plugins: string[];

    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables) : boolean | undefined {
        return super.condition(uniteConfiguration.e2eTestRunner, "WebdriverIO");
    }

    public async initialise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        this.configDefaults(fileSystem, engineVariables);

        return 0;
    }

    public async install(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["webdriverio",
                                            "wdio-spec-reporter",
                                            "wdio-allure-reporter",
                                            "browser-sync",
                                            "selenium-standalone",
                                            "allure-commandline"],
                                            true);

        engineVariables.toggleDevDependency(["@types/webdriverio"],
                                            super.condition(uniteConfiguration.sourceLanguage, "TypeScript"));

        engineVariables.toggleDevDependency(["eslint-plugin-webdriverio"], super.condition(uniteConfiguration.linter, "ESLint"));

        const esLintConfiguration = engineVariables.getConfiguration<EsLintConfiguration>("ESLint");
        if (esLintConfiguration) {
            ArrayHelper.addRemove(esLintConfiguration.plugins, "webdriverio", true);
            ObjectHelper.addRemove(esLintConfiguration.env, "webdriverio/wdio", true, true);
        }

        return 0;
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        return super.fileWriteLines(logger,
                                    fileSystem,
                                    engineVariables.wwwRootFolder,
                                    WebdriverIo.FILENAME,
                                    engineVariables.force,
                                    async () => this.finaliseConfig(fileSystem, uniteConfiguration, engineVariables));
    }

    public async uninstall(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["webdriverio",
                                            "wdio-spec-reporter",
                                            "wdio-allure-reporter",
                                            "browser-sync",
                                            "selenium-standalone",
                                            "allure-commandline"],
                                            false);

        engineVariables.toggleDevDependency(["@types/webdriverio"], false);

        engineVariables.toggleDevDependency(["eslint-plugin-webdriverio"], false);

        const esLintConfiguration = engineVariables.getConfiguration<EsLintConfiguration>("ESLint");
        if (esLintConfiguration) {
            ArrayHelper.addRemove(esLintConfiguration.plugins, "webdriverio", false);
            ObjectHelper.addRemove(esLintConfiguration.env, "webdriverio/wdio", true, false);
        }

        return await super.deleteFileLines(logger, fileSystem, engineVariables.wwwRootFolder, WebdriverIo.FILENAME, engineVariables.force);
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
