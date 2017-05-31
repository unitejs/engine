/**
 * Model of Unite Configuration (unite.json) file.
 */
export class UniteConfiguration {
    public packageName: string;
    public title: string;
    public sourceLanguage: string;
    public moduleLoader: string;
    public outputDirectory: string;

    public staticClientModules: string[];
}