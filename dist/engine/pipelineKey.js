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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmdpbmUvcGlwZWxpbmVLZXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7R0FFRztBQUNIO0lBSUksWUFBWSxRQUFnQixFQUFFLEdBQVc7UUFDckMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7SUFDbkIsQ0FBQztJQUVNLFFBQVE7UUFDWCxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUMxQyxDQUFDO0lBRU0sT0FBTyxDQUFDLEtBQWtCO1FBQzdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxLQUFLLEtBQUssQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLEdBQUcsS0FBSyxLQUFLLENBQUMsR0FBRyxDQUFDO0lBQ3RFLENBQUM7Q0FDSjtBQWhCRCxrQ0FnQkMiLCJmaWxlIjoiZW5naW5lL3BpcGVsaW5lS2V5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDbGFzcyBmb3IgcGlwZWxpbmUga2V5XG4gKi9cbmV4cG9ydCBjbGFzcyBQaXBlbGluZUtleSB7XG4gICAgcHVibGljIGNhdGVnb3J5OiBzdHJpbmc7XG4gICAgcHVibGljIGtleTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IoY2F0ZWdvcnk6IHN0cmluZywga2V5OiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5jYXRlZ29yeSA9IGNhdGVnb3J5O1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY29tYmluZWQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGAke3RoaXMuY2F0ZWdvcnl9LyR7dGhpcy5rZXl9YDtcbiAgICB9XG5cbiAgICBwdWJsaWMgbWF0Y2hlcyhtYXRjaDogUGlwZWxpbmVLZXkpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2F0ZWdvcnkgPT09IG1hdGNoLmNhdGVnb3J5ICYmIHRoaXMua2V5ID09PSBtYXRjaC5rZXk7XG4gICAgfVxufVxuIl19
