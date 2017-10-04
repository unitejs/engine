import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { IPipelineStep } from "../interfaces/IPipelineStep";
import { EngineVariables } from "./engineVariables";
import { PipelineKey } from "./pipelineKey";
export declare class Pipeline {
    private _logger;
    private _fileSystem;
    private _pipelineStepFolder;
    private _steps;
    private _moduleIdMap;
    private _loadedStepCache;
    constructor(logger: ILogger, fileSystem: IFileSystem, pipelineStepFolder: string);
    add(category: string, key: string): void;
    run(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, steps?: string[], logInfo?: boolean): Promise<number>;
    getStep<T extends IPipelineStep>(pipelineKey: PipelineKey): T;
    tryLoad(uniteConfiguration: UniteConfiguration, pipelineKey: PipelineKey, configurationType?: string, defineProperty?: boolean): Promise<boolean>;
}
