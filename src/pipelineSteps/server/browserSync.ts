/**
 * Pipeline step to generate browsersync configuration.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class BrowserSync extends PipelineStepBase {
    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables) : boolean | undefined {
        return super.condition(uniteConfiguration.server, "BrowserSync");
    }

    public async configure(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        engineVariables.toggleDevDependency(["browser-sync"], mainCondition);

        return 0;
    }
}
