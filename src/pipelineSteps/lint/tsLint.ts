/**
 * Pipeline step to generate tslint configuration.
 */
import { TsLintConfiguration } from "../../configuration/models/tslint/tsLintConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";
import { IDisplay } from "../../interfaces/IDisplay";
import { IFileSystem } from "../../interfaces/IFileSystem";
import { ILogger } from "../../interfaces/ILogger";

export class TsLint extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        if (uniteConfiguration.linter === "TSLint") {
            try {
                if (uniteConfiguration.sourceLanguage !== "TypeScript") {
                    throw new Error("You can only use TSLint when the source language is TypeScript");
                }
                super.log(logger, display, "Generating TSLint Configuration");

                engineVariables.requiredDevDependencies.push("gulp-tslint");
                engineVariables.requiredDevDependencies.push("tslint");

                const config = this.generateConfig(fileSystem, uniteConfiguration, engineVariables);
                await fileSystem.fileWriteJson(engineVariables.rootFolder, "tslint.json", config);

                return 0;
            } catch (err) {
                super.error(logger, display, "Generating TSLint Configuration failed", err);
                return 1;
            }
        } else {
            try {
                const exists = await fileSystem.fileExists(engineVariables.rootFolder, "tslint.json");
                if (exists) {
                    await fileSystem.fileDelete(engineVariables.rootFolder, "tslint.json");
                }
            } catch (err) {
                super.error(logger, display, "Deleting TSLint Configuration failed", err);
                return 1;
            }
        }

        return 0;
    }

    private generateConfig(fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): TsLintConfiguration {
        const config = new TsLintConfiguration();

        config.extends = "tslint:recommended";
        config.rulesDirectory = [];
        config.rules = {};

        return config;
    }
}