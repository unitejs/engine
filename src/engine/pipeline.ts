/**
 * Class for pipeline
 */
import { ObjectHelper } from "unitejs-framework/dist/helpers/objectHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { IPipelineStep } from "../interfaces/IPipelineStep";
import { EngineVariables } from "./engineVariables";
import { PipelineKey } from "./pipelineKey";
import { PipelineLocator } from "./pipelineLocator";

export class Pipeline {
    private _logger: ILogger;
    private _fileSystem: IFileSystem;
    private _engineRootFolder: string;

    private _steps: PipelineKey[];
    private _moduleIdMap: { [id: string]: string };
    private _loadedStepCache: { [id: string]: IPipelineStep };

    constructor(logger: ILogger, fileSystem: IFileSystem, engineRootFolder: string) {
        this._logger = logger;
        this._fileSystem = fileSystem;
        this._engineRootFolder = engineRootFolder;
        this._steps = [];
        this._moduleIdMap = {};
        this._loadedStepCache = {};
    }

    public add(category: string, key: string): void {
        this._steps.push(new PipelineKey(category, key));
    }

    public async run(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, steps?: string[], logInfo: boolean = true): Promise<number> {
        const pipeline: IPipelineStep[] = [];

        for (const pipelineStep of this._steps) {
            const exists = await this.tryLoad(uniteConfiguration, pipelineStep, undefined, false);

            if (exists) {
                pipeline.push(this.getStep(pipelineStep));
            } else {
                return 1;
            }
        }

        const pipelineAdd: IPipelineStep[] = [];
        const pipelineRemove: IPipelineStep[] = [];

        for (const pipelineStep of pipeline) {
            const condition = pipelineStep.mainCondition(uniteConfiguration, engineVariables);
            if (condition || condition === undefined) {
                pipelineAdd.push(pipelineStep);
            } else {
                pipelineRemove.push(pipelineStep);
            }

            if (!steps || steps.indexOf("initialise") >= 0) {
                try {
                    if ((condition || condition === undefined) && logInfo) {
                        this._logger.info("Initialising", { step: ObjectHelper.getClassName(pipelineStep) });
                    }
                    const ret = await pipelineStep.initialise(this._logger, this._fileSystem, uniteConfiguration, engineVariables, condition || condition === undefined);
                    if (ret !== 0) {
                        return ret;
                    }
                } catch (err) {
                    this._logger.error(`Exception initialising pipeline step '${ObjectHelper.getClassName(pipelineStep)}'`, err);
                    return 1;
                }
            }
        }

        if (!steps || steps.indexOf("unconfigure") >= 0) {
            for (const pipelineStep of pipelineRemove) {
                try {
                    const ret = await pipelineStep.configure(this._logger, this._fileSystem, uniteConfiguration, engineVariables, false);
                    if (ret !== 0) {
                        return ret;
                    }
                } catch (err) {
                    this._logger.error(`Exception unconfiguring pipeline step '${ObjectHelper.getClassName(pipelineStep)}'`, err);
                    return 1;
                }
            }
        }

        if (!steps || steps.indexOf("configure") >= 0) {
            for (const pipelineStep of pipelineAdd) {
                try {
                    if (logInfo) {
                        this._logger.info("Configuring", { step: ObjectHelper.getClassName(pipelineStep) });
                    }
                    const ret = await pipelineStep.configure(this._logger, this._fileSystem, uniteConfiguration, engineVariables, true);
                    if (ret !== 0) {
                        return ret;
                    }
                } catch (err) {
                    this._logger.error(`Exception installing pipeline step '${ObjectHelper.getClassName(pipelineStep)}'`, err);
                    return 1;
                }
            }
        }

        if (!steps || steps.indexOf("unfinalise") >= 0) {
            for (const pipelineStep of pipelineRemove) {
                try {
                    const ret = await pipelineStep.finalise(this._logger, this._fileSystem, uniteConfiguration, engineVariables, false);
                    if (ret !== 0) {
                        return ret;
                    }
                } catch (err) {
                    this._logger.error(`Exception unfinalising pipeline step '${ObjectHelper.getClassName(pipelineStep)}'`, err);
                    return 1;
                }
            }
        }

        if (!steps || steps.indexOf("finalise") >= 0) {
            for (const pipelineStep of pipelineAdd) {
                try {
                    if (logInfo) {
                        this._logger.info("Finalising", { step: ObjectHelper.getClassName(pipelineStep) });
                    }
                    const ret = await pipelineStep.finalise(this._logger, this._fileSystem, uniteConfiguration, engineVariables, true);
                    if (ret !== 0) {
                        return ret;
                    }
                } catch (err) {
                    this._logger.error(`Exception finalising pipeline step '${ObjectHelper.getClassName(pipelineStep)}'`, err);
                    return 1;
                }
            }
        }

        return 0;
    }

