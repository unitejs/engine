/**
 * Pipeline step to generate handle postCss styling.
 */
import { ObjectHelper } from "unitejs-framework/dist/helpers/objectHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { PostCssConfiguration } from "../../configuration/models/postcss/postCssConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class PostCss extends PipelineStepBase {
    private static FILENAME: string = ".postcssrc.json";

    private _configuration: PostCssConfiguration;

    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables) : boolean | undefined {
        return super.condition(uniteConfiguration.cssPost, "PostCss");
    }

    public async initialise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        logger.info(`Initialising ${PostCss.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });

        if (!engineVariables.force) {
            try {
                const exists = await fileSystem.fileExists(engineVariables.wwwRootFolder, PostCss.FILENAME);
                if (exists) {
                    this._configuration = await fileSystem.fileReadJson<PostCssConfiguration>(engineVariables.wwwRootFolder, PostCss.FILENAME);
                }
            } catch (err) {
                logger.error(`Reading existing ${PostCss.FILENAME} failed`, err);
                return 1;
            }
        }

        this.configDefaults(engineVariables);

        return 0;
    }

    public async install(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["postcss", "postcss-import", "autoprefixer", "cssnano"], true);
        return 0;
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            logger.info(`Generating ${PostCss.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });

            await fileSystem.fileWriteJson(engineVariables.wwwRootFolder, ".postcssrc.json", this._configuration);
            return 0;
        } catch (err) {
            logger.error(`Generating ${PostCss.FILENAME} failed`, err, { wwwFolder: engineVariables.wwwRootFolder });
            return 1;
        }
    }

    public async uninstall(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["postcss", "postcss-import", "autoprefixer", "cssnano"], false);

        return await super.deleteFile(logger, fileSystem, engineVariables.wwwRootFolder, PostCss.FILENAME, engineVariables.force);
    }

    private configDefaults(engineVariables: EngineVariables): void {
        const defaultConfiguration = new PostCssConfiguration();

        defaultConfiguration.plugins = {};
        defaultConfiguration.plugins["postcss-import"] = {};
        defaultConfiguration.plugins.autoprefixer = {};

        this._configuration = ObjectHelper.merge(defaultConfiguration, this._configuration);

        engineVariables.setConfiguration("PostCss", this._configuration);
    }
}
