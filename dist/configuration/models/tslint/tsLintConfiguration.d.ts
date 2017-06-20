/**
 * Model of TSLint Configuration (tslint.json) file.
 */
export declare class TsLintConfiguration {
    extends: string;
    rulesDirectory: string[];
    rules: {
        [id: string]: any;
    };
}
