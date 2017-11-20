/**
 * Model of ESDoc Configuration (.esdoc.json) file.
 */
export class EsDocConfiguration {
    public source: string;
    public destination: string;
    public includes: string[];
    public excludes: string[];
    public plugins: { name: string; option?: { [id: string]: any} }[];
}
