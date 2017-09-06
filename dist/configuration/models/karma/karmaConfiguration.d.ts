/**
 * Model of Karma Configuration karma.conf
 */
export declare class KarmaConfiguration {
    autoWatch: boolean;
    autoWatchBatchDelay: number;
    basePath: string;
    browserConsoleLogOptions: {
        level: string;
        format: string;
        path: string;
        terminal: boolean;
    };
    browserDisconnectTimeout: number;
    browserDisconnectTolerance: number;
    browserNoActivityTimeout: number;
    browsers: string[];
    captureTimeout: number;
    "client.args": string;
    "client.useIframe": string;
    "client.runInParent": string;
    "client.captureConsole": string;
    "client.clearContext": string;
    colors: boolean;
    concurrency: number;
    crossOriginAttribute: boolean;
    customContextFile: string;
    customDebugFile: string;
    customClientContextFile: string;
    customHeaders: {
        match: string;
        name: string;
        value: string;
    }[];
    detached: boolean;
    exclude: string[];
    failOnEmptyTestSuite: boolean;
    files: {
        pattern: string;
        watched?: boolean;
        included?: boolean;
        served?: true;
        nocache?: boolean;
        includeType?: string;
    }[];
    forceJSONP: boolean;
    formatError: any;
    frameworks: string[];
    listenAddress: string;
    hostname: string;
    httpsServerOptions: {
        [id: string]: any;
    };
    logLevel: "OFF" | "ERROR" | "WARN" | "INFO" | "DEBUG" | "LOG";
    loggers: {
        type: string;
    }[];
    middleware: string[];
    mime: {
        [id: string]: string[];
    };
    beforeMiddleware: string[];
    plugins: string[];
    port: number;
    processKillTimeout: number;
    preprocessors: {
        [id: string]: string[];
    };
    httpModule: string;
    proxies: {
        [id: string]: string | {
            target: string;
            changeOrigin: string;
        };
    };
    proxyValidateSSL: boolean;
    reportSlowerThan: number;
    reporters: string[];
    restartOnFileChange: boolean;
    retryLimit: number;
    singleRun: boolean;
    transports: string[];
    proxyReq: any;
    proxyRes: any;
    upstreamProxy: {
        path: string;
        port: number;
        hostname: string;
        protocol: string;
    };
    urlRoot: string;
    jsVersion: number;
    coverageReporter: {
        include: string;
        exclude: string;
        reporters: {
            type: string;
            dir: string;
            subdir: string;
        }[];
    };
    htmlReporter: {
        outputDir: string;
        reportName: string;
    };
    remapIstanbulReporter: {
        reports: {
            [id: string]: string;
        };
    };
}
