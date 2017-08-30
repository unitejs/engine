/**
 * Model of Unite Configuration (unite.json) file.
 */
import { UniteBuildConfiguration } from "./uniteBuildConfiguration";
import { UniteClientPackage } from "./uniteClientPackage";
import { UniteDirectories } from "./uniteDirectories";

export class UniteConfiguration {
    public uniteVersion: string;
    public packageName: string;
    public title: string;
    public license: string;
    public sourceLanguage: string;
    public moduleType: string;
    public bundler: string;
    public linter: string;
    public packageManager: string;
    public taskManager: string;
    public unitTestRunner: string;
    public unitTestFramework: string;
    public unitTestEngine: string;
    public e2eTestRunner: string;
    public e2eTestFramework: string;
    public server: string;
    public applicationFramework: string;
    public cssPre: string;
    public cssPost: string;

    public clientPackages: { [id: string]: UniteClientPackage };

    public dirs: UniteDirectories;

    public srcDistReplace: string;
    public srcDistReplaceWith: string;

    public buildConfigurations: { [id: string]: UniteBuildConfiguration };
    public platforms: { [id: string]: { [id: string]: any } };
}
