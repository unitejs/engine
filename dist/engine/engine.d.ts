import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { IncludeMode } from "../configuration/models/unite/includeMode";
import { ScriptIncludeMode } from "../configuration/models/unite/scriptIncludeMode";
import { BuildConfigurationOperation } from "../interfaces/buildConfigurationOperation";
import { IEngine } from "../interfaces/IEngine";
import { ModuleOperation } from "../interfaces/moduleOperation";
import { PlatformOperation } from "../interfaces/platformOperation";
export declare class Engine implements IEngine {
    private _logger;
    private _fileSystem;
    private _engineRootFolder;
    private _engineAssetsFolder;
    private _moduleIdMap;
    private _pipelineStepCache;
    constructor(logger: ILogger, fileSystem: IFileSystem);
    configure(packageName: string | undefined | null, title: string | undefined | null, license: string | undefined | null, sourceLanguage: string | undefined | null, moduleType: string | undefined | null, bundler: string | undefined | null, unitTestRunner: string | undefined | null, unitTestFramework: string | undefined | null, unitTestEngine: string | undefined | null, e2eTestRunner: string | undefined | null, e2eTestFramework: string | undefined | null, linter: string | undefined | null, cssPre: string | undefined | null, cssPost: string | undefined | null, packageManager: string | undefined | null, applicationFramework: string | undefined | null, force: boolean | undefined | null, outputDirectory: string | undefined | null): Promise<number>;
    clientPackage(operation: ModuleOperation | undefined | null, packageName: string | undefined | null, version: string | undefined | null, preload: boolean | undefined, includeMode: IncludeMode | undefined | null, scriptIncludeMode: ScriptIncludeMode | undefined | null, main: string | undefined | null, mainMinified: string | undefined | null, testingAdditions: string | undefined | null, isPackage: boolean | undefined, assets: string | undefined | null, map: string | undefined | null, loaders: string | undefined | null, packageManager: string | undefined | null, outputDirectory: string | undefined | null): Promise<number>;
    buildConfiguration(operation: BuildConfigurationOperation | undefined | null, configurationName: string | undefined | null, bundle: boolean | undefined, minify: boolean | undefined, sourcemaps: boolean | undefined, outputDirectory: string | undefined | null): Promise<number>;
    platform(operation: PlatformOperation | undefined | null, platformName: string | undefined | null, outputDirectory: string | undefined | null): Promise<number>;
    private cleanupOutputDirectory(outputDirectory);
    private loadConfiguration(outputDirectory, force);
    private configureRun(outputDirectory, uniteConfiguration, license, force);
    private clientPackageAdd(packageName, version, preload, includeMode, scriptIncludeMode, main, mainMinified, testingAdditions, isPackage, assets, map, loaders, outputDirectory, uniteConfiguration);
    private clientPackageRemove(packageName, outputDirectory, uniteConfiguration);
    private buildConfigurationAdd(configurationName, bundle, minify, sourcemaps, outputDirectory, uniteConfiguration);
    private buildConfigurationRemove(configurationName, outputDirectory, uniteConfiguration);
    private platformAdd(platformName, outputDirectory, uniteConfiguration);
    private platformRemove(platformName, outputDirectory, uniteConfiguration);
    private createEngineVariables(outputDirectory, packageManager, engineVariables);
    private runPipeline(pipelineSteps, uniteConfiguration, engineVariables);
    private getPipelineStep<T>(moduleType, moduleId);
    private tryLoadPipelineStep(uniteConfiguration, moduleType, moduleId, configurationType?, defineProperty?);
    private mapParser(input);
}
