/**
 * Model of Build Configuration (build.config.json) file.
 */
export class BuildConfiguration {
    public srcFolder: string;
    public distFolder: string;
    public unitTestFolder: string;
    public e2eTestFolder: string;
    public sourceMaps: boolean;
}