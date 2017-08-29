/**
 * Model of Protractor Configuration protractor.conf.js
 * Info from here https://github.com/angular/protractor/blob/master/lib/config.ts
 */
import { ProtractorCapabilities } from "./protractorCapabilities";
export declare class ProtractorConfiguration {
    baseUrl: string;
    specs: string[];
    plugins: {
        path: string;
    }[];
    capabilities: ProtractorCapabilities;
    framework: string;
    mochaOpts: {
        ui?: string;
        reporter?: string;
        timeout?: number;
        slow?: number;
        reporterOptions?: {
            [id: string]: any;
        };
    };
    jasmineNodeOpts: {
        showColors?: boolean;
        defaultTimeoutInterval?: number;
        print?: any;
        grep?: string;
        invertGrep?: boolean;
    };
    onPrepare: any;
    localSeleniumStandaloneOpts: {
        jvmArgs: string[];
    };
}
