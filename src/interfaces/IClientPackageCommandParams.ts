/**
 * Interface for client package command parameters.
 */
import { IncludeMode } from "../configuration/models/unite/includeMode";
import { ScriptIncludeMode } from "../configuration/models/unite/scriptIncludeMode";
import { ClientPackageOperation } from "./clientPackageOperation";
import { IEngineCommandParams } from "./IEngineCommandParams";

export interface IClientPackageCommandParams extends IEngineCommandParams {
    operation: ClientPackageOperation | undefined | null;
    packageName: string | undefined | null;
    version: string | undefined | null;
    preload: boolean | undefined;
    includeMode: IncludeMode | undefined | null;
    scriptIncludeMode: ScriptIncludeMode | undefined | null;
    main: string | undefined | null;
    mainMinified: string | undefined | null;
    mainLib: string[] | undefined | null;
    isPackage: boolean | undefined;
    testingAdditions: string[] | undefined | null;
    assets: string[] | undefined | null;
    map: string[] | undefined | null;
    loaders: string[] | undefined | null;
    noScript: boolean | undefined;
    profile: string | undefined | null;
    packageManager: string | undefined | null;
}
