/**
 * Pipeline step to generate configuration for amd modules.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { BabelConfiguration } from "../../configuration/models/babel/babelConfiguration";
import { TypeScriptConfiguration } from "../../configuration/models/typeScript/typeScriptConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineKey } from "../../engine/pipelineKey";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class Amd extends PipelineStepBase {
    public influences(): PipelineKey[] {
        return [
            new PipelineKey("unite", "uniteConfigurationJson"),
            new PipelineKey("content", "packageJson"),
            new PipelineKey("content", "htmlTemplate"),
            new PipelineKey("language", "javaScript"),
            new PipelineKey("language", "typeScript")
        ];
    }

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        if (super.condition(uniteConfiguration.moduleType, "AMD")) {
            try {
                logger.info("Generating Module Type AMD", {});

                uniteConfiguration.srcDistReplace = "(define)*?(..\/src\/)";
                uniteConfiguration.srcDistReplaceWith = "../dist/";

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
            } catch (err) {
                logger.error(`Generating Module Type AMD failed`, err);
                return 1;
            }
        }

        return 0;
    }
}
