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
}