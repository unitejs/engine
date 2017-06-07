/**
 * Model of Build Configuration (build.config.json) file.
 */
export declare class BuildConfiguration {
    srcFolder: string;
    distFolder: string;
    unitTestFolder: string;
    unitTestSrcFolder: string;
    unitTestDistFolder: string;
    e2eTestSrcFolder: string;
    e2eTestDistFolder: string;
    sourceMaps: boolean;
}
