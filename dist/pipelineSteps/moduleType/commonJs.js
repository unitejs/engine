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
                    engineVariables.htmlNoBundle.scriptIncludes.push("systemjs/dist/system.js");
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL21vZHVsZVR5cGUvY29tbW9uSnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQU1BLGdGQUE2RTtBQUc3RSxjQUFzQixTQUFRLCtDQUFzQjtJQUNuQyxPQUFPLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7O1lBQ25JLGdHQUFnRztZQUNoRyxlQUFlLENBQUMsbUJBQW1CLENBQy9CLFVBQVUsRUFDVixvQkFBb0IsRUFDcEIsZ0JBQWdCLEVBQ2hCLEtBQUssRUFDTCxLQUFLLEVBQ0wsS0FBSyxFQUNMLGtCQUFrQixDQUFDLFVBQVUsS0FBSyxVQUFVLENBQUMsQ0FBQztZQUVsRCxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDL0MsSUFBSSxDQUFDO29CQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsbUNBQW1DLENBQUMsQ0FBQztvQkFFakQsZUFBZSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUM7b0JBRTVFLGtCQUFrQixDQUFDLGNBQWMsR0FBRyx3QkFBd0IsQ0FBQztvQkFDN0Qsa0JBQWtCLENBQUMsa0JBQWtCLEdBQUcsVUFBVSxDQUFDO29CQUVuRCxlQUFlLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsdURBQXVELENBQUMsQ0FBQztvQkFDaEcsZUFBZSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUNuRCxlQUFlLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsdUZBQXVGLENBQUMsQ0FBQztvQkFDaEksZUFBZSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLENBQUM7b0JBQ2pFLGVBQWUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO29CQUNoRSxlQUFlLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsNkNBQTZDLENBQUMsQ0FBQztvQkFDdEYsZUFBZSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUNsRCxlQUFlLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7b0JBRXBELGVBQWUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyw4REFBOEQsQ0FBQyxDQUFDO29CQUNyRyxlQUFlLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztvQkFDdkUsZUFBZSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLDJEQUEyRCxDQUFDLENBQUM7b0JBRWxHLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztnQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsMENBQTBDLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQzlELE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztZQUNMLENBQUM7WUFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0NBQ0o7QUExQ0QsNEJBMENDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvbW9kdWxlVHlwZS9jb21tb25Kcy5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMifQ==
