/**
 * Object helper methods
 */
export class ObjectHelper {
    public static getClassName(object: any): string {
        if (object) {
            const constructor = typeof object === "function" ? object.toString() : object.constructor.toString();
            const results = constructor.match(/\w+/g);
            return (results && results.length > 1) ? results[1] : "<no object>";
        } else {
            return "<no object>";
        }
    }
}