/**
 * Model of Unite Configuration (unite.json) file.
 */
export class UniteConfiguration {
    public name: string;
    public language: string;
    public moduleLoader: string;
    public outputDirectory: string;

    public dependencies: { [id: string]: string };
    public devDependencies: { [id: string]: string };
}