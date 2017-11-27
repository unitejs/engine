/**
 * Interface for package command parameters.
 */
import { IEngineCommandParams } from "./IEngineCommandParams";

export interface IPackageCommandParams extends IEngineCommandParams {
    packageName: string | undefined | null;
}
