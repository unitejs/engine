/**
 * Variables used by the engine.
 */
import { UniteModuleLoader } from "../configuration/models/unite/uniteModuleLoader";
import { UniteSourceLanguage } from "../configuration/models/unite/uniteSourceLanguage";
export declare class EngineVariables {
    appSourceFolder: string;
    gulpBuildFolder: string;
    gulpTasksFolder: string;
    gulpUtilFolder: string;
    assetsDirectory: string;
    dependenciesFile: string;
    requiredDependencies: string[];
    requiredDevDependencies: string[];
    uniteSourceLanguage: UniteSourceLanguage;
    uniteModuleLoader: UniteModuleLoader;
}
