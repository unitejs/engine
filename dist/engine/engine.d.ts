/**
 * Main engine
 */
import { IncludeMode } from "../configuration/models/unite/includeMode";
import { UniteModuleLoader } from "../configuration/models/unite/uniteModuleLoader";
import { UniteSourceLanguage } from "../configuration/models/unite/uniteSourceLanguage";
import { UniteUnitTestFramework } from "../configuration/models/unite/uniteUnitTestFramework";
import { UniteUnitTestRunner } from "../configuration/models/unite/uniteUnitTestRunner";
import { IDisplay } from "../interfaces/IDisplay";
import { IEngine } from "../interfaces/IEngine";
import { IFileSystem } from "../interfaces/IFileSystem";
import { ILogger } from "../interfaces/ILogger";
import { IPackageManager } from "../interfaces/IPackageManager";
import { ModuleOperation } from "../interfaces/moduleOperation";
export declare class Engine implements IEngine {
    private _logger;
    private _display;
    private _fileSystem;
    private _engineScriptLocation;
    private _packageManager;
    constructor(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, packageManager: IPackageManager, engineScriptLocation: string);
    init(packageName: string | undefined | null, title: string | undefined | null, sourceLanguage: UniteSourceLanguage | undefined | null, moduleLoader: UniteModuleLoader | undefined | null, unitTestRunner: UniteUnitTestRunner | undefined | null, unitTestFramework: UniteUnitTestFramework | undefined | null, outputDirectory: string | undefined | null): Promise<number>;
    clientPackage(operation: ModuleOperation | undefined | null, packageName: string | undefined | null, version: string | undefined | null, preload: boolean, includeMode: IncludeMode | undefined | null, outputDirectory: string | undefined | null): Promise<number>;
    private cleanupOutputDirectory(outputDirectory);
    private loadConfiguration(outputDirectory);
    private initRun(outputDirectory, uniteConfiguration);
    private clientPackageAdd(packageName, version, preload, includeMode, outputDirectory, uniteConfiguration);
    private clientPackageRemove(packageName, outputDirectory, uniteConfiguration);
    private createEngineVariables(outputDirectory, uniteConfiguration);
    private runPipeline(pipelineSteps, uniteConfiguration, engineVariables);
}
