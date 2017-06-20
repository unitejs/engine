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

                const config = this.generateConfig(fileSystem, uniteConfiguration, engineVariables);
                await fileSystem.fileWriteJson(engineVariables.rootFolder, ".eslintrc.json", config);

                return 0;
            } catch (err) {
                super.error(logger, display, "Generating ESLint Configuration failed", err);
                return 1;
            }
        } else {
            try {
                const exists = await fileSystem.fileExists(engineVariables.rootFolder, ".eslintrc.json");
                if (exists) {
                    await fileSystem.fileDelete(engineVariables.rootFolder, ".eslintrc.json");
                }
            } catch (err) {
                super.error(logger, display, "Deleting ESLint Configuration failed", err);
                return 1;
            }
        }

        return 0;
    }

    private generateConfig(fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): EsLintConfiguration {
        const config = new EsLintConfiguration();

        config.parserOptions = new EsLintParserOptions();
        config.parserOptions.ecmaVersion = 6;
        config.parserOptions.sourceType = "module";
        config.extends = "eslint:recommended";
        config.env = {};
        config.env.browser = true;

        if (uniteConfiguration.unitTestFramework === "Jasmine") {
            config.env.jasmine = true;
        } else if (uniteConfiguration.unitTestFramework === "Mocha-Chai") {
            config.env.mocha = true;
        }

        config.globals = {};
        config.rules = {};

        return config;
    }
}