/**
 * Enum extensions class.
 */
import { IKeyValue } from "../interfaces/IKeyValueT";

export class EnumEx {
    // tslint:disable-next-line:no-any
    public static getNamesAndValues<T extends number>(e: any): IKeyValue<T>[] {
        return EnumEx.getNames(e).map((n) => ({ key: n, value: e[n] as T }));
    }

    // tslint:disable-next-line:no-any
    public static getNames(e: any): string[] {
        return EnumEx.getObjectValues(e).filter(v => typeof v === "string") as string[];
    }

    // tslint:disable-next-line:no-any
    public static getValues<T extends number>(e: any): T[] {
        return EnumEx.getObjectValues(e).filter(v => typeof v === "number") as T[];
    }

    // tslint:disable-next-line:no-any
    private static getObjectValues(e: any): (number | string)[] {
        return Object.keys(e).map(k => e[k]);
    }
}
