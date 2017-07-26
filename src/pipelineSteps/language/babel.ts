/**
 * Pipeline step to generate babel configuration.
 */
import { BabelConfiguration } from "../../configuration/models/babel/babelConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";
import { IDisplay } from "../../interfaces/IDisplay";
import { IFileSystem } from "../../interfaces/IFileSystem";
import { ILogger } from "../../interfaces/ILogger";

export class Babel extends EnginePipelineStepBase {
    private static FILENAME: string = ".babelrc";

    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["babel-core", "babel-preset-es2015"], uniteConfiguration.sourceLanguage === "JavaScript");

        if (uniteConfiguration.sourceLanguage === "JavaScript") {
            try {
                super.log(logger, display, `Generating ${Babel.FILENAME}`, { rootFolder: engineVariables.rootFolder });

                let existing;
                try {
                    const exists = await fileSystem.fileExists(engineVariables.rootFolder, Babel.FILENAME);
                    if (exists) {
                        existing = await fileSystem.fileReadJson<BabelConfiguration>(engineVariables.rootFolder, Babel.FILENAME);
                    }
                } catch (err) {
                    super.error(logger, display, `Reading existing ${Babel.FILENAME} failed`, err);
                    return 1;
                }

                const config = this.generateConfig(fileSystem, uniteConfiguration, engineVariables, existing);
                await fileSystem.fileWriteJson(engineVariables.rootFolder, Babel.FILENAME, config);

                return 0;
            } catch (err) {
                super.error(logger, display, `Generating ${Babel.FILENAME} failed`, err, { rootFolder: engineVariables.rootFolder });
                return 1;
            }
        } else {
            return await super.deleteFile(logger, display, fileSystem, engineVariables.rootFolder, Babel.FILENAME);
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