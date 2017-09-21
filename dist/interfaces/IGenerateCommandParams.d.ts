/**
 * Interface for generate command parameters.
 */
import { IEngineCommandParams } from "./IEngineCommandParams";
export interface IGenerateCommandParams extends IEngineCommandParams {
    name: string | undefined | null;
    type: string | undefined | null;
    subFolder: string | undefined | null;
}
