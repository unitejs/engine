/**
 * Pipeline step to generate configuration for commonjs.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { HtmlTemplateConfiguration } from "../../configuration/models/htmlTemplate/htmlTemplateConfiguration";
import { ScriptIncludeMode } from "../../configuration/models/unite/scriptIncludeMode";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class SJS extends PipelineStepBase {
    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables) : boolean | undefined {
        return super.condition(uniteConfiguration.bundler, "Browserify") ||
               super.condition(uniteConfiguration.bundler, "SystemJsBuilder") ||
               super.condition(uniteConfiguration.bundler, "Webpack");
    }

    public async install(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        const bundledLoaderCond = super.condition(uniteConfiguration.bundler, "SystemJsBuilder");
        const notBundledLoaderCond = this.mainCondition(uniteConfiguration, engineVariables);

        let scriptIncludeMode: ScriptIncludeMode;

        if (notBundledLoaderCond && bundledLoaderCond) {
            scriptIncludeMode = "both";
        } else if (notBundledLoaderCond) {
            scriptIncludeMode = "notBundled";
        } else {
            scriptIncludeMode = "none";
        }

        engineVariables.addClientPackage(
            "systemjs",
            "dist/system.src.js",
            "dist/system.js",
            undefined,
            false,
            "both",
            scriptIncludeMode,
            false,
            undefined,
            undefined,
            undefined,
            true);

        if (notBundledLoaderCond) {
            const htmlNoBundle = engineVariables.getConfiguration<HtmlTemplateConfiguration>("HTMLNoBundle");
            if (htmlNoBundle) {
                htmlNoBundle.body.push("<script src=\"./dist/app-module-config.js\"></script>");
                htmlNoBundle.body.push("<script>");
                htmlNoBundle.body.push("Promise.all(preloadModules.map(function(module) { return SystemJS.import(module); }))");
                htmlNoBundle.body.push("    .then(function() {");
                htmlNoBundle.body.push("        {UNITECONFIG}");
                htmlNoBundle.body.push("        SystemJS.import('dist/entryPoint');");
                htmlNoBundle.body.push("    });");
                htmlNoBundle.body.push("</script>");
            }
        }

        return 0;
    }

    public async uninstall(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.removeClientPackage("systemjs");

        return 0;
    }
}
