import { EngineCommandBase } from "../engine/engineCommandBase";
import { IEngineCommand } from "../interfaces/IEngineCommand";
import { IPlatformCommandParams } from "../interfaces/IPlatformCommandParams";
export declare class PlatformCommand extends EngineCommandBase implements IEngineCommand<IPlatformCommandParams> {
    run(args: IPlatformCommandParams): Promise<number>;
    private platformAdd(args, uniteConfiguration);
    private platformRemove(args, uniteConfiguration);
}
