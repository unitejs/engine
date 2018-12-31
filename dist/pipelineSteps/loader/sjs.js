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
        const _super = Object.create(null, {
            condition: { get: () => super.condition }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const bundledLoaderCond = _super.condition.call(this, uniteConfiguration.bundler, "SystemJsBuilder");
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
            engineVariables.toggleClientPackage("unitejs-systemjs-plugin-babel", {
                name: "unitejs-systemjs-plugin-babel",
                main: "plugin-babel.js",
                map: {
                    "unitejs-plugin-babel": "node_modules/unitejs-systemjs-plugin-babel/plugin-babel"
                }
            }, mainCondition);
            engineVariables.toggleClientPackage("systemjs-plugin-babel", {
                name: "systemjs-plugin-babel",
                main: "plugin-babel.js",
                map: {
                    "plugin-babel": "node_modules/systemjs-plugin-babel/plugin-babel",
                    "systemjs-babel-build": "node_modules/systemjs-plugin-babel/systemjs-babel-browser"
                },
                testingAdditions: {
                    "systemjs-babel-browser.js": "**/*.js"
                }
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2xvYWRlci9zanMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQVNBLG9FQUFpRTtBQUVqRSxNQUFhLEdBQUksU0FBUSxtQ0FBZ0I7SUFDOUIsYUFBYSxDQUFDLGtCQUFzQyxFQUFFLGVBQWdDO1FBQ3pGLE9BQU8sS0FBSyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDO1lBQ3pELEtBQUssQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsT0FBTyxFQUFFLGlCQUFpQixDQUFDO1lBQzlELEtBQUssQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFFWSxTQUFTLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0MsRUFBRSxhQUFzQjs7Ozs7WUFDN0osTUFBTSxpQkFBaUIsR0FBRyxPQUFNLFNBQVMsWUFBQyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztZQUV6RixJQUFJLGlCQUFvQyxDQUFDO1lBRXpDLElBQUksYUFBYSxJQUFJLGlCQUFpQixFQUFFO2dCQUNwQyxpQkFBaUIsR0FBRyxNQUFNLENBQUM7YUFDOUI7aUJBQU0sSUFBSSxhQUFhLEVBQUU7Z0JBQ3RCLGlCQUFpQixHQUFHLFlBQVksQ0FBQzthQUNwQztpQkFBTTtnQkFDSCxpQkFBaUIsR0FBRyxNQUFNLENBQUM7YUFDOUI7WUFFRCxlQUFlLENBQUMsbUJBQW1CLENBQUMsVUFBVSxFQUFFO2dCQUNSLElBQUksRUFBRSxVQUFVO2dCQUNoQixJQUFJLEVBQUUsb0JBQW9CO2dCQUMxQixZQUFZLEVBQUUsZ0JBQWdCO2dCQUM5QixpQkFBaUI7Z0JBQ2pCLGNBQWMsRUFBRSxJQUFJO2FBQ3ZCLEVBQ0QsYUFBYSxDQUFDLENBQUM7WUFFbkQsZUFBZSxDQUFDLG1CQUFtQixDQUFDLCtCQUErQixFQUFFO2dCQUM3QixJQUFJLEVBQUUsK0JBQStCO2dCQUNyQyxJQUFJLEVBQUUsaUJBQWlCO2dCQUN2QixHQUFHLEVBQUU7b0JBQ0Qsc0JBQXNCLEVBQUUseURBQXlEO2lCQUNwRjthQUNKLEVBQ0QsYUFBYSxDQUFDLENBQUM7WUFFbkQsZUFBZSxDQUFDLG1CQUFtQixDQUFDLHVCQUF1QixFQUFFO2dCQUNyQixJQUFJLEVBQUUsdUJBQXVCO2dCQUM3QixJQUFJLEVBQUUsaUJBQWlCO2dCQUN2QixHQUFHLEVBQUU7b0JBQ0QsY0FBYyxFQUFFLGlEQUFpRDtvQkFDakUsc0JBQXNCLEVBQUUsMkRBQTJEO2lCQUN0RjtnQkFDRCxnQkFBZ0IsRUFBRTtvQkFDZCwyQkFBMkIsRUFBRSxTQUFTO2lCQUN6QzthQUNKLEVBQ0QsYUFBYSxDQUFDLENBQUM7WUFDbkQsSUFBSSxhQUFhLEVBQUU7Z0JBQ2YsTUFBTSxZQUFZLEdBQUcsZUFBZSxDQUFDLGdCQUFnQixDQUE0QixjQUFjLENBQUMsQ0FBQztnQkFDakcsSUFBSSxZQUFZLEVBQUU7b0JBQ2QsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsdURBQXVELENBQUMsQ0FBQztvQkFDaEYsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7b0JBQ25DLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHVGQUF1RixDQUFDLENBQUM7b0JBQ2hILFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLENBQUM7b0JBQ2pELFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUM7b0JBQ2hELFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLDZDQUE2QyxDQUFDLENBQUM7b0JBQ3RFLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUNsQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztpQkFDdkM7YUFDSjtZQUVELE9BQU8sQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0NBQ0o7QUFsRUQsa0JBa0VDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvbG9hZGVyL3Nqcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgc3RlcCB0byBnZW5lcmF0ZSBjb25maWd1cmF0aW9uIGZvciBjb21tb25qcy5cbiAqL1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBIdG1sVGVtcGxhdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL2h0bWxUZW1wbGF0ZS9odG1sVGVtcGxhdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBTY3JpcHRJbmNsdWRlTW9kZSB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS9zY3JpcHRJbmNsdWRlTW9kZVwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcbmltcG9ydCB7IFBpcGVsaW5lU3RlcEJhc2UgfSBmcm9tIFwiLi4vLi4vZW5naW5lL3BpcGVsaW5lU3RlcEJhc2VcIjtcblxuZXhwb3J0IGNsYXNzIFNKUyBleHRlbmRzIFBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHB1YmxpYyBtYWluQ29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcykgOiBib29sZWFuIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uYnVuZGxlciwgXCJCcm93c2VyaWZ5XCIpIHx8XG4gICAgICAgICAgICAgICBzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLmJ1bmRsZXIsIFwiU3lzdGVtSnNCdWlsZGVyXCIpIHx8XG4gICAgICAgICAgICAgICBzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLmJ1bmRsZXIsIFwiV2VicGFja1wiKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgY29uZmlndXJlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGNvbnN0IGJ1bmRsZWRMb2FkZXJDb25kID0gc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5idW5kbGVyLCBcIlN5c3RlbUpzQnVpbGRlclwiKTtcblxuICAgICAgICBsZXQgc2NyaXB0SW5jbHVkZU1vZGU6IFNjcmlwdEluY2x1ZGVNb2RlO1xuXG4gICAgICAgIGlmIChtYWluQ29uZGl0aW9uICYmIGJ1bmRsZWRMb2FkZXJDb25kKSB7XG4gICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZSA9IFwiYm90aFwiO1xuICAgICAgICB9IGVsc2UgaWYgKG1haW5Db25kaXRpb24pIHtcbiAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlID0gXCJub3RCdW5kbGVkXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZSA9IFwibm9uZVwiO1xuICAgICAgICB9XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZUNsaWVudFBhY2thZ2UoXCJzeXN0ZW1qc1wiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInN5c3RlbWpzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluOiBcImRpc3Qvc3lzdGVtLnNyYy5qc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiBcImRpc3Qvc3lzdGVtLmpzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzTW9kdWxlTG9hZGVyOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5Db25kaXRpb24pO1xuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVDbGllbnRQYWNrYWdlKFwidW5pdGVqcy1zeXN0ZW1qcy1wbHVnaW4tYmFiZWxcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJ1bml0ZWpzLXN5c3RlbWpzLXBsdWdpbi1iYWJlbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbjogXCJwbHVnaW4tYmFiZWwuanNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidW5pdGVqcy1wbHVnaW4tYmFiZWxcIjogXCJub2RlX21vZHVsZXMvdW5pdGVqcy1zeXN0ZW1qcy1wbHVnaW4tYmFiZWwvcGx1Z2luLWJhYmVsXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbkNvbmRpdGlvbik7XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZUNsaWVudFBhY2thZ2UoXCJzeXN0ZW1qcy1wbHVnaW4tYmFiZWxcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzeXN0ZW1qcy1wbHVnaW4tYmFiZWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW46IFwicGx1Z2luLWJhYmVsLmpzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInBsdWdpbi1iYWJlbFwiOiBcIm5vZGVfbW9kdWxlcy9zeXN0ZW1qcy1wbHVnaW4tYmFiZWwvcGx1Z2luLWJhYmVsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzeXN0ZW1qcy1iYWJlbC1idWlsZFwiOiBcIm5vZGVfbW9kdWxlcy9zeXN0ZW1qcy1wbHVnaW4tYmFiZWwvc3lzdGVtanMtYmFiZWwtYnJvd3NlclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVzdGluZ0FkZGl0aW9uczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3lzdGVtanMtYmFiZWwtYnJvd3Nlci5qc1wiOiBcIioqLyouanNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29uZGl0aW9uKTtcbiAgICAgICAgaWYgKG1haW5Db25kaXRpb24pIHtcbiAgICAgICAgICAgIGNvbnN0IGh0bWxOb0J1bmRsZSA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPEh0bWxUZW1wbGF0ZUNvbmZpZ3VyYXRpb24+KFwiSFRNTE5vQnVuZGxlXCIpO1xuICAgICAgICAgICAgaWYgKGh0bWxOb0J1bmRsZSkge1xuICAgICAgICAgICAgICAgIGh0bWxOb0J1bmRsZS5ib2R5LnB1c2goXCI8c2NyaXB0IHNyYz1cXFwiLi9kaXN0L2FwcC1tb2R1bGUtY29uZmlnLmpzXFxcIj48L3NjcmlwdD5cIik7XG4gICAgICAgICAgICAgICAgaHRtbE5vQnVuZGxlLmJvZHkucHVzaChcIjxzY3JpcHQ+XCIpO1xuICAgICAgICAgICAgICAgIGh0bWxOb0J1bmRsZS5ib2R5LnB1c2goXCJQcm9taXNlLmFsbChwcmVsb2FkTW9kdWxlcy5tYXAoZnVuY3Rpb24obW9kdWxlKSB7IHJldHVybiBTeXN0ZW1KUy5pbXBvcnQobW9kdWxlKTsgfSkpXCIpO1xuICAgICAgICAgICAgICAgIGh0bWxOb0J1bmRsZS5ib2R5LnB1c2goXCIgICAgLnRoZW4oZnVuY3Rpb24oKSB7XCIpO1xuICAgICAgICAgICAgICAgIGh0bWxOb0J1bmRsZS5ib2R5LnB1c2goXCIgICAgICAgIHtVTklURUNPTkZJR31cIik7XG4gICAgICAgICAgICAgICAgaHRtbE5vQnVuZGxlLmJvZHkucHVzaChcIiAgICAgICAgU3lzdGVtSlMuaW1wb3J0KCdkaXN0L2VudHJ5UG9pbnQnKTtcIik7XG4gICAgICAgICAgICAgICAgaHRtbE5vQnVuZGxlLmJvZHkucHVzaChcIiAgICB9KTtcIik7XG4gICAgICAgICAgICAgICAgaHRtbE5vQnVuZGxlLmJvZHkucHVzaChcIjwvc2NyaXB0PlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbn1cbiJdfQ==
