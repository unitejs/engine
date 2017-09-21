import { EngineCommandBase } from "../engine/engineCommandBase";
import { IBuildConfigurationCommandParams } from "../interfaces/IBuildConfigurationCommandParams";
import { IEngineCommand } from "../interfaces/IEngineCommand";
export declare class BuildConfigurationCommand extends EngineCommandBase implements IEngineCommand<IBuildConfigurationCommandParams> {
    run(args: IBuildConfigurationCommandParams): Promise<number>;
    private buildConfigurationAdd(args, uniteConfiguration);
    private buildConfigurationRemove(args, uniteConfiguration);
}
