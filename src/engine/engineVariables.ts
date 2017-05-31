/**
 * Variables used by the engine.
 */
import { UniteModuleLoader } from "../configuration/models/unite/uniteModuleLoader";
import { UniteSourceLanguage } from "../configuration/models/unite/uniteSourceLanguage";

export class EngineVariables {
    public appSourceFolder: string;

    public gulpBuildFolder: string;
    public gulpTasksFolder: string;
    public gulpUtilFolder: string;

    public assetsDirectory: string;
    public dependenciesFile: string;

    public requiredDependencies: string[];
    public requiredDevDependencies: string[];

    public uniteSourceLanguage: UniteSourceLanguage;
    public uniteModuleLoader: UniteModuleLoader;
}
