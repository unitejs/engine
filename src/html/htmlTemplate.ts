/**
 * HTML template generator.
 */
import { TemplateConstants } from "./templateConstants";

export class HtmlTemplate {
    public generateTemplate(): string[] {
        const lines: string[] = [];

        lines.push("<!doctype html>");
        lines.push("<html>");
        lines.push("<head>");
        lines.push("<meta charset=\"utf-8\"/>");
        lines.push("<title>{" + TemplateConstants.APP_NAME + "}</title>");
        lines.push("</head>");
        lines.push("<body>");
        lines.push("</body>");
        lines.push("</html>");

        return lines;
    }
}