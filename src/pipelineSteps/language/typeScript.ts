/**
 * Pipeline step to generate TypeScript configuration.
 */
import { IDisplay } from "unitejs-framework/dist/interfaces/IDisplay";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { TypeScriptCompilerOptions } from "../../configuration/models/typeScript/typeScriptCompilerOptions";
import { TypeScriptConfiguration } from "../../configuration/models/typeScript/typeScriptConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class TypeScript extends EnginePipelineStepBase {
    private static FILENAME: string = "tsconfig.json";

    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["typescript"], uniteConfiguration.sourceLanguage === "TypeScript");

        if (uniteConfiguration.sourceLanguage === "TypeScript") {
            try {
                super.log(logger, display, `Generating ${TypeScript.FILENAME}`, { wwwFolder: engineVariables.wwwFolder });

                const typeScriptConfiguration = new TypeScriptConfiguration();
                typeScriptConfiguration.compilerOptions = new TypeScriptCompilerOptions();

                typeScriptConfiguration.compilerOptions.target = "es5";
                typeScriptConfiguration.compilerOptions.moduleResolution = "node";
                typeScriptConfiguration.compilerOptions.noImplicitAny = true;
                typeScriptConfiguration.compilerOptions.noImplicitThis = true;
                typeScriptConfiguration.compilerOptions.noImplicitReturns = true;

                typeScriptConfiguration.compilerOptions.lib = ["dom", "es2015"];

                if (uniteConfiguration.moduleType === "AMD") {
                    typeScriptConfiguration.compilerOptions.module = "amd";
                } else if (uniteConfiguration.moduleType === "SystemJS") {
                    typeScriptConfiguration.compilerOptions.module = "system";
                } else {
                    typeScriptConfiguration.compilerOptions.module = "commonjs";
                }

                const additional: { [id: string]: any} = {};
                for (const key in engineVariables.transpileProperties) {
                    if (engineVariables.transpileProperties[key].required) {
                        additional[key] = engineVariables.transpileProperties[key].object;
                    }
                }
                Object.assign(typeScriptConfiguration.compilerOptions, additional);

                await fileSystem.fileWriteJson(engineVariables.wwwFolder, TypeScript.FILENAME, typeScriptConfiguration);

                return 0;
            } catch (err) {
                super.error(logger, display, `Generating ${TypeScript.FILENAME} failed`, err, { wwwFolder: engineVariables.wwwFolder });
                return 1;
            }
        } else {
            return await super.deleteFile(logger, display, fileSystem, engineVariables.wwwFolder, TypeScript.FILENAME);
        }
    }
}
