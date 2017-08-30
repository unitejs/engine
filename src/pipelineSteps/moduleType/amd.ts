/**
 * Pipeline step to generate configuration for amd modules.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { BabelConfiguration } from "../../configuration/models/babel/babelConfiguration";
import { HtmlTemplateConfiguration } from "../../configuration/models/htmlTemplate/htmlTemplateConfiguration";
import { TypeScriptConfiguration } from "../../configuration/models/typeScript/typeScriptConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class Amd extends EnginePipelineStepBase {
    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["requirejs"], super.condition(uniteConfiguration.unitTestRunner, "Karma") && super.condition(uniteConfiguration.moduleType, "AMD"));

        engineVariables.toggleClientPackage(
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
            super.condition(uniteConfiguration.moduleType, "AMD"));

        if (super.condition(uniteConfiguration.moduleType, "AMD")) {
            try {
                logger.info("Generating Module Loader Scaffold", {});

                const typeScriptConfiguration = engineVariables.getConfiguration<TypeScriptConfiguration>("TypeScript");
                if (typeScriptConfiguration) {
                    typeScriptConfiguration.compilerOptions.module = "amd";
                }

                const babelConfiguration = engineVariables.getConfiguration<BabelConfiguration>("Babel");
                if (babelConfiguration) {
                    const foundPreset = babelConfiguration.presets.find(preset => Array.isArray(preset) && preset.length > 0 && preset[0] === "es2015");
                    if (foundPreset) {
                        foundPreset[1] = { modules: "amd" };
                    } else {
                        babelConfiguration.presets.push(["es2015", { modules: "amd" }]);
                    }
                }

                uniteConfiguration.srcDistReplace = "(define)*?(..\/src\/)";
                uniteConfiguration.srcDistReplaceWith = "../dist/";

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

                const htmlBundle = engineVariables.getConfiguration<HtmlTemplateConfiguration>("HTMLBundle");

                if (htmlBundle) {
                    htmlBundle.body.push("<script src=\"./dist/vendor-bundle.js{CACHEBUST}\"></script>");
                    htmlBundle.body.push("<script>{UNITECONFIG}</script>");
                    htmlBundle.body.push("<script src=\"./dist/app-bundle.js{CACHEBUST}\"></script>");
                }

                return 0;
            } catch (err) {
                logger.error("Generating Module Loader Scaffold failed", err);
                return 1;
            }
        }
        return 0;
    }
}
