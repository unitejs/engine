/**
 * Model of Unite Configuration (unite.json) file.
 */
import { IncludeMode } from "./includeMode";
import { ScriptIncludeMode } from "./scriptIncludeMode";

export class UniteClientPackage {
    public version: string;
    public preload: boolean;
    public main: string;
    public mainMinified: string;
    public testingAdditions: { [id: string]: string };
    public includeMode: IncludeMode;
    public isPackage: boolean;
    public assets: string;
    public map: string;
    public loaders: string[];
    public scriptIncludeMode: ScriptIncludeMode;
}
