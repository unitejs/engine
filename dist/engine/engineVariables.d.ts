/**
 * Variables used by the engine.
 */
import { PackageConfiguration } from "../configuration/models/packages/packageConfiguration";
import { ISpdxLicense } from "../configuration/models/spdx/ISpdxLicense";
import { IPackageManager } from "../interfaces/IPackageManager";
import { EngineVariablesHtml } from "./engineVariablesHtml";
export declare class EngineVariables {
    coreFolder: string;
    rootFolder: string;
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
    gulpBuildFolder: string;
    gulpTasksFolder: string;
    gulpUtilFolder: string;
    assetsDirectory: string;
    sourceLanguageExt: string;
    styleLanguageExt: string;
    gitIgnore: string[];
    license: ISpdxLicense;
    htmlNoBundle: EngineVariablesHtml;
    htmlBundle: EngineVariablesHtml;
    packageManager: IPackageManager;
    corePackageJson: PackageConfiguration;
    private _requiredDevDependencies;
    private _removedDevDependencies;
    private _requiredDependencies;
    private _removedDependencies;
    constructor();
    toggleDependencies(dependencies: string[], required: boolean, isDev: boolean): void;
    optimiseDependencies(): void;
    buildDependencies(dependencies: {
        [id: string]: string;
    }, isDev: boolean): void;
    findDependencyVersion(requiredDependency: string): string;
}
