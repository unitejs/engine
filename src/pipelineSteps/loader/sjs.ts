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

    public async configure(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        const bundledLoaderCond = super.condition(uniteConfiguration.bundler, "SystemJsBuilder");

        let scriptIncludeMode: ScriptIncludeMode;

        if (mainCondition && bundledLoaderCond) {
            scriptIncludeMode = "both";
        } else if (mainCondition) {
            scriptIncludeMode = "notBundled";
        } else {
            scriptIncludeMode = "none";
        }

        engineVariables.toggleClientPackage("systemjs", {
                                                name: "systemjs",
                                                main: "dist/system.src.js",
                                                mainMinified: "dist/system.js",
                                                scriptIncludeMode,
                                                isModuleLoader: true
                                            },
                                            mainCondition);

        engineVariables.toggleClientPackage("unitejs-systemjs-plugin-babel", {
                                                name: "unitejs-systemjs-plugin-babel",
                                                main: "plugin-babel.js",
                                                map: {
                                                    "unitejs-plugin-babel": "node_modules/unitejs-systemjs-plugin-babel/plugin-babel"
                                                }
                                            },
                                            mainCondition);

        engineVariables.toggleClientPackage("systemjs-plugin-babel", {
                                                name: "systemjs-plugin-babel",
                                                main: "plugin-babel.js",
                                                map: {
                                                    "plugin-babel": "node_modules/systemjs-plugin-babel/plugin-babel",
                                                    "systemjs-babel-build": "node_modules/systemjs-plugin-babel/systemjs-babel-browser"
                                                },
                                                testingAdditions: {
                                                    "systemjs-babel-browser.js": "**/*.js"
                                                }
                                            },
                                            mainCondition);
        if (mainCondition) {
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
}
