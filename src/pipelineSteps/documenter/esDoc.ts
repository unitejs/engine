/**
 * Pipeline step to generate esdoc configuration.
 */
import { ArrayHelper } from "unitejs-framework/dist/helpers/arrayHelper";
import { ObjectHelper } from "unitejs-framework/dist/helpers/objectHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { EsDocConfiguration } from "../../configuration/models/esDoc/esDocConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class EsDoc extends PipelineStepBase {
    private static FILENAME: string = ".esdoc.json";

    private _configuration: EsDocConfiguration;

    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): boolean | undefined {
        return super.condition(uniteConfiguration.documenter, "ESDoc");
    }

    public async initialise(logger: ILogger,
                            fileSystem: IFileSystem,
                            uniteConfiguration: UniteConfiguration,
                            engineVariables: EngineVariables,
                            mainCondition: boolean): Promise<number> {
        if (mainCondition) {
            return super.fileReadJson<EsDocConfiguration>(logger, fileSystem, engineVariables.wwwRootFolder, EsDoc.FILENAME, engineVariables.force, async (obj) => {
                this._configuration = obj;

                this.configDefaults(fileSystem, engineVariables);

                return 0;
            });
        } else {
            return 0;
        }
    }

    public async configure(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        engineVariables.toggleDevDependency(["esdoc", "esdoc-standard-plugin", "esdoc-ecmascript-proposal-plugin"], mainCondition);

        const isTypeScript = super.condition(uniteConfiguration.sourceLanguage, "TypeScript");

        engineVariables.toggleDevDependency(["esdoc-typescript-plugin"], mainCondition && isTypeScript);

        if (this._configuration) {
            ArrayHelper.addRemove(this._configuration.plugins,
                                  {
                                      name: "esdoc-typescript-plugin"
                                  },
                                  mainCondition && isTypeScript,
                                  (obj, item) => item.name === "esdoc-typescript-plugin");
        }

        return 0;
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        let ret = await super.folderCreate(logger, fileSystem, engineVariables.docsRootFolder);

        if (ret === 0) {
            ret = await super.fileToggleJson(logger,
                                             fileSystem,
                                             engineVariables.wwwRootFolder,
                                             EsDoc.FILENAME,
                                             engineVariables.force,
                                             mainCondition,
                                             async () => this._configuration);
        }

        return ret;
    }

    private configDefaults(fileSystem: IFileSystem, engineVariables: EngineVariables): void {
        const defaultConfiguration = new EsDocConfiguration();

        defaultConfiguration.source = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, engineVariables.www.src));
        defaultConfiguration.destination = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, engineVariables.docsRootFolder))
                    .replace(/^\.\//, "");

        defaultConfiguration.plugins = [
            {
                name: "esdoc-standard-plugin"
            },
            {
                name: "esdoc-ecmascript-proposal-plugin",
                option: {
                    all: true
                }
            }
        ];

        this._configuration = ObjectHelper.merge(defaultConfiguration, this._configuration);

        engineVariables.setConfiguration("EsDoc", this._configuration);
    }
}
