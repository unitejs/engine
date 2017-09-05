/**
 * Pipeline step to generate html template.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { HtmlTemplateConfiguration } from "../../configuration/models/htmlTemplate/htmlTemplateConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineKey } from "../../engine/pipelineKey";
import { PipelineStepBase } from "../../engine/pipelineStepBase";
export declare class HtmlTemplate extends PipelineStepBase {
    private static FILENAME_NO_BUNDLE;
    private static FILENAME_BUNDLE;
    private _htmlNoBundle;
    private _htmlBundle;
    influences(): PipelineKey[];
    initialise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number>;
    process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number>;
    createTemplate(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, filename: string, engineVariablesHtml: HtmlTemplateConfiguration, isBundled: boolean): Promise<number>;
    private addLine(indent, lines, content);
}
