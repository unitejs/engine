/**
 * Model of Unite Package Configuration (unite-package.json) file.
 */
import { UnitePackageClientConfiguration } from "./unitePackageClientConfiguration";
import { UnitePackageRouteConfiguration } from "./unitePackageRouteConfiguration";

export class UnitePackageConfiguration {
    public name: string;
    public version: string;
    public clientPackages: { [id: string]: UnitePackageClientConfiguration };
    public routes: { [id: string]: UnitePackageRouteConfiguration };
}
