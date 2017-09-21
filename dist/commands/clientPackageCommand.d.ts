import { EngineCommandBase } from "../engine/engineCommandBase";
import { IClientPackageCommandParams } from "../interfaces/IClientPackageCommandParams";
import { IEngineCommand } from "../interfaces/IEngineCommand";
export declare class ClientPackageCommand extends EngineCommandBase implements IEngineCommand<IClientPackageCommandParams> {
    run(args: IClientPackageCommandParams): Promise<number>;
    private clientPackageAdd(args, uniteConfiguration);
    private clientPackageRemove(args, uniteConfiguration);
}
