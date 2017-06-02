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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvc3RyaW5nSGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7O0dBRUc7QUFDSDtJQUNXLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBVTtRQUM3QixNQUFNLENBQUMsS0FBSyxLQUFLLElBQUksSUFBSSxLQUFLLEtBQUssU0FBUyxHQUFHLEtBQUssR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssaUJBQWlCLENBQUM7SUFDdkgsQ0FBQztJQUVNLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBVztRQUNqQyxNQUFNLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO0lBQ3hGLENBQUM7Q0FDSjtBQVJELG9DQVFDIiwiZmlsZSI6ImNvcmUvc3RyaW5nSGVscGVyLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
