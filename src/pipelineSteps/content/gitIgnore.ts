/**
 * Pipeline step to generate .gitignore.
 */
import { ObjectHelper } from "unitejs-framework/dist/helpers/objectHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class GitIgnore extends PipelineStepBase {
    private static readonly FILENAME: string = ".gitignore";

    private _ignore: string[];

    public async initialise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        return super.fileReadLines(logger,
                                   fileSystem,
                                   engineVariables.wwwRootFolder,
                                   GitIgnore.FILENAME,
                                   engineVariables.force,
                                   async (lines) => {
                                        this._ignore = lines;
                                        this.configDefaults(engineVariables);
                                        return 0;
                                    });
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        return super.fileToggleLines(logger,
                                     fileSystem,
                                     engineVariables.wwwRootFolder,
                                     GitIgnore.FILENAME,
                                     engineVariables.force,
                                     mainCondition,
                                     async () => {
                                        this._ignore.push(super.wrapGeneratedMarker("# ", ""));
                                        return this._ignore;
                                    });
    }

    private configDefaults(engineVariables: EngineVariables): void {
        const defaultIgnore: string[] = [];

        this._ignore = ObjectHelper.merge(defaultIgnore, this._ignore);

        const markerLine = super.wrapGeneratedMarker("# ", "");
        const idx = this._ignore.indexOf(markerLine);
        if (idx >= 0) {
            this._ignore.splice(idx, 1);
        }
        for (let i = this._ignore.length - 1; i >= 0; i--) {
            if (this._ignore[i].trim().length === 0) {
                this._ignore.splice(i, 1);
            }
        }

        engineVariables.setConfiguration("GitIgnore", this._ignore);
    }
}
