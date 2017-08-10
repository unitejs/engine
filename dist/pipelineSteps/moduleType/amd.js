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
class Amd extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleClientPackage("requirejs", "require.js", undefined, false, "app", false, uniteConfiguration.moduleType === "AMD");
            engineVariables.toggleClientPackage("text", "text.js", undefined, false, "both", false, uniteConfiguration.moduleType === "AMD");
            if (uniteConfiguration.moduleType === "AMD") {
                try {
                    logger.info("Generating Module Loader Scaffold", {});
                    engineVariables.htmlNoBundle.scriptIncludes.push("requirejs/require.js");
                    uniteConfiguration.srcDistReplace = "(define)*?(..\/src\/)";
                    uniteConfiguration.srcDistReplaceWith = "../dist/";
                    engineVariables.htmlNoBundle.body.push("<script src=\"./dist/app-module-config.js\"></script>");
                    engineVariables.htmlNoBundle.body.push("<script>");
                    engineVariables.htmlNoBundle.body.push("require(preloadModules, function() {");
                    engineVariables.htmlNoBundle.body.push("    {UNITECONFIG}");
                    engineVariables.htmlNoBundle.body.push("    require(['dist/entryPoint']);");
                    engineVariables.htmlNoBundle.body.push("});");
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
exports.Amd = Amd;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL21vZHVsZVR5cGUvYW1kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFNQSxnRkFBNkU7QUFHN0UsU0FBaUIsU0FBUSwrQ0FBc0I7SUFDOUIsT0FBTyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOztZQUNuSSxlQUFlLENBQUMsbUJBQW1CLENBQy9CLFdBQVcsRUFDWCxZQUFZLEVBQ1osU0FBUyxFQUNULEtBQUssRUFDTCxLQUFLLEVBQ0wsS0FBSyxFQUNMLGtCQUFrQixDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUMsQ0FBQztZQUU3QyxlQUFlLENBQUMsbUJBQW1CLENBQy9CLE1BQU0sRUFDTixTQUFTLEVBQ1QsU0FBUyxFQUNULEtBQUssRUFDTCxNQUFNLEVBQ04sS0FBSyxFQUNMLGtCQUFrQixDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUMsQ0FBQztZQUU3QyxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDMUMsSUFBSSxDQUFDO29CQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsbUNBQW1DLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBRXJELGVBQWUsQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO29CQUV6RSxrQkFBa0IsQ0FBQyxjQUFjLEdBQUcsdUJBQXVCLENBQUM7b0JBQzVELGtCQUFrQixDQUFDLGtCQUFrQixHQUFHLFVBQVUsQ0FBQztvQkFFbkQsZUFBZSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHVEQUF1RCxDQUFDLENBQUM7b0JBQ2hHLGVBQWUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDbkQsZUFBZSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHNDQUFzQyxDQUFDLENBQUM7b0JBQy9FLGVBQWUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO29CQUM1RCxlQUFlLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsbUNBQW1DLENBQUMsQ0FBQztvQkFDNUUsZUFBZSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUM5QyxlQUFlLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7b0JBRXBELGVBQWUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyw4REFBOEQsQ0FBQyxDQUFDO29CQUNyRyxlQUFlLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztvQkFDdkUsZUFBZSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLDJEQUEyRCxDQUFDLENBQUM7b0JBRWxHLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztnQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsMENBQTBDLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQzlELE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztZQUNMLENBQUM7WUFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0NBQ0o7QUFqREQsa0JBaURDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvbW9kdWxlVHlwZS9hbWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFBpcGVsaW5lIHN0ZXAgdG8gZ2VuZXJhdGUgY29uZmlndXJhdGlvbiBmb3IgYW1kIG1vZHVsZXMuXG4gKi9cbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lUGlwZWxpbmVTdGVwQmFzZSB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lUGlwZWxpbmVTdGVwQmFzZVwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcblxuZXhwb3J0IGNsYXNzIEFtZCBleHRlbmRzIEVuZ2luZVBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHB1YmxpYyBhc3luYyBwcm9jZXNzKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVDbGllbnRQYWNrYWdlKFxuICAgICAgICAgICAgXCJyZXF1aXJlanNcIixcbiAgICAgICAgICAgIFwicmVxdWlyZS5qc1wiLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICBcImFwcFwiLFxuICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24ubW9kdWxlVHlwZSA9PT0gXCJBTURcIik7XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZUNsaWVudFBhY2thZ2UoXG4gICAgICAgICAgICBcInRleHRcIixcbiAgICAgICAgICAgIFwidGV4dC5qc1wiLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICBcImJvdGhcIixcbiAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLm1vZHVsZVR5cGUgPT09IFwiQU1EXCIpO1xuXG4gICAgICAgIGlmICh1bml0ZUNvbmZpZ3VyYXRpb24ubW9kdWxlVHlwZSA9PT0gXCJBTURcIikge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhcIkdlbmVyYXRpbmcgTW9kdWxlIExvYWRlciBTY2FmZm9sZFwiLCB7fSk7XG5cbiAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuaHRtbE5vQnVuZGxlLnNjcmlwdEluY2x1ZGVzLnB1c2goXCJyZXF1aXJlanMvcmVxdWlyZS5qc1wiKTtcblxuICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5zcmNEaXN0UmVwbGFjZSA9IFwiKGRlZmluZSkqPyguLlxcL3NyY1xcLylcIjtcbiAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uc3JjRGlzdFJlcGxhY2VXaXRoID0gXCIuLi9kaXN0L1wiO1xuXG4gICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLmh0bWxOb0J1bmRsZS5ib2R5LnB1c2goXCI8c2NyaXB0IHNyYz1cXFwiLi9kaXN0L2FwcC1tb2R1bGUtY29uZmlnLmpzXFxcIj48L3NjcmlwdD5cIik7XG4gICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLmh0bWxOb0J1bmRsZS5ib2R5LnB1c2goXCI8c2NyaXB0PlwiKTtcbiAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuaHRtbE5vQnVuZGxlLmJvZHkucHVzaChcInJlcXVpcmUocHJlbG9hZE1vZHVsZXMsIGZ1bmN0aW9uKCkge1wiKTtcbiAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuaHRtbE5vQnVuZGxlLmJvZHkucHVzaChcIiAgICB7VU5JVEVDT05GSUd9XCIpO1xuICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5odG1sTm9CdW5kbGUuYm9keS5wdXNoKFwiICAgIHJlcXVpcmUoWydkaXN0L2VudHJ5UG9pbnQnXSk7XCIpO1xuICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5odG1sTm9CdW5kbGUuYm9keS5wdXNoKFwifSk7XCIpO1xuICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5odG1sTm9CdW5kbGUuYm9keS5wdXNoKFwiPC9zY3JpcHQ+XCIpO1xuXG4gICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLmh0bWxCdW5kbGUuYm9keS5wdXNoKFwiPHNjcmlwdCBzcmM9XFxcIi4vZGlzdC92ZW5kb3ItYnVuZGxlLmpze0NBQ0hFQlVTVH1cXFwiPjwvc2NyaXB0PlwiKTtcbiAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuaHRtbEJ1bmRsZS5ib2R5LnB1c2goXCI8c2NyaXB0PntVTklURUNPTkZJR308L3NjcmlwdD5cIik7XG4gICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLmh0bWxCdW5kbGUuYm9keS5wdXNoKFwiPHNjcmlwdCBzcmM9XFxcIi4vZGlzdC9hcHAtYnVuZGxlLmpze0NBQ0hFQlVTVH1cXFwiPjwvc2NyaXB0PlwiKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFwiR2VuZXJhdGluZyBNb2R1bGUgTG9hZGVyIFNjYWZmb2xkIGZhaWxlZFwiLCBlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbn1cbiJdfQ==
