/**
 * Pipeline step to generate html template.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";
import { EngineVariablesHtml } from "../../engine/engineVariablesHtml";

export class HtmlTemplate extends EnginePipelineStepBase {
    private static FILENAME_NO_BUNDLE: string = "index-no-bundle.html";
    private static FILENAME_BUNDLE: string = "index-bundle.html";

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        let ret = await this.createTemplate(logger, fileSystem, uniteConfiguration, engineVariables, HtmlTemplate.FILENAME_NO_BUNDLE, engineVariables.htmlNoBundle);

        if (ret === 0) {
            ret = await this.createTemplate(logger, fileSystem, uniteConfiguration, engineVariables, HtmlTemplate.FILENAME_BUNDLE, engineVariables.htmlBundle);
        }

        return ret;
    }

    public async createTemplate(logger: ILogger,
                                fileSystem: IFileSystem,
                                uniteConfiguration: UniteConfiguration,
                                engineVariables: EngineVariables,
                                filename: string,
                                engineVariablesHtml: EngineVariablesHtml): Promise<number> {
        try {
            const hasGeneratedMarker = await super.fileHasGeneratedMarker(fileSystem, engineVariables.wwwRootFolder, filename);

            if (hasGeneratedMarker) {
                logger.info(`Generating ${filename}`, { wwwFolder: engineVariables.wwwRootFolder });

                const lines: string[] = [];
                let indent = 0;
                this.addLine(indent, lines, "<!doctype html>");
                this.addLine(indent, lines, "<html>");
                indent++;
                this.addLine(indent, lines, "<head>");
                indent++;
                this.addLine(indent, lines, "<meta charset=\"utf-8\"/>");
                this.addLine(indent, lines, `<title>${uniteConfiguration.title}</title>`);
                if (engineVariablesHtml.separateCss) {
                    this.addLine(indent, lines, "<link rel=\"stylesheet\" href=\"./css/style.css{CACHEBUST}\">");
                }
                lines.push("{THEME}");

                if (engineVariablesHtml.scriptIncludes) {
                    engineVariablesHtml.scriptIncludes.forEach(scriptInclude => {
                        const script = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.packageFolder, scriptInclude)));

                        this.addLine(indent, lines, `<script src="${script}"></script>`);
                    });
                }

                engineVariablesHtml.head.forEach(head => {
                    this.addLine(indent, lines, head);
                });

                indent--;
                this.addLine(indent, lines, "</head>");
                this.addLine(indent, lines, "<body>");
                indent++;
                this.addLine(indent, lines, "<div id=\"root\"></div>");
                engineVariablesHtml.body.forEach(body => {
                    this.addLine(indent, lines, body);
                });
                indent--;
                this.addLine(indent, lines, "</body>");
                indent--;
                this.addLine(indent, lines, "</html>");
                this.addLine(indent, lines, super.wrapGeneratedMarker("<!-- ", " -->"));

                await fileSystem.fileWriteLines(engineVariables.wwwRootFolder, filename, lines);
            } else {
                logger.info(`Skipping ${filename} as it has no generated marker`, { wwwFolder: engineVariables.wwwRootFolder });
            }

            return 0;
        } catch (err) {
            logger.error(`Generating ${filename} failed`, err, { wwwFolder: engineVariables.wwwRootFolder });
            return 1;
        }
    }

    private addLine(indent: number, lines: string[], content: string): void {
        lines.push(" ".repeat(indent * 4) + content);
    }
}
