/**
 * Model of SassLint Configuration (.sasslintrc) file.
 */

export class SassLintConfiguration {
    public options?: {
        formatter?: string;
        "merge-default-rules"?: boolean;
    };
    public rules: { [id: string]: any };
}
