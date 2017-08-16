/**
 * Model of Karma Configuration karma.conf
 */
export class KarmaConfiguration {
    public autoWatch: boolean;
    public autoWatchBatchDelay: number;
    public basePath: string;
    public browserConsoleLogOptions: { level: string; format: string; path: string; terminal: boolean };
    public browserDisconnectTimeout: number;
    public browserDisconnectTolerance: number;
    public browserNoActivityTimeout: number;
    public browsers: string[];
    public captureTimeout: number;
    public "client.args": string;
    public "client.useIframe": string;
    public "client.runInParent": string;
    public "client.captureConsole": string;
    public "client.clearContext": string;
    public colors: boolean;
    public concurrency: number;
    public crossOriginAttribute: boolean;
    public customContextFile: string;
    public customDebugFile: string;
    public customClientContextFile: string;
    public customHeaders: { match: string; name: string; value: string}[];
    public detached: boolean;
    public exclude: string[];
    public failOnEmptyTestSuite: boolean;
    public files: { pattern: string; watched?: boolean; included?: boolean; served?: true; nocache?: boolean }[];
    public forceJSONP: boolean;
    public formatError: any;
    public frameworks: string[];
    public listenAddress: string;
    public hostname: string;
    public httpsServerOptions: { [id: string]: any};
    public logLevel: "OFF" | "ERROR" | "WARN" | "INFO" | "DEBUG" | "LOG";
    public loggers: { type: string }[];
    public middleware: string[];
    public mime: { [id: string]: string[]};
    public beforeMiddleware: string[];
    public plugins: string[];
    public port: number;
    public processKillTimeout: number;
    public preprocessors: { [id: string]: string[] };
    public httpModule: string;
    public proxies: { [id: string]: string | { target: string; changeOrigin: string}};
    public proxyValidateSSL: boolean;
    public reportSlowerThan: number;
    public reporters: string[];
    public restartOnFileChange: boolean;
    public retryLimit: number;
    public singleRun: boolean;
    public transports: string[];
    public proxyReq: any;
    public proxyRes: any;
    public upstreamProxy: { path: string; port: number; hostname: string; protocol: string};
    public urlRoot: string;
    public jsVersion: number;

    public coverageReporter: { include: string; exclude: string; reporters: { type: string; dir: string; subdir: string } [] };
    public htmlReporter: { outputDir: string; reportName: string};
    public remapIstanbulReporter: { reports: { [id: string]: string } };

}
