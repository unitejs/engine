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

    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): boolean | undefined {
        return super.condition(uniteConfiguration.sourceLanguage, "TypeScript");
    }

    public async initialise(logger: ILogger,
                            fileSystem: IFileSystem,
                            uniteConfiguration: UniteConfiguration,
                            engineVariables: EngineVariables,
                            mainCondition: boolean): Promise<number> {
        if (mainCondition) {
            return super.fileReadJson<TypeScriptConfiguration>(logger,
                                                               fileSystem,
                                                               engineVariables.wwwRootFolder,
                                                               TypeScript.FILENAME,
                                                               engineVariables.force,
                                                               async (obj) => {
                    this._configuration = obj;

                    ArrayHelper.addRemove(uniteConfiguration.sourceExtensions, "ts", true);
                    this.configDefaults(fileSystem, engineVariables);

                    return 0;
                });
        } else {
            return 0;
        }
    }

    public async configure(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        engineVariables.toggleDevDependency(["typescript", "unitejs-types"], mainCondition && super.condition(uniteConfiguration.sourceLanguage, "TypeScript"));

        return 0;
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        return super.fileToggleJson(logger,
                                    fileSystem,
                                    engineVariables.wwwRootFolder,
                                    TypeScript.FILENAME,
                                    engineVariables.force,
                                    mainCondition,
                                    async () => this._configuration);

    }

    private configDefaults(fileSystem: IFileSystem, engineVariables: EngineVariables): void {
        const defaultConfiguration = new TypeScriptConfiguration();

        defaultConfiguration.compilerOptions = new TypeScriptCompilerOptions();

        defaultConfiguration.compilerOptions.target = "es5";
        defaultConfiguration.compilerOptions.moduleResolution = "node";
        defaultConfiguration.compilerOptions.noImplicitAny = true;
        defaultConfiguration.compilerOptions.noImplicitThis = true;
        defaultConfiguration.compilerOptions.noImplicitReturns = true;

        defaultConfiguration.compilerOptions.lib = ["dom", "es2015"];
        defaultConfiguration.include = [
            `${fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.srcFolder))}**/*`,
            `${fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.unitTestSrcFolder))}**/*`,
            `${fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.e2eTestSrcFolder))}**/*`
        ];
        defaultConfiguration.exclude = [];

        this._configuration = ObjectHelper.merge(defaultConfiguration, this._configuration);

        engineVariables.setConfiguration("TypeScript", this._configuration);
    }
}
