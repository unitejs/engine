/**
 * Main engine
 */
import { ObjectHelper } from "unitejs-framework/dist/helpers/objectHelper";
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
    protected _profilesFolder: string;

    protected _pipeline: Pipeline;

    public create(logger: ILogger, fileSystem: IFileSystem, engineRootFolder: string, engineVersion: string, engineDependencies: { [id: string]: string }): void {
        this._logger = logger;
        this._fileSystem = fileSystem;
        this._engineRootFolder = engineRootFolder;
        this._engineVersion = engineVersion;
        this._engineDependencies = engineDependencies;

        this._engineAssetsFolder = this._fileSystem.pathCombine(this._engineRootFolder, "/assets/");
        this._profilesFolder = this._fileSystem.pathCombine(this._engineAssetsFolder, "/profiles/");

        this._pipeline = new Pipeline(this._logger, this._fileSystem, this._engineRootFolder);
    }

    protected async loadConfiguration(outputDirectory: string, profileSource: string, profile: string | undefined | null, force: boolean): Promise<UniteConfiguration | undefined | null> {
        let uniteConfiguration: UniteConfiguration | undefined | null = await this.loadProfile<UniteConfiguration>(profileSource, profile);

        if (!force && uniteConfiguration !== null) {
            try {
                const exists = await this._fileSystem.fileExists(outputDirectory, "unite.json");

                if (exists) {
                    const existing = await this._fileSystem.fileReadJson<UniteConfiguration>(outputDirectory, "unite.json");

                    uniteConfiguration = ObjectHelper.merge(uniteConfiguration, existing);
                }
            } catch (e) {
                this._logger.error("Reading existing unite.json", e);
                uniteConfiguration = null;
            }
        }

        return uniteConfiguration;
    }

    protected async loadProfile<T>(profileSource: string, profile: string | undefined | null): Promise<T | undefined | null> {
        if (profileSource !== undefined && profileSource !== null && profile !== undefined && profile !== null) {
            const configFile = `${profileSource}.json`;
            try {

                const exists = await this._fileSystem.fileExists(this._profilesFolder, configFile);
                if (exists) {
                    const profiles = await this._fileSystem.fileReadJson<{ [id: string]: T }>(this._profilesFolder, configFile);

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
                this._logger.error(`Reading profile file '${configFile}' failed`, err);
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
}
