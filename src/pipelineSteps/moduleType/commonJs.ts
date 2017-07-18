/**
 * Pipeline step to generate configuration for commonjs.
 */
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";
import { IDisplay } from "../../interfaces/IDisplay";
import { IFileSystem } from "../../interfaces/IFileSystem";
import { ILogger } from "../../interfaces/ILogger";

export class CommonJs extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDependencies(["cajon"], uniteConfiguration.moduleType === "CommonJS", false);

        if (uniteConfiguration.moduleType === "CommonJS") {
            try {
                super.log(logger, display, "Generating Module Loader Scaffold", { });

                engineVariables.htmlNoBundle.scriptIncludes.push("cajon/cajon.js");

                uniteConfiguration.srcDistReplace = "(require)*?(..\/src\/)";
                uniteConfiguration.srcDistReplaceWith = "../dist/";

                engineVariables.htmlNoBundle.body.push("<script src=\"./dist/app-module-config.js\"></script>");
                engineVariables.htmlNoBundle.body.push("<script>");
                engineVariables.htmlNoBundle.body.push("var baseUrl = window.location.origin + window.location.pathname.replace('index.html', '');");
                engineVariables.htmlNoBundle.body.push("require.config({");
                engineVariables.htmlNoBundle.body.push("    baseUrl: baseUrl,");
                engineVariables.htmlNoBundle.body.push("    paths: appModuleConfig.paths,");
                engineVariables.htmlNoBundle.body.push("    packages: appModuleConfig.packages");
                engineVariables.htmlNoBundle.body.push("});");
                engineVariables.htmlNoBundle.body.push("require(appModuleConfig.preload, function() {");
                engineVariables.htmlNoBundle.body.push("    {UNITECONFIG}");
                engineVariables.htmlNoBundle.body.push("    require(['dist/entryPoint']);");
                engineVariables.htmlNoBundle.body.push("});");
                engineVariables.htmlNoBundle.body.push("</script>");

                const appPackageKeys = Object.keys(uniteConfiguration.clientPackages).filter((key) => {
                    return uniteConfiguration.clientPackages[key].includeMode === "app" || uniteConfiguration.clientPackages[key].includeMode === "both";
                });

                if (appPackageKeys.length > 0) {
                    engineVariables.htmlBundle.body.push("<script src=\"./dist/vendor-bundle.js{CACHEBUST}\"></script>");
                }

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