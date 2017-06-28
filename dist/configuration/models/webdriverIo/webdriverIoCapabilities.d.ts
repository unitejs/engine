/**
 * Model of WebdriverIO Configuration wdio.conf.js
 */
export declare class WebdriverIoCapabilities {
    maxInstances?: number;
    browserName: string;
    specs?: string[];
    exclude?: string[];
    version?: string;
    platform?: string;
    tags?: string[];
    name?: string;
    pageLoadStrategy?: "normal" | "eager" | "none";
}
