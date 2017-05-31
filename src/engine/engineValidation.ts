/**
 * Engine validation.
 */
import { IDisplay } from "../interfaces/IDisplay";

export class EngineValidation {
   public static checkPackageName(display: IDisplay, name: string, value: string | undefined | null): boolean {
       // Rules from here https://docs.npmjs.com/files/package.json
       // here https://github.com/npm/validate-npm-package-name
       // and here https://github.com/npm/npm-registry-couchapp/blob/b31793881ff95c5bca5966a0a8bf8e5f7a801247/registry/modules.js#L93
        if (value === undefined || value === null || value.length === 0) {
            display.error(name + ": parameter is missing.");
            return false;
        }

        if (value.length > 214) {
            display.error(name + ": " + " must be less than or equal to 214 characters.");
            return false;
        }

        if (value.toLowerCase() !== value) {
            display.error(name + ": " + " must not have uppercase letters in it.");
            return false;
        }

        if (value[0] === "." || value[0] === "-" || value[0] === "_") {
            display.error(name + ": " + " must not start with a dot, hyphen or underscore.");
            return false;
        }

        if (value.match(/[\/\(\)&\?#\|<>@:%\s\\\*'"!~`]/)) {
            display.error(name + ": " + " must not have any special characters.");
            return false;
        }

        if (encodeURIComponent(value) !== value) {
            display.error(name + ": " + " can't contain any non-URL-safe characters.");
            return false;
        }

        display.info(name + ": " + value);

        return true;
    }

    public static checkPattern(display: IDisplay, name: string, value: string | undefined | null, pattern: RegExp, patternExplain: string): boolean {
        if (value === undefined || value === null || value.length === 0) {
            display.error(name + ": parameter is missing.");
            return false;
        }

        if (!pattern.test(value)) {
            display.error(name + ": " + " does not match pattern " + patternExplain + ".");
            return false;
        }

        display.info(name + ": " + value);

        return true;
    }

    public static checkOneOf<T extends string>(display: IDisplay, name: string, value: T | undefined | null, values: T[]): boolean {
        if (value === undefined || value === null || value.length === 0) {
            display.error(name + ": parameter is missing.");
            return false;
        }

        if (values.indexOf(value) === -1) {
            display.error(name + ": does not match any of the possible values. [" + values.join(",") + "]");
            return false;
        }

        display.info(name + ": " + value);

        return true;
    }

    public static notEmpty(display: IDisplay, name: string, value: string | undefined | null): boolean {
        if (value === undefined || value === null || value.length === 0) {
            display.error(name + ": parameter is missing.");
            return false;
        }

        display.info(name + ": " + value);

        return true;
    }
}
