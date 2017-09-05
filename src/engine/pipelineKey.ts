/**
 * Class for pipeline key
 */
export class PipelineKey {
    public category: string;
    public key: string;

    constructor(category: string, key: string) {
        this.category = category;
        this.key = key;
    }

    public combined(): string {
        return `${this.category}/${this.key}`;
    }

    public matches(match: PipelineKey): boolean {
        return this.category === match.category && this.key === match.key;
    }
}
