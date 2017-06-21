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
const enginePipelineStepBase_1 = require("../engine/enginePipelineStepBase");
class ModuleLoader extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            try {
                _super("log").call(this, logger, display, "Generating Module Loader Scaffold", {});
                if (uniteConfiguration.moduleLoader === "RequireJS") {
                    engineVariables.requiredDependencies.push("requirejs");
                    uniteConfiguration.staticClientModules.push("requirejs/require.js");
                    uniteConfiguration.srcDistReplace = "(define)*?(..\/src\/)";
                    uniteConfiguration.srcDistReplaceWith = "../dist/";
                    engineVariables.html.body.push("<script src=\"./dist/app-module-config.js\"></script>");
                    engineVariables.html.body.push("<script>");
                    engineVariables.html.body.push("var baseUrl = window.location.origin + window.location.pathname.replace('index.html', '');");
                    engineVariables.html.body.push("require.config({");
                    engineVariables.html.body.push("    baseUrl: baseUrl,");
                    engineVariables.html.body.push("    paths: appModuleConfig.paths,");
                    engineVariables.html.body.push("    packages: appModuleConfig.packages");
                    engineVariables.html.body.push("});");
                    engineVariables.html.body.push("require(appModuleConfig.preload, function() {");
                    engineVariables.html.body.push("    require(['dist/entryPoint']);");
                    engineVariables.html.body.push("});");
                    engineVariables.html.body.push("</script>");
                }
                else if (uniteConfiguration.moduleLoader === "SystemJS") {
                    engineVariables.requiredDependencies.push("systemjs");
                    uniteConfiguration.staticClientModules.push("systemjs/dist/system.js");
                    uniteConfiguration.srcDistReplace = "(System.register)*?(..\/src\/)";
                    uniteConfiguration.srcDistReplaceWith = "../dist/";
                    engineVariables.html.body.push("<script src=\"./dist/app-module-config.js\"></script>");
                    engineVariables.html.body.push("<script>");
                    engineVariables.html.body.push("var baseUrl = window.location.origin + window.location.pathname.replace('index.html', '');");
                    engineVariables.html.body.push("var packages = appModuleConfig.packages;");
                    engineVariables.html.body.push("packages[''] = { defaultExtension: 'js' };");
                    engineVariables.html.body.push("SystemJS.config({");
                    engineVariables.html.body.push("    baseUrl: baseUrl,");
                    engineVariables.html.body.push("    paths: appModuleConfig.paths,");
                    engineVariables.html.body.push("    packages: packages");
                    engineVariables.html.body.push("});");
                    engineVariables.html.body.push("Promise.all(appModuleConfig.preload.map(function(module) { return SystemJS.import(module); }))");
                    engineVariables.html.body.push("    .then(function() {");
                    engineVariables.html.body.push("        SystemJS.import('dist/entryPoint');");
                    engineVariables.html.body.push("    });");
                    engineVariables.html.body.push("</script>");
                }
                else if (uniteConfiguration.moduleLoader === "Webpack" || uniteConfiguration.moduleLoader === "Browserify") {
                    uniteConfiguration.srcDistReplace = "(require)*?(..\/src\/)";
                    uniteConfiguration.srcDistReplaceWith = "../dist/";
                    const appPackageKeys = Object.keys(uniteConfiguration.clientPackages).filter((key) => {
                        return uniteConfiguration.clientPackages[key].includeMode === "app" || uniteConfiguration.clientPackages[key].includeMode === "both";
                    });
                    if (appPackageKeys.length > 0) {
                        engineVariables.html.body.push("<script src=\"./dist/vendor-bundle.js\"></script>");
                    }
                    engineVariables.html.body.push("<script src=\"./dist/app-bundle.js\"></script>");
                }
                return 0;
            }
            catch (err) {
                _super("error").call(this, logger, display, "Generating Module Loader Scaffold failed", err);
                return 1;
            }
        });
    }
}
exports.ModuleLoader = ModuleLoader;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvbW9kdWxlTG9hZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFJQSw2RUFBMEU7QUFNMUUsa0JBQTBCLFNBQVEsK0NBQXNCO0lBQ3ZDLE9BQU8sQ0FBQyxNQUFlLEVBQUUsT0FBaUIsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDdEosSUFBSSxDQUFDO2dCQUNELGFBQVMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLG1DQUFtQyxFQUFFLEVBQUcsRUFBRTtnQkFFckUsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsWUFBWSxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUM7b0JBQ2xELGVBQWUsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7b0JBQ3ZELGtCQUFrQixDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO29CQUVwRSxrQkFBa0IsQ0FBQyxjQUFjLEdBQUcsdUJBQXVCLENBQUM7b0JBQzVELGtCQUFrQixDQUFDLGtCQUFrQixHQUFHLFVBQVUsQ0FBQztvQkFFbkQsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHVEQUF1RCxDQUFDLENBQUM7b0JBQ3hGLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDM0MsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLDRGQUE0RixDQUFDLENBQUM7b0JBQzdILGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO29CQUNuRCxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQztvQkFDeEQsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLG1DQUFtQyxD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QixHQUFHLFVBQVUsQ0FBQztvQkFFbkQsTUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHO3dCQUM3RSxNQUFNLENBQUMsa0JBQWtCLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsS0FBSyxLQUFLLElBQUksa0JBQWtCLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsS0FBSyxNQUFNLENBQUM7b0JBQ3pJLENBQUMsQ0FBQyxDQUFDO29CQUVILEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDNUIsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLG1EQUFtRCxDQUFDLENBQUM7b0JBQ3hGLENBQUM7b0JBQ0QsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGdEQUFnRCxDQUFDLENBQUM7Z0JBQ3JGLENBQUM7Z0JBRUQsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLDBDQUEwQyxFQUFFLEdBQUcsRUFBRTtnQkFDOUUsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7UUFDTCxDQUFDO0tBQUE7Q0FDSjtBQW5FRCxvQ0FtRUMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9tb2R1bGVMb2FkZXIuanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
