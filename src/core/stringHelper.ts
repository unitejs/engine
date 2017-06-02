/**
 * String helper methods
 */
export class StringHelper {
    public static isString(value: any): boolean {
        return value === null || value === undefined ? false : Object.prototype.toString.call(value) === "[object String]";
    }

    public static toCamelCase(val: string): string {
        return val && val.length > 0 ? val.substr(0, 1).toLowerCase() + val.substr(1) : val;
    }
}