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
            engineVariables.toggleClientPackage("systemjs", "dist/system.src.js", "dist/system.js", undefined, false, "both", scriptIncludeMode, false, undefined, undefined, undefined, true, mainCondition);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2xvYWRlci9zanMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQVNBLG9FQUFpRTtBQUVqRSxTQUFpQixTQUFRLG1DQUFnQjtJQUM5QixhQUFhLENBQUMsa0JBQXNDLEVBQUUsZUFBZ0M7UUFDekYsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQztZQUN6RCxLQUFLLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sRUFBRSxpQkFBaUIsQ0FBQztZQUM5RCxLQUFLLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBRVksU0FBUyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDLEVBQUUsYUFBc0I7OztZQUM3SixNQUFNLGlCQUFpQixHQUFHLG1CQUFlLFlBQUMsa0JBQWtCLENBQUMsT0FBTyxFQUFFLGlCQUFpQixDQUFDLENBQUM7WUFFekYsSUFBSSxpQkFBb0MsQ0FBQztZQUV6QyxFQUFFLENBQUMsQ0FBQyxhQUFhLElBQUksaUJBQWlCLENBQUMsQ0FBQyxDQUFDO2dCQUNyQyxpQkFBaUIsR0FBRyxNQUFNLENBQUM7WUFDL0IsQ0FBQztZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUN2QixpQkFBaUIsR0FBRyxZQUFZLENBQUM7WUFDckMsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLGlCQUFpQixHQUFHLE1BQU0sQ0FBQztZQUMvQixDQUFDO1lBRUQsZUFBZSxDQUFDLG1CQUFtQixDQUMvQixVQUFVLEVBQ1Ysb0JBQW9CLEVBQ3BCLGdCQUFnQixFQUNoQixTQUFTLEVBQ1QsS0FBSyxFQUNMLE1BQU0sRUFDTixpQkFBaUIsRUFDakIsS0FBSyxFQUNMLFNBQVMsRUFDVCxTQUFTLEVBQ1QsU0FBUyxFQUNULElBQUksRUFDSixhQUFhLENBQUMsQ0FBQztZQUVuQixFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUNoQixNQUFNLFlBQVksR0FBRyxlQUFlLENBQUMsZ0JBQWdCLENBQTRCLGNBQWMsQ0FBQyxDQUFDO2dCQUNqRyxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO29CQUNmLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHVEQUF1RCxDQUFDLENBQUM7b0JBQ2hGLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUNuQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyx1RkFBdUYsQ0FBQyxDQUFDO29CQUNoSCxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO29CQUNqRCxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO29CQUNoRCxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO29CQUN0RSxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFDbEMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQ3hDLENBQUM7WUFDTCxDQUFDO1lBRUQsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtDQUNKO0FBbkRELGtCQW1EQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2xvYWRlci9zanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFBpcGVsaW5lIHN0ZXAgdG8gZ2VuZXJhdGUgY29uZmlndXJhdGlvbiBmb3IgY29tbW9uanMuXG4gKi9cbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgSHRtbFRlbXBsYXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy9odG1sVGVtcGxhdGUvaHRtbFRlbXBsYXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgU2NyaXB0SW5jbHVkZU1vZGUgfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvc2NyaXB0SW5jbHVkZU1vZGVcIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9waXBlbGluZVN0ZXBCYXNlXCI7XG5cbmV4cG9ydCBjbGFzcyBTSlMgZXh0ZW5kcyBQaXBlbGluZVN0ZXBCYXNlIHtcbiAgICBwdWJsaWMgbWFpbkNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpIDogYm9vbGVhbiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiBzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLmJ1bmRsZXIsIFwiQnJvd3NlcmlmeVwiKSB8fFxuICAgICAgICAgICAgICAgc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5idW5kbGVyLCBcIlN5c3RlbUpzQnVpbGRlclwiKSB8fFxuICAgICAgICAgICAgICAgc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5idW5kbGVyLCBcIldlYnBhY2tcIik7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGNvbmZpZ3VyZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBjb25zdCBidW5kbGVkTG9hZGVyQ29uZCA9IHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uYnVuZGxlciwgXCJTeXN0ZW1Kc0J1aWxkZXJcIik7XG5cbiAgICAgICAgbGV0IHNjcmlwdEluY2x1ZGVNb2RlOiBTY3JpcHRJbmNsdWRlTW9kZTtcblxuICAgICAgICBpZiAobWFpbkNvbmRpdGlvbiAmJiBidW5kbGVkTG9hZGVyQ29uZCkge1xuICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGUgPSBcImJvdGhcIjtcbiAgICAgICAgfSBlbHNlIGlmIChtYWluQ29uZGl0aW9uKSB7XG4gICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZSA9IFwibm90QnVuZGxlZFwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGUgPSBcIm5vbmVcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVDbGllbnRQYWNrYWdlKFxuICAgICAgICAgICAgXCJzeXN0ZW1qc1wiLFxuICAgICAgICAgICAgXCJkaXN0L3N5c3RlbS5zcmMuanNcIixcbiAgICAgICAgICAgIFwiZGlzdC9zeXN0ZW0uanNcIixcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgXCJib3RoXCIsXG4gICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZSxcbiAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgdHJ1ZSxcbiAgICAgICAgICAgIG1haW5Db25kaXRpb24pO1xuXG4gICAgICAgIGlmIChtYWluQ29uZGl0aW9uKSB7XG4gICAgICAgICAgICBjb25zdCBodG1sTm9CdW5kbGUgPSBlbmdpbmVWYXJpYWJsZXMuZ2V0Q29uZmlndXJhdGlvbjxIdG1sVGVtcGxhdGVDb25maWd1cmF0aW9uPihcIkhUTUxOb0J1bmRsZVwiKTtcbiAgICAgICAgICAgIGlmIChodG1sTm9CdW5kbGUpIHtcbiAgICAgICAgICAgICAgICBodG1sTm9CdW5kbGUuYm9keS5wdXNoKFwiPHNjcmlwdCBzcmM9XFxcIi4vZGlzdC9hcHAtbW9kdWxlLWNvbmZpZy5qc1xcXCI+PC9zY3JpcHQ+XCIpO1xuICAgICAgICAgICAgICAgIGh0bWxOb0J1bmRsZS5ib2R5LnB1c2goXCI8c2NyaXB0PlwiKTtcbiAgICAgICAgICAgICAgICBodG1sTm9CdW5kbGUuYm9keS5wdXNoKFwiUHJvbWlzZS5hbGwocHJlbG9hZE1vZHVsZXMubWFwKGZ1bmN0aW9uKG1vZHVsZSkgeyByZXR1cm4gU3lzdGVtSlMuaW1wb3J0KG1vZHVsZSk7IH0pKVwiKTtcbiAgICAgICAgICAgICAgICBodG1sTm9CdW5kbGUuYm9keS5wdXNoKFwiICAgIC50aGVuKGZ1bmN0aW9uKCkge1wiKTtcbiAgICAgICAgICAgICAgICBodG1sTm9CdW5kbGUuYm9keS5wdXNoKFwiICAgICAgICB7VU5JVEVDT05GSUd9XCIpO1xuICAgICAgICAgICAgICAgIGh0bWxOb0J1bmRsZS5ib2R5LnB1c2goXCIgICAgICAgIFN5c3RlbUpTLmltcG9ydCgnZGlzdC9lbnRyeVBvaW50Jyk7XCIpO1xuICAgICAgICAgICAgICAgIGh0bWxOb0J1bmRsZS5ib2R5LnB1c2goXCIgICAgfSk7XCIpO1xuICAgICAgICAgICAgICAgIGh0bWxOb0J1bmRsZS5ib2R5LnB1c2goXCI8L3NjcmlwdD5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG59XG4iXX0=
