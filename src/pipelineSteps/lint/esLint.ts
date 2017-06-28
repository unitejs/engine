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
    private static FILENAME: string = ".eslintrc.json";
    private static FILENAME2: string = ".eslintignore";

    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDependencies(["eslint"], uniteConfiguration.linter === "ESLint", true);

        if (uniteConfiguration.linter === "ESLint") {
            try {
                if (uniteConfiguration.sourceLanguage !== "JavaScript") {
                    throw new Error("You can only use ESLint when the source language is JavaScript");
                }
                super.log(logger, display, `Generating ${EsLint.FILENAME}`);

                let existing;
                try {
                    const exists = await fileSystem.fileExists(engineVariables.rootFolder, EsLint.FILENAME);
                    if (exists) {
                        existing = await fileSystem.fileReadJson<EsLintConfiguration>(engineVariables.rootFolder, EsLint.FILENAME);
                    }
                } catch (err) {
                    super.error(logger, display, `Reading existing ${EsLint.FILENAME} failed`, err);
                    return 0;
                }

                const config = this.generateConfig(fileSystem, uniteConfiguration, engineVariables, existing);
                await fileSystem.fileWriteJson(engineVariables.rootFolder, EsLint.FILENAME, config);
            } catch (err) {
                super.error(logger, display, `Generating ${EsLint.FILENAME} failed`, err);
                return 1;
            }
            try {
                const hasGeneratedMarker = await super.fileHasGeneratedMarker(fileSystem, engineVariables.rootFolder, EsLint.FILENAME2);

                if (hasGeneratedMarker) {
                    super.log(logger, display, `Generating ${EsLint.FILENAME2} Configuration`);

                    const lines: string[] = [];

                    lines.push("dist/*");
                    lines.push("build/*");
                    lines.push("test/unit/unit-bootstrap.js");
                    lines.push("test/unit/unit-module-config.js");
                    lines.push(super.wrapGeneratedMarker("# ", ""));

                    await fileSystem.fileWriteLines(engineVariables.rootFolder, EsLint.FILENAME2, lines);
                } else {
                    super.log(logger, display, `Skipping ${EsLint.FILENAME2} as it has no generated marker`);
                }

                return 0;
            } catch (err) {
                super.error(logger, display, `Generating ${EsLint.FILENAME2} failed`, err);
                return 1;
            }
        } else {
            try {
                const exists = await fileSystem.fileExists(engineVariables.rootFolder, EsLint.FILENAME);
                if (exists) {
                    await fileSystem.fileDelete(engineVariables.rootFolder, EsLint.FILENAME);
                }
            } catch (err) {
                super.error(logger, display, `Deleting ${EsLint.FILENAME} failed`, err);
                return 1;
            }
            try {
                const exists = await fileSystem.fileExists(engineVariables.rootFolder, EsLint.FILENAME2);
                if (exists) {
                    await fileSystem.fileDelete(engineVariables.rootFolder, EsLint.FILENAME2);
                }
            } catch (err) {
                super.error(logger, display, `Deleting ${EsLint.FILENAME2} failed`, err);
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
        config.plugins = [];

        if (existing) {
            config.globals = existing.globals || config.globals;
            config.rules = existing.rules || config.rules;
            config.env = existing.env || config.env;
            config.extends = existing.extends || config.extends;
            config.plugins = existing.plugins || config.plugins;
        }

        config.env.browser = true;
        config.globals.require = true;
        if (uniteConfiguration.unitTestFramework === "Jasmine" || uniteConfiguration.e2eTestFramework === "Jasmine") {
            config.env.jasmine = true;
        } else {
            if (config.env.jasmine) {
                delete config.env.jasmine;
            }
        }

        if (uniteConfiguration.unitTestFramework === "Mocha-Chai" || uniteConfiguration.e2eTestFramework === "Mocha-Chai") {
            config.env.mocha = true;
        } else {
            if (config.env.mocha) {
                delete config.env.mocha;
            }
        }

        if (uniteConfiguration.e2eTestRunner === "Protractor") {
            config.env.protractor = true;
        } else {
            if (config.env.protractor) {
                delete config.env.protractor;
            }
        }

        engineVariables.toggleDependencies(["eslint-plugin-webdriverio"], uniteConfiguration.e2eTestRunner === "WebdriverIO", true);
        const idx = config.plugins.indexOf("webdriverio");
        if (uniteConfiguration.e2eTestRunner === "WebdriverIO") {
            if (idx < 0) {
                config.plugins.push("webdriverio");
            }
            config.env["webdriverio/wdio"] = true;
        } else {
            if (idx >= 0) {
                config.plugins.splice(idx, 1);
            }
            if (config.env["webdriverio/wdio"]) {
                delete config.env["webdriverio/wdio"];
            }
        }

        return config;
    }
}