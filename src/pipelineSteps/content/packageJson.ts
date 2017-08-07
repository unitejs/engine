/**
 * Pipeline step to generate package.json.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { PackageConfiguration } from "../../configuration/models/packages/packageConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class PackageJson extends EnginePipelineStepBase {
    private static FILENAME: string = "package.json";

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            let existingPackageJson: PackageConfiguration | undefined;
            try {
                const exists = await fileSystem.fileExists(engineVariables.wwwFolder, PackageJson.FILENAME);

                if (exists) {
                    logger.info(`Loading existing ${PackageJson.FILENAME}`, { core: engineVariables.wwwFolder, dependenciesFile: PackageJson.FILENAME });

                    existingPackageJson = await fileSystem.fileReadJson<PackageConfiguration>(engineVariables.wwwFolder, PackageJson.FILENAME);
                }
            } catch (err) {
                logger.error(`Loading existing ${PackageJson.FILENAME} failed`, err, { core: engineVariables.wwwFolder, dependenciesFile: PackageJson.FILENAME });
                return 1;
            }

            logger.info(`Generating ${PackageJson.FILENAME} in`, { wwwFolder: engineVariables.wwwFolder });

            const packageJson = existingPackageJson || new PackageConfiguration();
            packageJson.name = uniteConfiguration.packageName;
            packageJson.version = packageJson.version || "0.0.1";
            packageJson.license = uniteConfiguration.license;
            packageJson.devDependencies = packageJson.devDependencies || {};
            packageJson.dependencies = packageJson.dependencies || {};
            packageJson.engines = { node: ">=8.0.0" };

            engineVariables.buildDependencies(uniteConfiguration, packageJson.dependencies);
            engineVariables.buildDevDependencies(packageJson.devDependencies);

            packageJson.dependencies = this.sortDependencies(packageJson.dependencies);
            packageJson.devDependencies = this.sortDependencies(packageJson.devDependencies);

            await fileSystem.fileWriteJson(engineVariables.wwwFolder, PackageJson.FILENAME, packageJson);
            return 0;
        } catch (err) {
            logger.error(`Generating ${PackageJson.FILENAME} failed`, err, { wwwFolder: engineVariables.wwwFolder });
            return 1;
        }
    }

    private sortDependencies(dependencies: { [id: string]: string }): { [id: string]: string } {
        const newDependencies: { [id: string]: string } = {};
        const keys = Object.keys(dependencies);
        keys.sort();
        keys.forEach(key => {
            newDependencies[key] = dependencies[key];
        });

        return newDependencies;

    }
}
