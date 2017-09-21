/**
 * Interface for configure command parameters.
 */
import { IEngineCommandParams } from "./IEngineCommandParams";

export interface IConfigureCommandParams extends IEngineCommandParams {
    packageName: string | undefined | null;
    title: string | undefined | null;
    license: string | undefined | null;
    sourceLanguage: string | undefined | null;
    moduleType: string | undefined | null;
    bundler: string | undefined | null;
    unitTestRunner: string | undefined | null;
    unitTestFramework: string | undefined | null;
    unitTestEngine: string | undefined | null;
    e2eTestRunner: string | undefined | null;
    e2eTestFramework: string | undefined | null;
    linter: string | undefined | null;
    cssPre: string | undefined | null;
    cssPost: string | undefined | null;
    packageManager: string | undefined | null;
    applicationFramework: string | undefined | null;
    profile: string | undefined | null;
    force: boolean | undefined;
}
