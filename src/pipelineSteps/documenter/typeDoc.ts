/**
 * Pipeline step to generate typeDoc configuration.
 */
import { ObjectHelper } from "unitejs-framework/dist/helpers/objectHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { TypeDocConfiguration } from "../../configuration/models/typeDoc/typeDocConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class TypeDoc extends PipelineStepBase {
    private static FILENAME: string = "typedoc.json";

    private _configuration: TypeDocConfiguration;

    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): boolean | undefined {
        return super.condition(uniteConfiguration.documenter, "TypeDoc");
    }

    public async initialise(logger: ILogger,
                            fileSystem: IFileSystem,
                            uniteConfiguration: UniteConfiguration,
                            engineVariables: EngineVariables,
                            mainCondition: boolean): Promise<number> {
        if (mainCondition) {
            if (!super.condition(uniteConfiguration.sourceLanguage, "TypeScript")) {
                logger.error("You can only use TypeDoc when the source language is TypeScript");
                return 1;
            }
            return super.fileReadJson<TypeDocConfiguration>(logger, fileSystem, engineVariables.wwwRootFolder, TypeDoc.FILENAME, engineVariables.force, async (obj) => {
                this._configuration = obj;

                this.configDefaults(fileSystem, uniteConfiguration, engineVariables);

                return 0;
            });
        } else {
            return 0;
        }
    }

    public async configure(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        engineVariables.toggleDevDependency(["typedoc"], mainCondition);

        return 0;
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        let ret = await super.folderCreate(logger, fileSystem, engineVariables.docsRootFolder);

        if (ret === 0) {
            ret = await super.fileToggleJson(logger,
                                             fileSystem,
                                             engineVariables.wwwRootFolder,
                                             TypeDoc.FILENAME,
                                             engineVariables.force,
                                             mainCondition,
                                             async () => this._configuration);
        }

        return ret;
    }

    private configDefaults(fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): void {
        const defaultConfiguration = new TypeDocConfiguration();

        defaultConfiguration.mode = "file";
        defaultConfiguration.module = "es2015";
        defaultConfiguration.target = "es2015";
        defaultConfiguration.theme = "default";
        defaultConfiguration.out = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, engineVariables.docsRootFolder))
            .replace(/^\.\//, "");
        defaultConfiguration.moduleResolution = "node";
        defaultConfiguration.includeDeclarations = false;
        defaultConfiguration.experimentalDecorators = true;
        defaultConfiguration.externalPattern = "**/*.d.ts";
        defaultConfiguration.excludeExternals = true;
        defaultConfiguration.emitDecoratorMetadata = true;

        this._configuration = ObjectHelper.merge(defaultConfiguration, this._configuration);

        engineVariables.setConfiguration("TypeDoc", this._configuration);
    }
}
