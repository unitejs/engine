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
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class CommonJs extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            // We use SystemJS to load cjs modules for the unbundled version of the project and unit testing
            engineVariables.toggleClientPackage("systemjs", "dist/system.src.js", "dist/system.js", false, "app", false, uniteConfiguration.moduleType === "CommonJS");
            if (uniteConfiguration.moduleType === "CommonJS") {
                try {
                    logger.info("Generating Module Loader Scaffold");
                    engineVariables.htmlNoBundle.scriptIncludes.push("systemjs/dist/system.src.js");
                    uniteConfiguration.srcDistReplace = "(require)*?(..\/src\/)";
                    uniteConfiguration.srcDistReplaceWith = "../dist/";
                    engineVariables.htmlNoBundle.body.push("<script src=\"./dist/app-module-config.js\"></script>");
                    engineVariables.htmlNoBundle.body.push("<script>");
                    engineVariables.htmlNoBundle.body.push("Promise.all(preloadModules.map(function(module) { return SystemJS.import(module); }))");
                    engineVariables.htmlNoBundle.body.push("    .then(function() {");
                    engineVariables.htmlNoBundle.body.push("        {UNITECONFIG}");
                    engineVariables.htmlNoBundle.body.push("        SystemJS.import('dist/entryPoint');");
                    engineVariables.htmlNoBundle.body.push("    });");
                    engineVariables.htmlNoBundle.body.push("</script>");
                    engineVariables.htmlBundle.body.push("<script src=\"./dist/vendor-bundle.js{CACHEBUST}\"></script>");
                    engineVariables.htmlBundle.body.push("<script>{UNITECONFIG}</script>");
                    engineVariables.htmlBundle.body.push("<script src=\"./dist/app-bundle.js{CACHEBUST}\"></script>");
                    return 0;
                }
                catch (err) {
                    logger.error("Generating Module Loader Scaffold failed", err);
                    return 1;
                }
            }
            return 0;
        });
    }
}
exports.CommonJs = CommonJs;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL21vZHVsZVR5cGUvY29tbW9uSnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQU1BLGdGQUE2RTtBQUc3RSxjQUFzQixTQUFRLCtDQUFzQjtJQUNuQyxPQUFPLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7O1lBQ25JLGdHQUFnRztZQUNoRyxlQUFlLENBQUMsbUJBQW1CLENBQy9CLFVBQVUsRUFDVixvQkFBb0IsRUFDcEIsZ0JBQWdCLEVBQ2hCLEtBQUssRUFDTCxLQUFLLEVBQ0wsS0FBSyxFQUNMLGtCQUFrQixDQUFDLFVBQVUsS0FBSyxVQUFVLENBQUMsQ0FBQztZQUVsRCxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDL0MsSUFBSSxDQUFDO29CQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsbUNBQW1DLENBQUMsQ0FBQztvQkFFakQsZUFBZSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLDZCQUE2QixDQUFDLENBQUM7b0JBRWhGLGtCQUFrQixDQUFDLGNBQWMsR0FBRyx3QkFBd0IsQ0FBQztvQkFDN0Qsa0JBQWtCLENBQUMsa0JBQWtCLEdBQUcsVUFBVSxDQUFDO29CQUVuRCxlQUFlLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsdURBQXVELENBQUMsQ0FBQztvQkFDaEcsZUFBZSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUNuRCxlQUFlLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsdUZBQXVGLENBQUMsQ0FBQztvQkFDaEksZUFBZSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLENBQUM7b0JBQ2pFLGVBQWUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO29CQUNoRSxlQUFlLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsNkNBQTZDLENBQUMsQ0FBQztvQkFDdEYsZUFBZSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUNsRCxlQUFlLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7b0JBRXBELGVBQWUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyw4REFBOEQsQ0FBQyxDQUFDO29CQUNyRyxlQUFlLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztvQkFDdkUsZUFBZSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLDJEQUEyRCxDQUFDLENBQUM7b0JBRWxHLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztnQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsMENBQTBDLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQzlELE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztZQUNMLENBQUM7WUFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0NBQ0o7QUExQ0QsNEJBMENDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvbW9kdWxlVHlwZS9jb21tb25Kcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgc3RlcCB0byBnZW5lcmF0ZSBjb25maWd1cmF0aW9uIGZvciBjb21tb25qcy5cbiAqL1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVQaXBlbGluZVN0ZXBCYXNlXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuXG5leHBvcnQgY2xhc3MgQ29tbW9uSnMgZXh0ZW5kcyBFbmdpbmVQaXBlbGluZVN0ZXBCYXNlIHtcbiAgICBwdWJsaWMgYXN5bmMgcHJvY2Vzcyhsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICAvLyBXZSB1c2UgU3lzdGVtSlMgdG8gbG9hZCBjanMgbW9kdWxlcyBmb3IgdGhlIHVuYnVuZGxlZCB2ZXJzaW9uIG9mIHRoZSBwcm9qZWN0IGFuZCB1bml0IHRlc3RpbmdcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZUNsaWVudFBhY2thZ2UoXG4gICAgICAgICAgICBcInN5c3RlbWpzXCIsXG4gICAgICAgICAgICBcImRpc3Qvc3lzdGVtLnNyYy5qc1wiLFxuICAgICAgICAgICAgXCJkaXN0L3N5c3RlbS5qc1wiLFxuICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICBcImFwcFwiLFxuICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24ubW9kdWxlVHlwZSA9PT0gXCJDb21tb25KU1wiKTtcblxuICAgICAgICBpZiAodW5pdGVDb25maWd1cmF0aW9uLm1vZHVsZVR5cGUgPT09IFwiQ29tbW9uSlNcIikge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhcIkdlbmVyYXRpbmcgTW9kdWxlIExvYWRlciBTY2FmZm9sZFwiKTtcblxuICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5odG1sTm9CdW5kbGUuc2NyaXB0SW5jbHVkZXMucHVzaChcInN5c3RlbWpzL2Rpc3Qvc3lzdGVtLnNyYy5qc1wiKTtcblxuICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5zcmNEaXN0UmVwbGFjZSA9IFwiKHJlcXVpcmUpKj8oLi5cXC9zcmNcXC8pXCI7XG4gICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnNyY0Rpc3RSZXBsYWNlV2l0aCA9IFwiLi4vZGlzdC9cIjtcblxuICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5odG1sTm9CdW5kbGUuYm9keS5wdXNoKFwiPHNjcmlwdCBzcmM9XFxcIi4vZGlzdC9hcHAtbW9kdWxlLWNvbmZpZy5qc1xcXCI+PC9zY3JpcHQ+XCIpO1xuICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5odG1sTm9CdW5kbGUuYm9keS5wdXNoKFwiPHNjcmlwdD5cIik7XG4gICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLmh0bWxOb0J1bmRsZS5ib2R5LnB1c2goXCJQcm9taXNlLmFsbChwcmVsb2FkTW9kdWxlcy5tYXAoZnVuY3Rpb24obW9kdWxlKSB7IHJldHVybiBTeXN0ZW1KUy5pbXBvcnQobW9kdWxlKTsgfSkpXCIpO1xuICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5odG1sTm9CdW5kbGUuYm9keS5wdXNoKFwiICAgIC50aGVuKGZ1bmN0aW9uKCkge1wiKTtcbiAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuaHRtbE5vQnVuZGxlLmJvZHkucHVzaChcIiAgICAgICAge1VOSVRFQ09ORklHfVwiKTtcbiAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuaHRtbE5vQnVuZGxlLmJvZHkucHVzaChcIiAgICAgICAgU3lzdGVtSlMuaW1wb3J0KCdkaXN0L2VudHJ5UG9pbnQnKTtcIik7XG4gICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLmh0bWxOb0J1bmRsZS5ib2R5LnB1c2goXCIgICAgfSk7XCIpO1xuICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5odG1sTm9CdW5kbGUuYm9keS5wdXNoKFwiPC9zY3JpcHQ+XCIpO1xuXG4gICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLmh0bWxCdW5kbGUuYm9keS5wdXNoKFwiPHNjcmlwdCBzcmM9XFxcIi4vZGlzdC92ZW5kb3ItYnVuZGxlLmpze0NBQ0hFQlVTVH1cXFwiPjwvc2NyaXB0PlwiKTtcbiAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuaHRtbEJ1bmRsZS5ib2R5LnB1c2goXCI8c2NyaXB0PntVTklURUNPTkZJR308L3NjcmlwdD5cIik7XG4gICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLmh0bWxCdW5kbGUuYm9keS5wdXNoKFwiPHNjcmlwdCBzcmM9XFxcIi4vZGlzdC9hcHAtYnVuZGxlLmpze0NBQ0hFQlVTVH1cXFwiPjwvc2NyaXB0PlwiKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFwiR2VuZXJhdGluZyBNb2R1bGUgTG9hZGVyIFNjYWZmb2xkIGZhaWxlZFwiLCBlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbn1cbiJdfQ==
