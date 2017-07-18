"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class EngineValidation {
    static checkPackageName(display, name, value) {
        // Rules from here https://docs.npmjs.com/files/package.json
        // here https://github.com/npm/validate-npm-package-name
        // and here https://github.com/npm/npm-registry-couchapp/blob/b31793881ff95c5bca5966a0a8bf8e5f7a801247/registry/modules.js#L93
        if (value === undefined || value === null || value.length === 0) {
            display.error(name, "parameter is missing.");
            return false;
        }
        if (value.length > 214) {
            display.error(name, "must be less than or equal to 214 characters.");
            return false;
        }
        if (value.toLowerCase() !== value) {
            display.error(name, "must not have uppercase letters in it.");
            return false;
        }
        if (value[0] === "." || value[0] === "-" || value[0] === "_") {
            display.error(name, "must not start with a dot, hyphen or underscore.");
            return false;
        }
        if (value.match(/[\/\(\)&\?#\|<>@:%\s\\\*'"!~`]/)) {
            display.error(name, "must not have any special characters.");
            return false;
        }
        if (encodeURIComponent(value) !== value) {
            display.error(name, "can't contain any non-URL-safe characters.");
            return false;
        }
        display.info(name, { value });
        return true;
    }
    static checkPattern(display, name, value, pattern, patternExplain) {
        if (value === undefined || value === null || value.length === 0) {
            display.error(name, "parameter is missing.");
            return false;
        }
        if (!pattern.test(value)) {
            display.error(name, "does not match pattern " + patternExplain + ".");
            return false;
        }
        display.info(name, { value });
        return true;
    }
    static checkOneOf(display, name, value, values) {
        if (value === undefined || value === null || value.length === 0) {
            display.error(name, "parameter is missing.");
            return false;
        }
        if (values.indexOf(value) === -1) {
            display.error(name, "does not match any of the possible values. [" + values.join(",") + "]");
            return false;
        }
        display.info(name, { value });
        return true;
    }
    static notEmpty(display, name, value) {
        if (value === undefined || value === null || value.length === 0) {
            display.error(name, "parameter is missing.");
            return false;
        }
        display.info(name, { value });
        return true;
    }
    static checkLicense(licenseData, display, name, value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (value === undefined || value === null || value.length === 0) {
                display.error(name, "parameter is missing.");
                return false;
            }
            const keys = Object.keys(licenseData);
            if (keys.indexOf(value) < 0) {
                display.error(name, "does not match any of the possible SPDX license values (see https://spdx.org/licenses/).");
                return false;
            }
            return true;
        });
    }
}
exports.EngineValidation = EngineValidation;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9lbmdpbmUvZW5naW5lVmFsaWRhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBTUE7SUFDVSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsT0FBaUIsRUFBRSxJQUFZLEVBQUUsS0FBZ0M7UUFDNUYsNERBQTREO1FBQzVELHdEQUF3RDtRQUN4RCw4SEFBOEg7UUFDN0gsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLFNBQVMsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5RCxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO1lBQzdDLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDakIsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNyQixPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSwrQ0FBK0MsQ0FBQyxDQUFDO1lBQ3JFLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDakIsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLHdDQUF3QyxDQUFDLENBQUM7WUFDOUQsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNqQixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzNELE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLGtEQUFrRCxDQUFDLENBQUM7WUFDeEUsTUFBTSxDQUFDLEtBQUssQ0FB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QUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBRTlCLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVNLE1BQU0sQ0FBTyxZQUFZLENBQUMsV0FBa0IsRUFBRSxPQUFpQixFQUFFLElBQVksRUFBRSxLQUFnQzs7WUFDbEgsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLFNBQVMsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDOUQsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztnQkFDN0MsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUNqQixDQUFDO1lBRUQsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUN0QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNCLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLDBGQUEwRixDQUFDLENBQUM7Z0JBQ2hILE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDakIsQ0FBQztZQUVELE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztLQUFBO0NBQ0o7QUFqR0QsNENBaUdDIiwiZmlsZSI6ImVuZ2luZS9lbmdpbmVWYWxpZGF0aW9uLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
