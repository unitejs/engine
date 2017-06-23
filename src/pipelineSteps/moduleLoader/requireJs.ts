/**
 * Pipeline step to generate configuration for requirejs.
 */
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";
import { IDisplay } from "../../interfaces/IDisplay";
import { IFileSystem } from "../../interfaces/IFileSystem";
import { ILogger } from "../../interfaces/ILogger";

export class RequireJs extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDependencies(["requirejs"], uniteConfiguration.moduleLoader === "RequireJS", false);

        if (uniteConfiguration.moduleLoader === "RequireJS") {
            try {
                super.log(logger, display, "Generating Module Loader Scaffold", { });

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

                return 0;
            } catch (err) {
                super.error(logger, display, "Generating Module Loader Scaffold failed", err);
                return 1;
            }
        }
        return 0;
    }
}