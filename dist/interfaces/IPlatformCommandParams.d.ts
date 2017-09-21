/**
 * Interface for platform command parameters.
 */
import { IEngineCommandParams } from "./IEngineCommandParams";
import { PlatformOperation } from "./platformOperation";
export interface IPlatformCommandParams extends IEngineCommandParams {
    operation: PlatformOperation | undefined | null;
    platformName: string | undefined | null;
}
