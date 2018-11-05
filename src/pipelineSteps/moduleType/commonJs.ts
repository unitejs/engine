/**
 * Pipeline step to generate configuration for commonjs.
 */
import { ObjectHelper } from "unitejs-framework/dist/helpers/objectHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { BabelConfiguration } from "../../configuration/models/babel/babelConfiguration";
import { TypeScriptConfiguration } from "../../configuration/models/typeScript/typeScriptConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class CommonJs extends PipelineStepBase {
    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): boolean | undefined {
        return super.condition(uniteConfiguration.moduleType, "CommonJS");
    }

    public async initialise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        if (mainCondition) {
            engineVariables.moduleId = "module.id.toString()";
        }
        return 0;
    }

    public async configure(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        if (mainCondition) {
            uniteConfiguration.srcDistReplace = "(require.*?)(\.\.\/src\/)";
            uniteConfiguration.srcDistReplaceWith = "$1../dist/";
        }

        const typeScriptConfiguration = engineVariables.getConfiguration<TypeScriptConfiguration>("TypeScript");
        if (typeScriptConfiguration) {
            ObjectHelper.addRemove(typeScriptConfiguration.compilerOptions, "module", "commonjs", mainCondition);
        }

        const babelConfiguration = engineVariables.getConfiguration<BabelConfiguration>("Babel");
        if (babelConfiguration) {
            const foundPreset = babelConfiguration.presets.find(preset => Array.isArray(preset) && preset.length > 0 && preset[0] === "@babel/preset-env");
            if (foundPreset) {
                foundPreset[1] = { modules: mainCondition ? "commonjs" : undefined };
            } else {
                babelConfiguration.presets.push(["@babel/preset-env", { modules: mainCondition ? "commonjs" : undefined }]);
            }
        }

        return 0;
    }
}
