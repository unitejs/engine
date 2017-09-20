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
    private static FILENAME: string = ".babelrc";

    private _configuration: BabelConfiguration;

    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables) : boolean | undefined {
        return super.condition(uniteConfiguration.sourceLanguage, "JavaScript");
    }

    public async initialise(logger: ILogger,
                            fileSystem: IFileSystem,
                            uniteConfiguration: UniteConfiguration,
                            engineVariables: EngineVariables): Promise<number> {
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
    }

    public async install(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["babel-core", "babel-preset-env"], super.condition(uniteConfiguration.sourceLanguage, "JavaScript"));

        return 0;
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        return super.fileWriteJson(logger,
                                   fileSystem,
                                   engineVariables.wwwRootFolder,
                                   JavaScript.FILENAME,
                                   engineVariables.force,
                                   async() => this._configuration);

    }

    public async uninstall(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        ArrayHelper.addRemove(uniteConfiguration.sourceExtensions, "js", false);
        engineVariables.toggleDevDependency(["babel-core", "babel-preset-env"], false);

        return await super.deleteFileJson(logger, fileSystem, engineVariables.wwwRootFolder, JavaScript.FILENAME, engineVariables.force);
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
