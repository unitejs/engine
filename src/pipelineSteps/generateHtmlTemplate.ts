/**
 * Pipeline step to generate html template.
 */
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../engine/enginePipelineStepBase";
import { HtmlTemplate } from "../html/htmlTemplate";
import { IDisplay } from "../interfaces/IDisplay";
import { IFileSystem } from "../interfaces/IFileSystem";
import { ILogger } from "../interfaces/ILogger";

export class GenerateHtmlTemplate extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration): Promise<number> {
        try {
            super.log(logger, display, "Generating index.html.template int", { outputDirectory: uniteConfiguration.outputDirectory });
            const htmlTemplate = new HtmlTemplate();
            const lines = htmlTemplate.generateTemplate();
            await fileSystem.fileWriteLines(uniteConfiguration.outputDirectory, "index.html.template", lines);
            return 0;
        } catch (err) {
            super.error(logger, display, "Generating index.html.template", err, { outputDirectory: uniteConfiguration.outputDirectory });
            return 1;
        }
    }
}