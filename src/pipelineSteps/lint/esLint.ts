/**
 * Pipeline step to generate eslint configuration.
 */
import { EsLintConfiguration } from "../../configuration/models/eslint/esLintConfiguration";
import { EsLintParserOptions } from "../../configuration/models/eslint/esLintParserOptions";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";
import { IDisplay } from "../../interfaces/IDisplay";
import { IFileSystem } from "../../interfaces/IFileSystem";
import { ILogger } from "../../interfaces/ILogger";

export class EsLint extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        if (uniteConfiguration.linter === "ESLint") {
            try {
                if (uniteConfiguration.sourceLanguage !== "JavaScript") {
                    throw new Error("You can only use ESLint when the source language is JavaScript");
                }
                super.log(logger, display, "Generating ESLint Configuration");

                engineVariables.requiredDevDependencies.push("gulp-eslint");

                let existing;
                try {
                    const exists = await fileSystem.fileExists(engineVariables.rootFolder, ".eslintrc.json");
                    if (exists) {
                        existing = await fileSystem.fileReadJson<EsLintConfiguration>(engineVariables.rootFolder, ".eslintrc.json");
                    }
                } catch (err) {
                    super.error(logger, display, "Reading existing .eslintrc.json failed", err);
                    return 0;
                }

                const config = this.generateConfig(fileSystem, uniteConfiguration, engineVariables, existing);
                await fileSystem.fileWriteJson(engineVariables.rootFolder, ".eslintrc.json", config);
            } catch (err) {
                super.error(logger, display, "Generating ESLint Configuration failed", err);
                return 1;
            }
            try {
                super.log(logger, display, "Generating ESLint Ignore Configuration");

                const lines: string[] = [];

                lines.push("dist/*");
                lines.push("build/*");
                lines.push("test/unit/unit-bootstrap.js");
                lines.push("test/unit/unit-module-config.js");

                await fileSystem.fileWriteLines(engineVariables.rootFolder, ".eslintignore", lines);

                return 0;
            } catch (err) {
                super.error(logger, display, "Generating ESLint Ignore failed", err);
                return 1;
            }
        } else {
            try {
                const exists = await fileSystem.fileExists(engineVariables.rootFolder, ".eslintrc.json");
                if (exists) {
                    await fileSystem.fileDelete(engineVariables.rootFolder, ".eslintrc.json");
                }
            } catch (err) {
                super.error(logger, display, "Deleting eslintrc.jsonn failed", err);
                return 1;
            }
            try {
                const exists = await fileSystem.fileExists(engineVariables.rootFolder, ".eslintignore");
                if (exists) {
                    await fileSystem.fileDelete(engineVariables.rootFolder, ".eslintignore");
                }
            } catch (err) {
                super.error(logger, display, "Deleting .eslintignore failed", err);
                return 1;
            }
        }

        return 0;
    }

    private generateConfig(fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, existing: EsLintConfiguration | undefined): EsLintConfiguration {
        const config = new EsLintConfiguration();

        config.parserOptions = new EsLintParserOptions();
        config.parserOptions.ecmaVersion = 6;
        config.parserOptions.sourceType = "module";
        config.extends = "eslint:recommended";
        config.env = {};
        config.globals = {};
        config.rules = {};

        if (existing) {
            config.globals = existing.globals || config.globals;
            config.rules = existing.rules || config.rules;
            config.env = existing.env || config.env;
            config.extends = existing.extends || config.extends;
        }

        config.env.browser = true;
        if (uniteConfiguration.unitTestFramework === "Jasmine") {
            config.env.jasmine = true;
            if (config.env.mocha) {
                delete config.env.mocha;
            }
        } else if (uniteConfiguration.unitTestFramework === "Mocha-Chai") {
            config.env.mocha = true;
            if (config.env.jasmine) {
                delete config.env.jasmine;
            }
        }

        return config;
    }
}