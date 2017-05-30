/**
 * Engine validation.
 */
import { IDisplay } from "../interfaces/IDisplay";
export declare class EngineValidation {
    static checkPackageName(display: IDisplay, name: string, value: string | undefined | null): boolean;
    static checkPattern(display: IDisplay, name: string, value: string | undefined | null, pattern: RegExp, patternExplain: string): boolean;
    static checkOneOf(display: IDisplay, name: string, value: string | undefined | null, values: string[]): boolean;
    static notEmpty(display: IDisplay, name: string, value: string | undefined | null): boolean;
}
