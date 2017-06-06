/**
 * Pipeline step to generate TypeScript configuration.
 */
import { TypeScriptCompilerOptions } from "../configuration/models/typeScript/typeScriptCompilerOptions";
import { TypeScriptConfiguration } from "../configuration/models/typeScript/typeScriptConfiguration";
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../engine/enginePipelineStepBase";
import { EngineVariables } from "../engine/engineVariables";
import { IDisplay } from "../interfaces/IDisplay";
import { IFileSystem } from "../interfaces/IFileSystem";
import { ILogger } from "../interfaces/ILogger";

export class TypeScript extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {

        if (uniteConfiguration.sourceLanguage === "TypeScript") {
            try {
                super.log(logger, display, "Generating tsconfig.json", { outputDirectory: uniteConfiguration.outputDirectory });

                const typeScriptConfiguration = new TypeScriptConfiguration();
                typeScriptConfiguration.compilerOptions = new TypeScriptCompilerOptions();

                typeScriptConfiguration.compilerOptions.target = "es5";
                typeScriptConfiguration.compilerOptions.moduleResolution = "node";
                typeScriptConfiguration.compilerOptions.strict = true;

                if (uniteConfiguration.moduleLoader === "RequireJS") {
                    typeScriptConfiguration.compilerOptions.module = "amd";
                } else if (uniteConfiguration.moduleLoader === "SystemJS") {
                    typeScriptConfiguration.compilerOptions.module = "system";
                } else {
                    typeScriptConfiguration.compilerOptions.module = "commonjs";
                }

                await fileSystem.fileWriteJson(uniteConfiguration.outputDirectory, "tsconfig.json", typeScriptConfiguration);
                return 0;
            } catch (err) {
                super.error(logger, display, "Generating tsconfig.json failed", err, { outputDirectory: uniteConfiguration.outputDirectory });
                return 1;
            }
        }

        return 0;
    }
}