/**
 * Pipeline step to generate babel configuration.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { BabelConfiguration } from "../../configuration/models/babel/babelConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class Babel extends EnginePipelineStepBase {
    private static FILENAME: string = ".babelrc";

    public async prerequisites(logger: ILogger,
                               fileSystem: IFileSystem,
                               uniteConfiguration: UniteConfiguration,
                               engineVariables: EngineVariables): Promise<number> {
        if (uniteConfiguration.sourceLanguage === "JavaScript") {
            engineVariables.sourceLanguageExt = "js";
        }
        return 0;
    }
    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["babel-core", "babel-preset-es2015"], uniteConfiguration.sourceLanguage === "JavaScript");

        if (uniteConfiguration.sourceLanguage === "JavaScript") {
            try {
                logger.info(`Generating ${Babel.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });

                let existing;
                try {
                    const exists = await fileSystem.fileExists(engineVariables.wwwRootFolder, Babel.FILENAME);
                    if (exists) {
                        existing = await fileSystem.fileReadJson<BabelConfiguration>(engineVariables.wwwRootFolder, Babel.FILENAME);
                    }
                } catch (err) {
                    logger.error(`Reading existing ${Babel.FILENAME} failed`, err);
                    return 1;
                }

                const config = this.generateConfig(fileSystem, uniteConfiguration, engineVariables, existing);
                await fileSystem.fileWriteJson(engineVariables.wwwRootFolder, Babel.FILENAME, config);

                return 0;
            } catch (err) {
                logger.error(`Generating ${Babel.FILENAME} failed`, err, { wwwFolder: engineVariables.wwwRootFolder });
                return 1;
            }
        } else {
            return await super.deleteFile(logger, fileSystem, engineVariables.wwwRootFolder, Babel.FILENAME);
        }
    }

    private generateConfig(fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, existing: BabelConfiguration | undefined): BabelConfiguration {
        const config = new BabelConfiguration();
        config.presets = [];

        if (existing) {
            Object.assign(config, existing);
        }

        let modules = "";
        if (uniteConfiguration.moduleType === "AMD") {
            modules = "amd";
        } else if (uniteConfiguration.moduleType === "SystemJS") {
            modules = "systemjs";
        } else {
            modules = "commonjs";
        }

        let foundDefault = false;
        config.presets.forEach(preset => {
            if (Array.isArray(preset) && preset.length > 0) {
                if (preset[0] === "es2015") {
                    foundDefault = true;
                }
            }
        });

        if (!foundDefault) {
            config.presets.push(["es2015", { modules }]);
        }

        for (const key in engineVariables.transpilePresets) {
            const idx = config.presets.indexOf(key);
            if (engineVariables.transpilePresets[key]) {
                if (idx < 0) {
                    config.presets.push(key);
                }
            } else {
                if (idx >= 0) {
                    config.presets.splice(idx, 1);
                }
            }
        }

        return config;
    }
}
