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
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        if (uniteConfiguration.cssPost === "PostCss") {
            try {
                super.log(logger, display, "Generating .postcssrc.json", { rootFolder: engineVariables.rootFolder });

                engineVariables.requiredDevDependencies.push("gulp-postcss");
                engineVariables.requiredDevDependencies.push("postcss-import");
                engineVariables.requiredDevDependencies.push("autoprefixer");

                let existing;

                try {
                    const exists = await fileSystem.fileExists(engineVariables.rootFolder, ".postcssrc.json");

                    if (exists) {
                        existing = await fileSystem.fileReadJson<PostCssConfiguration>(engineVariables.rootFolder, ".postcssrc.json");

                    }
                } catch (err) {
                    super.error(logger, display, "Loading existing .postcssrc.json failed", err, { rootFolder: engineVariables.rootFolder });
                    return 1;
                }

                const config = this.generateConfig(existing);

                await fileSystem.fileWriteJson(engineVariables.rootFolder, ".postcssrc.json", config);
                return 0;
            } catch (err) {
                super.error(logger, display, "Generating .postcssrc.json failed", err, { rootFolder: engineVariables.rootFolder });
                return 1;
            }
        } else {
            try {
                const exists = await fileSystem.fileExists(engineVariables.rootFolder, ".postcssrc.json");
                if (exists) {
                    await fileSystem.fileDelete(engineVariables.rootFolder, ".postcssrc.json");
                }
            } catch (err) {
                super.error(logger, display, "Deleting .postcssrc.json failed", err);
                return 1;
            }
        }

        return 0;
    }

    private generateConfig(existing: PostCssConfiguration | undefined): PostCssConfiguration {
        const config = existing || new PostCssConfiguration();
        config.plugins = config.plugins || {};

        config.plugins["postcss-import"] = {};
        config.plugins.autoprefixer = {};

        return config;
    }
}