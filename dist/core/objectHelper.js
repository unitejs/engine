"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Object helper methods
 */
class ObjectHelper {
    static getClassName(object) {
        if (object) {
            const constructor = typeof object === "function" ? object.toString() : object.constructor.toString();
            const results = constructor.match(/\w+/g);
            return (results && results.length > 1) ? results[1] : "<no object>";
        }
        else {
            return "<no object>";
        }
    }
}
exports.ObjectHelper = ObjectHelper;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvb2JqZWN0SGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7O0dBRUc7QUFDSDtJQUNXLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBVztRQUNsQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ1QsTUFBTSxXQUFXLEdBQUcsT0FBTyxNQUFNLEtBQUssVUFBVSxHQUFHLE1BQU0sQ0FBQyxRQUFRLEVBQUUsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3JHLE1BQU0sT0FBTyxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDMUMsTUFBTSxDQUFDLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLGFBQWEsQ0FBQztRQUN4RSxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixNQUFNLENBQUMsYUFBYSxDQUFDO1FBQ3pCLENBQUM7SUFDTCxDQUFDO0NBQ0o7QUFWRCxvQ0FVQyIsImZpbGUiOiJjb3JlL29iamVjdEhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMifQ==
