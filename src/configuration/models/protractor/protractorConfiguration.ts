/**
 * Model of Protractor Configuration protractor.conf.js
 * Info from here https://github.com/angular/protractor/blob/master/lib/config.ts
 */
import { ProtractorCapabilities } from "./protractorCapabilities";

export class ProtractorConfiguration {
    public baseUrl: string;
    public specs: string[];
    public plugins: { path: string }[];
    public capabilities: ProtractorCapabilities;
    public framework: string;
    public mochaOpts: { ui?: string; reporter?: string; timeout?: number; slow?: number; reporterOptions?: { [id: string]: any } };
    public jasmineNodeOpts: { showColors?: boolean; defaultTimeoutInterval?: number; print?: any; grep?: string; invertGrep?: boolean };
    public onPrepare: any;
}
