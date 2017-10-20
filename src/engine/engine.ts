/**
 * Main engine
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { PackageConfiguration } from "../configuration/models/packages/packageConfiguration";
import { IEngine } from "../interfaces/IEngine";
import { IEngineCommand } from "../interfaces/IEngineCommand";
import { IEngineCommandParams } from "../interfaces/IEngineCommandParams";
import { ConfigHelper } from "./configHelper";

export class Engine implements IEngine {
    private _logger: ILogger;
    private _fileSystem: IFileSystem;
    private _engineRootFolder: string;
    private _engineVersion: string;
    private _engineDependencies: { [id: string]: string };

    constructor(logger: ILogger, fileSystem: IFileSystem) {
        this._logger = logger;
        this._fileSystem = fileSystem;
    }

    public async initialise(): Promise<number> {
        try {
            const nodeVersionParts = process.version.replace("v", "").split(".");

            if (parseInt(nodeVersionParts[0], 10) < 8) {
                this._logger.error("Node Version 8 or higher is required", undefined, { nodeVersion: process.version });
                return 1;
            }

            this._engineRootFolder = this._fileSystem.pathCombine(__dirname, "../../");

            const enginePackageJson = await this._fileSystem.fileReadJson<PackageConfiguration>(this._engineRootFolder, "package.json");
            this._engineVersion = enginePackageJson.version;

            const assetFolder = this._fileSystem.pathCombine(this._engineRootFolder, "assets");
            this._engineDependencies = await this._fileSystem.fileReadJson<{ [id: string]: string }>(assetFolder, "peerPackages.json");

            return 0;
        } catch (err) {
            this._logger.error("Loading dependencies failed", err, { core: this._engineRootFolder, dependenciesFile: "package.json" });
            return 1;
        }
    }

    public version(): string {
        return this._engineVersion ? this._engineVersion : "unknown";
    }

    public async command<T extends IEngineCommandParams>(commandName: string, args: T): Promise<number> {
        try {
            const commandFolder = this._fileSystem.pathCombine(this._engineRootFolder, "dist/commands/");
            const loadFile = this._fileSystem.pathCombine(commandFolder, `${commandName}Command.js`);
            const module = await import(loadFile);

            const className = Object.keys(module)[0];

            const instance = Object.create(module[className].prototype);
            const engineCommand: IEngineCommand<T> = new instance.constructor();

            engineCommand.create(this._logger, this._fileSystem, this._engineRootFolder, this._engineVersion, this._engineDependencies);
            args.outputDirectory = await ConfigHelper.findConfigFolder(this._fileSystem, args.outputDirectory);
            return engineCommand.run(args);
        } catch (err) {
            this._logger.error("Error loading command module", undefined, { command: commandName, args });
            return 1;
        }
    }
}
