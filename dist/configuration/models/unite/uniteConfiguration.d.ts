/**
 * Model of Unite Configuration (unite.json) file.
 */
import { UniteApplicationFramework } from "./uniteApplicationFramework";
import { UniteBuildConfiguration } from "./uniteBuildConfiguration";
import { UniteBundler } from "./uniteBundler";
import { UniteClientPackage } from "./uniteClientPackage";
import { UniteCssPostProcessor } from "./uniteCssPostProcessor";
import { UniteCssPreProcessor } from "./uniteCssPreProcessor";
import { UniteDirectories } from "./uniteDirectories";
import { UniteE2eTestFramework } from "./uniteE2eTestFramework";
import { UniteE2eTestRunner } from "./uniteE2eTestRunner";
import { UniteLinter } from "./uniteLinter";
import { UniteModuleType } from "./uniteModuleType";
import { UnitePackageManager } from "./unitePackageManager";
import { UniteServer } from "./uniteServer";
import { UniteSourceLanguage } from "./uniteSourceLanguage";
import { UniteTaskManager } from "./uniteTaskManager";
import { UniteUnitTestEngine } from "./uniteUnitTestEngine";
import { UniteUnitTestFramework } from "./uniteUnitTestFramework";
import { UniteUnitTestRunner } from "./uniteUnitTestRunner";
export declare class UniteConfiguration {
    uniteVersion: string;
    packageName: string;
    title: string;
    license: string;
    sourceLanguage: UniteSourceLanguage;
    moduleType: UniteModuleType;
    bundler: UniteBundler;
    linter: UniteLinter;
    packageManager: UnitePackageManager;
    taskManager: UniteTaskManager;
    unitTestRunner: UniteUnitTestRunner;
    unitTestFramework: UniteUnitTestFramework;
    unitTestEngine: UniteUnitTestEngine;
    e2eTestRunner: UniteE2eTestRunner;
    e2eTestFramework: UniteE2eTestFramework;
    server: UniteServer;
    applicationFramework: UniteApplicationFramework;
    cssPre: UniteCssPreProcessor;
    cssPost: UniteCssPostProcessor;
    clientPackages: {
        [id: string]: UniteClientPackage;
    };
    dirs: UniteDirectories;
    srcDistReplace: string;
    srcDistReplaceWith: string;
    buildConfigurations: {
        [id: string]: UniteBuildConfiguration;
    };
    platforms: {
        [id: string]: {
            [id: string]: any;
        };
    };
}
