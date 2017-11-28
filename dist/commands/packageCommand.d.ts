import { EngineCommandBase } from "../engine/engineCommandBase";
import { IEngineCommand } from "../interfaces/IEngineCommand";
import { IPackageCommandParams } from "../interfaces/IPackageCommandParams";
export declare class PackageCommand extends EngineCommandBase implements IEngineCommand<IPackageCommandParams> {
    run(args: IPackageCommandParams): Promise<number>;
    private packageAdd(args, uniteConfiguration);
    private processPackage(uniteConfiguration, engineVariables, packageFolder, unitePackageConfiguration);
    private copyFolder(uniteConfiguration, sourceFolder, destFolder, substitutions);
    private addRoute(uniteConfiguration, engineVariables, unitePackageConfiguration);
    private addPackages(uniteConfiguration, engineVariables, unitePackageConfiguration);
}
