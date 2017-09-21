import { EngineCommandBase } from "../engine/engineCommandBase";
import { IConfigureCommandParams } from "../interfaces/IConfigureCommandParams";
import { IEngineCommand } from "../interfaces/IEngineCommand";
import { IEngineCommandParams } from "../interfaces/IEngineCommandParams";
export declare class ConfigureCommand extends EngineCommandBase implements IEngineCommand<IEngineCommandParams> {
    run(args: IConfigureCommandParams): Promise<number>;
    private configureRun(outputDirectory, uniteConfiguration, license, force);
    private addPipelinePre();
    private addPipelineDynamic();
    private addPipelinePost();
}
