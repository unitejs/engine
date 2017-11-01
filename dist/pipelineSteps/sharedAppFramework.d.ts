/**
 * Pipeline step to generate scaffolding for shared application.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../engine/engineVariables";
import { PipelineStepBase } from "../engine/pipelineStepBase";
export declare abstract class SharedAppFramework extends PipelineStepBase {
    protected generateAppSource(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, files: string[], isShared: boolean): Promise<number>;
    protected generateAppHtml(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, htmlFiles: string[]): Promise<number>;
    protected generateAppCss(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, cssFiles: string[]): Promise<number>;
    protected generateUnitTest(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, specs: string[], isShared: boolean): Promise<number>;
    protected generateE2eTest(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, specs: string[]): Promise<number>;
    protected generateCss(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number>;
    protected createLoaderReplacement(engineVariables: EngineVariables, extension: string, loader: string, includeRequires: boolean): void;
    protected createLoaderTypeMapReplacement(engineVariables: EngineVariables, extension: string, loader: string): void;
}
