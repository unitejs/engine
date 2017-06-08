/**
 * Model of Unite Configuration (unite.json) file.
 */
import { UniteDirectories } from "./uniteDirectories";
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
    public outputDirectory: string;

    public staticClientModules: string[];

    public directories: UniteDirectories;

    public srcDistReplace: string;
    public srcDistReplaceWith: string;

    public testFrameworks: string[];
    public testPaths: { [id: string]: string };
    public testIncludes: { pattern: string, included: boolean}[];
}