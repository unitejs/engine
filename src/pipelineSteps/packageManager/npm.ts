/**
 * Pipeline step for Npm.
 */
import { ArrayHelper } from "unitejs-framework/dist/helpers/arrayHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { PackageConfiguration } from "../../configuration/models/packages/packageConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";
import { IPackageManager } from "../../interfaces/IPackageManager";
import { PackageUtils } from "../packageUtils";

export class Npm extends PipelineStepBase implements IPackageManager {
    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables) : boolean | undefined {
        return super.condition(uniteConfiguration.packageManager, "Npm");
    }

    public async install(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        const gitIgnoreConfiguration = engineVariables.getConfiguration<string[]>("GitIgnore");
        if (gitIgnoreConfiguration) {
            ArrayHelper.addRemove(gitIgnoreConfiguration, "node_modules", true);
        }
        return 0;
    }

    public async uninstall(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        const gitIgnoreConfiguration = engineVariables.getConfiguration<string[]>("GitIgnore");
        if (gitIgnoreConfiguration) {
            ArrayHelper.addRemove(gitIgnoreConfiguration, "node_modules", false);
        }
        return 0;
    }

    public async info(logger: ILogger, fileSystem: IFileSystem, packageName: string, version: string): Promise<PackageConfiguration> {
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

        const args = ["install", `${packageName}@${version}`];

        if (isDev) {
            args.push("--save-dev");
        } else {
            args.push("--save-prod");
        }

        return PackageUtils.exec(logger, fileSystem, "npm", workingDirectory, args)
            .catch((err) => {
                throw new Error(`Unable to add package: ${err}`);
            });
    }

    public async remove(logger: ILogger, fileSystem: IFileSystem, workingDirectory: string, packageName: string, isDev: boolean): Promise<any> {
        logger.info("Removing package...");

        const args = ["uninstall", packageName];

        if (isDev) {
            args.push("--save-dev");
        } else {
            args.push("--save");
        }

        return PackageUtils.exec(logger, fileSystem, "npm", workingDirectory, args)
            .catch((err) => {
                throw new Error(`Unable to remove package: ${err}`);
            });
    }
}
