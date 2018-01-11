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
    private static readonly FILENAME: string = "package.json";

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
        const ret = await super.fileToggleJson(logger,
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

        if (ret === 0 && uniteConfiguration.clientPackages) {
            // Since we are reconfiguring we should remove any transpiled clientPackages
            // they will get rebuilt on the first run of the build task
            const keys = Object.keys(uniteConfiguration.clientPackages);

            for (let i = 0; i < keys.length; i++) {
                const pkg = uniteConfiguration.clientPackages[keys[i]];

                // Fill in package name for any that used to be just addressed by their key
                pkg.name = pkg.name || keys[i];

                if (pkg.transpile && pkg.transpile.alias) {
                    const parts = pkg.transpile.alias.split("/");
                    const transpileFolder = fileSystem.pathCombine(engineVariables.www.package, parts[0]);
                    try {
                        const exists = await fileSystem.directoryExists(transpileFolder);

                        if (exists) {
                            logger.info(`Removing transpiled package ${transpileFolder}`);
                            await fileSystem.directoryDelete(transpileFolder);
                        }
                    } catch (err) {
                        logger.error(`Removing ${transpileFolder} failed`, err);
                        return 1;
                    }
                }
            }
        }

        return ret;
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
