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

    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["tslint"], uniteConfiguration.linter === "TSLint");

        if (uniteConfiguration.linter === "TSLint") {
            try {
                if (uniteConfiguration.sourceLanguage !== "TypeScript") {
                    throw new Error("You can only use TSLint when the source language is TypeScript");
                }
                super.log(logger, display, `Generating ${TsLint.FILENAME}`);

                let existing;
                try {
                    const exists = await fileSystem.fileExists(engineVariables.rootFolder, TsLint.FILENAME);
                    if (exists) {
                        existing = await fileSystem.fileReadJson<TsLintConfiguration>(engineVariables.rootFolder, TsLint.FILENAME);
                    }
                } catch (err) {
                    super.error(logger, display, `Reading existing ${TsLint.FILENAME} failed`, err);
                    return 1;
                }

                const config = this.generateConfig(fileSystem, uniteConfiguration, engineVariables, existing);
                await fileSystem.fileWriteJson(engineVariables.rootFolder, TsLint.FILENAME, config);

                return 0;
            } catch (err) {
                super.error(logger, display, `Generating ${TsLint.FILENAME} failed`, err);
                return 1;
            }
        } else {
            return await super.deleteFile(logger, display, fileSystem, engineVariables.rootFolder, TsLint.FILENAME);
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
