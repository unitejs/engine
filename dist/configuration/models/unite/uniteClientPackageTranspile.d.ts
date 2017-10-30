/**
 * Model of Unite Configuration (unite.json) tranpile options.
 */
export declare class UniteClientPackageTranspile {
    alias: string;
    sources?: string[];
    language?: string;
    modules?: string[];
    stripExt?: boolean;
    transforms?: {
        [id: string]: string;
    };
}
