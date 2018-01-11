/**
 * Pipeline step to generate unite-theme.json.
 */
import { ObjectHelper } from "unitejs-framework/dist/helpers/objectHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { UniteThemeConfiguration } from "../../configuration/models/uniteTheme/uniteThemeConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { EngineVariablesMeta } from "../../engine/engineVariablesMeta";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class UniteThemeConfigurationJson extends PipelineStepBase {
    private static readonly FILENAME: string = "unite-theme.json";

    private _configuration: UniteThemeConfiguration;

    public async initialise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        return super.fileReadJson<UniteThemeConfiguration>(logger,
                                                           fileSystem,
                                                           fileSystem.pathCombine(engineVariables.www.assetsSrc, "theme/"),
                                                           UniteThemeConfigurationJson.FILENAME,
                                                           engineVariables.force,
                                                           async (obj) => {
            this._configuration = obj;

            this.configDefaults(uniteConfiguration, engineVariables);

            return 0;
        });
    }

    public async configure(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        const meta: EngineVariablesMeta = engineVariables.meta || new EngineVariablesMeta();

        this._configuration.title = meta.title || this._configuration.title || uniteConfiguration.packageName || "";
        this._configuration.shortName = meta.shortName || this._configuration.shortName || this._configuration.title;
        this._configuration.metaDescription = meta.description || this._configuration.metaDescription || this._configuration.title;
        this._configuration.metaKeywords = meta.keywords || this._configuration.metaKeywords || this._configuration.title.split(" ");
        this._configuration.metaAuthor = meta.author || this._configuration.metaAuthor;
        this._configuration.metaAuthorEmail = meta.authorEmail || this._configuration.metaAuthorEmail;
        this._configuration.metaAuthorWebSite = meta.authorWebSite || this._configuration.metaAuthorWebSite;
        this._configuration.namespace = meta.namespace || this._configuration.namespace;
        this._configuration.organization = meta.organization || this._configuration.organization;
        this._configuration.copyright = meta.copyright || this._configuration.copyright;
        this._configuration.webSite = meta.webSite || this._configuration.webSite;

        meta.title = this._configuration.title;
        meta.shortName = this._configuration.shortName;
        meta.description = this._configuration.metaDescription;
        meta.keywords =  this._configuration.metaKeywords;
        meta.author = this._configuration.metaAuthor;
        meta.authorEmail = this._configuration.metaAuthorEmail;
        meta.authorWebSite = this._configuration.metaAuthorWebSite;
        meta.namespace = this._configuration.namespace;
        meta.organization = this._configuration.organization;
        meta.copyright = this._configuration.copyright;
        meta.webSite = this._configuration.webSite;

        engineVariables.meta = meta;

        return 0;
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        return super.fileToggleJson(logger,
                                    fileSystem,
                                    fileSystem.pathCombine(engineVariables.www.assetsSrc, "theme/"),
                                    UniteThemeConfigurationJson.FILENAME,
                                    engineVariables.force,
                                    mainCondition,
                                    async() => this._configuration);
    }

    private configDefaults(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): void {
        const defaultConfiguration = new UniteThemeConfiguration();

        defaultConfiguration.themeHeaders = [];
        defaultConfiguration.customHeaders = [];
        defaultConfiguration.backgroundColor = "#339933";
        defaultConfiguration.themeColor = "#339933";

        this._configuration = ObjectHelper.merge(defaultConfiguration, this._configuration);

        engineVariables.setConfiguration("UniteTheme", this._configuration);
    }
}
