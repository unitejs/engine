/**
 * Pipeline step to generate package.json.
 */
import { ObjectHelper } from "unitejs-framework/dist/helpers/objectHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { PackageConfiguration } from "../../configuration/models/packages/packageConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class PackageJson extends PipelineStepBase {
    private static FILENAME: string = "package.json";

    private _configuration: PackageConfiguration;

    public async initialise(logger: ILogger,
                            fileSystem: IFileSystem,
                            uniteConfiguration: UniteConfiguration,
                            engineVariables: EngineVariables,
                            mainCondition: boolean): Promise<number> {
        return super.fileReadJson<PackageConfiguration>(logger,
                                                        fileSystem,
                                                        engineVariables.wwwRootFolder,
                                                        PackageJson.FILENAME,
                                                        engineVariables.force,
                                                        async (obj) => {
                this._configuration = obj;
                this.configDefaults(uniteConfiguration, engineVariables);

                return 0;
            });
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        return super.fileToggleJson(logger,
                                    fileSystem,
                                    engineVariables.wwwRootFolder,
                                    PackageJson.FILENAME,
                                    engineVariables.force,
                                    mainCondition,
                                    async () => {
                ObjectHelper.addRemove(this._configuration, "license", uniteConfiguration.license, uniteConfiguration.license !== "None");

                engineVariables.buildDependencies(uniteConfiguration, this._configuration.dependencies);
                engineVariables.buildDevDependencies(this._configuration.devDependencies);

                this._configuration.dependencies = ObjectHelper.sort(this._configuration.dependencies);
                this._configuration.devDependencies = ObjectHelper.sort(this._configuration.devDependencies);

                return this._configuration;
            });
    }

    private configDefaults(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): void {
        const defaultConfiguration = new PackageConfiguration();

        defaultConfiguration.name = uniteConfiguration.packageName;
        defaultConfiguration.version = "0.0.1";
        defaultConfiguration.devDependencies = {};
        defaultConfiguration.dependencies = {};
        defaultConfiguration.engines = { node: ">=8.0.0" };

        this._configuration = ObjectHelper.merge(defaultConfiguration, this._configuration);

        engineVariables.setConfiguration("PackageJson", this._configuration);
    }
}
