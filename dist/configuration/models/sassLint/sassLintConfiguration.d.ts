/**
 * Model of SassLint Configuration (.sasslintrc) file.
 */
export declare class SassLintConfiguration {
    options?: {
        formatter?: string;
        "merge-default-rules"?: boolean;
    };
    rules: {
        [id: string]: any;
    };
}
