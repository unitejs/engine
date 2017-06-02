"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Json helper methods
 */
class JsonHelper {
    static stringify(object, space) {
        /* eliminates any recursion in the stringify */
        const cache = [];
        const replacer = (key, value) => {
            if (typeof value === "object" && value !== null && value !== undefined) {
                if (cache.indexOf(value) !== -1) {
                    /* circular reference found, discard key */
                    return;
                }
                else {
                    cache.push(value);
                }
            }
            return value;
        };
        return JSON.stringify(object, replacer, space);
    }
}
exports.JsonHelper = JsonHelper;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvanNvbkhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOztHQUVHO0FBQ0g7SUFDVyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQVcsRUFBRSxLQUF1QjtRQUN4RCwrQ0FBK0M7UUFDL0MsTUFBTSxLQUFLLEdBQVUsRUFBRSxDQUFDO1FBRXhCLE1BQU0sUUFBUSxHQUFHLENBQUMsR0FBVyxFQUFFLEtBQVU7WUFDckIsRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM5QiwyQ0FBMkM7b0JBQzNDLE1BQU0sQ0FBQztnQkFDWCxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3RCLENBQUM7WUFDTCxDQUFDO1lBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNqQixDQUFDLENBQUM7UUFFbEIsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNuRCxDQUFDO0NBQ0o7QUFuQkQsZ0NBbUJDIiwiZmlsZSI6ImNvcmUvanNvbkhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMifQ==
