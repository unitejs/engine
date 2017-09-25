"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pipelineStepBase_1 = require("../../engine/pipelineStepBase");
class Stylus extends pipelineStepBase_1.PipelineStepBase {
    mainCondition(uniteConfiguration, engineVariables) {
        return super.condition(uniteConfiguration.cssPre, "Stylus");
    }
    initialise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        return __awaiter(this, void 0, void 0, function* () {
            this._cssSrcFolder = fileSystem.pathCombine(engineVariables.wwwRootFolder, Stylus.FOLDER);
            if (mainCondition) {
                uniteConfiguration.styleExtension = "styl";
                engineVariables.www.cssSrcFolder = this._cssSrcFolder;
            }
            return 0;
        });
    }
    configure(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["stylus"], mainCondition);
            return 0;
        });
    }
    finalise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super("folderToggle").call(this, logger, fileSystem, this._cssSrcFolder, engineVariables.force, mainCondition);
        });
    }
}
Stylus.FOLDER = "stylus";
exports.Stylus = Stylus;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2Nzc1ByZS9zdHlsdXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQU9BLG9FQUFpRTtBQUVqRSxZQUFvQixTQUFRLG1DQUFnQjtJQUtqQyxhQUFhLENBQUMsa0JBQXNDLEVBQUUsZUFBZ0M7UUFDekYsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFWSxVQUFVLENBQUMsTUFBZSxFQUNmLFVBQXVCLEVBQ3ZCLGtCQUFzQyxFQUN0QyxlQUFnQyxFQUNoQyxhQUFzQjs7WUFDMUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRTFGLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hCLGtCQUFrQixDQUFDLGNBQWMsR0FBRyxNQUFNLENBQUM7Z0JBQzNDLGVBQWUsQ0FBQyxHQUFHLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7WUFDMUQsQ0FBQztZQUNELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7SUFFWSxTQUFTLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0MsRUFBRSxhQUFzQjs7WUFDN0osZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFFL0QsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtJQUVZLFFBQVEsQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQyxFQUFFLGFBQXNCOzs7WUFDNUosTUFBTSxDQUFDLE1BQU0sc0JBQWtCLFlBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFLGVBQWUsQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDbEgsQ0FBQztLQUFBOztBQTlCYyxhQUFNLEdBQVcsUUFBUSxDQUFDO0FBRDdDLHdCQWdDQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2Nzc1ByZS9zdHlsdXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFBpcGVsaW5lIHN0ZXAgdG8gZ2VuZXJhdGUgaGFuZGxlIHN0eWx1cyBzdHlsaW5nLlxuICovXG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9waXBlbGluZVN0ZXBCYXNlXCI7XG5cbmV4cG9ydCBjbGFzcyBTdHlsdXMgZXh0ZW5kcyBQaXBlbGluZVN0ZXBCYXNlIHtcbiAgICBwcml2YXRlIHN0YXRpYyBGT0xERVI6IHN0cmluZyA9IFwic3R5bHVzXCI7XG5cbiAgICBwcml2YXRlIF9jc3NTcmNGb2xkZXI6IHN0cmluZztcblxuICAgIHB1YmxpYyBtYWluQ29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IGJvb2xlYW4gfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5jc3NQcmUsIFwiU3R5bHVzXCIpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBpbml0aWFsaXNlKGxvZ2dlcjogSUxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgdGhpcy5fY3NzU3JjRm9sZGVyID0gZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgU3R5bHVzLkZPTERFUik7XG5cbiAgICAgICAgaWYgKG1haW5Db25kaXRpb24pIHtcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5zdHlsZUV4dGVuc2lvbiA9IFwic3R5bFwiO1xuICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLnd3dy5jc3NTcmNGb2xkZXIgPSB0aGlzLl9jc3NTcmNGb2xkZXI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGNvbmZpZ3VyZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJzdHlsdXNcIl0sIG1haW5Db25kaXRpb24pO1xuXG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaW5hbGlzZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICByZXR1cm4gYXdhaXQgc3VwZXIuZm9sZGVyVG9nZ2xlKGxvZ2dlciwgZmlsZVN5c3RlbSwgdGhpcy5fY3NzU3JjRm9sZGVyLCBlbmdpbmVWYXJpYWJsZXMuZm9yY2UsIG1haW5Db25kaXRpb24pO1xuICAgIH1cbn1cbiJdfQ==
