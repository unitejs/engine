/**
 * Pipeline step to generate tslint configuration.
 */
import { IDisplay } from "unitejs-framework/dist/interfaces/IDisplay";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { TsLintConfiguration } from "../../configuration/models/tslint/tsLintConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class TsLint extends EnginePipelineStepBase {
    private static FILENAME: string = "tslint.json";

    public async prerequisites(logger: ILogger,
                               display: IDisplay,
                               fileSystem: IFileSystem,
                               uniteConfiguration: UniteConfiguration,
                               engineVariables: EngineVariables): Promise<number> {
        if (uniteConfiguration.linter === "TSLint") {
            if (uniteConfiguration.sourceLanguage !== "TypeScript") {
                super.error(logger, display, "You can only use TSLint when the source language is TypeScript");
                return 1;
            }
        }
        return 0;
    }

    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["tslint"], uniteConfiguration.linter === "TSLint");

        if (uniteConfiguration.linter === "TSLint") {
            try {
                super.log(logger, display, `Generating ${TsLint.FILENAME}`);

                let existing;
                try {
                    const exists = await fileSystem.fileExists(engineVariables.wwwFolder, TsLint.FILENAME);
                    if (exists) {
                        existing = await fileSystem.fileReadJson<TsLintConfiguration>(engineVariables.wwwFolder, TsLint.FILENAME);
                    }
                } catch (err) {
                    super.error(logger, display, `Reading existing ${TsLint.FILENAME} failed`, err);
                    return 1;
                }

                const config = this.generateConfig(fileSystem, uniteConfiguration, engineVariables, existing);
                await fileSystem.fileWriteJson(engineVariables.wwwFolder, TsLint.FILENAME, config);

                return 0;
            } catch (err) {
                super.error(logger, display, `Generating ${TsLint.FILENAME} failed`, err);
                return 1;
            }
        } else {
            return await super.deleteFile(logger, display, fileSystem, engineVariables.wwwFolder, TsLint.FILENAME);
        }
    }

    private generateConfig(fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, existing: TsLintConfiguration | undefined): TsLintConfiguration {
        const config = new TsLintConfiguration();

        config.extends = "tslint:recommended";
        config.rulesDirectory = [];
        config.rules = {};

        if (existing) {
            config.extends = existing.extends || config.extends;
            config.rulesDirectory = existing.rulesDirectory || config.rulesDirectory;
            config.rules = existing.rules || config.rules;
        }

        if (!config.rules["object-literal-sort-keys"]) {
            config.rules["object-literal-sort-keys"] = false;
        }

        if (!config.rules["trailing-comma"]) {
            config.rules["trailing-comma"] = [
                true,
                {
                    multiline: {
                        objects: "never"
                    }
                }
            ];
        }

        if (!config.rules["no-reference"]) {
            config.rules["no-reference"] = false;
        }

        return config;
    }
}
