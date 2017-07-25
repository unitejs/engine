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
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleClientPackage("requirejs", "", "require.js", false, "app", false, uniteConfiguration.moduleType === "AMD");
            engineVariables.toggleClientPackage("text", "", "text.js", false, "both", false, uniteConfiguration.moduleType === "AMD");
            if (uniteConfiguration.moduleType === "AMD") {
                try {
                    _super("log").call(this, logger, display, "Generating Module Loader Scaffold", {});
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
                    _super("error").call(this, logger, display, "Generating Module Loader Scaffold failed", err);
                    return 1;
                }
            }
            return 0;
        });
    }
}
exports.Amd = Amd;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9waXBlbGluZVN0ZXBzL21vZHVsZVR5cGUvYW1kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFJQSxnRkFBNkU7QUFNN0UsU0FBaUIsU0FBUSwrQ0FBc0I7SUFDOUIsT0FBTyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUN0SixlQUFlLENBQUMsbUJBQW1CLENBQy9CLFdBQVcsRUFDWCxFQUFFLEVBQ0YsWUFBWSxFQUNaLEtBQUssRUFDTCxLQUFLLEVBQ0wsS0FBSyxFQUNMLGtCQUFrQixDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUMsQ0FBQztZQUU3QyxlQUFlLENBQUMsbUJBQW1CLENBQy9CLE1BQU0sRUFDTixFQUFFLEVBQ0YsU0FBUyxFQUNULEtBQUssRUFDTCxNQUFNLEVBQ04sS0FBSyxFQUNMLGtCQUFrQixDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUMsQ0FBQztZQUU3QyxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDMUMsSUFBSSxDQUFDO29CQUNELGFBQVMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLG1DQUFtQyxFQUFFLEVBQUUsRUFBRTtvQkFFcEUsZUFBZSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUM7b0JBRXpFLGtCQUFrQixDQUFDLGNBQWMsR0FBRyx1QkFBdUIsQ0FBQztvQkFDNUQsa0JBQWtCLENBQUMsa0JBQWtCLEdBQUcsVUFBVSxDQUFDO29CQUVuRCxlQUFlLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsdURBQXVELENBQUMsQ0FBQztvQkFDaEcsZUFBZSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUNuRCxlQUFlLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsc0NBQXNDLENBQUMsQ0FBQztvQkFDL0UsZUFBZSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7b0JBQzVELGVBQWUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO29CQUM1RSxlQUFlLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQzlDLGVBQWUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztvQkFFcEQsZUFBZSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLDhEQUE4RCxDQUFDLENBQUM7b0JBQ3JHLGVBQWUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO29CQUN2RSxlQUFlLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsMkRBQTJELENBQUMsQ0FBQztvQkFFbEcsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsZUFBVyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsMENBQTBDLEVBQUUsR0FBRyxFQUFFO29CQUM5RSxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7WUFDTCxDQUFDO1lBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtDQUNKO0FBakRELGtCQWlEQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL21vZHVsZVR5cGUvYW1kLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
