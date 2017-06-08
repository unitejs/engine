/**
 * Variables used by the engine.
 */
export class EngineVariables {
    public rootFolder: string;
    public sourceFolder: string;
    public distFolder: string;
    public unitTestFolder: string;
    public unitTestSrcFolder: string;
    public unitTestDistFolder: string;
    public e2eTestSrcFolder: string;
    public e2eTestDistFolder: string;
    public reportsFolder: string;

    public gulpBuildFolder: string;
    public gulpTasksFolder: string;
    public gulpUtilFolder: string;

    public assetsDirectory: string;
    public dependenciesFile: string;

    public requiredDependencies: string[];
    public requiredDevDependencies: string[];

    public sourceLanguageExt: string;

    public gitIgnore: string[];
}
