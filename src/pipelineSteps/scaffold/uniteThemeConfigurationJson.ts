/**
 * Pipeline step to generate unite-theme.json.
 */
import { IDisplay } from "unitejs-framework/dist/interfaces/IDisplay";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { UniteThemeConfiguration } from "../../configuration/models/uniteTheme/uniteThemeConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class UniteThemeConfigurationJson extends EnginePipelineStepBase {
    private static FILENAME: string = "unite-theme.json";

    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            super.log(logger, display, `Generating ${UniteThemeConfigurationJson.FILENAME}`);

            const sourceThemeFolder = fileSystem.pathCombine(engineVariables.assetsSourceFolder, "theme/");

            let existing;
            try {
                const exists = await fileSystem.fileExists(sourceThemeFolder, UniteThemeConfigurationJson.FILENAME);
                if (exists) {
                    existing = await fileSystem.fileReadJson<UniteThemeConfiguration>(sourceThemeFolder, UniteThemeConfigurationJson.FILENAME);
                }
            } catch (err) {
                super.error(logger, display, `Reading existing ${UniteThemeConfigurationJson.FILENAME} failed`, err);
                return 1;
            }

            const config = this.generateConfig(fileSystem, uniteConfiguration, engineVariables, existing);
            await fileSystem.fileWriteJson(sourceThemeFolder, UniteThemeConfigurationJson.FILENAME, config);

            return 0;
        } catch (err) {
            super.error(logger, display, `Generating ${UniteThemeConfigurationJson.FILENAME} failed`, err);
            return 1;
        }
    }

    private generateConfig(fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, existing: UniteThemeConfiguration | undefined): UniteThemeConfiguration {
        const config = new UniteThemeConfiguration();

        config.metaDescription = uniteConfiguration.title;
        config.metaKeywords = uniteConfiguration.title.split(" ");
        config.metaAuthor = "";
        config.customHeaders = [];
        config.themeHeaders = [];
        config.backgroundColor = "#339933";
        config.themeColor = "#339933";

        if (existing) {
            Object.assign(config, existing);
        }

        return config;
    }
}
