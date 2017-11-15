/**
 * Unite Runtime Configuration
 */
export interface IUniteRuntimeConfiguration {
    config: { [id: string]: any};
    configName: string;
    minify: boolean;
    bundle: boolean;
    pwa: boolean;
    packageVersion: string;
    uniteVersion: string;
    buildDateTime: number;
    buildNumber: string;
}

// Generated by UniteJS