/**
 * Model of TSLint Configuration (tslint.json) file.
 */

export class TsLintConfiguration {
    public extends: string;
    public rulesDirectory: string[];
    public rules: { [id: string]: any };
}