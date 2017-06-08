/**
 * Pipeline step to generate package.json.
 */
import { PackageConfiguration } from "../configuration/models/packages/packageConfiguration";
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { UniteDependencies } from "../configuration/models/unite/uniteDependencies";
import { EnginePipelineStepBase } from "../engine/enginePipelineStepBase";
import { EngineVariables } from "../engine/engineVariables";
import { IDisplay } from "../interfaces/IDisplay";
import { IFileSystem } from "../interfaces/IFileSystem";
import { ILogger } from "../interfaces/ILogger";

export class PackageJson extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        let uniteDependencies: UniteDependencies;

        try {
            super.log(logger, display, "Loading dependencies", { assetsDirectory: engineVariables.assetsDirectory, dependenciesFile: engineVariables.dependenciesFile });

            uniteDependencies = await fileSystem.fileReadJson<UniteDependencies>(engineVariables.assetsDirectory, engineVariables.dependenciesFile);
        } catch (err) {
            super.error(logger, display, "Loading dependencies failed", err, { assetsDirectory: engineVariables.assetsDirectory, dependenciesFile: engineVariables.dependenciesFile });
            return 1;
        }

        try {
            super.log(logger, display, "Generating package.json in", { rootFolder: engineVariables.rootFolder });

            const packageJson = new PackageConfiguration();
            packageJson.name = uniteConfiguration.packageName;
            packageJson.version = "0.0.1";
            packageJson.dependencies = this.lookupDependencies(logger, display, engineVariables.requiredDependencies, uniteDependencies);
            packageJson.devDependencies = this.lookupDependencies(logger, display, engineVariables.requiredDevDependencies, uniteDependencies);

            await fileSystem.fileWriteJson(engineVariables.rootFolder, "package.json", packageJson);
            return 0;
        } catch (err) {
            super.error(logger, display, "Generating package.json failed", err, { rootFolder: engineVariables.rootFolder });
            return 1;
        }
    }

    private lookupDependencies(logger: ILogger, display: IDisplay, requiredDependencies: string[], uniteDependencies: UniteDependencies): { [id: string]: string} {
        const dependencies: { [id: string]: string } = {};

        if (requiredDependencies) {
            if (uniteDependencies && uniteDependencies.versions) {
                requiredDependencies.sort();

                requiredDependencies.forEach(requiredDependency => {
                    if (uniteDependencies.versions[requiredDependency]) {
                        dependencies[requiredDependency] = uniteDependencies.versions[requiredDependency];
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