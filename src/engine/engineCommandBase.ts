/**
 * Main engine
 */
import { ObjectHelper } from "unitejs-framework/dist/helpers/objectHelper";
import { StringHelper } from "unitejs-framework/dist/helpers/stringHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { IPackageManager } from "../interfaces/IPackageManager";
import { EngineVariables } from "./engineVariables";
import { Pipeline } from "./pipeline";
import { PipelineKey } from "./pipelineKey";

export abstract class EngineCommandBase {
    protected _logger: ILogger;
    protected _fileSystem: IFileSystem;
    protected _engineRootFolder: string;
    protected _engineVersion: string;
    protected _engineDependencies: { [id: string]: string };

    protected _engineAssetsFolder: string;

    protected _pipeline: Pipeline;

    public create(logger: ILogger, fileSystem: IFileSystem, engineRootFolder: string, engineVersion: string, engineDependencies: { [id: string]: string }): void {
        this._logger = logger;
        this._fileSystem = fileSystem;
        this._engineRootFolder = engineRootFolder;
        this._engineVersion = engineVersion;
        this._engineDependencies = engineDependencies;

        this._engineAssetsFolder = this._fileSystem.pathCombine(this._engineRootFolder, "/assets/");

        this._pipeline = new Pipeline(this._logger, this._fileSystem, this._engineRootFolder);
    }

    protected async loadConfiguration(outputDirectory: string, profileSource: string, profile: string | undefined | null, force: boolean): Promise<UniteConfiguration | undefined | null> {
        let uniteConfiguration: UniteConfiguration | undefined | null;

        if (!force) {
            try {
                const exists = await this._fileSystem.fileExists(outputDirectory, "unite.json");

                if (exists) {
                    const existing = await this._fileSystem.fileReadJson<UniteConfiguration>(outputDirectory, "unite.json");

                    // Convert the old comma separated assets into an array
                    if (existing.clientPackages) {
                        Object.keys(existing.clientPackages).forEach(key => {
                            const pkg = existing.clientPackages[key];
                            if (pkg.assets) {
                                if (StringHelper.isString(pkg.assets)) {
                                    const assetsString = <string><any>pkg.assets;
                                    pkg.assets = assetsString.split(",");
                                }
                            }
                        });

                    }

                    uniteConfiguration = existing;
                }

                const loadedProfile: UniteConfiguration | undefined | null = await this.loadProfile<UniteConfiguration>(undefined, "assets/profiles/", "configure.json", profile);
                if (loadedProfile === null) {
                    uniteConfiguration = null;
                } else if (loadedProfile) {
                    uniteConfiguration = ObjectHelper.merge(uniteConfiguration || {}, loadedProfile);
                }
            } catch (e) {
                this._logger.error("Reading existing unite.json", e);
                uniteConfiguration = null;
            }
        }

        return uniteConfiguration;
    }

    protected async loadProfile<T>(module: string, location: string, profileFile: string, profile: string | undefined | null): Promise<T | undefined | null> {
        if (location !== undefined && location !== null && profile !== undefined && profile !== null) {
            try {
                const moduleRoot = module !== undefined && module.length > 0 ?
                    this._fileSystem.pathCombine(this._engineRootFolder, `node_modules/${module}`) : this._engineRootFolder;

                const profileLocation = this._fileSystem.pathCombine(moduleRoot, location);

                const exists = await this._fileSystem.fileExists(profileLocation, profileFile);
                if (exists) {
                    const profiles = await this._fileSystem.fileReadJson<{ [id: string]: T }>(profileLocation, profileFile);

                    const profileLower = profile.toLowerCase();
                    const keys = Object.keys(profiles);
                    for (let i = 0; i < keys.length; i++) {
                        if (profileLower === keys[i].toLowerCase()) {
                            return profiles[keys[i]];
                        }
                    }
                    this._logger.error(`Profile does not exist '${profile}'`);
                    return null;
                }
            } catch (err) {
                this._logger.error(`Reading profile file '${location}' failed`, err);
                return null;
            }
        }

        return undefined;
    }

    protected createEngineVariables(outputDirectory: string, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): void {
        engineVariables.force = false;
        engineVariables.engineRootFolder = this._engineRootFolder;
        engineVariables.engineAssetsFolder = this._engineAssetsFolder;
        engineVariables.engineVersion = this._engineVersion;
        engineVariables.engineDependencies = this._engineDependencies;
        engineVariables.setupDirectories(this._fileSystem, outputDirectory);
        engineVariables.initialisePackages(uniteConfiguration.clientPackages);

        engineVariables.packageManager = this._pipeline.getStep<IPackageManager>(new PipelineKey("packageManager", uniteConfiguration.packageManager));
    }

    protected mapParser(input: string[]): { [id: string]: string } {
        let parsedMap: { [id: string]: string };

        if (input !== undefined && input !== null && input.length > 0) {
            parsedMap = {};

            input.forEach(item => {
                const parts = item.split("=");
                if (parts.length === 2) {
                    parsedMap[parts[0]] = parts[1];
                } else {
                    throw new Error(`The input is not formed correctly '${input}'`);
                }
            });
        }

        return parsedMap;
    }

    protected mapFromArrayParser(input: string[]): { [id: string]: string } {
        let parsedMap: { [id: string]: string };

        if (input !== undefined && input !== null && input.length > 0) {
            parsedMap = {};

            if (input.length % 2 !== 0) {
                throw new Error(`The input is not formed correctly '${input}'`);
            } else {
                for (let i = 0; i < input.length; i += 2) {
                    parsedMap[input[i]] = input[i + 1];
                }
            }
        }

        return parsedMap;
    }

    protected displayCompletionMessage(engineVariables: EngineVariables, showPackageUpdate: boolean) : void {
        engineVariables.additionalCompletionMessages.forEach(message => {
            this._logger.warning(message);
        });
        if (showPackageUpdate) {
            this._logger.warning(`Packages may have changed, you should update them using the following command before running any tasks:`);
            this._logger.warning(`   ${engineVariables.packageManager.getInstallCommand("", false)}`);
        }
        this._logger.banner("Successfully Completed.");
    }
}
