/**
 * Interface for main engine.
 */
export interface IEngine {
    init(packageName: string | undefined | null, title: string | undefined | null, sourceLanguage: string | undefined | null, moduleLoader: string | undefined | null, outputDirectory: string | undefined | null): Promise<number>;
}
