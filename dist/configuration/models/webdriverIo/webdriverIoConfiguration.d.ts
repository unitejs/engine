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
    beforeSession: (config: WebdriverIoConfiguration, capabilities: WebdriverIoCapabilities[], specs: string[]) => void;
    afterSession: (config: WebdriverIoConfiguration, capabilities: WebdriverIoCapabilities[], specs: string[]) => void;
    before: (capabilities: WebdriverIoCapabilities[], specs: string[]) => void;
    after: (result: number, capabilities: WebdriverIoCapabilities[], specs: string[]) => void;
    beforeSuite: (suite: any) => void;
    afterSuite: (suite: any) => void;
    beforeHook: () => void;
    afterHook: () => void;
    beforeTest: (test: any) => void;
    afterTest: (test: any) => void;
    beforeCommand: (commandName: string, args: any[]) => void;
    afterCommand: (commandName: string, args: any[], result: number, error: any) => void;
}
