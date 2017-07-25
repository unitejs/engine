/**
 * Pipeline step to generate scaffolding for plain application.
 */
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { IDisplay } from "../../interfaces/IDisplay";
import { IFileSystem } from "../../interfaces/IFileSystem";
import { ILogger } from "../../interfaces/ILogger";
import { SharedAppFramework } from "./sharedAppFramework";
export declare class PlainApp extends SharedAppFramework {
    process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number>;
}
