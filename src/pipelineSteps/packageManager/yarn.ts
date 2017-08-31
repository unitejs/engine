/**
 * Pipeline step for Yarn.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { PackageConfiguration } from "../../configuration/models/packages/packageConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";
import { IPackageManager } from "../../interfaces/IPackageManager";
import { PackageUtils } from "../packageUtils";

export class Yarn extends EnginePipelineStepBase implements IPackageManager {
    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        if (super.condition(uniteConfiguration.packageManager, "Yarn")) {
            const gitIgnoreConfiguration = engineVariables.getConfiguration<string[]>("GitIgnore");
            if (gitIgnoreConfiguration) {
                gitIgnoreConfiguration.push("node_modules");
            }
        }
        return 0;
    }

    public async info(logger: ILogger, fileSystem: IFileSystem, packageName: string, version: string): Promise<PackageConfiguration> {
        // We still use NPM for this as yarn doesn't have this facility yet
        logger.info("Looking up package info...");

        const args = ["view", `${packageName}${version !== null && version !== undefined ? `@${version}` : ""}`, "--json", "name", "version", "main"];

        return PackageUtils.exec(logger, fileSystem, "npm", undefined, args)
            .then(viewData => JSON.parse(viewData))
            .catch((err) => {
                throw new Error(`No package information found: ${err}`);
            });
    }

    public async add(logger: ILogger, fileSystem: IFileSystem, workingDirectory: string, packageName: string, version: string, isDev: boolean): Promise<any> {
        logger.info("Adding package...");

        const args = ["add", `${packageName}@${version}`];
        if (isDev) {
            args.push("--dev");
        }

        return PackageUtils.exec(logger, fileSystem, "yarn", workingDirectory, args)
            .catch((err) => {
                throw new Error(`Unable to add package: ${err}`);
            });
    }

    public async remove(logger: ILogger, fileSystem: IFileSystem, workingDirectory: string, packageName: string, isDev: boolean): Promise<any> {
        logger.info("Removing package...");

        const args = ["remove", packageName];
        if (isDev) {
            args.push("--dev");
        }

        return PackageUtils.exec(logger, fileSystem, "yarn", workingDirectory, args)
            .catch((err) => {
                throw new Error(`Unable to remove package: ${err}`);
            });
    }
}
