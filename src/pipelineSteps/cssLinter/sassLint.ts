/**
 * Pipeline step to generate sass lint configuration.
 */
import { ObjectHelper } from "unitejs-framework/dist/helpers/objectHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { SassLintConfiguration } from "../../configuration/models/sassLint/sassLintConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class SassLint extends PipelineStepBase {
    private static readonly FILENAME: string = ".sasslintrc";

    private _configuration: SassLintConfiguration;

    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): boolean | undefined {
        return super.condition(uniteConfiguration.cssLinter, "SassLint");
    }

    public async initialise(logger: ILogger,
                            fileSystem: IFileSystem,
                            uniteConfiguration: UniteConfiguration,
                            engineVariables: EngineVariables,
                            mainCondition: boolean): Promise<number> {
        if (mainCondition) {
            if (!super.condition(uniteConfiguration.cssPre, "Sass")) {
                logger.error("You can only use SassLint when the css preprocessor is Sass");
                return 1;
            }
            return super.fileReadJson<SassLintConfiguration>(logger, fileSystem, engineVariables.wwwRootFolder, SassLint.FILENAME, engineVariables.force, async (obj) => {
                this._configuration = obj;

                this.configDefaults(engineVariables);

                return 0;
            });
        } else {
            return 0;
        }
    }

    public async configure(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        engineVariables.toggleDevDependency(["sass-lint"], mainCondition);

        return 0;
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        return super.fileToggleJson(logger,
                                    fileSystem,
                                    engineVariables.wwwRootFolder,
                                    SassLint.FILENAME,
                                    engineVariables.force,
                                    mainCondition,
                                    async () => this._configuration);

    }

    private configDefaults(engineVariables: EngineVariables): void {
        const defaultConfiguration = new SassLintConfiguration();

        defaultConfiguration.options = {};
        defaultConfiguration.options["merge-default-rules"] = true;
        defaultConfiguration.rules = {};

        this._configuration = ObjectHelper.merge(defaultConfiguration, this._configuration);

        engineVariables.setConfiguration("SassLint", this._configuration);
    }
}