    public getStep<T extends IPipelineStep>(pipelineKey: PipelineKey): T {
        if (pipelineKey !== undefined && pipelineKey !== null &&
            pipelineKey.category !== undefined && pipelineKey.category !== null && pipelineKey.category.length > 0 &&
            pipelineKey.key !== undefined && pipelineKey.key !== null && pipelineKey.key.length > 0) {
            const combinedKey = pipelineKey.combined();
            if (this._loadedStepCache[combinedKey] === undefined) {
                const mappedName = this._moduleIdMap[combinedKey];
                if (mappedName !== undefined && this._loadedStepCache[mappedName] !== undefined) {
                    return <T>this._loadedStepCache[mappedName];
                }
            } else {
                return <T>this._loadedStepCache[combinedKey];
            }
        }

        return undefined;
    }

    public async tryLoad(uniteConfiguration: UniteConfiguration, pipelineKey: PipelineKey, configurationType?: string, defineProperty: boolean = true): Promise<boolean> {
        if (pipelineKey !== undefined && pipelineKey !== null &&
            pipelineKey.category !== undefined && pipelineKey.category !== null && pipelineKey.category.length > 0) {

            const moduleTypeId = pipelineKey.combined();
            let className = this._moduleIdMap[moduleTypeId];

            if (className === undefined) {
                const actualType = configurationType ? configurationType : pipelineKey.category;

                try {
                    const items = await PipelineLocator.getPipelineCategoryItems(this._fileSystem, this._engineRootFolder, pipelineKey.category);

                    if (pipelineKey.key === undefined || pipelineKey.key === null || pipelineKey.key.length === 0) {
                        this._logger.error(`--${actualType} should not be blank, possible options could be [${items.join(", ")}]`);
                        return false;
                    } else {
                        const moduleIdLower = pipelineKey.key.toLowerCase();
                        for (let i = 0; i < items.length; i++) {
                            if (items[i].toLowerCase() === moduleIdLower) {
                                const module = await PipelineLocator.loadItem(this._fileSystem,
                                                                              this._engineRootFolder,
                                                                              pipelineKey.category,
                                                                              items[i]);

                                className = Object.keys(module)[0];

                                const instance = Object.create(module[className].prototype);

                                if (defineProperty) {
                                    this._logger.info(actualType, { className });
                                    Object.defineProperty(uniteConfiguration, actualType, { value: className });
                                }

                                const moduleClassName = new PipelineKey(pipelineKey.category, className).combined();
                                this._loadedStepCache[moduleClassName] = new instance.constructor();
                                this._moduleIdMap[moduleTypeId] = moduleClassName;
                                return true;
                            }
                        }
                        this._logger.error(`Pipeline Step '${pipelineKey.key}' for arg --${actualType} could not be located, possible options could be [${items.join(", ")}]`);
                        return false;
                    }
                } catch (err) {
                    this._logger.error(`Pipeline Step '${pipelineKey.key}' for arg --${actualType} failed to load`, err);
                    return false;
                }
            } else {
                return true;
            }
        } else {
            this._logger.error(`Pipeline Step has an invalid key`, undefined, pipelineKey);
            return false;
        }
    }
}
