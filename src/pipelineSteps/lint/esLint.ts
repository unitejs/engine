/**
 * Pipeline step to generate eslint configuration.
 */
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

    public async prerequisites(logger: ILogger,
                               fileSystem: IFileSystem,
                               uniteConfiguration: UniteConfiguration,
                               engineVariables: EngineVariables): Promise<number> {
        if (uniteConfiguration.linter === "ESLint") {
            if (uniteConfiguration.sourceLanguage !== "JavaScript") {
                logger.error("You can only use ESLint when the source language is JavaScript");
                return 1;
            }
        }
        return 0;
    }

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["eslint"], uniteConfiguration.linter === "ESLint");

        if (uniteConfiguration.linter === "ESLint") {
            try {
                logger.info(`Generating ${EsLint.FILENAME}`, { wwwFolder: engineVariables.wwwFolder});

                let existing;
                try {
                    const exists = await fileSystem.fileExists(engineVariables.wwwFolder, EsLint.FILENAME);
                    if (exists) {
                        existing = await fileSystem.fileReadJson<EsLintConfiguration>(engineVariables.wwwFolder, EsLint.FILENAME);
                    }
                } catch (err) {
                    logger.error(`Reading existing ${EsLint.FILENAME} failed`, err);
                    return 1;
                }

                const config = this.generateConfig(fileSystem, uniteConfiguration, engineVariables, existing);
                await fileSystem.fileWriteJson(engineVariables.wwwFolder, EsLint.FILENAME, config);
            } catch (err) {
                logger.error(`Generating ${EsLint.FILENAME} failed`, err);
                return 1;
            }
            try {
                const hasGeneratedMarker = await super.fileHasGeneratedMarker(fileSystem, engineVariables.wwwFolder, EsLint.FILENAME2);

                if (hasGeneratedMarker) {
                    logger.info(`Generating ${EsLint.FILENAME2} Configuration`, { wwwFolder: engineVariables.wwwFolder});

                    const lines: string[] = [];

                    lines.push("dist/*");
                    lines.push("build/*");
                    lines.push("test/unit/unit-bootstrap.js");
                    lines.push("test/unit/unit-module-config.js");
                    lines.push(super.wrapGeneratedMarker("# ", ""));

                    await fileSystem.fileWriteLines(engineVariables.wwwFolder, EsLint.FILENAME2, lines);
                } else {
                    logger.info(`Skipping ${EsLint.FILENAME2} as it has no generated marker`);
                }

                return 0;
            } catch (err) {
                logger.error(`Generating ${EsLint.FILENAME2} failed`, err);
                return 1;
            }
        } else {
            let ret = await super.deleteFile(logger, fileSystem, engineVariables.wwwFolder, EsLint.FILENAME);
            if (ret === 0) {
                ret = await super.deleteFile(logger, fileSystem, engineVariables.wwwFolder, EsLint.FILENAME2);
            }

            return ret;
        }
    }

    private generateConfig(fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, existing: EsLintConfiguration | undefined): EsLintConfiguration {
        const config = new EsLintConfiguration();

        engineVariables.lintExtends["eslint:recommended"] = true;
        engineVariables.lintEnv.browser = true;
        engineVariables.lintGlobals.require = true;

        config.parserOptions = new EsLintParserOptions();

        config.extends = [];
        config.env = {};
        config.globals = {};
        config.rules = {};
        config.plugins = [];

        if (existing) {
            Object.assign(config, existing);
        }

        config.parserOptions.ecmaVersion = 6;
        config.parserOptions.sourceType = "module";
        config.parserOptions.ecmaFeatures = {};

        for (const key in engineVariables.lintFeatures) {
            if (engineVariables.lintFeatures[key].required) {
                config.parserOptions.ecmaFeatures[key] = engineVariables.lintFeatures[key].object;
            } else {
                if (config.parserOptions.ecmaFeatures[key]) {
                    delete config.parserOptions.ecmaFeatures[key];
                }
            }
        }

        for (const key in engineVariables.lintPlugins) {
            const idx = config.plugins.indexOf(key);
            if (engineVariables.lintPlugins[key]) {
                if (idx < 0) {
                    config.plugins.push(key);
                }
            } else {
                if (idx >= 0) {
                    config.plugins.splice(idx, 1);
                }
            }
        }

        for (const key in engineVariables.lintExtends) {
            const idx = config.extends.indexOf(key);
            if (engineVariables.lintExtends[key]) {
                if (idx < 0) {
                    config.extends.push(key);
                }
            } else {
                if (idx >= 0) {
                    config.extends.splice(idx, 1);
                }
            }
        }

        for (const key in engineVariables.lintEnv) {
            if (engineVariables.lintEnv[key]) {
                config.env[key] = true;
            } else {
                if (config.env[key]) {
                    delete config.env[key];
                }
            }
        }

        for (const key in engineVariables.lintGlobals) {
            if (engineVariables.lintGlobals[key]) {
                config.globals[key] = true;
            } else {
                if (config.globals[key]) {
                    delete config.globals[key];
                }
            }
        }

        return config;
    }
}
