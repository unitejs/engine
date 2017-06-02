/**
 * Model of Unite Configuration (unite.json) file.
 */
import { UniteModuleLoader } from "./uniteModuleLoader";
import { UniteSourceLanguage } from "./uniteSourceLanguage";
import { UniteUnitTestFramework } from "./uniteUnitTestFramework";
import { UniteUnitTestRunner } from "./uniteUnitTestRunner";

export class UniteConfiguration {
    public packageName: string;
    public title: string;
    public sourceLanguage: UniteSourceLanguage;
    public moduleLoader: UniteModuleLoader;
    public unitTestRunner: UniteUnitTestRunner;
    public unitTestFramework: UniteUnitTestFramework;
    public sourceMaps: boolean;
    public outputDirectory: string;

    public staticClientModules: string[];
}