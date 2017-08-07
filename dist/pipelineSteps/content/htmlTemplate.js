"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class HtmlTemplate extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.createTemplate(logger, fileSystem, uniteConfiguration, engineVariables, HtmlTemplate.FILENAME_NO_BUNDLE, engineVariables.htmlNoBundle);
            if (ret === 0) {
                ret = yield this.createTemplate(logger, fileSystem, uniteConfiguration, engineVariables, HtmlTemplate.FILENAME_BUNDLE, engineVariables.htmlBundle);
            }
            return ret;
        });
    }
    createTemplate(logger, fileSystem, uniteConfiguration, engineVariables, filename, engineVariablesHtml) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hasGeneratedMarker = yield _super("fileHasGeneratedMarker").call(this, fileSystem, engineVariables.wwwFolder, filename);
                if (hasGeneratedMarker) {
                    logger.info(`Generating ${filename}`, { wwwFolder: engineVariables.wwwFolder });
                    const lines = [];
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
                            this.addLine(indent, lines, `<script src="./${engineVariables.packageFolder}${scriptInclude}"></script>`);
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
                    this.addLine(indent, lines, _super("wrapGeneratedMarker").call(this, "<!-- ", " -->"));
                    yield fileSystem.fileWriteLines(engineVariables.wwwFolder, filename, lines);
                }
                else {
                    logger.info(`Skipping ${filename} as it has no generated marker`, { wwwFolder: engineVariables.wwwFolder });
                }
                return 0;
            }
            catch (err) {
                logger.error(`Generating ${filename} failed`, err, { wwwFolder: engineVariables.wwwFolder });
                return 1;
            }
        });
    }
    addLine(indent, lines, content) {
        lines.push(" ".repeat(indent * 4) + content);
    }
}
HtmlTemplate.FILENAME_NO_BUNDLE = "index-no-bundle.html";
HtmlTemplate.FILENAME_BUNDLE = "index-bundle.html";
exports.HtmlTemplate = HtmlTemplate;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2NvbnRlbnQvaHRtbFRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFNQSxnRkFBNkU7QUFJN0Usa0JBQTBCLFNBQVEsK0NBQXNCO0lBSXZDLE9BQU8sQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7WUFDbkksSUFBSSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsa0JBQWtCLEVBQUUsZUFBZSxFQUFFLFlBQVksQ0FBQyxrQkFBa0IsRUFBRSxlQUFlLENBQUMsWUFBWSxDQUFDLENBQUM7WUFFNUosRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1osR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsRUFBRSxZQUFZLENBQUMsZUFBZSxFQUFFLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUN2SixDQUFDO1lBRUQsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNmLENBQUM7S0FBQTtJQUVZLGNBQWMsQ0FBQyxNQUFlLEVBQ2YsVUFBdUIsRUFDdkIsa0JBQXNDLEVBQ3RDLGVBQWdDLEVBQ2hDLFFBQWdCLEVBQ2hCLG1CQUF3Qzs7O1lBQ2hFLElBQUksQ0FBQztnQkFDRCxNQUFNLGtCQUFrQixHQUFHLE1BQU0sZ0NBQTRCLFlBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBRS9HLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztvQkFDckIsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLFFBQVEsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLGVBQWUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO29CQUVoRixNQUFNLEtB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YixDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxNQUFNLENBQUMsS0FBSyxDQUFDLGNBQWMsUUFBUSxTQUFTLEVBQUUsR0FBRyxFQUFFLEVBQUUsU0FBUyxFQUFFLGVBQWUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO2dCQUM3RixNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztRQUNMLENBQUM7S0FBQTtJQUVPLE9BQU8sQ0FBQyxNQUFjLEVBQUUsS0FBZSxFQUFFLE9BQWU7UUFDNUQsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQztJQUNqRCxDQUFDOztBQTdFYywrQkFBa0IsR0FBVyxzQkFBc0IsQ0FBQztBQUNwRCw0QkFBZSxHQUFXLG1CQUFtQixDQUFDO0FBRmpFLG9DQStFQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2NvbnRlbnQvaHRtbFRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
