/**
 * Pipeline step to generate handle postCss styling.
 */
import { PostCssConfiguration } from "../../configuration/models/postcss/postCssConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";
import { IDisplay } from "../../interfaces/IDisplay";
import { IFileSystem } from "../../interfaces/IFileSystem";
import { ILogger } from "../../interfaces/ILogger";

export class PostCss extends EnginePipelineStepBase {
    private static FILENAME: string = ".postcssrc.json";

    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDependencies(["postcss", "postcss-import", "autoprefixer", "cssnano"], uniteConfiguration.cssPost === "PostCss", true);

        if (uniteConfiguration.cssPost === "PostCss") {
            try {
                super.log(logger, display, `Generating ${PostCss.FILENAME}`, { rootFolder: engineVariables.rootFolder });

                let existing;

                try {
                    const exists = await fileSystem.fileExists(engineVariables.rootFolder, PostCss.FILENAME);

                    if (exists) {
                        existing = await fileSystem.fileReadJson<PostCssConfiguration>(engineVariables.rootFolder, PostCss.FILENAME);

                    }
                } catch (err) {
                    super.error(logger, display, `Loading existing ${PostCss.FILENAME} failed`, err, { rootFolder: engineVariables.rootFolder });
                    return 1;
                }

                const config = this.generateConfig(existing);

                await fileSystem.fileWriteJson(engineVariables.rootFolder, ".postcssrc.json", config);
                return 0;
            } catch (err) {
                super.error(logger, display, `Generating ${PostCss.FILENAME} failed`, err, { rootFolder: engineVariables.rootFolder });
                return 1;
            }
        } else {
            return await super.deleteFile(logger, display, fileSystem, engineVariables.rootFolder, PostCss.FILENAME);
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