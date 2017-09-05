/**
 * Class for pipeline key
 */
export declare class PipelineKey {
    category: string;
    key: string;
    constructor(category: string, key: string);
    combined(): string;
    matches(match: PipelineKey): boolean;
}
