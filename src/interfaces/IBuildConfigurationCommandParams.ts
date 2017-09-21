/**
 * Interface for build configuration command parameters.
 */
import { BuildConfigurationOperation } from "./buildConfigurationOperation";
import { IEngineCommandParams } from "./IEngineCommandParams";

export interface IBuildConfigurationCommandParams extends IEngineCommandParams {
    operation: BuildConfigurationOperation | undefined | null;
    configurationName: string | undefined | null;
    bundle: boolean | undefined;
    minify: boolean | undefined;
    sourcemaps: boolean | undefined;
}
