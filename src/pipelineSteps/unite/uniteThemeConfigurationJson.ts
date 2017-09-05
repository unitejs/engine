/**
 * Pipeline step to generate unite-theme.json.
 */
import { ObjectHelper } from "unitejs-framework/dist/helpers/objectHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { UniteThemeConfiguration } from "../../configuration/models/uniteTheme/uniteThemeConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineKey } from "../../engine/pipelineKey";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class UniteThemeConfigurationJson extends PipelineStepBase {
    private static FILENAME: string = "unite-theme.json";

    private _configuration: UniteThemeConfiguration;

    public influences(): PipelineKey[] {
        return [];
    }

    public async initialise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        logger.info("Initialising Unite Theme Config");

        const sourceThemeFolder = fileSystem.pathCombine(engineVariables.www.assetsSrcFolder, "theme/");

        if (!engineVariables.force) {
            try {
                const exists = await fileSystem.fileExists(sourceThemeFolder, UniteThemeConfigurationJson.FILENAME);
                if (exists) {
                    this._configuration = await fileSystem.fileReadJson<UniteThemeConfiguration>(sourceThemeFolder, UniteThemeConfigurationJson.FILENAME);
                }
            } catch (err) {
                logger.error(`Reading existing ${UniteThemeConfigurationJson.FILENAME} failed`, err);
                return 1;
            }
        }

        this.configDefaults(uniteConfiguration, engineVariables);

        return 0;
    }

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            logger.info(`Generating ${UniteThemeConfigurationJson.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder});

            const sourceThemeFolder = fileSystem.pathCombine(engineVariables.www.assetsSrcFolder, "theme/");

            await fileSystem.fileWriteJson(sourceThemeFolder, UniteThemeConfigurationJson.FILENAME, this._configuration);

            return 0;
        } catch (err) {
            logger.error(`Generating ${UniteThemeConfigurationJson.FILENAME} failed`, err);
            return 1;
        }
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
