/**
 * Variables used by the engine.
 */
import { ISpdxLicense } from "../configuration/models/spdx/ISpdxLicense";
import { IPackageManager } from "../interfaces/IPackageManager";
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
    html: {
        head: string[];
        body: string[];
    };
    packageManager: IPackageManager;
    private _requiredDevDependencies;
    private _removedDevDependencies;
    private _requiredDependencies;
    private _removedDependencies;
    constructor();
    toggleDependencies(dependencies: string[], required: boolean, isDev: boolean): void;
    optimiseDependencies(): void;
    buildDependencies(dependencies: {
        [id: string]: string;
    }, peerDependencies: {
        [id: string]: string;
    }, isDev: boolean): void;
}
