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
const pipelineStepBase_1 = require("../../engine/pipelineStepBase");
class HtmlTemplate extends pipelineStepBase_1.PipelineStepBase {
    initialise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    finalise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.createTemplate(logger, fileSystem, uniteConfiguration, engineVariables, HtmlTemplate.FILENAME_NO_BUNDLE, this._htmlNoBundle, false, mainCondition);
            if (ret === 0) {
                ret = yield this.createTemplate(logger, fileSystem, uniteConfiguration, engineVariables, HtmlTemplate.FILENAME_BUNDLE, this._htmlBundle, true, mainCondition);
            }
            return ret;
        });
    }
    createTemplate(logger, fileSystem, uniteConfiguration, engineVariables, filename, engineVariablesHtml, isBundled, mainCondition) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return _super("fileToggleLines").call(this, logger, fileSystem, engineVariables.wwwRootFolder, filename, engineVariables.force, mainCondition, () => __awaiter(this, void 0, void 0, function* () {
                const lines = [];
                let indent = 0;
                this.addLine(indent, lines, "<!doctype html>");
                this.addLine(indent, lines, "<html lang=\"en\">");
                indent++;
                this.addLine(indent, lines, "<head>");
                indent++;
                this.addLine(indent, lines, "<meta charset=\"utf-8\"/>");
                this.addLine(indent, lines, "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\">");
                this.addLine(indent, lines, `<title>{TITLE}</title>`);
                lines.push("{THEME}");
                engineVariablesHtml.head.forEach(head => {
                    this.addLine(indent, lines, head);
                });
                indent--;
                this.addLine(indent, lines, "</head>");
                this.addLine(indent, lines, "<body>");
                indent++;
                this.addLine(indent, lines, "<div id=\"app-loader\">{APPLOADER}</div>");
                this.addLine(indent, lines, "<div id=\"root\"></div>");
                lines.push("{SCRIPTINCLUDE}");
                engineVariablesHtml.body.forEach(body => {
                    this.addLine(indent, lines, body);
                });
                this.addLine(indent, lines, "<link rel=\"stylesheet\" href=\"./css/style.css{CACHEBUST}\">");
                this.addLine(indent, lines, "<noscript>Your browser does not support JavaScript or has it disabled, this site will not work without it.</noscript>");
                lines.push("{BODYEND}");
                indent--;
                this.addLine(indent, lines, "</body>");
                indent--;
                this.addLine(indent, lines, "</html>");
                this.addLine(indent, lines, _super("wrapGeneratedMarker").call(this, "<!-- ", " -->"));
                return lines;
            }));
        });
    }
    addLine(indent, lines, content) {
        lines.push(" ".repeat(indent * 4) + content);
    }
}
HtmlTemplate.FILENAME_NO_BUNDLE = "index-no-bundle.html";
HtmlTemplate.FILENAME_BUNDLE = "index-bundle.html";
exports.HtmlTemplate = HtmlTemplate;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2NvbnRlbnQvaHRtbFRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFRQSxvRUFBaUU7QUFFakUsTUFBYSxZQUFhLFNBQVEsbUNBQWdCO0lBT2pDLFVBQVUsQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQyxFQUFFLGFBQXNCOztZQUM5SixJQUFJLENBQUMsYUFBYSxHQUFHO2dCQUNqQixJQUFJLEVBQUUsRUFBRTtnQkFDUixJQUFJLEVBQUUsRUFDTDthQUNKLENBQUM7WUFFRixJQUFJLENBQUMsV0FBVyxHQUFHO2dCQUNmLElBQUksRUFBRSxFQUFFO2dCQUNSLElBQUksRUFBRTtvQkFDRiw4REFBOEQ7b0JBQzlELGdDQUFnQztvQkFDaEMsMkRBQTJEO2lCQUM5RDthQUNKLENBQUM7WUFFRixlQUFlLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNqRSxlQUFlLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUVyRSxPQUFPLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtJQUVZLFFBQVEsQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQyxFQUFFLGFBQXNCOztZQUM1SixJQUFJLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLEVBQUUsWUFBWSxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBRXhLLElBQUksR0FBRyxLQUFLLENBQUMsRUFBRTtnQkFDWCxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsa0JBQWtCLEVBQUUs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U0FBUyxDQUFDLENBQUM7Z0JBQ3ZDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSw2QkFBeUIsWUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLENBQUM7Z0JBQ3hFLE9BQU8sS0FBSyxDQUFDO1lBQ2pCLENBQUMsQ0FBQSxFQUFFO1FBQ1AsQ0FBQztLQUFBO0lBRU8sT0FBTyxDQUFDLE1BQWMsRUFBRSxLQUFlLEVBQUUsT0FBZTtRQUM1RCxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDO0lBQ2pELENBQUM7O0FBNUZ1QiwrQkFBa0IsR0FBVyxzQkFBc0IsQ0FBQztBQUNwRCw0QkFBZSxHQUFXLG1CQUFtQixDQUFDO0FBRjFFLG9DQThGQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2NvbnRlbnQvaHRtbFRlbXBsYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIHRvIGdlbmVyYXRlIGh0bWwgdGVtcGxhdGUuXG4gKi9cbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgSHRtbFRlbXBsYXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy9odG1sVGVtcGxhdGUvaHRtbFRlbXBsYXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcbmltcG9ydCB7IFBpcGVsaW5lU3RlcEJhc2UgfSBmcm9tIFwiLi4vLi4vZW5naW5lL3BpcGVsaW5lU3RlcEJhc2VcIjtcblxuZXhwb3J0IGNsYXNzIEh0bWxUZW1wbGF0ZSBleHRlbmRzIFBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IEZJTEVOQU1FX05PX0JVTkRMRTogc3RyaW5nID0gXCJpbmRleC1uby1idW5kbGUuaHRtbFwiO1xuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IEZJTEVOQU1FX0JVTkRMRTogc3RyaW5nID0gXCJpbmRleC1idW5kbGUuaHRtbFwiO1xuXG4gICAgcHJpdmF0ZSBfaHRtbE5vQnVuZGxlOiBIdG1sVGVtcGxhdGVDb25maWd1cmF0aW9uO1xuICAgIHByaXZhdGUgX2h0bWxCdW5kbGU6IEh0bWxUZW1wbGF0ZUNvbmZpZ3VyYXRpb247XG5cbiAgICBwdWJsaWMgYXN5bmMgaW5pdGlhbGlzZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICB0aGlzLl9odG1sTm9CdW5kbGUgPSB7XG4gICAgICAgICAgICBoZWFkOiBbXSxcbiAgICAgICAgICAgIGJvZHk6IFtcbiAgICAgICAgICAgIF1cbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLl9odG1sQnVuZGxlID0ge1xuICAgICAgICAgICAgaGVhZDogW10sXG4gICAgICAgICAgICBib2R5OiBbXG4gICAgICAgICAgICAgICAgXCI8c2NyaXB0IHNyYz1cXFwiLi9kaXN0L3ZlbmRvci1idW5kbGUuanN7Q0FDSEVCVVNUfVxcXCI+PC9zY3JpcHQ+XCIsXG4gICAgICAgICAgICAgICAgXCI8c2NyaXB0PntVTklURUNPTkZJR308L3NjcmlwdD5cIixcbiAgICAgICAgICAgICAgICBcIjxzY3JpcHQgc3JjPVxcXCIuL2Rpc3QvYXBwLWJ1bmRsZS5qc3tDQUNIRUJVU1R9XFxcIj48L3NjcmlwdD5cIlxuICAgICAgICAgICAgXVxuICAgICAgICB9O1xuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5zZXRDb25maWd1cmF0aW9uKFwiSFRNTEJ1bmRsZVwiLCB0aGlzLl9odG1sQnVuZGxlKTtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnNldENvbmZpZ3VyYXRpb24oXCJIVE1MTm9CdW5kbGVcIiwgdGhpcy5faHRtbE5vQnVuZGxlKTtcblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmluYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgbGV0IHJldCA9IGF3YWl0IHRoaXMuY3JlYXRlVGVtcGxhdGUobG9nZ2VyLCBmaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcywgSHRtbFRlbXBsYXRlLkZJTEVOQU1FX05PX0JVTkRMRSwgdGhpcy5faHRtbE5vQnVuZGxlLCBmYWxzZSwgbWFpbkNvbmRpdGlvbik7XG5cbiAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0ID0gYXdhaXQgdGhpcy5jcmVhdGVUZW1wbGF0ZShsb2dnZXIsIGZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzLCBIdG1sVGVtcGxhdGUuRklMRU5BTUVfQlVORExFLCB0aGlzLl9odG1sQnVuZGxlLCB0cnVlLCBtYWluQ29uZGl0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGNyZWF0ZVRlbXBsYXRlKGxvZ2dlcjogSUxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZW5hbWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzSHRtbDogSHRtbFRlbXBsYXRlQ29uZmlndXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNCdW5kbGVkOiBib29sZWFuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmZpbGVUb2dnbGVMaW5lcyhsb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuZm9yY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbkNvbmRpdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3luYygpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxpbmVzOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICAgICAgbGV0IGluZGVudCA9IDA7XG4gICAgICAgICAgICB0aGlzLmFkZExpbmUoaW5kZW50LCBsaW5lcywgXCI8IWRvY3R5cGUgaHRtbD5cIik7XG4gICAgICAgICAgICB0aGlzLmFkZExpbmUoaW5kZW50LCBsaW5lcywgXCI8aHRtbCBsYW5nPVxcXCJlblxcXCI+XCIpO1xuICAgICAgICAgICAgaW5kZW50Kys7XG4gICAgICAgICAgICB0aGlzLmFkZExpbmUoaW5kZW50LCBsaW5lcywgXCI8aGVhZD5cIik7XG4gICAgICAgICAgICBpbmRlbnQrKztcbiAgICAgICAgICAgIHRoaXMuYWRkTGluZShpbmRlbnQsIGxpbmVzLCBcIjxtZXRhIGNoYXJzZXQ9XFxcInV0Zi04XFxcIi8+XCIpO1xuICAgICAgICAgICAgdGhpcy5hZGRMaW5lKGluZGVudCwgbGluZXMsIFwiPG1ldGEgbmFtZT1cXFwidmlld3BvcnRcXFwiIGNvbnRlbnQ9XFxcIndpZHRoPWRldmljZS13aWR0aCwgaW5pdGlhbC1zY2FsZT0xLCBzaHJpbmstdG8tZml0PW5vXFxcIj5cIik7XG4gICAgICAgICAgICB0aGlzLmFkZExpbmUoaW5kZW50LCBsaW5lcywgYDx0aXRsZT57VElUTEV9PC90aXRsZT5gKTtcbiAgICAgICAgICAgIGxpbmVzLnB1c2goXCJ7VEhFTUV9XCIpO1xuICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzSHRtbC5oZWFkLmZvckVhY2goaGVhZCA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRMaW5lKGluZGVudCwgbGluZXMsIGhlYWQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGluZGVudC0tO1xuICAgICAgICAgICAgdGhpcy5hZGRMaW5lKGluZGVudCwgbGluZXMsIFwiPC9oZWFkPlwiKTtcbiAgICAgICAgICAgIHRoaXMuYWRkTGluZShpbmRlbnQsIGxpbmVzLCBcIjxib2R5PlwiKTtcbiAgICAgICAgICAgIGluZGVudCsrO1xuICAgICAgICAgICAgdGhpcy5hZGRMaW5lKGluZGVudCwgbGluZXMsIFwiPGRpdiBpZD1cXFwiYXBwLWxvYWRlclxcXCI+e0FQUExPQURFUn08L2Rpdj5cIik7XG4gICAgICAgICAgICB0aGlzLmFkZExpbmUoaW5kZW50LCBsaW5lcywgXCI8ZGl2IGlkPVxcXCJyb290XFxcIj48L2Rpdj5cIik7XG4gICAgICAgICAgICBsaW5lcy5wdXNoKFwie1NDUklQVElOQ0xVREV9XCIpO1xuICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzSHRtbC5ib2R5LmZvckVhY2goYm9keSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRMaW5lKGluZGVudCwgbGluZXMsIGJvZHkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmFkZExpbmUoaW5kZW50LCBsaW5lcywgXCI8bGluayByZWw9XFxcInN0eWxlc2hlZXRcXFwiIGhyZWY9XFxcIi4vY3NzL3N0eWxlLmNzc3tDQUNIRUJVU1R9XFxcIj5cIik7XG4gICAgICAgICAgICB0aGlzLmFkZExpbmUoaW5kZW50LCBsaW5lcywgXCI8bm9zY3JpcHQ+WW91ciBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgSmF2YVNjcmlwdCBvciBoYXMgaXQgZGlzYWJsZWQsIHRoaXMgc2l0ZSB3aWxsIG5vdCB3b3JrIHdpdGhvdXQgaXQuPC9ub3NjcmlwdD5cIik7XG4gICAgICAgICAgICBsaW5lcy5wdXNoKFwie0JPRFlFTkR9XCIpO1xuICAgICAgICAgICAgaW5kZW50LS07XG4gICAgICAgICAgICB0aGlzLmFkZExpbmUoaW5kZW50LCBsaW5lcywgXCI8L2JvZHk+XCIpO1xuICAgICAgICAgICAgaW5kZW50LS07XG4gICAgICAgICAgICB0aGlzLmFkZExpbmUoaW5kZW50LCBsaW5lcywgXCI8L2h0bWw+XCIpO1xuICAgICAgICAgICAgdGhpcy5hZGRMaW5lKGluZGVudCwgbGluZXMsIHN1cGVyLndyYXBHZW5lcmF0ZWRNYXJrZXIoXCI8IS0tIFwiLCBcIiAtLT5cIikpO1xuICAgICAgICAgICAgcmV0dXJuIGxpbmVzO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZExpbmUoaW5kZW50OiBudW1iZXIsIGxpbmVzOiBzdHJpbmdbXSwgY29udGVudDogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGxpbmVzLnB1c2goXCIgXCIucmVwZWF0KGluZGVudCAqIDQpICsgY29udGVudCk7XG4gICAgfVxufVxuIl19
