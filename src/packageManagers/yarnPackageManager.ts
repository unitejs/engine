/**
 * Yarn Package Manager class.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { PackageConfiguration } from "../configuration/models/packages/packageConfiguration";
import { IPackageManager } from "../interfaces/IPackageManager";
import { PackageUtils } from "./packageUtils";

export class YarnPackageManager implements IPackageManager {
    private _logger: ILogger;
    private _fileSystem: IFileSystem;

    constructor(logger: ILogger, fileSystem: IFileSystem) {
        this._logger = logger;
        this._fileSystem = fileSystem;
    }

    public async info(packageName: string): Promise<PackageConfiguration> {
        // We still use NPM for this as yarn doesn't have this facility yet
        this._logger.info("Looking up package info...");

        const args = ["view", packageName, "--json", "name", "version", "main"];

        return PackageUtils.exec(this._logger, this._fileSystem, "npm", undefined, args)
            .then(viewData => JSON.parse(viewData))
            .catch((err) => {
                throw new Error(`No package information found: ${err}`);
            });
    }

    public async add(workingDirectory: string, packageName: string, version: string, isDev: boolean): Promise<any> {
        this._logger.info("Adding package...");

        const args = ["add", `${packageName}@${version}`];
        if (isDev) {
            args.push("--dev");
        }

        return PackageUtils.exec(this._logger, this._fileSystem, "yarn", workingDirectory, args)
            .catch((err) => {
                throw new Error(`Unable to add package: ${err}`);
            });
    }

    public async remove(workingDirectory: string, packageName: string, isDev: boolean): Promise<any> {
        this._logger.info("Removing package...");

        const args = ["remove", packageName];
        if (isDev) {
            args.push("--dev");
        }

        return PackageUtils.exec(this._logger, this._fileSystem, "yarn", workingDirectory, args)
            .catch((err) => {
                throw new Error(`Unable to remove package: ${err}`);
            });
    }
}
