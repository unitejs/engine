/**
 * Pipeline step to generate TypeScript configuration.
 */
import { TypeScriptCompilerOptions } from "../../configuration/models/typeScript/typeScriptCompilerOptions";
import { TypeScriptConfiguration } from "../../configuration/models/typeScript/typeScriptConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";
import { IDisplay } from "../../interfaces/IDisplay";
import { IFileSystem } from "../../interfaces/IFileSystem";
import { ILogger } from "../../interfaces/ILogger";

export class TypeScript extends EnginePipelineStepBase {
    private static FILENAME: string = "tsconfig.json";

    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDependencies(["typescript"], uniteConfiguration.sourceLanguage === "TypeScript", true);

        if (uniteConfiguration.sourceLanguage === "TypeScript") {
            try {
                super.log(logger, display, `Generating ${TypeScript.FILENAME}`, { rootFolder: engineVariables.rootFolder });

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

                await fileSystem.fileWriteJson(engineVariables.rootFolder, TypeScript.FILENAME, typeScriptConfiguration);
                return 0;
            } catch (err) {
                super.error(logger, display, `Generating ${TypeScript.FILENAME} failed`, err, { rootFolder: engineVariables.rootFolder });
                return 1;
            }
        } else {
            try {
                const exists = await fileSystem.fileExists(engineVariables.rootFolder, TypeScript.FILENAME);
                if (exists) {
                    await fileSystem.fileDelete(engineVariables.rootFolder, TypeScript.FILENAME);
                }
            } catch (err) {
                super.error(logger, display, `Deleting ${TypeScript.FILENAME} failed`, err);
                return 1;
            }
        }

        return 0;
    }
}