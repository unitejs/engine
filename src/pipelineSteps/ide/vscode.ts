/**
 * Pipeline step to generate vscode configuration.
 */
import { ObjectHelper } from "unitejs-framework/dist/helpers/objectHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { JavaScriptCompilerOptions } from "../../configuration/models/vscode/javaScriptCompilerOptions";
import { JavaScriptConfiguration } from "../../configuration/models/vscode/javaScriptConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class VsCode extends PipelineStepBase {
    private static readonly FILENAME: string = "jsconfig.json";

    private _configuration: JavaScriptConfiguration;

    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): boolean | undefined {
        return super.arrayCondition(uniteConfiguration.ides, "VSCode") && super.condition(uniteConfiguration.sourceLanguage, "JavaScript");
    }

    public async initialise(logger: ILogger,
                            fileSystem: IFileSystem,
                            uniteConfiguration: UniteConfiguration,
                            engineVariables: EngineVariables,
                            mainCondition: boolean): Promise<number> {
        if (mainCondition) {
            return super.fileReadJson<JavaScriptConfiguration>(logger,
                                                               fileSystem,
                                                               engineVariables.wwwRootFolder,
                                                               VsCode.FILENAME,
                                                               engineVariables.force,
                                                               async (obj) => {
                    this._configuration = obj;

                    this.configDefaults(fileSystem, engineVariables);

                    return 0;
                });
        } else {
            return 0;
        }
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        return super.fileToggleJson(logger,
                                    fileSystem,
                                    engineVariables.wwwRootFolder,
                                    VsCode.FILENAME,
                                    engineVariables.force,
                                    mainCondition,
                                    async () => this._configuration);

    }

    private configDefaults(fileSystem: IFileSystem, engineVariables: EngineVariables): void {
        const defaultConfiguration = new JavaScriptConfiguration();

        defaultConfiguration.compilerOptions = new JavaScriptCompilerOptions();
        defaultConfiguration.compilerOptions.target = "es5";
        defaultConfiguration.include = [
            `${fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.src))}**/*`,
            `${fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.unit))}**/*`,
            `${fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.wwwRootFolder, engineVariables.www.e2e))}**/*`
        ];
        defaultConfiguration.exclude = [];

        this._configuration = ObjectHelper.merge(defaultConfiguration, this._configuration);

        engineVariables.setConfiguration("JavaScript", this._configuration);
    }
}
