/**
 * Enum extensions class.
 */
import { IKeyValue } from "../interfaces/IKeyValueT";

export class EnumEx {
    public static getNamesAndValues<T extends number>(e: any): IKeyValue<T>[] {
        return EnumEx.getNames(e).map((n) => ({ key: n, value: e[n] as T }));
    }

    public static getNames(e: any): string[] {
        return EnumEx.getObjectValues(e).filter(v => typeof v === "string") as string[];
    }

    public static getValues<T extends number>(e: any): T[] {
        return EnumEx.getObjectValues(e).filter(v => typeof v === "number") as T[];
    }

    public static getValueByName<T extends number>(e: any, name: string): T {
        return e[name] as T;
    }

    private static getObjectValues(e: any): (number | string)[] {
        return Object.keys(e).map(k => e[k]);
    }
}
