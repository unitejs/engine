/**
 * Model of Unite Configuration (unite.json) file.
 */
import { IncludeMode } from "./includeMode";
import { ScriptIncludeMode } from "./scriptIncludeMode";
export declare class UniteClientPackage {
    version: string;
    preload: boolean;
    main: string;
    mainMinified: string;
    testingAdditions: {
        [id: string]: string;
    };
    includeMode: IncludeMode;
    isPackage: boolean;
    assets: string;
    map: string;
    loaders: string[];
    scriptIncludeMode: ScriptIncludeMode;
}
