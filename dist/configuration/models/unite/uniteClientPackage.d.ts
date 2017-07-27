import { IncludeMode } from "./includeMode";
/**
 * Model of Unite Configuration (unite.json) file.
 */
export declare class UniteClientPackage {
    version: string;
    preload: boolean;
    main: string;
    mainMinified: string;
    includeMode: IncludeMode;
    isPackage: boolean;
    wrapAssets: string;
}
