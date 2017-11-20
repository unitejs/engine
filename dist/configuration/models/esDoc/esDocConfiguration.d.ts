/**
 * Model of ESDoc Configuration (.esdoc.json) file.
 */
export declare class EsDocConfiguration {
    source: string;
    destination: string;
    includes: string[];
    excludes: string[];
    plugins: {
        name: string;
        option?: {
            [id: string]: any;
        };
    }[];
}
