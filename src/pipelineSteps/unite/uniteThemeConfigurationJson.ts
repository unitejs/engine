/**
 * Pipeline step to generate unite-theme.json.
 */
import { ObjectHelper } from "unitejs-framework/dist/helpers/objectHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { UniteThemeConfiguration } from "../../configuration/models/uniteTheme/uniteThemeConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
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

        if (uniteConfiguration.title) {
            defaultConfiguration.metaDescription = uniteConfiguration.title;
            defaultConfiguration.metaKeywords = uniteConfiguration.title.split(" ");
            defaultConfiguration.shortName = uniteConfiguration.title;
        }
        defaultConfiguration.metaAuthor = "";
        defaultConfiguration.customHeaders = [];
        defaultConfiguration.themeHeaders = [];
        defaultConfiguration.backgroundColor = "#339933";
        defaultConfiguration.themeColor = "#339933";
        defaultConfiguration.appLoaderStyle = "<style>#app-loader{width:200px;height:200px;position:absolute;top:0;bottom:0;left:0;right:0;margin:auto;}</style>";
        defaultConfiguration.appLoader = `<svg width="200px" height="200px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
            <circle cx="50" cy="50" fill="none" stroke="{THEME_COLOR}" stroke-width="2" r="35"
                stroke-dasharray="164.93361431346415 56.97787143782138" transform="rotate(330 50 50)">
                <animateTransform attributeName="transform" type="rotate" calcMode="linear"
                    values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite">
            </animateTransform></circle></svg>`;

        this._configuration = ObjectHelper.merge(defaultConfiguration, this._configuration);

        engineVariables.setConfiguration("UniteTheme", this._configuration);
    }
}
