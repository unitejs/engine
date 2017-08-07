/**
 * Pipeline step to generate configuration for amd modules.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class Amd extends EnginePipelineStepBase {
    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleClientPackage(
            "requirejs",
            "require.js",
            "",
            false,
            "app",
            false,
            uniteConfiguration.moduleType === "AMD");

        engineVariables.toggleClientPackage(
            "text",
            "text.js",
            "",
            false,
            "both",
            false,
            uniteConfiguration.moduleType === "AMD");

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
            } catch (err) {
                logger.error("Generating Module Loader Scaffold failed", err);
                return 1;
            }
        }
        return 0;
    }
}
