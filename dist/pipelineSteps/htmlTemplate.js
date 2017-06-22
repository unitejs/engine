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
const enginePipelineStepBase_1 = require("../engine/enginePipelineStepBase");
class HtmlTemplate extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hasMarker = yield _super("fileHasMarker").call(this, fileSystem, engineVariables.rootFolder, "index.html");
                if (hasMarker) {
                    _super("log").call(this, logger, display, "Generating index.html", { rootFolder: engineVariables.rootFolder });
                    const lines = [];
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
                    this.addLine(indent, lines, _super("wrapMarker").call(this, "<!-- ", " -->"));
                    yield fileSystem.fileWriteLines(engineVariables.rootFolder, "index.html", lines);
                }
                else {
                    _super("log").call(this, logger, display, "Skipping index.html as it has no marker", { rootFolder: engineVariables.rootFolder });
                }
                return 0;
            }
            catch (err) {
                _super("error").call(this, logger, display, "Generating index.html", err, { rootFolder: engineVariables.rootFolder });
                return 1;
            }
        });
    }
    addLine(indent, lines, content) {
        lines.push(" ".repeat(indent * 4) + content);
    }
}
exports.HtmlTemplate = HtmlTemplate;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvaHRtbFRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFJQSw2RUFBMEU7QUFNMUUsa0JBQTBCLFNBQVEsK0NBQXNCO0lBQ3ZDLE9BQU8sQ0FBQyxNQUFlLEVBQUUsT0FBaUIsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDdEosSUFBSSxDQUFDO2dCQUNELE1BQU0sU0FBUyxHQUFHLE1BQU0sdUJBQW1CLFlBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxVQUFVLEVBQUUsWUFBWSxDQUFDLENBQUM7Z0JBRWxHLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBQ1osYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsRUFBRSxVQUFVLEVBQUUsZUFBZSxDQUFDLFVBQVUsRUFBRSxFQUFFO29CQUVoRyxNQUFNLEtBQUssR0FBYSxFQUFFLENBQUM7b0JBQzNCLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQztvQkFDZixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztvQkFDL0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO29CQUN0QyxNQUFNLEVBQUUsQ0FBQztvQkFDVCxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7b0JBQ3RDLE1BQU0sRUFBRSxDQUFDO29CQUNULElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSwyQkFBMkIsQ0FBQyxDQUFDO29CQUN6RCxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsU0FBUyxHQUFHLGtCQUFrQixDQUFDLEtBQUssR0FBRyxVQUFVLENBQUMsQ0FBQztvQkFDL0UsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLG9EQUFvRCxDQUFDLENBQUM7b0JBRWxGLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQzt3QkFDekMsa0JBQWtCLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLGtCQUFrQjs0QkFDN0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLGtCQUFrQixHQUFHLGVBQWUsQ0FBQyxhQUFhLEdBQUcsa0JBQWtCLEdBQUcsY0FBYyxDQUFDLENBQUM7d0JBQzFILENBQUMsQ0FBQyxDQUFDO29CQUNQLENBQUM7b0JBRUQsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUk7d0JBQ2xDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDdEMsQ0FBQyxDQUFDLENBQUM7b0JBRUgsTUFBTSxFQUFFLENBQUM7b0JBQ1QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO29CQUN2QyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7b0JBQ3RDLE1BQU0sRUFBRSxDQUFDO29CQUNULGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJO3dCQUNsQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQ3RDLENBQUMsQ0FBQyxDQUFDO29CQUNILE1BQU0sRUFBRSxDQUFDO29CQUNULElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztvQkFDdkMsTUFBTSxFQUFFLENBQUM7b0JBQ1QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO29CQUN2QyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsb0JBQWdCLFlBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxDQUFDO29CQUUvRCxNQUFNLFVBQVUsQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxZQUFZLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ3JGLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUseUNBQXlDLEVBQUUsRUFBRSxVQUFVLEVBQUUsZUFBZSxDQUFDLFVBQVUsRUFBRSxFQUFFO2dCQUN0SCxDQUFDO2dCQUVELE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxlQUFXLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxHQUFHLEVBQUUsRUFBRSxVQUFVLEVBQUUsZUFBZSxDQUFDLFVBQVUsRUFBRSxFQUFFO2dCQUN2RyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztRQUNMLENBQUM7S0FBQTtJQUVPLE9BQU8sQ0FBQyxNQUFjLEVBQUUsS0FBZSxFQUFFLE9BQWU7UUFDNUQsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQztJQUNqRCxDQUFDO0NBQ0o7QUF6REQsb0NBeURDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvaHRtbFRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
