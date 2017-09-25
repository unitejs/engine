/**
 * Pipeline step for Yarn.
 */
import { ArrayHelper } from "unitejs-framework/dist/helpers/arrayHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { PackageConfiguration } from "../../configuration/models/packages/packageConfiguration";
import { TypeScriptConfiguration } from "../../configuration/models/typeScript/typeScriptConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { JavaScriptConfiguration } from "../../configuration/models/vscode/javaScriptConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";
import { IPackageManager } from "../../interfaces/IPackageManager";
import { PackageUtils } from "../packageUtils";

export class Yarn extends PipelineStepBase implements IPackageManager {
    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables) : boolean | undefined {
        return super.condition(uniteConfiguration.packageManager, "Yarn");
    }

    public async configure(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        const gitIgnoreConfiguration = engineVariables.getConfiguration<string[]>("GitIgnore");
        if (gitIgnoreConfiguration) {
            ArrayHelper.addRemove(gitIgnoreConfiguration, "node_modules", mainCondition);
        }

        const typeScriptConfiguration = engineVariables.getConfiguration<TypeScriptConfiguration>("TypeScript");
        if (typeScriptConfiguration) {
            ArrayHelper.addRemove(typeScriptConfiguration.exclude, "node_modules", mainCondition);
        }

        const javaScriptConfiguration = engineVariables.getConfiguration<JavaScriptConfiguration>("JavaScript");
        if (javaScriptConfiguration) {
            ArrayHelper.addRemove(javaScriptConfiguration.exclude, "node_modules", mainCondition);
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
