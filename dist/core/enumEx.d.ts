/**
 * Enum extensions class.
 */
import { IKeyValue } from "../interfaces/IKeyValueT";
export declare class EnumEx {
    static getNamesAndValues<T extends number>(e: any): IKeyValue<T>[];
    static getNames(e: any): string[];
    static getValues<T extends number>(e: any): T[];
    static getValueByName<T extends number>(e: any, name: string): T;
    private static getObjectValues(e);
}
