import { EngineCommandBase } from "../engine/engineCommandBase";
import { IEngineCommand } from "../interfaces/IEngineCommand";
import { IPackageCommandParams } from "../interfaces/IPackageCommandParams";
export declare class PackageCommand extends EngineCommandBase implements IEngineCommand<IPackageCommandParams> {
    run(args: IPackageCommandParams): Promise<number>;
    private packageAdd;
    private processPackage;
    private copyFolder;
    private addRoute;
    private addPackages;
    private matchesConditions;
    private propertyMatches;
    private conditionsToText;
}
