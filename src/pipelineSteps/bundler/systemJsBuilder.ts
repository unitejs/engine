/**
 * Pipeline step to generate configuration for systemjs builder.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class SystemJsBuilder extends PipelineStepBase {
    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables) : boolean | undefined {
        return super.condition(uniteConfiguration.bundler, "SystemJSBuilder");
    }

    public async configure(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        engineVariables.toggleDevDependency(["systemjs-builder"], mainCondition);

        return 0;
    }
}
