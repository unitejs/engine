"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * String helper methods
 */
class StringHelper {
    static isString(value) {
        return value === null || value === undefined ? false : Object.prototype.toString.call(value) === "[object String]";
    }
    static toCamelCase(val) {
        return val && val.length > 0 ? val.substr(0, 1).toLowerCase() + val.substr(1) : val;
    }
}
exports.StringHelper = StringHelper;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb3JlL3N0cmluZ0hlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOztHQUVHO0FBQ0g7SUFDVyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQVU7UUFDN0IsTUFBTSxDQUFDLEtBQUssS0FBSyxJQUFJLElBQUksS0FBSyxLQUFLLFNBQVMsR0FBRyxLQUFLLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLGlCQUFpQixDQUFDO0lBQ3ZILENBQUM7SUFFTSxNQUFNLENBQUMsV0FBVyxDQUFDLEdBQVc7UUFDakMsTUFBTSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztJQUN4RixDQUFDO0NBQ0o7QUFSRCxvQ0FRQyIsImZpbGUiOiJjb3JlL3N0cmluZ0hlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMifQ==
