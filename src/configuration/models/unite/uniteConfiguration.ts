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

    public staticClientModules: string[];

    public clientPackages: { [id: string]: { version: string, preload: boolean } };

    public directories: UniteDirectories;

    public srcDistReplace: string;
    public srcDistReplaceWith: string;

    public testAppPreprocessors: string[];
    public testUnitPreprocessors: string[];
    public testFrameworks: string[];
    public testPaths: { [id: string]: string };
    public testIncludes: { pattern: string, included: boolean}[];
}