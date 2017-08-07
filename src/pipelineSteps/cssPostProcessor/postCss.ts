/**
 * Pipeline step to generate handle postCss styling.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { PostCssConfiguration } from "../../configuration/models/postcss/postCssConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class PostCss extends EnginePipelineStepBase {
    private static FILENAME: string = ".postcssrc.json";

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["postcss", "postcss-import", "autoprefixer", "cssnano"], uniteConfiguration.cssPost === "PostCss");

        if (uniteConfiguration.cssPost === "PostCss") {
            try {
                logger.info(`Generating ${PostCss.FILENAME}`, { wwwFolder: engineVariables.wwwFolder });

                let existing;

                try {
                    const exists = await fileSystem.fileExists(engineVariables.wwwFolder, PostCss.FILENAME);

                    if (exists) {
                        existing = await fileSystem.fileReadJson<PostCssConfiguration>(engineVariables.wwwFolder, PostCss.FILENAME);

                    }
                } catch (err) {
                    logger.error(`Loading existing ${PostCss.FILENAME} failed`, err, { wwwFolder: engineVariables.wwwFolder });
                    return 1;
                }

                const config = this.generateConfig(existing);

                await fileSystem.fileWriteJson(engineVariables.wwwFolder, ".postcssrc.json", config);
                return 0;
            } catch (err) {
                logger.error(`Generating ${PostCss.FILENAME} failed`, err, { wwwFolder: engineVariables.wwwFolder });
                return 1;
            }
        } else {
            return await super.deleteFile(logger, fileSystem, engineVariables.wwwFolder, PostCss.FILENAME);
        }
    }

    private generateConfig(existing: PostCssConfiguration | undefined): PostCssConfiguration {
        const config = existing || new PostCssConfiguration();
        config.plugins = config.plugins || {};

        config.plugins["postcss-import"] = {};
        config.plugins.autoprefixer = {};

        return config;
    }
}
