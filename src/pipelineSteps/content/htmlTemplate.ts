/**
 * Pipeline step to generate html template.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { HtmlTemplateConfiguration } from "../../configuration/models/htmlTemplate/htmlTemplateConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class HtmlTemplate extends EnginePipelineStepBase {
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
            body: []
        };

        engineVariables.setConfiguration("HTMLBundle", this._htmlBundle);
        engineVariables.setConfiguration("HTMLNoBundle", this._htmlNoBundle);

        return 0;
    }

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
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
                                useMinified: boolean): Promise<number> {
        try {
            const hasGeneratedMarker = await super.fileHasGeneratedMarker(fileSystem, engineVariables.wwwRootFolder, filename);

            if (hasGeneratedMarker === "FileNotExist" || hasGeneratedMarker === "HasMarker") {
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
                this.addLine(indent, lines, "<link rel=\"stylesheet\" href=\"./css/style.css{CACHEBUST}\">");
                lines.push("{THEME}");

                const appClientPackages = engineVariables.getAppClientPackages();

                for (const pkg in appClientPackages) {
                    if (appClientPackages[pkg].scriptInclude) {
                        const main = (useMinified && appClientPackages[pkg].mainMinified) ? appClientPackages[pkg].mainMinified : appClientPackages[pkg].main;
                        const script = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.packageFolder, `${pkg}/${main}`)));

                        this.addLine(indent, lines, `<script src="${script}"></script>`);
                    }
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
