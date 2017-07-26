/**
 * Model of ESLint Configuration (.eslintrc.json) file.
 */
import { EsLintParserOptions } from "./esLintParserOptions";

export class EsLintConfiguration {
    public parserOptions: EsLintParserOptions;
    public extends: string[];
    public env: { [id: string ]: boolean};
    public globals: { [id: string ]: boolean};
    public rules: { [id: string]: any };
    public plugins: string[];
}