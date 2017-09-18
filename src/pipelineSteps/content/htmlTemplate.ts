/**
 * Pipeline step to generate html template.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { HtmlTemplateConfiguration } from "../../configuration/models/htmlTemplate/htmlTemplateConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class HtmlTemplate extends PipelineStepBase {
    private static FILENAME_NO_BUNDLE: string = "index-no-bundle.html";
    private static FILENAME_BUNDLE: string = "index-bundle.html";

    private _htmlNoBundle: HtmlTemplateConfiguration;
    private _htmlBundle: HtmlTemplateConfiguration;

    public async initialise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        this._htmlNoBundle = {
            head: [],
            body: []
        };

        this._htmlBundle = {
            head: [],
            body: [
                "<script src=\"./dist/vendor-bundle.js{CACHEBUST}\"></script>",
                "<script>{UNITECONFIG}</script>",
                "<script src=\"./dist/app-bundle.js{CACHEBUST}\"></script>"
            ]
        };

        engineVariables.setConfiguration("HTMLBundle", this._htmlBundle);
        engineVariables.setConfiguration("HTMLNoBundle", this._htmlNoBundle);

        return 0;
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        let ret = await this.createTemplate(logger, fileSystem, uniteConfiguration, engineVariables, HtmlTemplate.FILENAME_NO_BUNDLE, this._htmlNoBundle, false);

        if (ret === 0) {
            ret = await this.createTemplate(logger, fileSystem, uniteConfiguration, engineVariables, HtmlTemplate.FILENAME_BUNDLE, this._htmlBundle, true);
        }

        return ret;
    }

    public async createTemplate(logger: ILogger,
                                fileSystem: IFileSystem,
                                uniteConfiguration: UniteConfiguration,
                                engineVariables: EngineVariables,
                                filename: string,
                                engineVariablesHtml: HtmlTemplateConfiguration,
                                isBundled: boolean): Promise<number> {
        try {
            const hasGeneratedMarker = await super.fileHasGeneratedMarker(fileSystem, engineVariables.wwwRootFolder, filename);

            if (hasGeneratedMarker === "FileNotExist" || hasGeneratedMarker === "HasMarker" || engineVariables.force) {
                logger.info(`Generating ${filename}`, { wwwFolder: engineVariables.wwwRootFolder });

                const lines: string[] = [];
                let indent = 0;
                this.addLine(indent, lines, "<!doctype html>");
                this.addLine(indent, lines, "<html lang=\"en\">");
                indent++;
                this.addLine(indent, lines, "<head>");
                indent++;
                this.addLine(indent, lines, "<meta charset=\"utf-8\"/>");
                this.addLine(indent, lines, "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\">");
                this.addLine(indent, lines, `<title>${uniteConfiguration.title}</title>`);
                this.addLine(indent, lines, "<link rel=\"stylesheet\" href=\"./css/style.css{CACHEBUST}\">");
                lines.push("{THEME}");
                lines.push("{SCRIPTINCLUDE}");

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
