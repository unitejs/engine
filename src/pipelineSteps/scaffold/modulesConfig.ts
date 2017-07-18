/**
 * Pipeline step to generate module-config.js.
 */
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { JsonHelper } from "../../core/jsonHelper";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";
import { IDisplay } from "../../interfaces/IDisplay";
import { IFileSystem } from "../../interfaces/IFileSystem";
import { ILogger } from "../../interfaces/ILogger";

export class ModulesConfig extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            super.log(logger, display, "Creating Dist Directory", { distFolder: engineVariables.distFolder });
            await fileSystem.directoryCreate(engineVariables.distFolder);
        } catch (err) {
            super.error(logger, display, "Creating Dist failed", err, { distFolder: engineVariables.distFolder });
            return 1;
        }

        try {
            super.log(logger, display, "Generating app-modules-config.json in", { distFolder: engineVariables.distFolder });

            const lines: string[] = [];

            this.buildAppModuleConfig(uniteConfiguration, engineVariables, lines);

            await fileSystem.fileWriteLines(engineVariables.distFolder, "app-module-config.js", lines);

        } catch (err) {
            super.error(logger, display, "Generating app-modules-config.js failed", err, { distFolder: engineVariables.distFolder });
            return 1;
        }

        try {
            if (uniteConfiguration.unitTestRunner === "Karma") {
                super.log(logger, display, "Generating unit-modules-config.json in", { distFolder: engineVariables.unitTestFolder });

                const lines: string[] = [];

                this.buildUnitModuleConfig(uniteConfiguration, engineVariables, lines);

                await fileSystem.fileWriteLines(engineVariables.unitTestFolder, "unit-module-config.js", lines);
            }

            return 0;
        } catch (err) {
            super.error(logger, display, "Generating unit-modules-config.js failed", err, { distFolder: engineVariables.unitTestFolder });
            return 1;
        }
    }

    private buildAppModuleConfig(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, lines: string[]): void {
        const moduleConfig: { paths: { [id: string]: string }, packages: {}, preload: string[]} = { paths: {}, packages: {}, preload: []};

        const keys = Object.keys(uniteConfiguration.clientPackages);
        for (let i = 0; i < keys.length; i++) {
            const pkg = uniteConfiguration.clientPackages[keys[i]];
            if (pkg.includeMode === "app" || pkg.includeMode === "both") {
                moduleConfig.paths[keys[i]] = engineVariables.packageFolder + keys[i] + "/" + pkg.main.replace(/(\.js)$/, "").replace(/\.\//, "");
                if (pkg.preload) {
                    moduleConfig.preload.push(keys[i]);
                }
            }
        }

        lines.push("appModuleConfig = " + JsonHelper.codify(moduleConfig) + ";");
    }

    private buildUnitModuleConfig(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, lines: string[]): void {
        const moduleConfig: { paths: { [id: string]: string }, packages: {}, preload: string[]} = { paths: {}, packages: {}, preload: []};

        const keys = Object.keys(uniteConfiguration.clientPackages);
        for (let i = 0; i < keys.length; i++) {
            const pkg = uniteConfiguration.clientPackages[keys[i]];
            if (pkg.includeMode === "test" || pkg.includeMode === "both") {
                moduleConfig.paths[keys[i]] = engineVariables.packageFolder + keys[i] + "/" + pkg.main.replace(/(\.js)$/, "").replace(/\.\//, "");
                if (pkg.preload) {
                    moduleConfig.preload.push(keys[i]);
                }
            }
        }

        lines.push("unitModuleConfig = " + JsonHelper.codify(moduleConfig) + ";");
    }
}