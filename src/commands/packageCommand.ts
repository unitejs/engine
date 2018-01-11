/**
 * Package Command
 */
import { ParameterValidation } from "unitejs-framework/dist/helpers/parameterValidation";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteClientPackage } from "../configuration/models/unite/uniteClientPackage";
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { UnitePackageClientConfiguration } from "../configuration/models/unitePackages/unitePackageClientConfiguration";
import { UnitePackageCondition } from "../configuration/models/unitePackages/unitePackageCondition";
import { UnitePackageConfiguration } from "../configuration/models/unitePackages/unitePackageConfiguration";
import { EngineCommandBase } from "../engine/engineCommandBase";
import { EngineVariables } from "../engine/engineVariables";
import { PipelineKey } from "../engine/pipelineKey";
import { PackageHelper } from "../helpers/packageHelper";
import { TemplateHelper } from "../helpers/templateHelper";
import { IApplicationFramework } from "../interfaces/IApplicationFramework";
import { IEngineCommand } from "../interfaces/IEngineCommand";
import { IPackageCommandParams } from "../interfaces/IPackageCommandParams";
import { IPipelineStep } from "../interfaces/IPipelineStep";
import { ClientPackageCommand } from "./clientPackageCommand";

export class PackageCommand extends EngineCommandBase implements IEngineCommand<IPackageCommandParams> {
    public async run(args: IPackageCommandParams): Promise<number> {
        const uniteConfiguration = await this.loadConfiguration(args.outputDirectory, undefined, undefined, false);

        if (!uniteConfiguration) {
            this._logger.error("There is no unite.json to configure.");
            return 1;
        }

        if (!await this._pipeline.tryLoad(uniteConfiguration, new PipelineKey("applicationFramework", uniteConfiguration.applicationFramework))) {
            return 1;
        }

        if (!await this._pipeline.tryLoad(uniteConfiguration, new PipelineKey("packageManager", uniteConfiguration.packageManager))) {
            return 1;
        }

        if (!await this._pipeline.tryLoad(uniteConfiguration, new PipelineKey("moduleType", uniteConfiguration.moduleType))) {
            return 1;
        }

        return this.packageAdd(args, uniteConfiguration);
    }

    private async packageAdd(args: IPackageCommandParams, uniteConfiguration: UniteConfiguration): Promise<number> {
        if (!ParameterValidation.notEmpty(this._logger, "packageName", args.packageName)) {
            return 1;
        }

        this._logger.info("");

        const engineVariables = new EngineVariables();
        this.createEngineVariables(args.outputDirectory, uniteConfiguration, engineVariables);

        try {
            const rootPackageFolder = await PackageHelper.locate(this._fileSystem, this._logger, engineVariables.engineRootFolder, "unitejs-packages");

            let ret = 0;
            if (rootPackageFolder) {
                const packageFolder = this._fileSystem.pathCombine(rootPackageFolder, `assets/${args.packageName}`);

                const packageDirExists = await this._fileSystem.directoryExists(packageFolder);

                if (packageDirExists) {
                    const packageFileExists = await this._fileSystem.fileExists(packageFolder, "unite-package.json");

                    if (packageFileExists) {
                        const unitePackageConfiguration = await this._fileSystem.fileReadJson<UnitePackageConfiguration>(packageFolder, "unite-package.json");

                        const moduleType = this._pipeline.getStep<IPipelineStep>(new PipelineKey("moduleType", uniteConfiguration.moduleType));

                        await moduleType.initialise(this._logger, this._fileSystem, uniteConfiguration, engineVariables, true);

                        ret = await this.processPackage(uniteConfiguration, engineVariables, packageFolder, unitePackageConfiguration);
                    } else {
                        ret = 1;
                        this._logger.error(`Package file '${this._fileSystem.pathCombine(packageFolder, "unite-package.json")}' does not exist`);
                    }
                } else {
                    ret = 1;
                    this._logger.error(`Package folder '${packageFolder}' does not exist`);
                }
            } else {
                ret = 1;
            }

            return ret;
        } catch (err) {
            this._logger.error(`There was an error loading unite-package.json for package '${args.packageName}'`, err);
            return 1;
        }
    }

