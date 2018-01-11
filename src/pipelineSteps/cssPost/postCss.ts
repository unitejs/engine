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
    private static readonly FILENAME: string = ".postcssrc.json";

    private _configuration: PostCssConfiguration;

    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): boolean | undefined {
        return super.condition(uniteConfiguration.cssPost, "PostCss");
    }

    public async initialise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        if (mainCondition) {
            return super.fileReadJson<PostCssConfiguration>(logger,
                                                            fileSystem,
                                                            engineVariables.wwwRootFolder,
                                                            PostCss.FILENAME,
                                                            engineVariables.force,
                                                            async (obj) => {
                    this._configuration = obj;
                    this.configDefaults(engineVariables);

                    return 0;
                });
        } else {
            return 0;
        }
    }

    public async configure(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        engineVariables.toggleDevDependency(["postcss", "postcss-import", "autoprefixer", "cssnano"], mainCondition);
        return 0;
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        return super.fileToggleJson(logger,
                                    fileSystem,
                                    engineVariables.wwwRootFolder,
                                    PostCss.FILENAME,
                                    engineVariables.force,
                                    mainCondition,
                                    async () => this._configuration);
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
