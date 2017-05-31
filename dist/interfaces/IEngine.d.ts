/**
 * Interface for main engine.
 */
export interface IEngine {
    init(packageName: string | undefined | null, title: string | undefined | null, sourceLanguage: string | undefined | null, moduleLoader: string | undefined | null, sourceMaps: boolean, outputDirectory: string | undefined | null): Promise<number>;
    module(operation: string | undefined | null, name: string | undefined | null): Promise<number>;
}
