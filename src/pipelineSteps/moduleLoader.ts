/**
 * Pipeline step to generate scaffolding for moduleLoader.
 */
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../engine/enginePipelineStepBase";
import { EngineVariables } from "../engine/engineVariables";
import { IDisplay } from "../interfaces/IDisplay";
import { IFileSystem } from "../interfaces/IFileSystem";
import { ILogger } from "../interfaces/ILogger";

export class ModuleLoader extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            super.log(logger, display, "Generating Module Loader Scaffold", { });

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
            } else if (uniteConfiguration.moduleLoader === "SystemJS") {
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

            } else if (uniteConfiguration.moduleLoader === "Webpack" || uniteConfiguration.moduleLoader === "Browserify") {
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
        } catch (err) {
            super.error(logger, display, "Generating Module Loader Scaffold failed", err);
            return 1;
        }
    }
}