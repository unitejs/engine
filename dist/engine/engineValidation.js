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
        // and here https://github.com/npm/npm-registry-couchapp/
        // blob/b31793881ff95c5bca5966a0a8bf8e5f7a801247/registry/modules.js#L93
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
            display.error(name, `does not match pattern ${patternExplain}.`);
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
            display.error(name, `does not match any of the possible values. [${values.join(",")}]`);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmdpbmUvZW5naW5lVmFsaWRhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBTUE7SUFDVSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsT0FBaUIsRUFBRSxJQUFZLEVBQUUsS0FBZ0M7UUFDNUYsNERBQTREO1FBQzVELHdEQUF3RDtRQUN4RCx5REFBeUQ7UUFDekQsd0VBQXdFO1FBQ3ZFLEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxTQUFTLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUQsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztZQUM3QyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2pCLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDckIsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsK0NBQStDLENBQUMsQ0FBQztZQUNyRSxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2pCLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNoQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSx3Q0FBd0MsQ0FBQyxDQUFDO1lBQzlELE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDakIsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztZQUMzRCxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxrREFBa0QsQ0FBQyxDQUFDO1lBQ3hFLE1B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RUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFFOUIsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUssTUFBTSxDQUFPLFlBQVksQ0FBQyxXQUFrQixFQUFFLE9BQWlCLEVBQUUsSUFBWSxFQUFFLEtBQWdDOztZQUNqSCxFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssU0FBUyxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5RCxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO2dCQUM3QyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ2pCLENBQUM7WUFFRCxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3RDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDMUIsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsMEZBQTBGLENBQUMsQ0FBQztnQkFDaEgsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUNqQixDQUFDO1lBRUQsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO0tBQUE7Q0FDSjtBQWxHRCw0Q0FrR0MiLCJmaWxlIjoiZW5naW5lL2VuZ2luZVZhbGlkYXRpb24uanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
