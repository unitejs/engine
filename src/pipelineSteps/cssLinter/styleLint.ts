/**
 * Pipeline step to generate style lint configuration.
 */
import { ObjectHelper } from "unitejs-framework/dist/helpers/objectHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { StyleLintConfiguration } from "../../configuration/models/styleLint/styleLintConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class StyleLint extends PipelineStepBase {
    private static FILENAME: string = ".stylelintrc";

    private _configuration: StyleLintConfiguration;

    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): boolean | undefined {
        return super.condition(uniteConfiguration.cssLinter, "StyleLint");
    }

    public async initialise(logger: ILogger,
                            fileSystem: IFileSystem,
                            uniteConfiguration: UniteConfiguration,
                            engineVariables: EngineVariables,
                            mainCondition: boolean): Promise<number> {
        if (mainCondition) {
            if (super.condition(uniteConfiguration.cssPre, "Stylus")) {
                logger.error("You can not use StyleLint when the css preprocessor is Stylus");
                return 1;
            }
            return super.fileReadJson<StyleLintConfiguration>(logger, fileSystem, engineVariables.wwwRootFolder, StyleLint.FILENAME, engineVariables.force, async (obj) => {
                this._configuration = obj;

                this.configDefaults(engineVariables);

                return 0;
            });
        } else {
            return 0;
        }
    }

    public async configure(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        engineVariables.toggleDevDependency(["stylelint"], mainCondition);

        const isSass = super.condition(uniteConfiguration.cssPre, "Sass");
        engineVariables.toggleDevDependency(["stylelint-config-standard"], mainCondition && !isSass);
        engineVariables.toggleDevDependency(["stylelint-scss", "stylelint-config-recommended-scss"], mainCondition && isSass);

        if (this._configuration) {
            this._configuration.extends = isSass ? "stylelint-config-recommended-scss" : "stylelint-config-recommended";
        }

        return 0;
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        return super.fileToggleJson(logger,
                                    fileSystem,
                                    engineVariables.wwwRootFolder,
                                    StyleLint.FILENAME,
                                    engineVariables.force,
                                    mainCondition,
                                    async () => this._configuration);

    }

    private configDefaults(engineVariables: EngineVariables): void {
        const defaultConfiguration = new StyleLintConfiguration();

        defaultConfiguration.rules = {};

        this._configuration = ObjectHelper.merge(defaultConfiguration, this._configuration);

        engineVariables.setConfiguration("StyleLint", this._configuration);
    }
}
