/**
 * Pipeline step to generate scaffolding for moduleLoader.
 */
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../engine/enginePipelineStepBase";
import { EngineVariables } from "../engine/engineVariables";
import { IDisplay } from "../interfaces/IDisplay";
import { IFileSystem } from "../interfaces/IFileSystem";
import { ILogger } from "../interfaces/ILogger";

export class ModuleLoader extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            super.log(logger, display, "Generating Module Loader Scaffold", { });

            if (uniteConfiguration.moduleLoader === "RequireJS") {
                engineVariables.requiredDependencies.push("requirejs");
                uniteConfiguration.staticClientModules.push("requirejs/require.js");

                uniteConfiguration.srcDistReplace = "(define)*?(..\/src\/)";
                uniteConfiguration.srcDistReplaceWith = "../dist/";
            } else if (uniteConfiguration.moduleLoader === "SystemJS") {
                engineVariables.requiredDependencies.push("systemjs");
                uniteConfiguration.staticClientModules.push("systemjs/dist/system.js");

                uniteConfiguration.srcDistReplace = "(System.register)*?(..\/src\/)";
                uniteConfiguration.srcDistReplaceWith = "../dist/";
            } else if (uniteConfiguration.moduleLoader === "Webpack" || uniteConfiguration.moduleLoader === "Browserify") {
                uniteConfiguration.srcDistReplace = "(require)*?(..\/src\/)";
                uniteConfiguration.srcDistReplaceWith = "../dist/";
            }

            return 0;
        } catch (err) {
            super.error(logger, display, "Generating Module Loader Scaffold failed", err);
            return 1;
        }
    }
}