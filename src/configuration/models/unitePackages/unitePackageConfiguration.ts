/**
 * Model of Unite Package Configuration (unite-theme.json) file.
 */
import { UniteClientPackage } from "../unite/uniteClientPackage";
import { UnitePackageRouteConfiguration } from "./unitePackageRouteConfiguration";

export class UnitePackageConfiguration {
    public name: string;
    public version: string;
    public clientPackages: UniteClientPackage[];
    public routes: UnitePackageRouteConfiguration[];
}
