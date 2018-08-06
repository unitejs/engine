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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmdpbmUvcGlwZWxpbmVLZXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7R0FFRztBQUNILE1BQWEsV0FBVztJQUlwQixZQUFZLFFBQWdCLEVBQUUsR0FBVztRQUNyQyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztJQUNuQixDQUFDO0lBRU0sUUFBUTtRQUNYLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUMxQyxDQUFDO0lBRU0sT0FBTyxDQUFDLEtBQWtCO1FBQzdCLE9BQU8sSUFBSSxDQUFDLFFBQVEsS0FBSyxLQUFLLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxHQUFHLEtBQUssS0FBSyxDQUFDLEdBQUcsQ0FBQztJQUN0RSxDQUFDO0NBQ0o7QUFoQkQsa0NBZ0JDIiwiZmlsZSI6ImVuZ2luZS9waXBlbGluZUtleS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ2xhc3MgZm9yIHBpcGVsaW5lIGtleVxuICovXG5leHBvcnQgY2xhc3MgUGlwZWxpbmVLZXkge1xuICAgIHB1YmxpYyBjYXRlZ29yeTogc3RyaW5nO1xuICAgIHB1YmxpYyBrZXk6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKGNhdGVnb3J5OiBzdHJpbmcsIGtleTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuY2F0ZWdvcnkgPSBjYXRlZ29yeTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgfVxuXG4gICAgcHVibGljIGNvbWJpbmVkKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBgJHt0aGlzLmNhdGVnb3J5fS8ke3RoaXMua2V5fWA7XG4gICAgfVxuXG4gICAgcHVibGljIG1hdGNoZXMobWF0Y2g6IFBpcGVsaW5lS2V5KTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhdGVnb3J5ID09PSBtYXRjaC5jYXRlZ29yeSAmJiB0aGlzLmtleSA9PT0gbWF0Y2gua2V5O1xuICAgIH1cbn1cbiJdfQ==
