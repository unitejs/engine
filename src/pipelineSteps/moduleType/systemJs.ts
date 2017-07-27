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
        engineVariables.toggleClientPackage(
            "systemjs",
            "dist/system.src.js",
            "dist/system.js",
            false,
            "app",
            false,
            uniteConfiguration.moduleType === "SystemJS");

        engineVariables.toggleClientPackage(
            "systemjs-plugin-text",
            "text.js",
            undefined,
            false,
            "both",
            false,
            uniteConfiguration.moduleType === "SystemJS");

        if (uniteConfiguration.moduleType === "SystemJS") {
            try {
                super.log(logger, display, "Generating Module Loader Scaffold", { });

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
            } catch (err) {
                super.error(logger, display, "Generating Module Loader Scaffold failed", err);
                return 1;
            }
        }
        return 0;
    }
}