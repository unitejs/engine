/**
 * Model of Unite Configuration (unite.json) file.
 */
import { UniteBuildConfiguration } from "./uniteBuildConfiguration";
import { UniteClientPackage } from "./uniteClientPackage";
import { UniteDirectories } from "./uniteDirectories";
export declare class UniteConfiguration {
    uniteVersion: string;
    packageName: string;
    title: string;
    license: string;
    sourceLanguage: string;
    moduleType: string;
    bundler: string;
    linter: string;
    packageManager: string;
    taskManager: string;
    unitTestRunner: string;
    unitTestFramework: string;
    unitTestEngine: string;
    e2eTestRunner: string;
    e2eTestFramework: string;
    server: string;
    applicationFramework: string;
    cssPre: string;
    cssPost: string;
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
