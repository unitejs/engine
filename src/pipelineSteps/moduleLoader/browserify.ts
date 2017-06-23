/**
 * Pipeline step to generate configuration for browserify.
 */
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";
import { IDisplay } from "../../interfaces/IDisplay";
import { IFileSystem } from "../../interfaces/IFileSystem";
import { ILogger } from "../../interfaces/ILogger";

export class Browserify extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDependencies(["browserify"], uniteConfiguration.moduleLoader === "Browserify", true);

        if (uniteConfiguration.moduleLoader === "Browserify") {
            try {
                super.log(logger, display, "Generating Module Loader Scaffold", { });

                uniteConfiguration.srcDistReplace = "(require)*?(..\/src\/)";
                uniteConfiguration.srcDistReplaceWith = "../dist/";

                const appPackageKeys = Object.keys(uniteConfiguration.clientPackages).filter((key) => {
                    return uniteConfiguration.clientPackages[key].includeMode === "app" || uniteConfiguration.clientPackages[key].includeMode === "both";
                });

                if (appPackageKeys.length > 0) {
                    engineVariables.html.body.push("<script src=\"./dist/vendor-bundle.js\"></script>");
                }
                engineVariables.html.body.push("<script src=\"./dist/app-bundle.js\"></script>");

                return 0;
            } catch (err) {
                super.error(logger, display, "Generating Module Loader Scaffold failed", err);
                return 1;
            }
        }
        return 0;
    }
}