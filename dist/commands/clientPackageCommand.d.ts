import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteClientPackage } from "../configuration/models/unite/uniteClientPackage";
import { EngineCommandBase } from "../engine/engineCommandBase";
import { EngineVariables } from "../engine/engineVariables";
import { IClientPackageCommandParams } from "../interfaces/IClientPackageCommandParams";
import { IEngineCommand } from "../interfaces/IEngineCommand";
export declare class ClientPackageCommand extends EngineCommandBase implements IEngineCommand<IClientPackageCommandParams> {
    static retrievePackageDetails(logger: ILogger, fileSystem: IFileSystem, engineVariables: EngineVariables, clientPackage: UniteClientPackage): Promise<number>;
    run(args: IClientPackageCommandParams): Promise<number>;
    private clientPackageAdd(args, uniteConfiguration);
    private clientPackageRemove(args, uniteConfiguration);
}
