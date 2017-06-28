/**
 * Model of WebdriverIO Configuration wdio.conf.js
 * Info from here http://webdriver.io/guide/testrunner/configurationfile.html
 */
import { WebdriverIoCapabilities } from "./webdriverIoCapabilities";
export declare class WebdriverIoConfiguration {
    host: string;
    port: number;
    path: string;
    user: string;
    key: string;
    specs: string[];
    exclude: string[];
    services: string[];
    maxInstances: number;
    capabilities: WebdriverIoCapabilities[];
    debug: boolean;
    execArgv: string[];
    sync: boolean;
    logLevel: "verbose" | "silent" | "command" | "data" | "result";
    coloredLogs: boolean;
    bail: number;
    screenshotPath: string;
    baseUrl: string;
    waitforTimeout: number;
    plugins: {
        [id: string]: any;
    };
    framework: string;
    reporters: string[];
    reporterOptions: {};
    mochaOpts: {};
    jasmineNodeOpts: {};
    cucumberOpts: {};
}
