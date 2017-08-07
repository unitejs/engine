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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL21vZHVsZVR5cGUvYW1kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFNQSxnRkFBNkU7QUFHN0UsU0FBaUIsU0FBUSwrQ0FBc0I7SUFDOUIsT0FBTyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOztZQUNuSSxlQUFlLENBQUMsbUJBQW1CLENBQy9CLFdBQVcsRUFDWCxZQUFZLEVBQ1osU0FBUyxFQUNULEtBQUssRUFDTCxLQUFLLEVBQ0wsS0FBSyxFQUNMLGtCQUFrQixDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUMsQ0FBQztZQUU3QyxlQUFlLENBQUMsbUJBQW1CLENBQy9CLE1BQU0sRUFDTixTQUFTLEVBQ1QsU0FBUyxFQUNULEtBQUssRUFDTCxNQUFNLEVBQ04sS0FBSyxFQUNMLGtCQUFrQixDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUMsQ0FBQztZQUU3QyxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDMUMsSUFBSSxDQUFDO29CQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsbUNBQW1DLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBRXJELGVBQWUsQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO29CQUV6RSxrQkFBa0IsQ0FBQyxjQUFjLEdBQUcsdUJBQXVCLENBQUM7b0JBQzVELGtCQUFrQixDQUFDLGtCQUFrQixHQUFHLFVBQVUsQ0FBQztvQkFFbkQsZUFBZSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHVEQUF1RCxDQUFDLENBQUM7b0JBQ2hHLGVBQWUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDbkQsZUFBZSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHNDQUFzQyxDQUFDLENBQUM7b0JBQy9FLGVBQWUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO29CQUM1RCxlQUFlLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsbUNBQW1DLENBQUMsQ0FBQztvQkFDNUUsZUFBZSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUM5QyxlQUFlLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7b0JBRXBELGVBQWUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyw4REFBOEQsQ0FBQyxDQUFDO29CQUNyRyxlQUFlLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztvQkFDdkUsZUFBZSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLDJEQUEyRCxDQUFDLENBQUM7b0JBRWxHLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztnQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsMENBQTBDLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQzlELE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztZQUNMLENBQUM7WUFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0NBQ0o7QUFqREQsa0JBaURDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvbW9kdWxlVHlwZS9hbWQuanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
