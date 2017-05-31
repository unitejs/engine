/**
 * Model of Unite Configuration (unite.json) file.
 */
import { UniteModuleLoader } from "./uniteModuleLoader";
import { UniteSourceLanguage } from "./uniteSourceLanguage";

export class UniteConfiguration {
    public packageName: string;
    public title: string;
    public sourceLanguage: UniteSourceLanguage;
    public moduleLoader: UniteModuleLoader;
    public outputDirectory: string;

    public staticClientModules: string[];
}