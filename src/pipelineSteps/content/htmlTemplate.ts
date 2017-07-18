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

export class HtmlTemplate extends EnginePipelineStepBase {
    private static FILENAME_NO_BUNDLE: string = "index-no-bundle.html";
    private static FILENAME_BUNDLE: string = "index-bundle.html";

    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        let ret = await this.createTemplate(logger, display, fileSystem, uniteConfiguration, engineVariables, HtmlTemplate.FILENAME_NO_BUNDLE, engineVariables.htmlNoBundle);

        if (ret === 0) {
            ret = await this.createTemplate(logger, display, fileSystem, uniteConfiguration, engineVariables, HtmlTemplate.FILENAME_BUNDLE, engineVariables.htmlBundle);
        }

        return ret;
    }

    public async createTemplate(logger: ILogger,
                                display: IDisplay,
                                fileSystem: IFileSystem,
                                uniteConfiguration: UniteConfiguration,
                                engineVariables: EngineVariables,
                                filename: string,
                                engineVariablesHtml: EngineVariablesHtml): Promise<number> {
        try {
            const hasGeneratedMarker = await super.fileHasGeneratedMarker(fileSystem, engineVariables.rootFolder, filename);

            if (hasGeneratedMarker) {
                super.log(logger, display, `Generating ${filename}`, { rootFolder: engineVariables.rootFolder });

                const lines: string[] = [];
                let indent = 0;
                this.addLine(indent, lines, "<!doctype html>");
                this.addLine(indent, lines, "<html>");
                indent++;
                this.addLine(indent, lines, "<head>");
                indent++;
                this.addLine(indent, lines, "<meta charset=\"utf-8\"/>");
                this.addLine(indent, lines, "<title>" + uniteConfiguration.title + "</title>");
                if (engineVariablesHtml.separateCss) {
                    this.addLine(indent, lines, "<link rel=\"stylesheet\" href=\"./css/style.css{CACHEBUST}\">");
                }

                if (engineVariablesHtml.scriptIncludes) {
                    engineVariablesHtml.scriptIncludes.forEach(scriptInclude => {
                        this.addLine(indent, lines, "<script src=\"./" + engineVariables.packageFolder + scriptInclude + "\"></script>");
                    });
                }

                engineVariablesHtml.head.forEach(head => {
                    this.addLine(indent, lines, head);
                });

                indent--;
                this.addLine(indent, lines, "</head>");
                this.addLine(indent, lines, "<body>");
                indent++;
                engineVariablesHtml.body.forEach(body => {
                    this.addLine(indent, lines, body);
                });
                indent--;
                this.addLine(indent, lines, "</body>");
                indent--;
                this.addLine(indent, lines, "</html>");
                this.addLine(indent, lines, super.wrapGeneratedMarker("<!-- ", " -->"));

                await fileSystem.fileWriteLines(engineVariables.rootFolder, filename, lines);
            } else {
                super.log(logger, display, `Skipping ${filename} as it has no generated marker`, { rootFolder: engineVariables.rootFolder });
            }

            return 0;
        } catch (err) {
            super.error(logger, display, `Generating ${filename} failed`, err, { rootFolder: engineVariables.rootFolder });
            return 1;
        }
    }

    private addLine(indent: number, lines: string[], content: string): void {
        lines.push(" ".repeat(indent * 4) + content);
    }
}