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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb3JlL29iamVjdEhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOztHQUVHO0FBQ0g7SUFDVyxNQUFNLENBQUMsWUFBWSxDQUFDLE1BQVc7UUFDbEMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNULE1BQU0sV0FBVyxHQUFHLE9BQU8sTUFBTSxLQUFLLFVBQVUsR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNyRyxNQUFNLE9BQU8sR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxhQUFhLENBQUM7UUFDeEUsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osTUFBTSxDQUFDLGFBQWEsQ0FBQztRQUN6QixDQUFDO0lBQ0wsQ0FBQztDQUNKO0FBVkQsb0NBVUMiLCJmaWxlIjoiY29yZS9vYmplY3RIZWxwZXIuanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
