/**
 * Model of Unite Configuration (unite.json) file.
 */
import { UniteBuildConfiguration } from "./uniteBuildConfiguration";
import { UniteClientPackage } from "./uniteClientPackage";
import { UniteDirectories } from "./uniteDirectories";

export class UniteConfiguration {
    public uniteVersion: string;
    public packageName: string;
    public license: string;
    public applicationFramework: string;
    public moduleType: string;
    public bundler: string;
    public sourceLanguage: string;
    public linter: string;
    public unitTestRunner: string;
    public unitTestFramework: string;
    public unitTestEngine: string;
    public e2eTestRunner: string;
    public e2eTestFramework: string;
    public cssPre: string;
    public cssPost: string;
    public cssLinter: string;
    public documenter: string;
    public server: string;
    public taskManager: string;
    public packageManager: string;
    public ides: string[];

    public sourceExtensions: string[];
    public viewExtensions: string[];
    public styleExtension: string;

    public clientPackages: { [id: string]: UniteClientPackage };

    public dirs: UniteDirectories;

    public srcDistReplace: string;
    public srcDistReplaceWith: string;

    public buildConfigurations: { [id: string]: UniteBuildConfiguration };
    public platforms: { [id: string]: { [id: string]: any } };

    // This has moved to unite-theme.json, will be removed in a future build
    public title?: string;
}
