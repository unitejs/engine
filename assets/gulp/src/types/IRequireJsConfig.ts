/**
 * RequireJS Config
 */
export interface IRequireJsConfig {
    baseUrl: string;
    paths: { [id: string]: string };
    packages: { name: string; location: string; main: string }[];
    map: { [id: string]: any };
}

// Generated by UniteJS
