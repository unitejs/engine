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
    static codify(object) {
        let json = JSON.stringify(object, undefined, "\t");
        /* first substitue embedded quotes with FFFF */
        json = json.replace(/\\"/g, "\uFFFF");
        /* now replace all property name quotes */
        json = json.replace(/\"([a-zA-Z_$][a-zA-Z0-9_$]+)\":/g, "$1:");
        /* now replace all other quotes with single ones */
        json = json.replace(/\"/g, "'");
        /* and finally replace the FFFF with original quotes */
        json = json.replace(/\uFFFF/g, "\\\"");
        /* only remove quotes for known code variables */
        json = json.replace(/'__dirname'/g, "__dirname");
        return json;
    }
}
exports.JsonHelper = JsonHelper;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb3JlL2pzb25IZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7R0FFRztBQUNIO0lBQ1csTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFXLEVBQUUsS0FBdUI7UUFDeEQsK0NBQStDO1FBQy9DLE1BQU0sS0FBSyxHQUFVLEVBQUUsQ0FBQztRQUV4QixNQUFNLFFBQVEsR0FBRyxDQUFDLEdBQVcsRUFBRSxLQUFVO1lBQ3JCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUNyRSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDOUIsMkNBQTJDO29CQUMzQyxNQUFNLENBQUM7Z0JBQ1gsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN0QixDQUFDO1lBQ0wsQ0FBQztZQUNELE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDakIsQ0FBQyxDQUFDO1FBRWxCLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVNLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBVztRQUM1QixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbkQsK0NBQStDO1FBQy9DLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN0QywwQ0FBMEM7UUFDMUMsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsa0NBQWtDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDL0QsbURBQW1EO1FBQ25ELElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNoQyx1REFBdUQ7UUFDdkQsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZDLGlEQUFpRDtRQUNqRCxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDakQsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0NBQ0o7QUFsQ0QsZ0NBa0NDIiwiZmlsZSI6ImNvcmUvanNvbkhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMifQ==
