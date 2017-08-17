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
            engineVariables.toggleClientPackage("systemjs", "dist/system.src.js", "dist/system.js", false, "app", false, undefined, uniteConfiguration.moduleType === "CommonJS");
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL21vZHVsZVR5cGUvY29tbW9uSnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQU1BLGdGQUE2RTtBQUc3RSxjQUFzQixTQUFRLCtDQUFzQjtJQUNuQyxPQUFPLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7O1lBQ25JLGdHQUFnRztZQUNoRyxlQUFlLENBQUMsbUJBQW1CLENBQy9CLFVBQVUsRUFDVixvQkFBb0IsRUFDcEIsZ0JBQWdCLEVBQ2hCLEtBQUssRUFDTCxLQUFLLEVBQ0wsS0FBSyxFQUNMLFNBQVMsRUFDVCxrQkFBa0IsQ0FBQyxVQUFVLEtBQUssVUFBVSxDQUFDLENBQUM7WUFFbEQsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsVUFBVSxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQy9DLElBQUksQ0FBQztvQkFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLG1DQUFtQyxDQUFDLENBQUM7b0JBRWpELGVBQWUsQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO29CQUVoRixrQkFBa0IsQ0FBQyxjQUFjLEdBQUcsd0JBQXdCLENBQUM7b0JBQzdELGtCQUFrQixDQUFDLGtCQUFrQixHQUFHLFVBQVUsQ0FBQztvQkFFbkQsZUFBZSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHVEQUF1RCxDQUFDLENBQUM7b0JBQ2hHLGVBQWUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDbkQsZUFBZSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHVGQUF1RixDQUFDLENBQUM7b0JBQ2hJLGVBQWUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO29CQUNqRSxlQUFlLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQztvQkFDaEUsZUFBZSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLDZDQUE2QyxDQUFDLENBQUM7b0JBQ3RGLGVBQWUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFDbEQsZUFBZSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO29CQUVwRCxlQUFlLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsOERBQThELENBQUMsQ0FBQztvQkFDckcsZUFBZSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGdDQUFnQyxDQUFDLENBQUM7b0JBQ3ZFLGVBQWUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQywyREFBMkQsQ0FBQyxDQUFDO29CQUVsRyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7Z0JBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDWCxNQUFNLENBQUMsS0FBSyxDQUFDLDBDQUEwQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUM5RCxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7WUFDTCxDQUFDO1lBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtDQUNKO0FBM0NELDRCQTJDQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL21vZHVsZVR5cGUvY29tbW9uSnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFBpcGVsaW5lIHN0ZXAgdG8gZ2VuZXJhdGUgY29uZmlndXJhdGlvbiBmb3IgY29tbW9uanMuXG4gKi9cbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lUGlwZWxpbmVTdGVwQmFzZSB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lUGlwZWxpbmVTdGVwQmFzZVwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcblxuZXhwb3J0IGNsYXNzIENvbW1vbkpzIGV4dGVuZHMgRW5naW5lUGlwZWxpbmVTdGVwQmFzZSB7XG4gICAgcHVibGljIGFzeW5jIHByb2Nlc3MobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgLy8gV2UgdXNlIFN5c3RlbUpTIHRvIGxvYWQgY2pzIG1vZHVsZXMgZm9yIHRoZSB1bmJ1bmRsZWQgdmVyc2lvbiBvZiB0aGUgcHJvamVjdCBhbmQgdW5pdCB0ZXN0aW5nXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVDbGllbnRQYWNrYWdlKFxuICAgICAgICAgICAgXCJzeXN0ZW1qc1wiLFxuICAgICAgICAgICAgXCJkaXN0L3N5c3RlbS5zcmMuanNcIixcbiAgICAgICAgICAgIFwiZGlzdC9zeXN0ZW0uanNcIixcbiAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgXCJhcHBcIixcbiAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLm1vZHVsZVR5cGUgPT09IFwiQ29tbW9uSlNcIik7XG5cbiAgICAgICAgaWYgKHVuaXRlQ29uZmlndXJhdGlvbi5tb2R1bGVUeXBlID09PSBcIkNvbW1vbkpTXCIpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oXCJHZW5lcmF0aW5nIE1vZHVsZSBMb2FkZXIgU2NhZmZvbGRcIik7XG5cbiAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuaHRtbE5vQnVuZGxlLnNjcmlwdEluY2x1ZGVzLnB1c2goXCJzeXN0ZW1qcy9kaXN0L3N5c3RlbS5zcmMuanNcIik7XG5cbiAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uc3JjRGlzdFJlcGxhY2UgPSBcIihyZXF1aXJlKSo/KC4uXFwvc3JjXFwvKVwiO1xuICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5zcmNEaXN0UmVwbGFjZVdpdGggPSBcIi4uL2Rpc3QvXCI7XG5cbiAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuaHRtbE5vQnVuZGxlLmJvZHkucHVzaChcIjxzY3JpcHQgc3JjPVxcXCIuL2Rpc3QvYXBwLW1vZHVsZS1jb25maWcuanNcXFwiPjwvc2NyaXB0PlwiKTtcbiAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuaHRtbE5vQnVuZGxlLmJvZHkucHVzaChcIjxzY3JpcHQ+XCIpO1xuICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5odG1sTm9CdW5kbGUuYm9keS5wdXNoKFwiUHJvbWlzZS5hbGwocHJlbG9hZE1vZHVsZXMubWFwKGZ1bmN0aW9uKG1vZHVsZSkgeyByZXR1cm4gU3lzdGVtSlMuaW1wb3J0KG1vZHVsZSk7IH0pKVwiKTtcbiAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuaHRtbE5vQnVuZGxlLmJvZHkucHVzaChcIiAgICAudGhlbihmdW5jdGlvbigpIHtcIik7XG4gICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLmh0bWxOb0J1bmRsZS5ib2R5LnB1c2goXCIgICAgICAgIHtVTklURUNPTkZJR31cIik7XG4gICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLmh0bWxOb0J1bmRsZS5ib2R5LnB1c2goXCIgICAgICAgIFN5c3RlbUpTLmltcG9ydCgnZGlzdC9lbnRyeVBvaW50Jyk7XCIpO1xuICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5odG1sTm9CdW5kbGUuYm9keS5wdXNoKFwiICAgIH0pO1wiKTtcbiAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuaHRtbE5vQnVuZGxlLmJvZHkucHVzaChcIjwvc2NyaXB0PlwiKTtcblxuICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5odG1sQnVuZGxlLmJvZHkucHVzaChcIjxzY3JpcHQgc3JjPVxcXCIuL2Rpc3QvdmVuZG9yLWJ1bmRsZS5qc3tDQUNIRUJVU1R9XFxcIj48L3NjcmlwdD5cIik7XG4gICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLmh0bWxCdW5kbGUuYm9keS5wdXNoKFwiPHNjcmlwdD57VU5JVEVDT05GSUd9PC9zY3JpcHQ+XCIpO1xuICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5odG1sQnVuZGxlLmJvZHkucHVzaChcIjxzY3JpcHQgc3JjPVxcXCIuL2Rpc3QvYXBwLWJ1bmRsZS5qc3tDQUNIRUJVU1R9XFxcIj48L3NjcmlwdD5cIik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihcIkdlbmVyYXRpbmcgTW9kdWxlIExvYWRlciBTY2FmZm9sZCBmYWlsZWRcIiwgZXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG59XG4iXX0=
