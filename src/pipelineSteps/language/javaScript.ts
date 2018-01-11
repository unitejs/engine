/**
 * Pipeline step to generate babel configuration.
 */
import { ArrayHelper } from "unitejs-framework/dist/helpers/arrayHelper";
import { ObjectHelper } from "unitejs-framework/dist/helpers/objectHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { BabelConfiguration } from "../../configuration/models/babel/babelConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class JavaScript extends PipelineStepBase {
    private static readonly FILENAME: string = ".babelrc";

    private _configuration: BabelConfiguration;

    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): boolean | undefined {
        return super.condition(uniteConfiguration.sourceLanguage, "JavaScript");
    }

    public async initialise(logger: ILogger,
                            fileSystem: IFileSystem,
                            uniteConfiguration: UniteConfiguration,
                            engineVariables: EngineVariables,
                            mainCondition: boolean): Promise<number> {
        if (mainCondition) {
            return super.fileReadJson<BabelConfiguration>(logger,
                                                          fileSystem,
                                                          engineVariables.wwwRootFolder,
                                                          JavaScript.FILENAME,
                                                          engineVariables.force,
                                                          async (obj) => {
                    this._configuration = obj;

                    ArrayHelper.addRemove(uniteConfiguration.sourceExtensions, "js", true);
                    this.configDefaults(engineVariables);

                    return 0;
                });
        } else {
            return 0;
        }
    }

    public async configure(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        // Removing and old dependency always false
        engineVariables.toggleDevDependency(["babel-preset-es2015"], false);
        // We always include babel as we might need to transpile client packages
        engineVariables.toggleDevDependency(["babel-core", "babel-preset-env"], true);

        return 0;
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        return super.fileToggleJson(logger,
                                    fileSystem,
                                    engineVariables.wwwRootFolder,
                                    JavaScript.FILENAME,
                                    engineVariables.force,
                                    mainCondition,
                                    async () => this._configuration);

    }

    private configDefaults(engineVariables: EngineVariables): void {
        const defaultConfiguration = new BabelConfiguration();

        defaultConfiguration.presets = [];
        defaultConfiguration.plugins = [];
        defaultConfiguration.env = {};

        this._configuration = ObjectHelper.merge(defaultConfiguration, this._configuration);

        engineVariables.setConfiguration("Babel", this._configuration);
    }
}
