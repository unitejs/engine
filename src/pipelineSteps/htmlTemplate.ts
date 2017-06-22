/**
 * Pipeline step to generate html template.
 */
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../engine/enginePipelineStepBase";
import { EngineVariables } from "../engine/engineVariables";
import { IDisplay } from "../interfaces/IDisplay";
import { IFileSystem } from "../interfaces/IFileSystem";
import { ILogger } from "../interfaces/ILogger";

export class HtmlTemplate extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            const hasMarker = await super.fileHasMarker(fileSystem, engineVariables.rootFolder, "index.html");

            if (hasMarker) {
                super.log(logger, display, "Generating index.html", { rootFolder: engineVariables.rootFolder });

                const lines: string[] = [];
                let indent = 0;
                this.addLine(indent, lines, "<!doctype html>");
                this.addLine(indent, lines, "<html>");
                indent++;
                this.addLine(indent, lines, "<head>");
                indent++;
                this.addLine(indent, lines, "<meta charset=\"utf-8\"/>");
                this.addLine(indent, lines, "<title>" + uniteConfiguration.title + "</title>");
                this.addLine(indent, lines, "<link rel=\"stylesheet\" href=\"./css/style.css\">");

                if (uniteConfiguration.staticClientModules) {
                    uniteConfiguration.staticClientModules.forEach(staticClientModule => {
                        this.addLine(indent, lines, "<script src=\"./" + engineVariables.packageFolder + staticClientModule + "\"></script>");
                    });
                }

                engineVariables.html.head.forEach(head => {
                    this.addLine(indent, lines, head);
                });

                indent--;
                this.addLine(indent, lines, "</head>");
                this.addLine(indent, lines, "<body>");
                indent++;
                engineVariables.html.body.forEach(body => {
                    this.addLine(indent, lines, body);
                });
                indent--;
                this.addLine(indent, lines, "</body>");
                indent--;
                this.addLine(indent, lines, "</html>");
                this.addLine(indent, lines, super.wrapMarker("<!-- ", " -->"));

                await fileSystem.fileWriteLines(engineVariables.rootFolder, "index.html", lines);
            } else {
                super.log(logger, display, "Skipping index.html as it has no marker", { rootFolder: engineVariables.rootFolder });
            }

            return 0;
        } catch (err) {
            super.error(logger, display, "Generating index.html", err, { rootFolder: engineVariables.rootFolder });
            return 1;
        }
    }

    private addLine(indent: number, lines: string[], content: string): void {
        lines.push(" ".repeat(indent * 4) + content);
    }
}