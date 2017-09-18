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
    private static FILENAME: string = ".gitignore";

    private _ignore: string[];

    public async initialise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        logger.info(`Initialising ${GitIgnore.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });

        if (!engineVariables.force) {
            try {
                const exists = await fileSystem.fileExists(engineVariables.wwwRootFolder, GitIgnore.FILENAME);
                if (exists) {
                    this._ignore = await fileSystem.fileReadLines(engineVariables.wwwRootFolder, GitIgnore.FILENAME);
                }
            } catch (err) {
                logger.error(`Reading existing ${GitIgnore.FILENAME} failed`, err);
                return 1;
            }
        }

        this.configDefaults(engineVariables);

        return 0;
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            const hasGeneratedMarker = await super.fileHasGeneratedMarker(fileSystem, engineVariables.wwwRootFolder, GitIgnore.FILENAME);

            if (hasGeneratedMarker === "FileNotExist" || hasGeneratedMarker === "HasMarker" || engineVariables.force) {
                logger.info(`Generating ${GitIgnore.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });

                this._ignore.push(super.wrapGeneratedMarker("# ", ""));

                await fileSystem.fileWriteLines(engineVariables.wwwRootFolder, GitIgnore.FILENAME, this._ignore);
            } else {
                logger.info(`Skipping ${GitIgnore.FILENAME} as it has no generated marker`);
            }

            return 0;
        } catch (err) {
            logger.error(`Generating ${GitIgnore.FILENAME} failed`, err);
            return 1;
        }
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
