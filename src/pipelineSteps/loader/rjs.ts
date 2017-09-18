/**
 * Pipeline step to generate configuration for requirejs optimizer.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { HtmlTemplateConfiguration } from "../../configuration/models/htmlTemplate/htmlTemplateConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class RJS extends PipelineStepBase {
    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables) : boolean | undefined {
        return super.condition(uniteConfiguration.bundler, "RequireJS");
    }

    public async install(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.addClientPackage(
            "requirejs",
            "require.js",
            undefined,
            undefined,
            false,
            "both",
            "both",
            false,
            undefined,
            undefined,
            undefined,
            true);

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

        return 0;
    }

    public async uninstall(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.removeClientPackage("requirejs");

        return 0;
    }
}
