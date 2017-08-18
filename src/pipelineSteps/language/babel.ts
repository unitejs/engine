/**
 * Pipeline step to generate babel configuration.
 */
import { ObjectHelper } from "unitejs-framework/dist/helpers/objectHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { BabelConfiguration } from "../../configuration/models/babel/babelConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class Babel extends EnginePipelineStepBase {
    private static FILENAME: string = ".babelrc";

    private _configuration: BabelConfiguration;

    public async preProcess(logger: ILogger,
                            fileSystem: IFileSystem,
                            uniteConfiguration: UniteConfiguration,
                            engineVariables: EngineVariables): Promise<number> {
        if (uniteConfiguration.sourceLanguage === "JavaScript") {
            engineVariables.sourceLanguageExt = "js";

            logger.info(`Initialising ${Babel.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });

            try {
                const exists = await fileSystem.fileExists(engineVariables.wwwRootFolder, Babel.FILENAME);
                if (exists) {
                    this._configuration = await fileSystem.fileReadJson<BabelConfiguration>(engineVariables.wwwRootFolder, Babel.FILENAME);
                }
            } catch (err) {
                logger.error(`Reading existing ${Babel.FILENAME} failed`, err);
                return 1;
            }

            this.configDefaults(engineVariables);
        }
        return 0;
    }
    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["babel-core", "babel-preset-es2015"], uniteConfiguration.sourceLanguage === "JavaScript");

        if (uniteConfiguration.sourceLanguage === "JavaScript") {
            try {
                logger.info(`Generating ${Babel.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });

                await fileSystem.fileWriteJson(engineVariables.wwwRootFolder, Babel.FILENAME, this._configuration);

                return 0;
            } catch (err) {
                logger.error(`Generating ${Babel.FILENAME} failed`, err, { wwwFolder: engineVariables.wwwRootFolder });
                return 1;
            }
        } else {
            return await super.deleteFile(logger, fileSystem, engineVariables.wwwRootFolder, Babel.FILENAME);
        }
    }

    private configDefaults(engineVariables: EngineVariables): void {
        const defaultConfiguration = new BabelConfiguration();

        defaultConfiguration.presets = [];
        defaultConfiguration.plugins = [];
        defaultConfiguration.env = {};

        this._configuration = ObjectHelper.merge(defaultConfiguration, this._configuration);

        engineVariables.setConfiguration("Babel", this._configuration);
    }
}
