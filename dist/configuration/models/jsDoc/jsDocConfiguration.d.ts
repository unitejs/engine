/**
 * Model of JSDoc Configuration (.jsdoc.json) file.
 */
import { BabelConfiguration } from "../babel/babelConfiguration";
export declare class JsDocConfiguration {
    plugins?: string[];
    recurseDepth?: number;
    source?: {
        include?: string[];
        exclude?: string[];
        includePattern?: string;
        excludePattern?: string;
    };
    sourceType?: string;
    opts?: {
        template?: string;
        encoding?: string;
        destination?: string;
        recurse?: boolean;
        tutorials?: string;
    };
    tags?: {
        allowUnknownTags?: boolean;
        dictionaries?: string[];
    };
    templates?: {
        cleverLinks?: boolean;
        monospaceLinks?: boolean;
    };
    babel?: BabelConfiguration;
}
