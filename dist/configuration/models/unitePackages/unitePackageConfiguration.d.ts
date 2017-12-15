/**
 * Model of Unite Package Configuration (unite-package.json) file.
 */
import { UnitePackageClientConfiguration } from "./unitePackageClientConfiguration";
import { UnitePackageCondition } from "./unitePackageCondition";
import { UnitePackageRouteConfiguration } from "./unitePackageRouteConfiguration";
export declare class UnitePackageConfiguration {
    name: string;
    version: string;
    clientPackages?: {
        [id: string]: UnitePackageClientConfiguration;
    };
    routes?: {
        [id: string]: UnitePackageRouteConfiguration;
    };
    conditions?: UnitePackageCondition[];
}
