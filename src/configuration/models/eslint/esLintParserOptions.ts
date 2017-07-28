/**
 * Model of ESLint Configuration Parser Options (.eslintrc.json) file.
 */

export class EsLintParserOptions {
    public ecmaVersion: number;
    public sourceType: string;
    public ecmaFeatures: { [id: string]: any };
}
