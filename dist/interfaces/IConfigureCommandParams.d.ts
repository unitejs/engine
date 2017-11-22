/**
 * Interface for configure command parameters.
 */
import { IEngineCommandParams } from "./IEngineCommandParams";
export interface IConfigureCommandParams extends IEngineCommandParams {
    packageName: string | undefined | null;
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
    cssLinter: string | undefined | null;
    documenter: string | undefined | null;
    ides: string[] | undefined | null;
    server: string | undefined | null;
    taskManager: string | undefined | null;
    packageManager: string | undefined | null;
    applicationFramework: string | undefined | null;
    profile: string | undefined | null;
    title: string | undefined | null;
    shortName: string | undefined | null;
    description: string | undefined | null;
    keywords: string[] | undefined | null;
    organization: string | undefined | null;
    copyright: string | undefined | null;
    webSite: string | undefined | null;
    author: string | undefined | null;
    authorEmail: string | undefined | null;
    authorWebSite: string | undefined | null;
    namespace: string | undefined | null;
    noCreateSource: boolean | undefined;
    force: boolean | undefined;
}
