/**
 * Pipeline step to generate configuration for requirejs optimizer.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { HtmlTemplateConfiguration } from "../../configuration/models/htmlTemplate/htmlTemplateConfiguration";
import { ScriptIncludeMode } from "../../configuration/models/unite/scriptIncludeMode";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineKey } from "../../engine/pipelineKey";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class RJS extends PipelineStepBase {
    public influences(): PipelineKey[] {
        return [
            new PipelineKey("unite", "uniteConfigurationJson"),
            new PipelineKey("content", "packageJson"),
            new PipelineKey("content", "htmlTemplate")
        ];
    }

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        const bundledLoaderCond = super.condition(uniteConfiguration.bundledLoader, "RJS");
        const notBundledLoaderCond = super.condition(uniteConfiguration.notBundledLoader, "RJS");

        let scriptIncludeMode: ScriptIncludeMode;

        if (notBundledLoaderCond && bundledLoaderCond) {
            scriptIncludeMode = "both";
        } else if (notBundledLoaderCond) {
            scriptIncludeMode = "notBundled";
        } else if (bundledLoaderCond) {
            scriptIncludeMode = "bundled";
        } else {
            scriptIncludeMode = "none";
        }

        engineVariables.toggleClientPackage(
            "requirejs",
            "require.js",
            undefined,
            undefined,
            false,
            "both",
            scriptIncludeMode,
            false,
            undefined,
            undefined,
            undefined,
            true,
            bundledLoaderCond || notBundledLoaderCond);

        if (notBundledLoaderCond) {
            const htmlNoBundle = engineVariables.getConfiguration<HtmlTemplateConfiguration>("HTMLNoBundle");

            if (htmlNoBundle) {
                htmlNoBundle.body.push("<script src=\"./dist/app-module-config.js\"></script>");
                htmlNoBundle.body.push("<script>");
                htmlNoBundle.body.push("require(preloadModules, function() {");
                htmlNoBundle.body.push("    {UNITECONFIG}");
                htmlNoBundle.body.push("    require(['dist/entryPoint']);");
                htmlNoBundle.body.push("});");
                htmlNoBundle.body.push("</script>");
            }
        }

        return 0;
    }
}