    private async processPackage(uniteConfiguration: UniteConfiguration,
                                 engineVariables: EngineVariables,
                                 packageFolder: string,
                                 unitePackageConfiguration: UnitePackageConfiguration): Promise<number> {
        let ret = 0;

        const matches = this.matchesConditions(this._logger, uniteConfiguration, unitePackageConfiguration.conditions);

        if (matches === null) {
            ret = 1;
        } else {
            if (matches) {
                const appFrameworkFolder = this._fileSystem.pathCombine(packageFolder, uniteConfiguration.applicationFramework.toLowerCase());

                const appFrameworkFolderExists = await this._fileSystem.directoryExists(appFrameworkFolder);

                if (appFrameworkFolderExists) {
                    const subFolders = await this._fileSystem.directoryGetFolders(appFrameworkFolder);

                    const codeSubstitutions = TemplateHelper.createCodeSubstitutions(engineVariables);

                    for (let i = 0; i < subFolders.length && ret === 0; i++) {
                        const actualWwwFolder = engineVariables.www[subFolders[i]];
                        if (actualWwwFolder) {
                            const actualSource = this._fileSystem.pathCombine(appFrameworkFolder, subFolders[i]);

                            this._logger.info("Copying folder", { sourceFolder: actualSource, destFolder: actualWwwFolder });

                            ret = await this.copyFolder(uniteConfiguration, actualSource, actualWwwFolder, codeSubstitutions);
                        } else {
                            ret = 1;
                            this._logger.error(`There is no destination folder '${subFolders[i]}' to copy content to.`);
                        }
                    }
                }

                if (ret === 0) {
                    ret = await this.addPackages(uniteConfiguration, engineVariables, unitePackageConfiguration);
                }

                if (ret === 0) {
                    this._pipeline.add("content", "packageJson");
                    this._pipeline.add("unite", "uniteConfigurationJson");

                    ret = await this._pipeline.run(uniteConfiguration, engineVariables);
                }

                if (ret === 0) {
                    ret = await this.addRoute(uniteConfiguration, engineVariables, unitePackageConfiguration);
                }

                if (ret === 0) {
                    this.displayCompletionMessage(engineVariables, true);
                }
            } else {
                this._logger.error("This package can not be added to your current setup, the following conditions must be met:");
                this.conditionsToText(unitePackageConfiguration.conditions)
                    .map(conditionText => this._logger.error(`   ${conditionText}`));
                ret = 1;
            }
        }

        return ret;
    }

    private async copyFolder(uniteConfiguration: UniteConfiguration,
                             sourceFolder: string,
                             destFolder: string,
                             substitutions: { [id: string]: string | string[] }): Promise<number> {
        let ret = 0;

        try {
            const destFolderExists = await this._fileSystem.directoryExists(destFolder);
            if (!destFolderExists) {
                await this._fileSystem.directoryCreate(destFolder);
            }
        } catch (err) {
            this._logger.error(`There was an creating folder '${destFolder}'`, err);
            ret = 1;
        }

        if (ret === 0) {
            const usableExtensions = uniteConfiguration.sourceExtensions
                                        .concat(uniteConfiguration.viewExtensions)
                                        .concat(uniteConfiguration.styleExtension);

            const files = await this._fileSystem.directoryGetFiles(sourceFolder);

            for (let i = 0; i < files.length && ret === 0; i++) {
                try {
                    const ext = /\.(.*)$/.exec(files[i]);

                    if (ext && ext.length > 1 && usableExtensions.indexOf(ext[1]) >= 0) {
                        this._logger.info("Copying file", { sourceFolder, destFolder, file: files[i] });
                        let data = await this._fileSystem.fileReadText(sourceFolder, files[i]);

                        data = TemplateHelper.replaceSubstitutions(substitutions, data);

                        await this._fileSystem.fileWriteText(destFolder, files[i], data);
                    }
                } catch (err) {
                    this._logger.error(`There was an error copying file '${files[i]}'`, err);
                    ret = 1;
                }
            }
        }

        if (ret === 0) {
            const folders = await this._fileSystem.directoryGetFolders(sourceFolder);
            for (let i = 0; i < folders.length && ret === 0; i++) {
                ret = await this.copyFolder(uniteConfiguration,
                                            this._fileSystem.pathCombine(sourceFolder, folders[i]),
                                            this._fileSystem.pathCombine(destFolder, folders[i]),
                                            substitutions);
            }
        }

        return ret;
    }

