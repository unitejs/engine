/**
 * Model of Unite Configuration (unite.json) file.
 */
import { IncludeMode } from "./includeMode";
import { UniteDirectories } from "./uniteDirectories";
import { UniteLinter } from "./uniteLinter";
import { UniteModuleLoader } from "./uniteModuleLoader";
import { UnitePackageManager } from "./unitePackageManager";
import { UniteSourceLanguage } from "./uniteSourceLanguage";
import { UniteUnitTestFramework } from "./uniteUnitTestFramework";
import { UniteUnitTestRunner } from "./uniteUnitTestRunner";
export declare class UniteConfiguration {
    packageName: string;
    title: string;
    license: string;
    sourceLanguage: UniteSourceLanguage;
    moduleLoader: UniteModuleLoader;
    linter: UniteLinter;
    packageManager: UnitePackageManager;
    unitTestRunner: UniteUnitTestRunner;
    unitTestFramework: UniteUnitTestFramework;
    staticClientModules: string[];
    clientPackages: {
        [id: string]: {
            version: string;
            preload: boolean;
            main: string;
            includeMode: IncludeMode;
        };
    };
    directories: UniteDirectories;
    srcDistReplace: string;
    srcDistReplaceWith: string;
}
