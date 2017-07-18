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
    private static FILENAME: string = ".babelrc";

    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDependencies(["babel-core", "babel-preset-es2015"], uniteConfiguration.sourceLanguage === "JavaScript", true);

        if (uniteConfiguration.sourceLanguage === "JavaScript") {
            try {
                super.log(logger, display, `Generating ${Babel.FILENAME}`, { rootFolder: engineVariables.rootFolder });

                const babelConfiguration = new BabelConfiguration();
                babelConfiguration.plugins = [];

                let modules = "";
                if (uniteConfiguration.moduleType === "AMD") {
                    modules = "amd";
                } else if (uniteConfiguration.moduleType === "SystemJS") {
                    modules = "systemjs";
                } else {
                    modules = "commonjs";
                }
                babelConfiguration.presets = [
                                                ["es2015", { modules }]
                                             ];

                await fileSystem.fileWriteJson(engineVariables.rootFolder, Babel.FILENAME, babelConfiguration);
                return 0;
            } catch (err) {
                super.error(logger, display, `Generating ${Babel.FILENAME} failed`, err, { rootFolder: engineVariables.rootFolder });
                return 1;
            }
        } else {
            return await super.deleteFile(logger, display, fileSystem, engineVariables.rootFolder, Babel.FILENAME);
        }
    }
}