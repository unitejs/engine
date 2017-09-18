/**
 * Pipeline step to generate TypeScript configuration.
 */
import { ArrayHelper } from "unitejs-framework/dist/helpers/arrayHelper";
import { ObjectHelper } from "unitejs-framework/dist/helpers/objectHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { TypeScriptCompilerOptions } from "../../configuration/models/typeScript/typeScriptCompilerOptions";
import { TypeScriptConfiguration } from "../../configuration/models/typeScript/typeScriptConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class TypeScript extends PipelineStepBase {
    private static FILENAME: string = "tsconfig.json";

    private _configuration: TypeScriptConfiguration;

    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables) : boolean | undefined {
        return super.condition(uniteConfiguration.sourceLanguage, "TypeScript");
    }

    public async initialise(logger: ILogger,
                            fileSystem: IFileSystem,
                            uniteConfiguration: UniteConfiguration,
                            engineVariables: EngineVariables): Promise<number> {

        logger.info(`Initialising ${TypeScript.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });

        ArrayHelper.addRemove(uniteConfiguration.sourceExtensions, "ts", true);

        if (!engineVariables.force) {
            try {
                const exists = await fileSystem.fileExists(engineVariables.wwwRootFolder, TypeScript.FILENAME);
                if (exists) {
                    this._configuration = await fileSystem.fileReadJson<TypeScriptConfiguration>(engineVariables.wwwRootFolder, TypeScript.FILENAME);
                }
            } catch (err) {
                logger.error(`Reading existing ${TypeScript.FILENAME} failed`, err);
                return 1;
            }
        }

        this.configDefaults(engineVariables);

        return 0;
    }

    public async install(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["typescript", "unitejs-types"], super.condition(uniteConfiguration.sourceLanguage, "TypeScript"));

        return 0;
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            logger.info(`Generating ${TypeScript.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });

            await fileSystem.fileWriteJson(engineVariables.wwwRootFolder, TypeScript.FILENAME, this._configuration);

            return 0;
        } catch (err) {
            logger.error(`Generating ${TypeScript.FILENAME} failed`, err, { wwwFolder: engineVariables.wwwRootFolder });
            return 1;
        }
    }

    public async uninstall(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        ArrayHelper.addRemove(uniteConfiguration.sourceExtensions, "ts", false);

        engineVariables.toggleDevDependency(["typescript", "unitejs-types"], false);

        return await super.deleteFile(logger, fileSystem, engineVariables.wwwRootFolder, TypeScript.FILENAME, engineVariables.force);
    }

    private configDefaults(engineVariables: EngineVariables): void {
        const defaultConfiguration = new TypeScriptConfiguration();

        defaultConfiguration.compilerOptions = new TypeScriptCompilerOptions();

        defaultConfiguration.compilerOptions.target = "es5";
        defaultConfiguration.compilerOptions.moduleResolution = "node";
        defaultConfiguration.compilerOptions.noImplicitAny = true;
        defaultConfiguration.compilerOptions.noImplicitThis = true;
        defaultConfiguration.compilerOptions.noImplicitReturns = true;

        defaultConfiguration.compilerOptions.lib = ["dom", "es2015"];

        this._configuration = ObjectHelper.merge(defaultConfiguration, this._configuration);

        engineVariables.setConfiguration("TypeScript", this._configuration);
    }
}
