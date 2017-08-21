/**
 * Pipeline step to generate package.json.
 */
import { ObjectHelper } from "unitejs-framework/dist/helpers/objectHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { PackageConfiguration } from "../../configuration/models/packages/packageConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class PackageJson extends EnginePipelineStepBase {
    private static FILENAME: string = "package.json";

    private _configuration: PackageConfiguration;

    public async initialise(logger: ILogger,
                            fileSystem: IFileSystem,
                            uniteConfiguration: UniteConfiguration,
                            engineVariables: EngineVariables): Promise<number> {
        logger.info(`Initialising ${PackageJson.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });

        try {
            const exists = await fileSystem.fileExists(engineVariables.wwwRootFolder, PackageJson.FILENAME);
            if (exists) {
                this._configuration = await fileSystem.fileReadJson<PackageConfiguration>(engineVariables.wwwRootFolder, PackageJson.FILENAME);
            }
        } catch (err) {
            logger.error(`Reading existing ${PackageJson.FILENAME} failed`, err);
            return 1;
        }

        this.configDefaults(uniteConfiguration, engineVariables);

        return 0;
    }

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            logger.info(`Generating ${PackageJson.FILENAME} in`, { wwwFolder: engineVariables.wwwRootFolder });

            engineVariables.buildDependencies(uniteConfiguration, this._configuration.dependencies);
            engineVariables.buildDevDependencies(this._configuration.devDependencies);

            this._configuration.dependencies = ObjectHelper.sort(this._configuration.dependencies);
            this._configuration.devDependencies = ObjectHelper.sort(this._configuration.devDependencies);

            await fileSystem.fileWriteJson(engineVariables.wwwRootFolder, PackageJson.FILENAME, this._configuration);
            return 0;
        } catch (err) {
            logger.error(`Generating ${PackageJson.FILENAME} failed`, err, { wwwFolder: engineVariables.wwwRootFolder });
            return 1;
        }
    }

    private configDefaults(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): void {
        const defaultConfiguration = new PackageConfiguration();

        defaultConfiguration.name = uniteConfiguration.packageName;
        defaultConfiguration.version = "0.0.1";
        defaultConfiguration.license = uniteConfiguration.license;
        defaultConfiguration.devDependencies = {};
        defaultConfiguration.dependencies = {};
        defaultConfiguration.engines = { node: ">=8.0.0" };

        this._configuration = ObjectHelper.merge(defaultConfiguration, this._configuration);

        engineVariables.setConfiguration("PackageJson", this._configuration);
    }
}
