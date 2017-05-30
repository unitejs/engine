/**
 * Variables used by the engine.
 */
import { UniteLanguage } from "../configuration/models/unite/uniteLanguage";
import { UniteModuleLoader } from "../configuration/models/unite/uniteModuleLoader";

export class EngineVariables {
    public appSourceFolder: string;

    public gulpBuildFolder: string;
    public gulpTasksFolder: string;
    public gulpUtilFolder: string;

    public uniteLanguage: UniteLanguage;
    public uniteModuleLoader: UniteModuleLoader;
}
