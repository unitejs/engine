/**
 * Pipeline step to generate tslint configuration.
 */
import { ObjectHelper } from "unitejs-framework/dist/helpers/objectHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { TsLintConfiguration } from "../../configuration/models/tslint/tsLintConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class TsLint extends PipelineStepBase {
    private static readonly FILENAME: string = "tslint.json";

    private _configuration: TsLintConfiguration;

    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): boolean | undefined {
        return super.condition(uniteConfiguration.linter, "TSLint");
    }

    public async initialise(logger: ILogger,
                            fileSystem: IFileSystem,
                            uniteConfiguration: UniteConfiguration,
                            engineVariables: EngineVariables,
                            mainCondition: boolean): Promise<number> {
        if (mainCondition) {
            if (!super.condition(uniteConfiguration.sourceLanguage, "TypeScript")) {
                logger.error("You can only use TSLint when the source language is TypeScript");
                return 1;
            }
            return super.fileReadJson<TsLintConfiguration>(logger, fileSystem, engineVariables.wwwRootFolder, TsLint.FILENAME, engineVariables.force, async (obj) => {
                this._configuration = obj;

                this.configDefaults(engineVariables);

                return 0;
            });
        } else {
            return 0;
        }
    }

    public async configure(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        engineVariables.toggleDevDependency(["tslint"], mainCondition);

        return 0;
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        return super.fileToggleJson(logger,
                                    fileSystem,
                                    engineVariables.wwwRootFolder,
                                    TsLint.FILENAME,
                                    engineVariables.force,
                                    mainCondition,
                                    async () => this._configuration);

    }

    private configDefaults(engineVariables: EngineVariables): void {
        const defaultConfiguration = new TsLintConfiguration();

        defaultConfiguration.extends = "tslint:recommended";
        defaultConfiguration.rulesDirectory = [];
        defaultConfiguration.rules = {};

        defaultConfiguration.rules["object-literal-sort-keys"] = false;
        defaultConfiguration.rules["trailing-comma"] = [
            true,
            {
                multiline: {
                    objects: "never"
                }
            }
        ];
        defaultConfiguration.rules["no-reference"] = false;
        defaultConfiguration.rules["array-type"] = false;

        this._configuration = ObjectHelper.merge(defaultConfiguration, this._configuration);

        engineVariables.setConfiguration("TSLint", this._configuration);
    }
}
