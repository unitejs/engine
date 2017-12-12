/**
 * Model of Unite Package Configuration (unite-package.json) file.
 */
import { UniteClientPackage } from "../unite/uniteClientPackage";
import { UnitePackageCondition } from "./unitePackageCondition";
export declare class UnitePackageClientConfiguration extends UniteClientPackage {
    profile: string;
    conditions: UnitePackageCondition[];
}
