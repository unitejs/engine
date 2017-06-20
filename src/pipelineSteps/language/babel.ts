/**
 * Pipeline step to generate babel configuration.
 */
import { BabelConfiguration } from "../../configuration/models/babel/babelConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";
import { IDisplay } from "../../interfaces/IDisplay";
import { IFileSystem } from "../../interfaces/IFileSystem";
import { ILogger } from "../../interfaces/ILogger";

export class Babel extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        if (uniteConfiguration.sourceLanguage === "JavaScript") {
            try {
                super.log(logger, display, "Generating .babelrc", { rootFolder: engineVariables.rootFolder });

                const babelConfiguration = new BabelConfiguration();
                babelConfiguration.plugins = [];

                engineVariables.requiredDevDependencies.push("babel-preset-es2015");

                let modules = "";
                if (uniteConfiguration.moduleLoader === "RequireJS") {
                    modules = "amd";
                } else if (uniteConfiguration.moduleLoader === "SystemJS") {
                    modules = "systemjs";
                } else {
                    modules = "commonjs";
                }
                babelConfiguration.presets = [
                                                ["es2015", { modules }]
                                             ];

                await fileSystem.fileWriteJson(engineVariables.rootFolder, ".babelrc", babelConfiguration);
                return 0;
            } catch (err) {
                super.error(logger, display, "Generating .babelrc failed", err, { rootFolder: engineVariables.rootFolder });
                return 1;
            }
        } else {
            try {
                const exists = await fileSystem.fileExists(engineVariables.rootFolder, ".babelrc");
                if (exists) {
                    await fileSystem.fileDelete(engineVariables.rootFolder, ".babelrc");
                }
            } catch (err) {
                super.error(logger, display, "Deleting .babelrc failed", err);
                return 1;
            }
        }

        return 0;
    }
}