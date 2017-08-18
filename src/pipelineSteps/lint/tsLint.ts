/**
 * Pipeline step to generate tslint configuration.
 */
import { ObjectHelper } from "unitejs-framework/dist/helpers/objectHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { TsLintConfiguration } from "../../configuration/models/tslint/tsLintConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class TsLint extends EnginePipelineStepBase {
    private static FILENAME: string = "tslint.json";

    private _configuration: TsLintConfiguration;

    public async preProcess(logger: ILogger,
                            fileSystem: IFileSystem,
                            uniteConfiguration: UniteConfiguration,
                            engineVariables: EngineVariables): Promise<number> {
        if (uniteConfiguration.linter === "TSLint") {
            if (uniteConfiguration.sourceLanguage !== "TypeScript") {
                logger.error("You can only use TSLint when the source language is TypeScript");
                return 1;
            }

            logger.info(`Initialising ${TsLint.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });

            try {
                const exists = await fileSystem.fileExists(engineVariables.wwwRootFolder, TsLint.FILENAME);
                if (exists) {
                    this._configuration = await fileSystem.fileReadJson<TsLintConfiguration>(engineVariables.wwwRootFolder, TsLint.FILENAME);
                }
            } catch (err) {
                logger.error(`Reading existing ${TsLint.FILENAME} failed`, err);
                return 1;
            }

            this.configDefaults(engineVariables);
        }
        return 0;
    }

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["tslint"], uniteConfiguration.linter === "TSLint");

        if (uniteConfiguration.linter === "TSLint") {
            try {
                logger.info(`Generating ${TsLint.FILENAME}`);

                this.configFinalise();
                await fileSystem.fileWriteJson(engineVariables.wwwRootFolder, TsLint.FILENAME, this._configuration);

                return 0;
            } catch (err) {
                logger.error(`Generating ${TsLint.FILENAME} failed`, err);
                return 1;
            }
        } else {
            return await super.deleteFile(logger, fileSystem, engineVariables.wwwRootFolder, TsLint.FILENAME);
        }
    }

    private configDefaults(engineVariables: EngineVariables): void {
        const defaultConfiguration = new TsLintConfiguration();

        defaultConfiguration.extends = "tslint:recommended";
        defaultConfiguration.rulesDirectory = [];
        defaultConfiguration.rules = {};

        this._configuration = ObjectHelper.merge(defaultConfiguration, this._configuration);

        engineVariables.setConfiguration("TSLint", this._configuration);
    }

    private configFinalise(): void {
        if (!this._configuration.rules["object-literal-sort-keys"]) {
            this._configuration.rules["object-literal-sort-keys"] = false;
        }

        if (!this._configuration.rules["trailing-comma"]) {
            this._configuration.rules["trailing-comma"] = [
                true,
                {
                    multiline: {
                        objects: "never"
                    }
                }
            ];
        }

        if (!this._configuration.rules["no-reference"]) {
            this._configuration.rules["no-reference"] = false;
        }
    }
}
