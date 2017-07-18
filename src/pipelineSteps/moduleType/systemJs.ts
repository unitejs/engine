/**
 * Pipeline step to generate configuration for systemjs.
 */
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";
import { IDisplay } from "../../interfaces/IDisplay";
import { IFileSystem } from "../../interfaces/IFileSystem";
import { ILogger } from "../../interfaces/ILogger";

export class SystemJs extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDependencies(["systemjs"], uniteConfiguration.moduleType === "SystemJS", false);

        if (uniteConfiguration.moduleType === "SystemJS") {
            try {
                super.log(logger, display, "Generating Module Loader Scaffold", { });

                engineVariables.htmlNoBundle.scriptIncludes.push("systemjs/dist/system.js");
                uniteConfiguration.clientPackages.systemjs = { version: engineVariables.findDependencyVersion("systemjs"), main: "dist/system.js", preload: false, includeMode: "app" };

                uniteConfiguration.srcDistReplace = "(System.register)*?(..\/src\/)";
                uniteConfiguration.srcDistReplaceWith = "../dist/";

                engineVariables.htmlNoBundle.body.push("<script src=\"./dist/app-module-config.js\"></script>");
                engineVariables.htmlNoBundle.body.push("<script>");
                engineVariables.htmlNoBundle.body.push("var baseUrl = window.location.origin + window.location.pathname.replace('index.html', '');");
                engineVariables.htmlNoBundle.body.push("var packages = appModuleConfig.packages;");
                engineVariables.htmlNoBundle.body.push("packages[''] = { defaultExtension: 'js' };");
                engineVariables.htmlNoBundle.body.push("SystemJS.config({");
                engineVariables.htmlNoBundle.body.push("    baseURL: baseUrl,");
                engineVariables.htmlNoBundle.body.push("    paths: appModuleConfig.paths,");
                engineVariables.htmlNoBundle.body.push("    packages: packages");
                engineVariables.htmlNoBundle.body.push("});");
                engineVariables.htmlNoBundle.body.push("Promise.all(appModuleConfig.preload.map(function(module) { return SystemJS.import(module); }))");
                engineVariables.htmlNoBundle.body.push("    .then(function() {");
                engineVariables.htmlNoBundle.body.push("        {UNITECONFIG}");
                engineVariables.htmlNoBundle.body.push("        SystemJS.import('dist/entryPoint');");
                engineVariables.htmlNoBundle.body.push("    });");
                engineVariables.htmlNoBundle.body.push("</script>");

                engineVariables.htmlBundle.body.push("<script src=\"./dist/vendor-bundle.js{CACHEBUST}\"></script>");
                engineVariables.htmlBundle.body.push("<script>{UNITECONFIG}</script>");
                engineVariables.htmlBundle.body.push("<script src=\"./dist/app-bundle.js{CACHEBUST}\"></script>");

                return 0;
            } catch (err) {
                super.error(logger, display, "Generating Module Loader Scaffold failed", err);
                return 1;
            }
        }
        return 0;
    }
}