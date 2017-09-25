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
    applicationFramework: string;
    moduleType: string;
    bundler: string;
    sourceLanguage: string;
    linter: string;
    unitTestRunner: string;
    unitTestFramework: string;
    unitTestEngine: string;
    e2eTestRunner: string;
    e2eTestFramework: string;
    cssPre: string;
    cssPost: string;
    server: string;
    taskManager: string;
    packageManager: string;
    ides: string[];
    sourceExtensions: string[];
    viewExtensions: string[];
    styleExtension: string;
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
