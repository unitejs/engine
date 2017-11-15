/**
 * Unite Client Package
 */
import { IncludeMode } from "./includeMode";
import { IUniteClientPackageTranspile } from "./IUniteClientPackageTranspile";
import { ScriptIncludeMode } from "./scriptIncludeMode";

export interface IUniteClientPackage {
    name: string;
    version?: string;
    main?: string;
    mainMinified?: string;
    mainLib?: string[];
    testingAdditions?: { [id: string]: string };
    preload?: boolean;
    includeMode?: IncludeMode;
    scriptIncludeMode?: ScriptIncludeMode;
    isPackage?: boolean;
    assets?: string[];
    map?: { [id: string]: string };
    loaders?: { [id: string]: string };
    isModuleLoader?: boolean;
    noScript?: boolean;
    transpile?: IUniteClientPackageTranspile;
    hasOverrides?: boolean;
}

// Generated by UniteJS