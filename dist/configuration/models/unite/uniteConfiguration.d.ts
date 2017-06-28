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
export declare class UniteConfiguration {
    packageName: string;
    title: string;
    license: string;
    sourceLanguage: UniteSourceLanguage;
    moduleLoader: UniteModuleLoader;
    linter: UniteLinter;
    packageManager: UnitePackageManager;
    taskManager: UniteTaskManager;
    unitTestRunner: UniteUnitTestRunner;
    unitTestFramework: UniteUnitTestFramework;
    e2eTestRunner: UniteE2eTestRunner;
    e2eTestFramework: UniteE2eTestFramework;
    server: UniteServer;
    applicationFramework: UniteApplicationFramework;
    cssPre: UniteCssPreProcessor;
    cssPost: UniteCssPostProcessor;
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
