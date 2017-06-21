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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS9lbmdpbmVWYWxpZGF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFNQTtJQUNVLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFpQixFQUFFLElBQVksRUFBRSxLQUFnQztRQUM1Riw0REFBNEQ7UUFDNUQsd0RBQXdEO1FBQ3hELDhIQUE4SDtRQUM3SCxFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssU0FBUyxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlELE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLHVCQUF1QixDQUFDLENBQUM7WUFDN0MsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNqQixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLCtDQUErQyxDQUFDLENBQUM7WUFDckUsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNqQixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDaEMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsd0NBQXdDLENBQUMsQ0FBQztZQUM5RCxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2pCLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDM0QsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsa0RBQWtELENBQUMsQ0FBQztZQUN4RSxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2pC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RSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFFOUIsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU0sTUFBTSxDQUFPLFlBQVksQ0FBQyxXQUFrQixFQUFFLE9BQWlCLEVBQUUsSUFBWSxFQUFFLEtBQWdDOztZQUNsSCxFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssU0FBUyxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5RCxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO2dCQUM3QyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ2pCLENBQUM7WUFFRCxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3RDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDM0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsMEZBQTBGLENBQUMsQ0FBQztnQkFDaEgsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUNqQixDQUFDO1lBRUQsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO0tBQUE7Q0FDSjtBQWpHRCw0Q0FpR0MiLCJmaWxlIjoiZW5naW5lL2VuZ2luZVZhbGlkYXRpb24uanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
