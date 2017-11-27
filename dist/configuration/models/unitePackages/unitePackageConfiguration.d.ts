/**
 * Model of Unite Package Configuration (unite-theme.json) file.
 */
import { UniteClientPackage } from "../unite/uniteClientPackage";
import { UnitePackageRouteConfiguration } from "./unitePackageRouteConfiguration";
export declare class UnitePackageConfiguration {
    name: string;
    version: string;
    clientPackages: UniteClientPackage[];
    routes: UnitePackageRouteConfiguration[];
}