    private async addRoute(uniteConfiguration: UniteConfiguration,
                           engineVariables: EngineVariables,
                           unitePackageConfiguration: UnitePackageConfiguration): Promise<number> {

        let ret = 0;

        if (unitePackageConfiguration.routes && Object.keys(unitePackageConfiguration.routes).length > 0) {
            const appFramework = this._pipeline.getStep<IApplicationFramework>(new PipelineKey("applicationFramework", uniteConfiguration.applicationFramework));

            ret = await appFramework.insertRoutes(this._logger, this._fileSystem, uniteConfiguration, engineVariables, unitePackageConfiguration.routes);
        }

        return ret;
    }

    private async addPackages(uniteConfiguration: UniteConfiguration,
                              engineVariables: EngineVariables,
                              unitePackageConfiguration: UnitePackageConfiguration): Promise<number> {

        let ret = 0;

        if (unitePackageConfiguration.clientPackages) {
            const keys = Object.keys(unitePackageConfiguration.clientPackages);
            for (let i = 0; i < keys.length && ret === 0; i++) {
                const clientPackage = unitePackageConfiguration.clientPackages[keys[i]];

                const matches = this.matchesConditions(this._logger, uniteConfiguration, clientPackage.conditions);
                if (matches === null) {
                    ret = 1;
                } else {
                    if (matches) {
                        let finalClientPackage: UnitePackageClientConfiguration = new UnitePackageClientConfiguration();
                        if (clientPackage.profile) {
                            const profilePackage = await this.loadProfile<UniteClientPackage>("unitejs-packages", "assets", "clientPackage.json", clientPackage.profile);
                            if (profilePackage === null) {
                                ret = 1;
                            } else {
                                delete clientPackage.profile;
                                finalClientPackage = {...finalClientPackage, ...profilePackage};
                            }
                        }

                        if (ret === 0) {
                            finalClientPackage = {...finalClientPackage, ...clientPackage};

                            ret = await ClientPackageCommand.retrievePackageDetails(this._logger, this._fileSystem, engineVariables, finalClientPackage);

                            if (ret === 0) {
                                if (finalClientPackage.isDevDependency) {
                                    engineVariables.addVersionedDevDependency(finalClientPackage.name, finalClientPackage.version);
                                } else {
                                    uniteConfiguration.clientPackages = uniteConfiguration.clientPackages || {};
                                    uniteConfiguration.clientPackages[finalClientPackage.name] = finalClientPackage;
                                }
                            }
                        }
                    }
                }
            }
        }

        return ret;
    }

    private matchesConditions(logger: ILogger, uniteConfiguration: UniteConfiguration, conditions: UnitePackageCondition[]): boolean | null {
        if (conditions && conditions.length > 0) {
            for (let i = 0; i < conditions.length; i++) {
                if (conditions[i].property !== undefined) {
                    if (conditions[i].value !== undefined) {
                        let matches = this.propertyMatches(uniteConfiguration, conditions[i].property, conditions[i].value);

                        if (conditions[i].negate) {
                            matches = !matches;
                        }

                        if (!matches) {
                            return false;
                        }
                    } else {
                        logger.error(`Can not match condition when value is not set`);
                        return null;
                    }
                } else {
                    logger.error(`Can not match condition when property is not set`);
                    return null;
                }
            }

            return true;
        } else {
            return true;
        }
    }

    private propertyMatches(uniteConfigurationObject: any, property: string, value: string): boolean {
        const propertyLower = property.toLowerCase();

        const actualProperty: string = Object.keys(uniteConfigurationObject)
                                                .find(key => key.toLowerCase() === propertyLower);

        if (actualProperty) {
            const configValue = uniteConfigurationObject[actualProperty];

            if (configValue !== undefined) {
                return configValue.toLowerCase() === value.toLowerCase();
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    private conditionsToText(conditions: UnitePackageCondition[]) : string[] {
        const ret: string[] = [];

        conditions.forEach(condition => {
            if (condition.negate) {
                ret.push(`${condition.property} must not be ${condition.value}`);
            } else {
                ret.push(`${condition.property} must be ${condition.value}`);
            }
        });

        return ret;
    }
}
