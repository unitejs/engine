/**
 * NPM Package Manager class.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { PackageConfiguration } from "../configuration/models/packages/packageConfiguration";
import { IPackageManager } from "../interfaces/IPackageManager";
import { PackageUtils } from "./packageUtils";

export class NpmPackageManager implements IPackageManager {
    private _logger: ILogger;
    private _fileSystem: IFileSystem;

    constructor(logger: ILogger, fileSystem: IFileSystem) {
        this._logger = logger;
        this._fileSystem = fileSystem;
    }

    public async info(packageName: string): Promise<PackageConfiguration> {
        this._logger.info("Looking up package info...");

        const args = ["view", packageName, "--json", "name", "version", "main"];

        return PackageUtils.exec(this._logger, this._fileSystem, "npm", undefined, args)
            .then(viewData => JSON.parse(viewData))
            .catch(() => {
                throw new Error("No package information found.");
            });
    }

    public async add(workingDirectory: string, packageName: string, version: string, isDev: boolean): Promise<any> {
        this._logger.info("Adding package...");

        const args = ["install", `${packageName}@${version}`];

        if (isDev) {
            args.push("--save-dev");
        } else {
            args.push("--save-prod");
        }

        return PackageUtils.exec(this._logger, this._fileSystem, "npm", workingDirectory, args)
            .catch((err) => {
                throw err;
            });
    }

    public async remove(workingDirectory: string, packageName: string, isDev: boolean): Promise<any> {
        this._logger.info("Removing package...");

        const args = ["uninstall", packageName];

        if (isDev) {
            args.push("--save-dev");
        } else {
            args.push("--save");
        }

        return PackageUtils.exec(this._logger, this._fileSystem, "npm", workingDirectory, args)
            .catch((err) => {
                throw err;
            });
    }
}
