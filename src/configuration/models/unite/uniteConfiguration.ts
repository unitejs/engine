/**
 * Model of Unite Configuration (unite.json) file.
 */
import { IncludeMode } from "./includeMode";
import { UniteApplicationFramework } from "./uniteApplicationFramework";
import { UniteCssPostProcessor } from "./uniteCssPostProcessor";
import { UniteCssPreProcessor } from "./uniteCssPreProcessor";
import { UniteDirectories } from "./uniteDirectories";
import { UniteE2eTestFramework } from "./uniteE2eTestFramework";
import { UniteE2eTestRunner } from "./uniteE2eTestRunner";
import { UniteLinter } from "./uniteLinter";
import { UniteModuleLoader } from "./uniteModuleLoader";
import { UnitePackageManager } from "./unitePackageManager";
import { UniteServer } from "./uniteServer";
import { UniteSourceLanguage } from "./uniteSourceLanguage";
import { UniteTaskManager } from "./uniteTaskManager";
import { UniteUnitTestFramework } from "./uniteUnitTestFramework";
import { UniteUnitTestRunner } from "./uniteUnitTestRunner";

export class UniteConfiguration {
    public packageName: string;
    public title: string;
    public license: string;
    public sourceLanguage: UniteSourceLanguage;
    public moduleLoader: UniteModuleLoader;
    public linter: UniteLinter;
    public packageManager: UnitePackageManager;
    public taskManager: UniteTaskManager;
    public unitTestRunner: UniteUnitTestRunner;
    public unitTestFramework: UniteUnitTestFramework;
    public e2eTestRunner: UniteE2eTestRunner;
    public e2eTestFramework: UniteE2eTestFramework;
    public server: UniteServer;
    public applicationFramework: UniteApplicationFramework;
    public cssPre: UniteCssPreProcessor;
    public cssPost: UniteCssPostProcessor;

    public staticClientModules: string[];

    public clientPackages: { [id: string]: { version: string, preload: boolean, main: string, includeMode: IncludeMode } };

    public directories: UniteDirectories;

    public srcDistReplace: string;
    public srcDistReplaceWith: string;
}