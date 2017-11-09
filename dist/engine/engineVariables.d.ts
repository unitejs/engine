/**
 * Variables used by the engine.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { UniteClientPackage } from "../configuration/models/unite/uniteClientPackage";
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { IPackageManager } from "../interfaces/IPackageManager";
import { EngineVariablesMeta } from "./engineVariablesMeta";
export declare class EngineVariables {
    meta: EngineVariablesMeta;
    force: boolean;
    engineRootFolder: string;
    engineAssetsFolder: string;
    engineVersion: string;
    engineDependencies: {
        [id: string]: string;
    };
    rootFolder: string;
    wwwRootFolder: string;
    packagedRootFolder: string;
    platformRootFolder: string;
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
        configurationFolder: string;
        assetsFolder: string;
        assetsSrcFolder: string;
    };
    buildTranspileInclude: string[];
    buildTranspilePreBuild: string[];
    buildTranspilePostBuild: string[];
    syntheticImport: string;
    moduleId: string;
    packageManager: IPackageManager;
    additionalCompletionMessages: string[];
    private _configuration;
    private _requiredDevDependencies;
    private _removedDevDependencies;
    private _requiredClientPackages;
    private _removedClientPackages;
    private _existingClientPackages;
    constructor();
    setConfiguration(name: string, config: any): void;
    getConfiguration<T>(name: string): T;
    setupDirectories(fileSystem: IFileSystem, rootFolder: string): void;
    initialisePackages(clientPackages: {
        [id: string]: UniteClientPackage;
    }): void;
    toggleClientPackage(key: string, clientPackage: UniteClientPackage, required: boolean): void;
    addClientPackage(key: string, clientPackage: UniteClientPackage): void;
    removeClientPackage(key: string, clientPackage: UniteClientPackage): void;
    toggleDevDependency(dependencies: string[], required: boolean): void;
    addDevDependency(dependencies: string[]): void;
    removeDevDependency(dependencies: string[]): void;
    buildDependencies(uniteConfiguration: UniteConfiguration, packageJsonDependencies: {
        [id: string]: string;
    }): void;
    buildDevDependencies(packageJsonDevDependencies: {
        [id: string]: string;
    }): void;
    findDependencyVersion(requiredDependency: string): string;
}
