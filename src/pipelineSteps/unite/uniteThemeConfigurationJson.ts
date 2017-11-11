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
    private static FILENAME: string = "unite-theme.json";

    private _configuration: UniteThemeConfiguration;

    public async initialise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        return super.fileReadJson<UniteThemeConfiguration>(logger,
                                                           fileSystem,
                                                           fileSystem.pathCombine(engineVariables.www.assetsSrcFolder, "theme/"),
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

        return 0;
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        return super.fileToggleJson(logger,
                                    fileSystem,
                                    fileSystem.pathCombine(engineVariables.www.assetsSrcFolder, "theme/"),
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
        defaultConfiguration.appLoaderStyle = [
            "<style>",
            "#app-loader",
            "{",
            "width:200px;",
            "height:200px;",
            "position:absolute;",
            "top:0;",
            "bottom:0;",
            "left:0;",
            "right:0;",
            "margin:auto;",
            "}",
            "</style>"
        ];
        defaultConfiguration.appLoader = [
            `<svg width="200px" height="200px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">`,
            `<circle cx="50" cy="50" fill="none" stroke="{THEME_COLOR}" stroke-width="2" r="35" stroke-dasharray="164.93361431346415 56.97787143782138" transform="rotate(330 50 50)">`,
            `<animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite">`,
            `</animateTransform>`,
            `</circle>`,
            `</svg>`
        ];

        this._configuration = ObjectHelper.merge(defaultConfiguration, this._configuration);

        engineVariables.setConfiguration("UniteTheme", this._configuration);
    }
}
