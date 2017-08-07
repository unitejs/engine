/**
 * Pipeline step to generate html template.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";
import { EngineVariablesHtml } from "../../engine/engineVariablesHtml";
export declare class HtmlTemplate extends EnginePipelineStepBase {
    private static FILENAME_NO_BUNDLE;
    private static FILENAME_BUNDLE;
    process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number>;
    createTemplate(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, filename: string, engineVariablesHtml: EngineVariablesHtml): Promise<number>;
    private addLine(indent, lines, content);
}
