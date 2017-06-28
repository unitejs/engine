/**
 * Json helper methods
 */
export class JsonHelper {
    public static stringify(object: any, space?: string | number): string {
        /* eliminates any recursion in the stringify */
        const cache: any[] = [];

        const replacer = (key: string, value: any) => {
                            if (typeof value === "object" && value !== null && value !== undefined) {
                                if (cache.indexOf(value) !== -1) {
                                    /* circular reference found, discard key */
                                    return;
                                } else {
                                    cache.push(value);
                                }
                            }
                            return value;
                        };

        return JSON.stringify(object, replacer, space);
    }

    public static codify(object: any): string {
        let json = JSON.stringify(object, undefined, "\t");
        /* first substitue embedded quotes with FFFF */
        json = json.replace(/\\"/g, "\uFFFF");
        /* now replace all property name quotes */
        json = json.replace(/\"([a-zA-Z_$][a-zA-Z0-9_$]+)\":/g, "$1:");
        /* now replace all other quotes with single ones */
        json = json.replace(/\"/g, "'");
        /* and finally replace the FFFF with original quotes */
        json = json.replace(/\uFFFF/g, "\\\"");
        /* only remove quotes for known code variables */
        json = json.replace(/'__dirname'/g, "__dirname");
        return json;
    }
}