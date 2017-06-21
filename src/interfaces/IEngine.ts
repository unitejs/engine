/**
 * Interface for main engine.
 */
export interface IEngine {
    init(packageName: string | undefined | null,
         title: string | undefined | null,
         license: string | undefined | null,
         sourceLanguage: string | undefined | null,
         moduleLoader: string | undefined | null,
         unitTestRunner: string | undefined | null,
         unitTestFramework: string | undefined | null,
         linter: string | undefined | null,
         packageManager: string | undefined | null,
         outputDirectory: string | undefined | null): Promise<number>;

    clientPackage(operation: string | undefined | null,
                  packageName: string | undefined | null,
                  version: string | undefined | null,
                  preload: boolean,
                  includeMode: string | undefined | null,
                  packageManager: string | undefined | null,
                  outputDirectory: string | undefined | null): Promise<number>;
}