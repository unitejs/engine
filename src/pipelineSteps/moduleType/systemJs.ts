/**
 * Pipeline step to generate configuration for systemjs.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { BabelConfiguration } from "../../configuration/models/babel/babelConfiguration";
import { HtmlTemplateConfiguration } from "../../configuration/models/htmlTemplate/htmlTemplateConfiguration";
import { KarmaConfiguration } from "../../configuration/models/karma/karmaConfiguration";
import { TypeScriptConfiguration } from "../../configuration/models/typeScript/typeScriptConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class SystemJs extends EnginePipelineStepBase {
    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        // We use SystemJS for testing CommonJS modules so we don't need to webpack the tests
        engineVariables.toggleDevDependency(["systemjs"], uniteConfiguration.unitTestRunner === "Karma" && uniteConfiguration.moduleType === "SystemJS");

        engineVariables.toggleClientPackage(
            "systemjs",
            "dist/system.src.js",
            "dist/system.js",
            false,
            "app",
            false,
            undefined,
            uniteConfiguration.moduleType === "SystemJS");

        engineVariables.toggleClientPackage(
            "systemjs-plugin-text",
            "text.js",
            undefined,
            false,
            "both",
            false,
            undefined,
            uniteConfiguration.moduleType === "SystemJS");

        if (uniteConfiguration.moduleType === "SystemJS") {
            try {
                logger.info("Generating Module Loader Scaffold");

                const typeScriptConfiguration = engineVariables.getConfiguration<TypeScriptConfiguration>("TypeScript");
                if (typeScriptConfiguration) {
                    typeScriptConfiguration.compilerOptions.module = "system";
                }

                const babelConfiguration = engineVariables.getConfiguration<BabelConfiguration>("Babel");
                if (babelConfiguration) {
                    const foundPreset = babelConfiguration.presets.find(preset => Array.isArray(preset) && preset.length > 0 && preset[0] === "es2015");
                    if (foundPreset) {
                        foundPreset[1] = { modules: "systemjs" };
                    } else {
                        babelConfiguration.presets.push(["es2015", { modules: "systemjs" }]);
                    }
                }

                const karmaConfiguration = engineVariables.getConfiguration<KarmaConfiguration>("Karma");
                if (karmaConfiguration) {
                    const sysInclude = fileSystem.pathToWeb(
                        fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.packageFolder, "systemjs/dist/system.src.js")));
                    karmaConfiguration.files.unshift({ pattern: sysInclude, included: true });
                }

                uniteConfiguration.srcDistReplace = "(System.register)*?(..\/src\/)";
                uniteConfiguration.srcDistReplaceWith = "../dist/";

                const htmlNoBundle = engineVariables.getConfiguration<HtmlTemplateConfiguration>("HTMLNoBundle");
                if (htmlNoBundle) {
                    htmlNoBundle.scriptIncludes.push("systemjs/dist/system.src.js");

                    htmlNoBundle.body.push("<script src=\"./dist/app-module-config.js\"></script>");
                    htmlNoBundle.body.push("<script>");
                    htmlNoBundle.body.push("Promise.all(preloadModules.map(function(module) { return SystemJS.import(module); }))");
                    htmlNoBundle.body.push("    .then(function() {");
                    htmlNoBundle.body.push("        {UNITECONFIG}");
                    htmlNoBundle.body.push("        SystemJS.import('dist/entryPoint');");
                    htmlNoBundle.body.push("    });");
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
