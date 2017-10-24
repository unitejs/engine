/**
 * Model of Unite Configuration (unite.json) file.
 */
import { IncludeMode } from "./includeMode";
import { ScriptIncludeMode } from "./scriptIncludeMode";

export class UniteClientPackage {
    public name: string;
    public version?: string;
    public main?: string;
    public mainMinified?: string;
    public testingAdditions?: { [id: string]: string };
    public preload?: boolean;
    public includeMode?: IncludeMode;
    public scriptIncludeMode?: ScriptIncludeMode;
    public isPackage?: boolean;
    public assets?: string;
    public map?: { [id: string]: string };
    public loaders?: { [id: string]: string };
    public isModuleLoader?: boolean;
    public noScript?: boolean;
    public transpileAlias?: string;
    public transpileSrc?: string[];
    public transpileTransforms?: { from: string; to: string}[];
}
