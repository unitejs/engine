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
    public map: { [id: string]: string };
    public loaders: { [id: string]: string };
    public scriptIncludeMode: ScriptIncludeMode;
    public isModuleLoader: boolean;
}
