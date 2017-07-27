import { IncludeMode } from "./includeMode";
/**
 * Model of Unite Configuration (unite.json) file.
 */
export class UniteClientPackage {
    public version: string;
    public preload: boolean;
    public main: string;
    public mainMinified: string;
    public includeMode: IncludeMode;
    public isPackage: boolean;
    public wrapAssets: string;
}