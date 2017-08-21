/**
 * Pipeline step for Yarn.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class Yarn extends EnginePipelineStepBase {
    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        if (uniteConfiguration.packageManager === "Yarn") {
            const gitIgnoreConfiguration = engineVariables.getConfiguration<string[]>("GitIgnore");
            if (gitIgnoreConfiguration) {
                gitIgnoreConfiguration.push("node_modules");
            }
        }
        return 0;
    }
}
