"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Class for pipeline key
 */
class PipelineKey {
    constructor(category, key) {
        this.category = category;
        this.key = key;
    }
    combined() {
        return `${this.category}/${this.key}`;
    }
    matches(match) {
        return this.category === match.category && this.key === match.key;
    }
}
exports.PipelineKey = PipelineKey;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmdpbmUvcGlwZWxpbmVLZXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7R0FFRztBQUNIO0lBSUksWUFBWSxRQUFnQixFQUFFLEdBQVc7UUFDckMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7SUFDbkIsQ0FBQztJQUVNLFFBQVE7UUFDWCxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDMUMsQ0FBQztJQUVNLE9BQU8sQ0FBQyxLQUFrQjtRQUM3QixPQUFPLElBQUksQ0FBQyxRQUFRLEtBQUssS0FBSyxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsR0FBRyxLQUFLLEtBQUssQ0FBQyxHQUFHLENBQUM7SUFDdEUsQ0FBQztDQUNKO0FBaEJELGtDQWdCQyIsImZpbGUiOiJlbmdpbmUvcGlwZWxpbmVLZXkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENsYXNzIGZvciBwaXBlbGluZSBrZXlcbiAqL1xuZXhwb3J0IGNsYXNzIFBpcGVsaW5lS2V5IHtcbiAgICBwdWJsaWMgY2F0ZWdvcnk6IHN0cmluZztcbiAgICBwdWJsaWMga2V5OiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihjYXRlZ29yeTogc3RyaW5nLCBrZXk6IHN0cmluZykge1xuICAgICAgICB0aGlzLmNhdGVnb3J5ID0gY2F0ZWdvcnk7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgIH1cblxuICAgIHB1YmxpYyBjb21iaW5lZCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gYCR7dGhpcy5jYXRlZ29yeX0vJHt0aGlzLmtleX1gO1xuICAgIH1cblxuICAgIHB1YmxpYyBtYXRjaGVzKG1hdGNoOiBQaXBlbGluZUtleSk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jYXRlZ29yeSA9PT0gbWF0Y2guY2F0ZWdvcnkgJiYgdGhpcy5rZXkgPT09IG1hdGNoLmtleTtcbiAgICB9XG59XG4iXX0=
