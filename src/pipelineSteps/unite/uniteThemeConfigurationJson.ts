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
        }
        defaultConfiguration.metaAuthor = "";
        defaultConfiguration.customHeaders = [];
        defaultConfiguration.themeHeaders = [];
        defaultConfiguration.backgroundColor = "#339933";
        defaultConfiguration.themeColor = "#339933";

        this._configuration = ObjectHelper.merge(defaultConfiguration, this._configuration);

        engineVariables.setConfiguration("UniteTheme", this._configuration);
    }
}
