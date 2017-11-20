/**
 * Model of JSDoc Configuration (.jsdoc.json) file.
 */
import { BabelConfiguration } from "../babel/babelConfiguration";

export class JsDocConfiguration {
    public plugins?: string[];
    public recurseDepth?: number;
    public source?: {
        include?: string[];
        exclude?: string[];
        includePattern?: string;
        excludePattern?: string;
    };
    public sourceType?: string;
    public opts?: {
        template?: string;
        encoding?: string;
        destination?: string;
        recurse?: boolean;
        tutorials?: string;
    };
    public tags?: {
        allowUnknownTags?: boolean;
        dictionaries?: string[];
    };
    public templates?: {
        cleverLinks?: boolean;
        monospaceLinks?: boolean;
    };
    public babel?: BabelConfiguration;
}
