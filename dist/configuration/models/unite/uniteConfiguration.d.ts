/**
 * Model of Unite Configuration (unite.json) file.
 */
import { UniteDirectories } from "./uniteDirectories";
import { UniteModuleLoader } from "./uniteModuleLoader";
import { UniteSourceLanguage } from "./uniteSourceLanguage";
import { UniteUnitTestFramework } from "./uniteUnitTestFramework";
import { UniteUnitTestRunner } from "./uniteUnitTestRunner";
export declare class UniteConfiguration {
    packageName: string;
    title: string;
    sourceLanguage: UniteSourceLanguage;
    moduleLoader: UniteModuleLoader;
    unitTestRunner: UniteUnitTestRunner;
    unitTestFramework: UniteUnitTestFramework;
    staticClientModules: string[];
    clientPackages: {
        [id: string]: {
            version: string;
            preload: boolean;
        };
    };
    directories: UniteDirectories;
    srcDistReplace: string;
    srcDistReplaceWith: string;
    testFrameworks: string[];
    testPaths: {
        [id: string]: string;
    };
    testIncludes: {
        pattern: string;
        included: boolean;
    }[];
}
