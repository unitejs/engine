/**
 * Variables used by the engine.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { PackageConfiguration } from "../configuration/models/packages/packageConfiguration";
import { ISpdxLicense } from "../configuration/models/spdx/ISpdxLicense";
import { IncludeMode } from "../configuration/models/unite/includeMode";
import { ScriptIncludeMode } from "../configuration/models/unite/scriptIncludeMode";
import { UniteClientPackage } from "../configuration/models/unite/uniteClientPackage";
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { IPackageManager } from "../interfaces/IPackageManager";
export declare class EngineVariables {
    force: boolean;
    engineRootFolder: string;
    engineAssetsFolder: string;
    enginePackageJson: PackageConfiguration;
    rootFolder: string;
    wwwRootFolder: string;
    packagedRootFolder: string;
    www: {
        srcFolder: string;
        distFolder: string;
        unitTestFolder: string;
        unitTestSrcFolder: string;
        unitTestDistFolder: string;
        cssSrcFolder: string;
        cssDistFolder: string;
        e2eTestFolder: string;
        e2eTestSrcFolder: string;
        e2eTestDistFolder: string;
        reportsFolder: string;
        packageFolder: string;
        buildFolder: string;
        assetsFolder: string;
        assetsSrcFolder: string;
    };
    license: ISpdxLicense;
    packageManager: IPackageManager;
    private _configuration;
    private _requiredDevDependencies;
    private _removedDevDependencies;
    private _requiredClientPackages;
    private _removedClientPackages;
    constructor();
    setConfiguration(name: string, config: any): void;
    getConfiguration<T>(name: string): T;
    setupDirectories(fileSystem: IFileSystem, rootFolder: string): void;
    initialisePackages(clientPackages: {
        [id: string]: UniteClientPackage;
    }): void;
    toggleClientPackage(name: string, main: string, mainMinified: string, testingAdditions: {
        [id: string]: string;
    }, preload: boolean, includeMode: IncludeMode, scriptIncludeMode: ScriptIncludeMode, isPackage: boolean, assets: string, map: {
        [id: string]: string;
    }, loaders: {
        [id: string]: string;
    }, isModuleLoader: boolean, required: boolean): void;
    toggleDevDependency(dependencies: string[], required: boolean): void;
    buildDependencies(uniteConfiguration: UniteConfiguration, packageJsonDependencies: {
        [id: string]: string;
    }): void;
    buildDevDependencies(packageJsonDevDependencies: {
        [id: string]: string;
    }): void;
    findDependencyVersion(requiredDependency: string): string;
}
