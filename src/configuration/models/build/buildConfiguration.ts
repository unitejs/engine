/**
 * Model of Build Configuration (build.config.json) file.
 */
export class BuildConfiguration {
    public srcFolder: string;
    public distFolder: string;
    public unitTestSrcFolder: string;
    public unitTestDistFolder: string;
    public e2eTestSrcFolder: string;
    public e2eTestDistFolder: string;
    public sourceMaps: boolean;
}