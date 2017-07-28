/**
 * Model of WebdriverIO Configuration wdio.conf.js
 * Info from here http://webdriver.io/guide/testrunner/configurationfile.html
 */

import { WebdriverIoCapabilities } from "./webdriverIoCapabilities";

export class WebdriverIoConfiguration {
    public host: string;
    public port: number;
    public path: string;
    public user: string;
    public key: string;
    public specs: string[];
    public exclude: string[];
    public services: string[];

    public maxInstances: number;
    public capabilities: WebdriverIoCapabilities[];
    public debug: boolean;
    public execArgv: string[];

    public sync: boolean;
    public logLevel: "verbose" | "silent" | "command" | "data" | "result";
    public coloredLogs: boolean;
    public bail: number;
    public screenshotPath: string;
    public baseUrl: string;
    public waitforTimeout: number;
    public plugins: { [id: string]: any };
    public framework: string;
    public reporters: string[];
    public reporterOptions: {};

    public mochaOpts: {};
    public jasmineNodeOpts: {};
    public cucumberOpts: {};

    public beforeSession: (config: WebdriverIoConfiguration, capabilities: WebdriverIoCapabilities[], specs: string[]) => void;
    public afterSession: (config: WebdriverIoConfiguration, capabilities: WebdriverIoCapabilities[], specs: string[]) => void;

    public before: (capabilities: WebdriverIoCapabilities[], specs: string[]) => void;
    public after: (result: number, capabilities: WebdriverIoCapabilities[], specs: string[]) => void;

    public beforeSuite: (suite: any) => void;
    public afterSuite: (suite: any) => void;

    public beforeHook: () => void;
    public afterHook: () => void;

    public beforeTest: (test: any) => void;
    public afterTest: (test: any) => void;

    public beforeCommand: (commandName: string, args: any[]) => void;
    public afterCommand: (commandName: string, args: any[], result: number, error: any) => void;
}
