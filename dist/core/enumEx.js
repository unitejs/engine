"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EnumEx {
    // tslint:disable-next-line:no-any
    static getNamesAndValues(e) {
        return EnumEx.getNames(e).map((n) => ({ key: n, value: e[n] }));
    }
    // tslint:disable-next-line:no-any
    static getNames(e) {
        return EnumEx.getObjectValues(e).filter(v => typeof v === "string");
    }
    // tslint:disable-next-line:no-any
    static getValues(e) {
        return EnumEx.getObjectValues(e).filter(v => typeof v === "number");
    }
    // tslint:disable-next-line:no-any
    static getObjectValues(e) {
        return Object.keys(e).map(k => e[k]);
    }
}
exports.EnumEx = EnumEx;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvZW51bUV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBS0E7SUFDSSxrQ0FBa0M7SUFDM0IsTUFBTSxDQUFDLGlCQUFpQixDQUFtQixDQUFNO1FBQ3BELE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFFRCxrQ0FBa0M7SUFDM0IsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFNO1FBQ3pCLE1BQU0sQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksT0FBTyxDQUFDLEtBQUssUUFBUSxDQUFhLENBQUM7SUFDcEYsQ0FBQztJQUVELGtDQUFrQztJQUMzQixNQUFNLENBQUMsU0FBUyxDQUFtQixDQUFNO1FBQzVDLE1BQU0sQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksT0FBTyxDQUFDLEtBQUssUUFBUSxDQUFRLENBQUM7SUFDL0UsQ0FBQztJQUVELGtDQUFrQztJQUMxQixNQUFNLENBQUMsZUFBZSxDQUFDLENBQU07UUFDakMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6QyxDQUFDO0NBQ0o7QUFwQkQsd0JBb0JDIiwiZmlsZSI6ImNvcmUvZW51bUV4LmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
