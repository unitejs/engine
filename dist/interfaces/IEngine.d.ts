/**
 * Interface for main engine.
 */
export interface IEngine {
    init(packageName: string | undefined | null, language: string | undefined | null, moduleLoader: string | undefined | null, outputDirectory: string | undefined | null): Promise<number>;
}
