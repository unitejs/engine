/**
 * Pipeline step to generate package.json.
 */
import { PackageConfiguration } from "../../configuration/models/packages/packageConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";
import { IDisplay } from "../../interfaces/IDisplay";
import { IFileSystem } from "../../interfaces/IFileSystem";
import { ILogger } from "../../interfaces/ILogger";

export class PackageJson extends EnginePipelineStepBase {
    private static FILENAME: string = "package.json";

    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        let corePackageJson: PackageConfiguration;

        try {
            super.log(logger, display, "Loading dependencies", { core: engineVariables.coreFolder, dependenciesFile: PackageJson.FILENAME });

            corePackageJson = await fileSystem.fileReadJson<PackageConfiguration>(engineVariables.coreFolder, PackageJson.FILENAME);
        } catch (err) {
            super.error(logger, display, "Loading dependencies failed", err, { core: engineVariables.coreFolder, dependenciesFile: PackageJson.FILENAME });
            return 1;
        }

        try {
            let existingPackageJson: PackageConfiguration | undefined;
            try {
                const exists = await fileSystem.fileExists(engineVariables.rootFolder, PackageJson.FILENAME);

                if (exists) {
                    super.log(logger, display, `Loading existing ${PackageJson.FILENAME}`, { core: engineVariables.rootFolder, dependenciesFile: PackageJson.FILENAME });

                    existingPackageJson = await fileSystem.fileReadJson<PackageConfiguration>(engineVariables.rootFolder, PackageJson.FILENAME);
                }
            } catch (err) {
                super.error(logger, display, `Loading existing ${PackageJson.FILENAME} failed`, err, { core: engineVariables.rootFolder, dependenciesFile: PackageJson.FILENAME });
                return 1;
            }

            super.log(logger, display, `Generating ${PackageJson.FILENAME} in`, { rootFolder: engineVariables.rootFolder });

            const packageJson = existingPackageJson || new PackageConfiguration();
            packageJson.name = uniteConfiguration.packageName;
            packageJson.version = packageJson.version || "0.0.1";
            packageJson.license = uniteConfiguration.license;
            packageJson.devDependencies = packageJson.devDependencies || {};
            packageJson.dependencies = packageJson.dependencies || {};

            engineVariables.optimiseDependencies();
            engineVariables.buildDependencies(packageJson.devDependencies, corePackageJson.peerDependencies, true);
            engineVariables.buildDependencies(packageJson.dependencies, corePackageJson.peerDependencies, false);

            if (uniteConfiguration.clientPackages) {
                for (const pkg in uniteConfiguration.clientPackages) {
                    if (uniteConfiguration.clientPackages[pkg].includeMode === "app" || uniteConfiguration.clientPackages[pkg].includeMode === "both") {
                        packageJson.dependencies[pkg] = uniteConfiguration.clientPackages[pkg].version;
                    } else if (uniteConfiguration.clientPackages[pkg].includeMode === "test") {
                        packageJson.devDependencies[pkg] = uniteConfiguration.clientPackages[pkg].version;
                    }
                }
            }

            packageJson.dependencies = this.sortDependencies(packageJson.dependencies);
            packageJson.devDependencies = this.sortDependencies(packageJson.devDependencies);

            await fileSystem.fileWriteJson(engineVariables.rootFolder, PackageJson.FILENAME, packageJson);
            return 0;
        } catch (err) {
            super.error(logger, display, `Generating ${PackageJson.FILENAME} failed`, err, { rootFolder: engineVariables.rootFolder });
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