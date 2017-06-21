/**
 * Pipeline step to generate package.json.
 */
import { PackageConfiguration } from "../configuration/models/packages/packageConfiguration";
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../engine/enginePipelineStepBase";
import { EngineVariables } from "../engine/engineVariables";
import { IDisplay } from "../interfaces/IDisplay";
import { IFileSystem } from "../interfaces/IFileSystem";
import { ILogger } from "../interfaces/ILogger";

export class PackageJson extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        let corePackageJson: PackageConfiguration;

        try {
            super.log(logger, display, "Loading dependencies", { core: engineVariables.coreFolder, dependenciesFile: "package.json" });

            corePackageJson = await fileSystem.fileReadJson<PackageConfiguration>(engineVariables.coreFolder, "package.json");
        } catch (err) {
            super.error(logger, display, "Loading dependencies failed", err, { core: engineVariables.coreFolder, dependenciesFile: "package.json" });
            return 1;
        }

        try {
            super.log(logger, display, "Generating package.json in", { rootFolder: engineVariables.rootFolder });

            const packageJson = new PackageConfiguration();
            packageJson.name = uniteConfiguration.packageName;
            packageJson.version = "0.0.1";
            packageJson.license = uniteConfiguration.license;
            packageJson.dependencies = this.lookupDependencies(logger, display, engineVariables.requiredDependencies, corePackageJson);
            packageJson.devDependencies = this.lookupDependencies(logger, display, engineVariables.requiredDevDependencies, corePackageJson);

            if (uniteConfiguration.clientPackages) {
                for (const pkg in uniteConfiguration.clientPackages) {
                    if (uniteConfiguration.clientPackages[pkg].includeMode === "app" || uniteConfiguration.clientPackages[pkg].includeMode === "both") {
                        packageJson.dependencies[pkg] = uniteConfiguration.clientPackages[pkg].version;
                    } else if (uniteConfiguration.clientPackages[pkg].includeMode === "test") {
                        packageJson.devDependencies[pkg] = uniteConfiguration.clientPackages[pkg].version;
                    }
                }
            }

            await fileSystem.fileWriteJson(engineVariables.rootFolder, "package.json", packageJson);
            return 0;
        } catch (err) {
            super.error(logger, display, "Generating package.json failed", err, { rootFolder: engineVariables.rootFolder });
            return 1;
        }
    }

    private lookupDependencies(logger: ILogger, display: IDisplay, requiredDependencies: string[], corePackageJson: PackageConfiguration): { [id: string]: string} {
        const dependencies: { [id: string]: string } = {};

        if (requiredDependencies) {
            if (corePackageJson && corePackageJson.peerDependencies) {
                requiredDependencies.sort();

                requiredDependencies.forEach(requiredDependency => {
                    if (corePackageJson.peerDependencies[requiredDependency]) {
                        dependencies[requiredDependency] = corePackageJson.peerDependencies[requiredDependency];
                    } else {
                        throw new Error("Missing Dependency '" + requiredDependency + "'");
                    }
                });
            } else {
                throw new Error("Dependency Versions missing");
            }
        }

        return dependencies;
    }
}