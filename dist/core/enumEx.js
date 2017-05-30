"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EnumEx {
    static getNamesAndValues(e) {
        return EnumEx.getNames(e).map((n) => ({ key: n, value: e[n] }));
    }
    static getNames(e) {
        return EnumEx.getObjectValues(e).filter(v => typeof v === "string");
    }
    static getValues(e) {
        return EnumEx.getObjectValues(e).filter(v => typeof v === "number");
    }
    static getValueByName(e, name) {
        return e[name];
    }
    static getObjectValues(e) {
        return Object.keys(e).map(k => e[k]);
    }
}
exports.EnumEx = EnumEx;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvZW51bUV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBS0E7SUFDVyxNQUFNLENBQUMsaUJBQWlCLENBQW1CLENBQU07UUFDcEQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUVNLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBTTtRQUN6QixNQUFNLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxLQUFLLFFBQVEsQ0FBYSxDQUFDO0lBQ3BGLENBQUM7SUFFTSxNQUFNLENBQUMsU0FBUyxDQUFtQixDQUFNO1FBQzVDLE1BQU0sQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksT0FBTyxDQUFDLEtBQUssUUFBUSxDQUFRLENBQUM7SUFDL0UsQ0FBQztJQUVNLE1BQU0sQ0FBQyxjQUFjLENBQW1CLENBQU0sRUFBRSxJQUFZO1FBQy9ELE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFNLENBQUM7SUFDeEIsQ0FBQztJQUVPLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBTTtRQUNqQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7Q0FDSjtBQXBCRCx3QkFvQkMiLCJmaWxlIjoiY29yZS9lbnVtRXguanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
