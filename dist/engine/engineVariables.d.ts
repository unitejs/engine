/**
 * Variables used by the engine.
 */
import { ISpdxLicense } from "../configuration/models/spdx/ISpdxLicense";
import { IPackageManager } from "../interfaces/IPackageManager";
export declare class EngineVariables {
    coreFolder: string;
    rootFolder: string;
    sourceFolder: string;
    distFolder: string;
    unitTestFolder: string;
    unitTestSrcFolder: string;
    unitTestDistFolder: string;
    e2eTestSrcFolder: string;
    e2eTestDistFolder: string;
    reportsFolder: string;
    packageFolder: string;
    gulpBuildFolder: string;
    gulpTasksFolder: string;
    gulpUtilFolder: string;
    assetsDirectory: string;
    requiredDependencies: string[];
    requiredDevDependencies: string[];
    sourceLanguageExt: string;
    gitIgnore: string[];
    license: ISpdxLicense;
    html: {
        head: string[];
        body: string[];
    };
    packageManager: IPackageManager;
}
