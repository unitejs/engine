/**
 * Model of Unite Package Configuration (unite-package.json) file.
 */
import { UniteClientPackage } from "../unite/uniteClientPackage";
import { UnitePackageCondition } from "./unitePackageCondition";

export class UnitePackageClientConfiguration extends UniteClientPackage {
    public profile: string;
    public conditions: UnitePackageCondition[];
}
