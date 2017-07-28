/**
 * Model of WebdriverIO Configuration wdio.conf.js
 */
export class WebdriverIoCapabilities {
    public maxInstances?: number;
    public browserName: string;
    public specs?: string[];
    public exclude?: string[];
    public version?: string;
    public platform?: string;
    public tags?: string[];
    public name?: string;
    public pageLoadStrategy?: "normal" | "eager" | "none";
}
