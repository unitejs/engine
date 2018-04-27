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
class SJS extends pipelineStepBase_1.PipelineStepBase {
    mainCondition(uniteConfiguration, engineVariables) {
        return super.condition(uniteConfiguration.bundler, "Browserify") ||
            super.condition(uniteConfiguration.bundler, "SystemJsBuilder") ||
            super.condition(uniteConfiguration.bundler, "Webpack");
    }
    configure(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            const bundledLoaderCond = _super("condition").call(this, uniteConfiguration.bundler, "SystemJsBuilder");
            let scriptIncludeMode;
            if (mainCondition && bundledLoaderCond) {
                scriptIncludeMode = "both";
            }
            else if (mainCondition) {
                scriptIncludeMode = "notBundled";
            }
            else {
                scriptIncludeMode = "none";
            }
            engineVariables.toggleClientPackage("systemjs", {
                name: "systemjs",
                main: "dist/system.src.js",
                mainMinified: "dist/system.js",
                scriptIncludeMode,
                isModuleLoader: true
            }, mainCondition);
            if (mainCondition) {
                const htmlNoBundle = engineVariables.getConfiguration("HTMLNoBundle");
                if (htmlNoBundle) {
                    htmlNoBundle.body.push("<script src=\"./dist/app-module-config.js\"></script>");
                    htmlNoBundle.body.push("<script>");
                    htmlNoBundle.body.push("Promise.all(preloadModules.map(function(module) { return SystemJS.import(module); }))");
                    htmlNoBundle.body.push("    .then(function() {");
                    htmlNoBundle.body.push("        {UNITECONFIG}");
                    htmlNoBundle.body.push("        SystemJS.import('dist/entryPoint');");
                    htmlNoBundle.body.push("    });");
                    htmlNoBundle.body.push("</script>");
                }
            }
            return 0;
        });
    }
}
exports.SJS = SJS;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2xvYWRlci9zanMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQVNBLG9FQUFpRTtBQUVqRSxTQUFpQixTQUFRLG1DQUFnQjtJQUM5QixhQUFhLENBQUMsa0JBQXNDLEVBQUUsZUFBZ0M7UUFDekYsT0FBTyxLQUFLLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUM7WUFDekQsS0FBSyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsaUJBQWlCLENBQUM7WUFDOUQsS0FBSyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDbEUsQ0FBQztJQUVZLFNBQVMsQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQyxFQUFFLGFBQXNCOzs7WUFDN0osTUFBTSxpQkFBaUIsR0FBRyxtQkFBZSxZQUFDLGtCQUFrQixDQUFDLE9BQU8sRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1lBRXpGLElBQUksaUJBQW9DLENBQUM7WUFFekMsSUFBSSxhQUFhLElBQUksaUJBQWlCLEVBQUU7Z0JBQ3BDLGlCQUFpQixHQUFHLE1BQU0sQ0FBQzthQUM5QjtpQkFBTSxJQUFJLGFBQWEsRUFBRTtnQkFDdEIsaUJBQWlCLEdBQUcsWUFBWSxDQUFDO2FBQ3BDO2lCQUFNO2dCQUNILGlCQUFpQixHQUFHLE1BQU0sQ0FBQzthQUM5QjtZQUVELGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFLFVBQVU7Z0JBQ2hCLElBQUksRUFBRSxvQkFBb0I7Z0JBQzFCLFlBQVksRUFBRSxnQkFBZ0I7Z0JBQzlCLGlCQUFpQjtnQkFDakIsY0FBYyxFQUFFLElBQUk7YUFDdkIsRUFDRCxhQUFhLENBQUMsQ0FBQztZQUVuRCxJQUFJLGFBQWEsRUFBRTtnQkFDZixNQUFNLFlBQVksR0FBRyxlQUFlLENBQUMsZ0JBQWdCLENBQTRCLGNBQWMsQ0FBQyxDQUFDO2dCQUNqRyxJQUFJLFlBQVksRUFBRTtvQkFDZCxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyx1REFBdUQsQ0FBQyxDQUFDO29CQUNoRixZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDbkMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsdUZBQXVGLENBQUMsQ0FBQztvQkFDaEgsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsQ0FBQztvQkFDakQsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQztvQkFDaEQsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsNkNBQTZDLENBQUMsQ0FBQztvQkFDdEUsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQ2xDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2lCQUN2QzthQUNKO1lBRUQsT0FBTyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7Q0FDSjtBQTdDRCxrQkE2Q0MiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9sb2FkZXIvc2pzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIHRvIGdlbmVyYXRlIGNvbmZpZ3VyYXRpb24gZm9yIGNvbW1vbmpzLlxuICovXG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IEh0bWxUZW1wbGF0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvaHRtbFRlbXBsYXRlL2h0bWxUZW1wbGF0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFNjcmlwdEluY2x1ZGVNb2RlIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3NjcmlwdEluY2x1ZGVNb2RlXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuaW1wb3J0IHsgUGlwZWxpbmVTdGVwQmFzZSB9IGZyb20gXCIuLi8uLi9lbmdpbmUvcGlwZWxpbmVTdGVwQmFzZVwiO1xuXG5leHBvcnQgY2xhc3MgU0pTIGV4dGVuZHMgUGlwZWxpbmVTdGVwQmFzZSB7XG4gICAgcHVibGljIG1haW5Db25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKSA6IGJvb2xlYW4gfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5idW5kbGVyLCBcIkJyb3dzZXJpZnlcIikgfHxcbiAgICAgICAgICAgICAgIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uYnVuZGxlciwgXCJTeXN0ZW1Kc0J1aWxkZXJcIikgfHxcbiAgICAgICAgICAgICAgIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uYnVuZGxlciwgXCJXZWJwYWNrXCIpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBjb25maWd1cmUobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgY29uc3QgYnVuZGxlZExvYWRlckNvbmQgPSBzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLmJ1bmRsZXIsIFwiU3lzdGVtSnNCdWlsZGVyXCIpO1xuXG4gICAgICAgIGxldCBzY3JpcHRJbmNsdWRlTW9kZTogU2NyaXB0SW5jbHVkZU1vZGU7XG5cbiAgICAgICAgaWYgKG1haW5Db25kaXRpb24gJiYgYnVuZGxlZExvYWRlckNvbmQpIHtcbiAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlID0gXCJib3RoXCI7XG4gICAgICAgIH0gZWxzZSBpZiAobWFpbkNvbmRpdGlvbikge1xuICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGUgPSBcIm5vdEJ1bmRsZWRcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlID0gXCJub25lXCI7XG4gICAgICAgIH1cblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlQ2xpZW50UGFja2FnZShcInN5c3RlbWpzXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwic3lzdGVtanNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW46IFwiZGlzdC9zeXN0ZW0uc3JjLmpzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluTWluaWZpZWQ6IFwiZGlzdC9zeXN0ZW0uanNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNNb2R1bGVMb2FkZXI6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbkNvbmRpdGlvbik7XG5cbiAgICAgICAgaWYgKG1haW5Db25kaXRpb24pIHtcbiAgICAgICAgICAgIGNvbnN0IGh0bWxOb0J1bmRsZSA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPEh0bWxUZW1wbGF0ZUNvbmZpZ3VyYXRpb24+KFwiSFRNTE5vQnVuZGxlXCIpO1xuICAgICAgICAgICAgaWYgKGh0bWxOb0J1bmRsZSkge1xuICAgICAgICAgICAgICAgIGh0bWxOb0J1bmRsZS5ib2R5LnB1c2goXCI8c2NyaXB0IHNyYz1cXFwiLi9kaXN0L2FwcC1tb2R1bGUtY29uZmlnLmpzXFxcIj48L3NjcmlwdD5cIik7XG4gICAgICAgICAgICAgICAgaHRtbE5vQnVuZGxlLmJvZHkucHVzaChcIjxzY3JpcHQ+XCIpO1xuICAgICAgICAgICAgICAgIGh0bWxOb0J1bmRsZS5ib2R5LnB1c2goXCJQcm9taXNlLmFsbChwcmVsb2FkTW9kdWxlcy5tYXAoZnVuY3Rpb24obW9kdWxlKSB7IHJldHVybiBTeXN0ZW1KUy5pbXBvcnQobW9kdWxlKTsgfSkpXCIpO1xuICAgICAgICAgICAgICAgIGh0bWxOb0J1bmRsZS5ib2R5LnB1c2goXCIgICAgLnRoZW4oZnVuY3Rpb24oKSB7XCIpO1xuICAgICAgICAgICAgICAgIGh0bWxOb0J1bmRsZS5ib2R5LnB1c2goXCIgICAgICAgIHtVTklURUNPTkZJR31cIik7XG4gICAgICAgICAgICAgICAgaHRtbE5vQnVuZGxlLmJvZHkucHVzaChcIiAgICAgICAgU3lzdGVtSlMuaW1wb3J0KCdkaXN0L2VudHJ5UG9pbnQnKTtcIik7XG4gICAgICAgICAgICAgICAgaHRtbE5vQnVuZGxlLmJvZHkucHVzaChcIiAgICB9KTtcIik7XG4gICAgICAgICAgICAgICAgaHRtbE5vQnVuZGxlLmJvZHkucHVzaChcIjwvc2NyaXB0PlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbn1cbiJdfQ==
