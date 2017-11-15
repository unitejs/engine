/**
 * Model of StyleLint Configuration (.stylelintrc.json) file.
 */

export class StyleLintConfiguration {
    public extends: string;
    public rules: { [id: string]: any };
}
