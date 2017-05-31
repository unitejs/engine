/**
 * Model of Unite Configuration (unite.json) file.
 */
import { UniteModuleLoader } from "./uniteModuleLoader";
import { UniteSourceLanguage } from "./uniteSourceLanguage";
export declare class UniteConfiguration {
    packageName: string;
    title: string;
    sourceLanguage: UniteSourceLanguage;
    moduleLoader: UniteModuleLoader;
    outputDirectory: string;
    staticClientModules: string[];
}
