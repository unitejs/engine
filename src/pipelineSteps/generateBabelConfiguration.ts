/**
 * Pipeline step to generate babel configuration.
 */
import { BabelConfiguration } from "../configuration/models/babel/babelConfiguration";
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { UniteLanguage } from "../configuration/models/unite/uniteLanguage";
import { UniteModuleLoader } from "../configuration/models/unite/uniteModuleLoader";
import { EnginePipelineStepBase } from "../engine/enginePipelineStepBase";
import { EngineVariables } from "../engine/engineVariables";
import { IDisplay } from "../interfaces/IDisplay";
import { IFileSystem } from "../interfaces/IFileSystem";
import { ILogger } from "../interfaces/ILogger";

export class GenerateBabelConfiguration extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {

        if (engineVariables.uniteLanguage === UniteLanguage.ES5 || engineVariables.uniteLanguage === UniteLanguage.ES6) {
            try {
                super.log(logger, display, "Generating .babelrc", { outputDirectory: uniteConfiguration.outputDirectory });

                uniteConfiguration.devDependencies["gulp-babel"] = "^6.1.2";

                const babelConfiguration = new BabelConfiguration();
                babelConfiguration.plugins = [];

                uniteConfiguration.devDependencies["babel-preset-es2015"] = "^6.24.1";

                let modules = "";
                if (engineVariables.uniteModuleLoader === UniteModuleLoader.RequireJS) {
                    modules = "amd";
                } else if (engineVariables.uniteModuleLoader === UniteModuleLoader.JSPM) {
                    modules = "systemjs";
                } else {
                    modules = "commonjs";
                }
                babelConfiguration.presets = [
                                                ["es2015", { modules }]
                                             ];

                await fileSystem.fileWriteJson(uniteConfiguration.outputDirectory, ".babelrc", babelConfiguration);
                return 0;
            } catch (err) {
                super.error(logger, display, "Generating .babelrc failed", err, { outputDirectory: uniteConfiguration.outputDirectory });
                return 1;
            }
        }

        return 0;
    }
}