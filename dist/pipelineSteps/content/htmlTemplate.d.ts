/**
 * Pipeline step to generate html template.
 */
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";
import { EngineVariablesHtml } from "../../engine/engineVariablesHtml";
import { IDisplay } from "../../interfaces/IDisplay";
import { IFileSystem } from "../../interfaces/IFileSystem";
import { ILogger } from "../../interfaces/ILogger";
export declare class HtmlTemplate extends EnginePipelineStepBase {
    private static FILENAME_NO_BUNDLE;
    private static FILENAME_BUNDLE;
    process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number>;
    createTemplate(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, filename: string, engineVariablesHtml: EngineVariablesHtml): Promise<number>;
    private addLine(indent, lines, content);
}
