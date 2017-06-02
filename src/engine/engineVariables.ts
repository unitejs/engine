/**
 * Variables used by the engine.
 */
export class EngineVariables {
    public sourceFolder: string;
    public unitTestFolder: string;
    public e2eTestFolder: string;

    public gulpBuildFolder: string;
    public gulpTasksFolder: string;
    public gulpUtilFolder: string;

    public assetsDirectory: string;
    public dependenciesFile: string;

    public requiredDependencies: string[];
    public requiredDevDependencies: string[];

    public sourceLanguageExt: string;
}
