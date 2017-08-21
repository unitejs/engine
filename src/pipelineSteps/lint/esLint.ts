/**
 * Pipeline step to generate eslint configuration.
 */
import { ObjectHelper } from "unitejs-framework/dist/helpers/objectHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { EsLintConfiguration } from "../../configuration/models/eslint/esLintConfiguration";
import { EsLintParserOptions } from "../../configuration/models/eslint/esLintParserOptions";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class EsLint extends EnginePipelineStepBase {
    private static FILENAME: string = ".eslintrc.json";
    private static FILENAME2: string = ".eslintignore";

    private _configuration: EsLintConfiguration;
    private _ignore: string[];

    public async initialise(logger: ILogger,
                            fileSystem: IFileSystem,
                            uniteConfiguration: UniteConfiguration,
                            engineVariables: EngineVariables): Promise<number> {
        if (uniteConfiguration.linter === "ESLint") {
            if (uniteConfiguration.sourceLanguage !== "JavaScript") {
                logger.error("You can only use ESLint when the source language is JavaScript");
                return 1;
            }

            logger.info(`Initialising ${EsLint.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });

            try {
                const exists = await fileSystem.fileExists(engineVariables.wwwRootFolder, EsLint.FILENAME);
                if (exists) {
                    this._configuration = await fileSystem.fileReadJson<EsLintConfiguration>(engineVariables.wwwRootFolder, EsLint.FILENAME);
                }
            } catch (err) {
                logger.error(`Reading existing ${EsLint.FILENAME} failed`, err);
                return 1;
            }

            try {
                const exists = await fileSystem.fileExists(engineVariables.wwwRootFolder, EsLint.FILENAME2);
                if (exists) {
                    this._ignore = await fileSystem.fileReadLines(engineVariables.wwwRootFolder, EsLint.FILENAME2);
                }
            } catch (err) {
                logger.error(`Reading existing ${EsLint.FILENAME} failed`, err);
                return 1;
            }

            this.configDefaults(engineVariables);
        }
        return 0;
    }

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["eslint"], uniteConfiguration.linter === "ESLint");

        if (uniteConfiguration.linter === "ESLint") {
            try {
                logger.info(`Generating ${EsLint.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });

                await fileSystem.fileWriteJson(engineVariables.wwwRootFolder, EsLint.FILENAME, this._configuration);
            } catch (err) {
                logger.error(`Generating ${EsLint.FILENAME} failed`, err);
                return 1;
            }

            try {
                const hasGeneratedMarker = await super.fileHasGeneratedMarker(fileSystem, engineVariables.wwwRootFolder, EsLint.FILENAME2);

                if (hasGeneratedMarker === "FileNotExist" || hasGeneratedMarker === "HasMarker") {
                    logger.info(`Generating ${EsLint.FILENAME2} Configuration`, { wwwFolder: engineVariables.wwwRootFolder });

                    this._ignore.push(super.wrapGeneratedMarker("# ", ""));

                    await fileSystem.fileWriteLines(engineVariables.wwwRootFolder, EsLint.FILENAME2, this._ignore);
                } else {
                    logger.info(`Skipping ${EsLint.FILENAME2} as it has no generated marker`);
                }

                return 0;
            } catch (err) {
                logger.error(`Generating ${EsLint.FILENAME2} failed`, err);
                return 1;
            }
        } else {
            let ret = await super.deleteFile(logger, fileSystem, engineVariables.wwwRootFolder, EsLint.FILENAME);
            if (ret === 0) {
                ret = await super.deleteFile(logger, fileSystem, engineVariables.wwwRootFolder, EsLint.FILENAME2);
            }

            return ret;
        }
    }

    private configDefaults(engineVariables: EngineVariables): void {
        const defaultConfiguration = new EsLintConfiguration();

        defaultConfiguration.parserOptions = new EsLintParserOptions();
        defaultConfiguration.parserOptions.ecmaVersion = 6;
        defaultConfiguration.parserOptions.sourceType = "module";
        defaultConfiguration.parserOptions.ecmaFeatures = {};

        defaultConfiguration.extends = ["eslint:recommended"];
        defaultConfiguration.env = {
            browser: true
        };
        defaultConfiguration.globals = {
            require: true
        };
        defaultConfiguration.rules = {};
        defaultConfiguration.plugins = [];

        const defaultIgnore = [
            "dist/*",
            "build/*",
            "test/unit/unit-bootstrap.js",
            "test/unit/unit-module-config.js"
        ];

        this._configuration = ObjectHelper.merge(defaultConfiguration, this._configuration);
        this._ignore = ObjectHelper.merge(defaultIgnore, this._ignore);

        const markerLine = super.wrapGeneratedMarker("# ", "");
        const idx = this._ignore.indexOf(markerLine);
        if (idx >= 0) {
            this._ignore.splice(idx, 1);
        }

        engineVariables.setConfiguration("ESLint", this._configuration);
        engineVariables.setConfiguration("ESLint.Ignore", this._ignore);
    }
}
