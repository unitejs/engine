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
                this.addLine(indent, lines, `<title>${uniteConfiguration.title}</title>`);
                lines.push("{THEME}");
                lines.push("{SCRIPTINCLUDE}");
                engineVariablesHtml.head.forEach(head => {
                    this.addLine(indent, lines, head);
                });
                indent--;
                this.addLine(indent, lines, "</head>");
                this.addLine(indent, lines, "<body>");
                indent++;
                this.addLine(indent, lines, "<div id=\"app-loader\">{APPLOADER}</div>");
                this.addLine(indent, lines, "<div id=\"root\"></div>");
                engineVariablesHtml.body.forEach(body => {
                    this.addLine(indent, lines, body);
                });
                this.addLine(indent, lines, "<link rel=\"stylesheet\" href=\"./css/style.css{CACHEBUST}\">");
                this.addLine(indent, lines, "<noscript>Your browser does not support JavaScript or has it disabled, this site will not work without it.</noscript>");
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2NvbnRlbnQvaHRtbFRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFRQSxvRUFBaUU7QUFFakUsa0JBQTBCLFNBQVEsbUNBQWdCO0lBT2pDLFVBQVUsQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQyxFQUFFLGFBQXNCOztZQUM5SixJQUFJLENBQUMsYUFBYSxHQUFHO2dCQUNqQixJQUFJLEVBQUUsRUFBRTtnQkFDUixJQUFJLEVBQUUsRUFDTDthQUNKLENBQUM7WUFFRixJQUFJLENBQUMsV0FBVyxHQUFHO2dCQUNmLElBQUksRUFBRSxFQUFFO2dCQUNSLElBQUksRUFBRTtvQkFDRiw4REFBOEQ7b0JBQzlELGdDQUFnQztvQkFDaEMsMkRBQTJEO2lCQUM5RDthQUNKLENBQUM7WUFFRixlQUFlLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNqRSxlQUFlLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUVyRSxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0lBRVksUUFBUSxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDLEVBQUUsYUFBc0I7O1lBQzVKLElBQUksR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsRUFBRSxZQUFZLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxLQUFLLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFFeEssRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1osR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUs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RUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7Z0JBQ3ZDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSw2QkFBeUIsWUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLENBQUM7Z0JBQ3hFLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDakIsQ0FBQyxDQUFBLEVBQUU7UUFDUCxDQUFDO0tBQUE7SUFFTyxPQUFPLENBQUMsTUFBYyxFQUFFLEtBQWUsRUFBRSxPQUFlO1FBQzVELEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUM7SUFDakQsQ0FBQzs7QUE1RmMsK0JBQWtCLEdBQVcsc0JBQXNCLENBQUM7QUFDcEQsNEJBQWUsR0FBVyxtQkFBbUIsQ0FBQztBQUZqRSxvQ0E4RkMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9jb250ZW50L2h0bWxUZW1wbGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgc3RlcCB0byBnZW5lcmF0ZSBodG1sIHRlbXBsYXRlLlxuICovXG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IEh0bWxUZW1wbGF0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvaHRtbFRlbXBsYXRlL2h0bWxUZW1wbGF0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9waXBlbGluZVN0ZXBCYXNlXCI7XG5cbmV4cG9ydCBjbGFzcyBIdG1sVGVtcGxhdGUgZXh0ZW5kcyBQaXBlbGluZVN0ZXBCYXNlIHtcbiAgICBwcml2YXRlIHN0YXRpYyBGSUxFTkFNRV9OT19CVU5ETEU6IHN0cmluZyA9IFwiaW5kZXgtbm8tYnVuZGxlLmh0bWxcIjtcbiAgICBwcml2YXRlIHN0YXRpYyBGSUxFTkFNRV9CVU5ETEU6IHN0cmluZyA9IFwiaW5kZXgtYnVuZGxlLmh0bWxcIjtcblxuICAgIHByaXZhdGUgX2h0bWxOb0J1bmRsZTogSHRtbFRlbXBsYXRlQ29uZmlndXJhdGlvbjtcbiAgICBwcml2YXRlIF9odG1sQnVuZGxlOiBIdG1sVGVtcGxhdGVDb25maWd1cmF0aW9uO1xuXG4gICAgcHVibGljIGFzeW5jIGluaXRpYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgdGhpcy5faHRtbE5vQnVuZGxlID0ge1xuICAgICAgICAgICAgaGVhZDogW10sXG4gICAgICAgICAgICBib2R5OiBbXG4gICAgICAgICAgICBdXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5faHRtbEJ1bmRsZSA9IHtcbiAgICAgICAgICAgIGhlYWQ6IFtdLFxuICAgICAgICAgICAgYm9keTogW1xuICAgICAgICAgICAgICAgIFwiPHNjcmlwdCBzcmM9XFxcIi4vZGlzdC92ZW5kb3ItYnVuZGxlLmpze0NBQ0hFQlVTVH1cXFwiPjwvc2NyaXB0PlwiLFxuICAgICAgICAgICAgICAgIFwiPHNjcmlwdD57VU5JVEVDT05GSUd9PC9zY3JpcHQ+XCIsXG4gICAgICAgICAgICAgICAgXCI8c2NyaXB0IHNyYz1cXFwiLi9kaXN0L2FwcC1idW5kbGUuanN7Q0FDSEVCVVNUfVxcXCI+PC9zY3JpcHQ+XCJcbiAgICAgICAgICAgIF1cbiAgICAgICAgfTtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuc2V0Q29uZmlndXJhdGlvbihcIkhUTUxCdW5kbGVcIiwgdGhpcy5faHRtbEJ1bmRsZSk7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5zZXRDb25maWd1cmF0aW9uKFwiSFRNTE5vQnVuZGxlXCIsIHRoaXMuX2h0bWxOb0J1bmRsZSk7XG5cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbmFsaXNlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGxldCByZXQgPSBhd2FpdCB0aGlzLmNyZWF0ZVRlbXBsYXRlKGxvZ2dlciwgZmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMsIEh0bWxUZW1wbGF0ZS5GSUxFTkFNRV9OT19CVU5ETEUsIHRoaXMuX2h0bWxOb0J1bmRsZSwgZmFsc2UsIG1haW5Db25kaXRpb24pO1xuXG4gICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgIHJldCA9IGF3YWl0IHRoaXMuY3JlYXRlVGVtcGxhdGUobG9nZ2VyLCBmaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcywgSHRtbFRlbXBsYXRlLkZJTEVOQU1FX0JVTkRMRSwgdGhpcy5faHRtbEJ1bmRsZSwgdHJ1ZSwgbWFpbkNvbmRpdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBjcmVhdGVUZW1wbGF0ZShsb2dnZXI6IElMb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVuYW1lOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlc0h0bWw6IEh0bWxUZW1wbGF0ZUNvbmZpZ3VyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQnVuZGxlZDogYm9vbGVhbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIHJldHVybiBzdXBlci5maWxlVG9nZ2xlTGluZXMobG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZW5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLmZvcmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5Db25kaXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmMoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBsaW5lczogc3RyaW5nW10gPSBbXTtcbiAgICAgICAgICAgIGxldCBpbmRlbnQgPSAwO1xuICAgICAgICAgICAgdGhpcy5hZGRMaW5lKGluZGVudCwgbGluZXMsIFwiPCFkb2N0eXBlIGh0bWw+XCIpO1xuICAgICAgICAgICAgdGhpcy5hZGRMaW5lKGluZGVudCwgbGluZXMsIFwiPGh0bWwgbGFuZz1cXFwiZW5cXFwiPlwiKTtcbiAgICAgICAgICAgIGluZGVudCsrO1xuICAgICAgICAgICAgdGhpcy5hZGRMaW5lKGluZGVudCwgbGluZXMsIFwiPGhlYWQ+XCIpO1xuICAgICAgICAgICAgaW5kZW50Kys7XG4gICAgICAgICAgICB0aGlzLmFkZExpbmUoaW5kZW50LCBsaW5lcywgXCI8bWV0YSBjaGFyc2V0PVxcXCJ1dGYtOFxcXCIvPlwiKTtcbiAgICAgICAgICAgIHRoaXMuYWRkTGluZShpbmRlbnQsIGxpbmVzLCBcIjxtZXRhIG5hbWU9XFxcInZpZXdwb3J0XFxcIiBjb250ZW50PVxcXCJ3aWR0aD1kZXZpY2Utd2lkdGgsIGluaXRpYWwtc2NhbGU9MSwgc2hyaW5rLXRvLWZpdD1ub1xcXCI+XCIpO1xuICAgICAgICAgICAgdGhpcy5hZGRMaW5lKGluZGVudCwgbGluZXMsIGA8dGl0bGU+JHt1bml0ZUNvbmZpZ3VyYXRpb24udGl0bGV9PC90aXRsZT5gKTtcbiAgICAgICAgICAgIGxpbmVzLnB1c2goXCJ7VEhFTUV9XCIpO1xuICAgICAgICAgICAgbGluZXMucHVzaChcIntTQ1JJUFRJTkNMVURFfVwiKTtcblxuICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzSHRtbC5oZWFkLmZvckVhY2goaGVhZCA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRMaW5lKGluZGVudCwgbGluZXMsIGhlYWQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGluZGVudC0tO1xuICAgICAgICAgICAgdGhpcy5hZGRMaW5lKGluZGVudCwgbGluZXMsIFwiPC9oZWFkPlwiKTtcbiAgICAgICAgICAgIHRoaXMuYWRkTGluZShpbmRlbnQsIGxpbmVzLCBcIjxib2R5PlwiKTtcbiAgICAgICAgICAgIGluZGVudCsrO1xuICAgICAgICAgICAgdGhpcy5hZGRMaW5lKGluZGVudCwgbGluZXMsIFwiPGRpdiBpZD1cXFwiYXBwLWxvYWRlclxcXCI+e0FQUExPQURFUn08L2Rpdj5cIik7XG4gICAgICAgICAgICB0aGlzLmFkZExpbmUoaW5kZW50LCBsaW5lcywgXCI8ZGl2IGlkPVxcXCJyb290XFxcIj48L2Rpdj5cIik7XG4gICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXNIdG1sLmJvZHkuZm9yRWFjaChib2R5ID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZExpbmUoaW5kZW50LCBsaW5lcywgYm9keSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuYWRkTGluZShpbmRlbnQsIGxpbmVzLCBcIjxsaW5rIHJlbD1cXFwic3R5bGVzaGVldFxcXCIgaHJlZj1cXFwiLi9jc3Mvc3R5bGUuY3Nze0NBQ0hFQlVTVH1cXFwiPlwiKTtcbiAgICAgICAgICAgIHRoaXMuYWRkTGluZShpbmRlbnQsIGxpbmVzLCBcIjxub3NjcmlwdD5Zb3VyIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBKYXZhU2NyaXB0IG9yIGhhcyBpdCBkaXNhYmxlZCwgdGhpcyBzaXRlIHdpbGwgbm90IHdvcmsgd2l0aG91dCBpdC48L25vc2NyaXB0PlwiKTtcbiAgICAgICAgICAgIGluZGVudC0tO1xuICAgICAgICAgICAgdGhpcy5hZGRMaW5lKGluZGVudCwgbGluZXMsIFwiPC9ib2R5PlwiKTtcbiAgICAgICAgICAgIGluZGVudC0tO1xuICAgICAgICAgICAgdGhpcy5hZGRMaW5lKGluZGVudCwgbGluZXMsIFwiPC9odG1sPlwiKTtcbiAgICAgICAgICAgIHRoaXMuYWRkTGluZShpbmRlbnQsIGxpbmVzLCBzdXBlci53cmFwR2VuZXJhdGVkTWFya2VyKFwiPCEtLSBcIiwgXCIgLS0+XCIpKTtcbiAgICAgICAgICAgIHJldHVybiBsaW5lcztcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhZGRMaW5lKGluZGVudDogbnVtYmVyLCBsaW5lczogc3RyaW5nW10sIGNvbnRlbnQ6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBsaW5lcy5wdXNoKFwiIFwiLnJlcGVhdChpbmRlbnQgKiA0KSArIGNvbnRlbnQpO1xuICAgIH1cbn1cbiJdfQ==
