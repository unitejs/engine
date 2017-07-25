import { IncludeMode } from "./includeMode";
/**
 * Model of Unite Configuration (unite.json) file.
 */
export declare class UniteClientPackage {
    version: string;
    preload: boolean;
    location: string;
    main: string;
    includeMode: IncludeMode;
    isPackage: boolean;
}
