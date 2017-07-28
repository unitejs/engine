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
class SystemJs extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleClientPackage("systemjs", "dist/system.src.js", "dist/system.js", false, "app", false, uniteConfiguration.moduleType === "SystemJS");
            engineVariables.toggleClientPackage("systemjs-plugin-text", "text.js", undefined, false, "both", false, uniteConfiguration.moduleType === "SystemJS");
            if (uniteConfiguration.moduleType === "SystemJS") {
                try {
                    _super("log").call(this, logger, display, "Generating Module Loader Scaffold", {});
                    engineVariables.htmlNoBundle.scriptIncludes.push("systemjs/dist/system.js");
                    uniteConfiguration.srcDistReplace = "(System.register)*?(..\/src\/)";
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
                    _super("error").call(this, logger, display, "Generating Module Loader Scaffold failed", err);
                    return 1;
                }
            }
            return 0;
        });
    }
}
exports.SystemJs = SystemJs;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL21vZHVsZVR5cGUvc3lzdGVtSnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQU9BLGdGQUE2RTtBQUc3RSxjQUFzQixTQUFRLCtDQUFzQjtJQUNuQyxPQUFPLENBQUMsTUFBZSxFQUFFLE9BQWlCLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQ3RKLGVBQWUsQ0FBQyxtQkFBbUIsQ0FDL0IsVUFBVSxFQUNWLG9CQUFvQixFQUNwQixnQkFBZ0IsRUFDaEIsS0FBSyxFQUNMLEtBQUssRUFDTCxLQUFLLEVBQ0wsa0JBQWtCLENBQUMsVUFBVSxLQUFLLFVBQVUsQ0FBQyxDQUFDO1lBRWxELGVBQWUsQ0FBQyxtQkFBbUIsQ0FDL0Isc0JBQXNCLEVBQ3RCLFNBQVMsRUFDVCxTQUFTLEVBQ1QsS0FBSyxFQUNMLE1BQU0sRUFDTixLQUFLLEVBQ0wsa0JBQWtCLENBQUMsVUFBVSxLQUFLLFVBQVUsQ0FBQyxDQUFDO1lBRWxELEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUMvQyxJQUFJLENBQUM7b0JBQ0QsYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsbUNBQW1DLEVBQUUsRUFBRyxFQUFFO29CQUVyRSxlQUFlLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsQ0FBQztvQkFFNUUsa0JBQWtCLENBQUMsY0FBYyxHQUFHLGdDQUFnQyxDQUFDO29CQUNyRSxrQkFBa0IsQ0FBQyxrQkFBa0IsR0FBRyxVQUFVLENBQUM7b0JBRW5ELGVBQWUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyx1REFBdUQsQ0FBQyxDQUFDO29CQUNoRyxlQUFlLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7b0JBQ25ELGVBQWUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyx1RkFBdUYsQ0FBQyxDQUFDO29CQUNoSSxlQUFlLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsQ0FBQztvQkFDakUsZUFBZSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUM7b0JBQ2hFLGVBQWUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO29CQUN0RixlQUFlLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQ2xELGVBQWUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztvQkFFcEQsZUFBZSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLDhEQUE4RCxDQUFDLENBQUM7b0JBQ3JHLGVBQWUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO29CQUN2RSxlQUFlLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsMkRBQTJELENBQUMsQ0FBQztvQkFFbEcsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsZUFBVyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsMENBQTBDLEVBQUUsR0FBRyxFQUFFO29CQUM5RSxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7WUFDTCxDQUFDO1lBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtDQUNKO0FBbERELDRCQWtEQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL21vZHVsZVR5cGUvc3lzdGVtSnMuanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
