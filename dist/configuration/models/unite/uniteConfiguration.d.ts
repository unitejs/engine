/**
 * Model of Unite Configuration (unite.json) file.
 */
export declare class UniteConfiguration {
    name: string;
    language: string;
    moduleLoader: string;
    outputDirectory: string;
    dependencies: {
        [id: string]: string;
    };
    devDependencies: {
        [id: string]: string;
    };
}
