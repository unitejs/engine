/**
 * String helper methods
 */
export class StringHelper {
    public static isString(value: any): boolean {
        return value === null || value === undefined ? false : Object.prototype.toString.call(value) === "[object String]";
    }
}