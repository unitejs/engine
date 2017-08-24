/**
 * Interface for main engine.
 */
export interface IEngine {
    configure(packageName: string | undefined | null, title: string | undefined | null, license: string | undefined | null, sourceLanguage: string | undefined | null, moduleType: string | undefined | null, bundler: string | undefined | null, unitTestRunner: string | undefined | null, unitTestFramework: string | undefined | null, e2eTestRunner: string | undefined | null, e2eTestFramework: string | undefined | null, linter: string | undefined | null, cssPre: string | undefined | null, cssPost: string | undefined | null, packageManager: string | undefined | null, applicationFramework: string | undefined | null, outputDirectory: string | undefined | null): Promise<number>;
    clientPackage(operation: string | undefined | null, packageName: string | undefined | null, version: string | undefined | null, preload: boolean | undefined, includeMode: string | undefined | null, scriptInclude: boolean | undefined, main: string | undefined | null, mainMinified: string | undefined | null, isPackage: boolean | undefined, assets: string | undefined | null, packageManager: string | undefined | null, outputDirectory: string | undefined | null): Promise<number>;
    buildConfiguration(operation: string | undefined | null, configurationName: string | undefined | null, bundle: boolean | undefined, minify: boolean | undefined, sourcemaps: boolean | undefined, outputDirectory: string | undefined | null): Promise<number>;
    platform(operation: string | undefined | null, platformName: string | undefined | null, outputDirectory: string | undefined | null): Promise<number>;
}
