/**
 * Model of Unite Configuration (unite.json) file.
 */
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
    sourceMaps: boolean;
    outputDirectory: string;
    staticClientModules: string[];
}
