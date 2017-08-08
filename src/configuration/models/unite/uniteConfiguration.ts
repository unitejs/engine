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
import { UniteUnitTestFramework } from "./uniteUnitTestFramework";
import { UniteUnitTestRunner } from "./uniteUnitTestRunner";

export class UniteConfiguration {
    public uniteVersion: string;
    public packageName: string;
    public title: string;
    public license: string;
    public sourceLanguage: UniteSourceLanguage;
    public moduleType: UniteModuleType;
    public bundler: UniteBundler;
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

    public clientPackages: { [id: string]: UniteClientPackage };

    public dirs: UniteDirectories;

    public srcDistReplace: string;
    public srcDistReplaceWith: string;

    public buildConfigurations: { [id: string]: UniteBuildConfiguration };
    public platforms: { [id: string]: { [id: string]: any } };
}
