/**
 * Interface for main engine.
 */
export interface IEngine {
    init(args: {
        [id: string]: string | null;
    }): number;
}
