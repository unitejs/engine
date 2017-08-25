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
    initialise(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.createTemplate(logger, fileSystem, uniteConfiguration, engineVariables, HtmlTemplate.FILENAME_NO_BUNDLE, this._htmlNoBundle, false);
            if (ret === 0) {
                ret = yield this.createTemplate(logger, fileSystem, uniteConfiguration, engineVariables, HtmlTemplate.FILENAME_BUNDLE, this._htmlBundle, true);
            }
            return ret;
        });
    }
    createTemplate(logger, fileSystem, uniteConfiguration, engineVariables, filename, engineVariablesHtml, isBundled) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hasGeneratedMarker = yield _super("fileHasGeneratedMarker").call(this, fileSystem, engineVariables.wwwRootFolder, filename);
                if (hasGeneratedMarker === "FileNotExist" || hasGeneratedMarker === "HasMarker") {
                    logger.info(`Generating ${filename}`, { wwwFolder: engineVariables.wwwRootFolder });
                    const lines = [];
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
                        if ((isBundled && (appClientPackages[pkg].scriptIncludeMode === "bundled" || appClientPackages[pkg].scriptIncludeMode === "both")) ||
                            (!isBundled && (appClientPackages[pkg].scriptIncludeMode === "notBundled" || appClientPackages[pkg].scriptIncludeMode === "both"))) {
                            const main = (isBundled && appClientPackages[pkg].mainMinified) ? appClientPackages[pkg].mainMinified : appClientPackages[pkg].main;
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
                    this.addLine(indent, lines, _super("wrapGeneratedMarker").call(this, "<!-- ", " -->"));
                    yield fileSystem.fileWriteLines(engineVariables.wwwRootFolder, filename, lines);
                }
                else {
                    logger.info(`Skipping ${filename} as it has no generated marker`, { wwwFolder: engineVariables.wwwRootFolder });
                }
                return 0;
            }
            catch (err) {
                logger.error(`Generating ${filename} failed`, err, { wwwFolder: engineVariables.wwwRootFolder });
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2NvbnRlbnQvaHRtbFRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFPQSxnRkFBNkU7QUFHN0Usa0JBQTBCLFNBQVEsK0NBQXNCO0lBT3ZDLFVBQVUsQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7WUFDdEksSUFBSSxDQUFDLGFBQWEsR0FBRztnQkFDakIsSUFBSSxFQUFFLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFLEVBQUU7YUFDWCxDQUFDO1lBRUYsSUFBSSxDQUFDLFdBQVcsR0FBRztnQkFDZixJQUFJLEVBQUUsRUFBRTtnQkFDUixJQUFJLEVBQUUsRUFBRTthQUNYLENBQUM7WUFFRixlQUFlLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNqRSxlQUFlLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUVyRSxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0lBRVksT0FBTyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOztZQUNuSSxJQUFJLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLEVBQUUsWUFBWSxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFFekosRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1osR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsRUFBRSxZQUFZLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFB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QUFFLFNBQVMsRUFBRSxlQUFlLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztnQkFDcEgsQ0FBQztnQkFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsTUFBTSxDQUFDLEtBQUssQ0FBQyxjQUFjLFFBQVEsU0FBUyxFQUFFLEdBQUcsRUFBRSxFQUFFLFNBQVMsRUFBRSxlQUFlLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztnQkFDakcsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7UUFDTCxDQUFDO0tBQUE7SUFFTyxPQUFPLENBQUMsTUFBYyxFQUFFLEtBQWUsRUFBRSxPQUFlO1FBQzVELEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUM7SUFDakQsQ0FBQzs7QUF0R2MsK0JBQWtCLEdBQVcsc0JBQXNCLENBQUM7QUFDcEQsNEJBQWUsR0FBVyxtQkFBbUIsQ0FBQztBQUZqRSxvQ0F3R0MiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9jb250ZW50L2h0bWxUZW1wbGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgc3RlcCB0byBnZW5lcmF0ZSBodG1sIHRlbXBsYXRlLlxuICovXG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IEh0bWxUZW1wbGF0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvaHRtbFRlbXBsYXRlL2h0bWxUZW1wbGF0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZVBpcGVsaW5lU3RlcEJhc2UgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVBpcGVsaW5lU3RlcEJhc2VcIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5cbmV4cG9ydCBjbGFzcyBIdG1sVGVtcGxhdGUgZXh0ZW5kcyBFbmdpbmVQaXBlbGluZVN0ZXBCYXNlIHtcbiAgICBwcml2YXRlIHN0YXRpYyBGSUxFTkFNRV9OT19CVU5ETEU6IHN0cmluZyA9IFwiaW5kZXgtbm8tYnVuZGxlLmh0bWxcIjtcbiAgICBwcml2YXRlIHN0YXRpYyBGSUxFTkFNRV9CVU5ETEU6IHN0cmluZyA9IFwiaW5kZXgtYnVuZGxlLmh0bWxcIjtcblxuICAgIHByaXZhdGUgX2h0bWxOb0J1bmRsZTogSHRtbFRlbXBsYXRlQ29uZmlndXJhdGlvbjtcbiAgICBwcml2YXRlIF9odG1sQnVuZGxlOiBIdG1sVGVtcGxhdGVDb25maWd1cmF0aW9uO1xuXG4gICAgcHVibGljIGFzeW5jIGluaXRpYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgdGhpcy5faHRtbE5vQnVuZGxlID0ge1xuICAgICAgICAgICAgaGVhZDogW10sXG4gICAgICAgICAgICBib2R5OiBbXVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuX2h0bWxCdW5kbGUgPSB7XG4gICAgICAgICAgICBoZWFkOiBbXSxcbiAgICAgICAgICAgIGJvZHk6IFtdXG4gICAgICAgIH07XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnNldENvbmZpZ3VyYXRpb24oXCJIVE1MQnVuZGxlXCIsIHRoaXMuX2h0bWxCdW5kbGUpO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuc2V0Q29uZmlndXJhdGlvbihcIkhUTUxOb0J1bmRsZVwiLCB0aGlzLl9odG1sTm9CdW5kbGUpO1xuXG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBwcm9jZXNzKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGxldCByZXQgPSBhd2FpdCB0aGlzLmNyZWF0ZVRlbXBsYXRlKGxvZ2dlciwgZmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMsIEh0bWxUZW1wbGF0ZS5GSUxFTkFNRV9OT19CVU5ETEUsIHRoaXMuX2h0bWxOb0J1bmRsZSwgZmFsc2UpO1xuXG4gICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgIHJldCA9IGF3YWl0IHRoaXMuY3JlYXRlVGVtcGxhdGUobG9nZ2VyLCBmaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcywgSHRtbFRlbXBsYXRlLkZJTEVOQU1FX0JVTkRMRSwgdGhpcy5faHRtbEJ1bmRsZSwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBjcmVhdGVUZW1wbGF0ZShsb2dnZXI6IElMb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVuYW1lOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlc0h0bWw6IEh0bWxUZW1wbGF0ZUNvbmZpZ3VyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQnVuZGxlZDogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBoYXNHZW5lcmF0ZWRNYXJrZXIgPSBhd2FpdCBzdXBlci5maWxlSGFzR2VuZXJhdGVkTWFya2VyKGZpbGVTeXN0ZW0sIGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBmaWxlbmFtZSk7XG5cbiAgICAgICAgICAgIGlmIChoYXNHZW5lcmF0ZWRNYXJrZXIgPT09IFwiRmlsZU5vdEV4aXN0XCIgfHwgaGFzR2VuZXJhdGVkTWFya2VyID09PSBcIkhhc01hcmtlclwiKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYEdlbmVyYXRpbmcgJHtmaWxlbmFtZX1gLCB7IHd3d0ZvbGRlcjogZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIgfSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBsaW5lczogc3RyaW5nW10gPSBbXTtcbiAgICAgICAgICAgICAgICBsZXQgaW5kZW50ID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZExpbmUoaW5kZW50LCBsaW5lcywgXCI8IWRvY3R5cGUgaHRtbD5cIik7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRMaW5lKGluZGVudCwgbGluZXMsIFwiPGh0bWw+XCIpO1xuICAgICAgICAgICAgICAgIGluZGVudCsrO1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkTGluZShpbmRlbnQsIGxpbmVzLCBcIjxoZWFkPlwiKTtcbiAgICAgICAgICAgICAgICBpbmRlbnQrKztcbiAgICAgICAgICAgICAgICB0aGlzLmFkZExpbmUoaW5kZW50LCBsaW5lcywgXCI8bWV0YSBjaGFyc2V0PVxcXCJ1dGYtOFxcXCIvPlwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZExpbmUoaW5kZW50LCBsaW5lcywgYDx0aXRsZT4ke3VuaXRlQ29uZmlndXJhdGlvbi50aXRsZX08L3RpdGxlPmApO1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkTGluZShpbmRlbnQsIGxpbmVzLCBcIjxsaW5rIHJlbD1cXFwic3R5bGVzaGVldFxcXCIgaHJlZj1cXFwiLi9jc3Mvc3R5bGUuY3Nze0NBQ0hFQlVTVH1cXFwiPlwiKTtcbiAgICAgICAgICAgICAgICBsaW5lcy5wdXNoKFwie1RIRU1FfVwiKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGFwcENsaWVudFBhY2thZ2VzID0gZW5naW5lVmFyaWFibGVzLmdldEFwcENsaWVudFBhY2thZ2VzKCk7XG5cbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHBrZyBpbiBhcHBDbGllbnRQYWNrYWdlcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoKGlzQnVuZGxlZCAmJiAoYXBwQ2xpZW50UGFja2FnZXNbcGtnXS5zY3JpcHRJbmNsdWRlTW9kZSA9PT0gXCJidW5kbGVkXCIgfHwgYXBwQ2xpZW50UGFja2FnZXNbcGtnXS5zY3JpcHRJbmNsdWRlTW9kZSA9PT0gXCJib3RoXCIpKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgKCFpc0J1bmRsZWQgJiYgKGFwcENsaWVudFBhY2thZ2VzW3BrZ10uc2NyaXB0SW5jbHVkZU1vZGUgPT09IFwibm90QnVuZGxlZFwiIHx8IGFwcENsaWVudFBhY2thZ2VzW3BrZ10uc2NyaXB0SW5jbHVkZU1vZGUgPT09IFwiYm90aFwiKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1haW4gPSAoaXNCdW5kbGVkICYmIGFwcENsaWVudFBhY2thZ2VzW3BrZ10ubWFpbk1pbmlmaWVkKSA/IGFwcENsaWVudFBhY2thZ2VzW3BrZ10ubWFpbk1pbmlmaWVkIDogYXBwQ2xpZW50UGFja2FnZXNbcGtnXS5tYWluO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2NyaXB0ID0gZmlsZVN5c3RlbS5wYXRoVG9XZWIoZmlsZVN5c3RlbS5wYXRoRmlsZVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy53d3cucGFja2FnZUZvbGRlciwgYCR7cGtnfS8ke21haW59YCkpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRMaW5lKGluZGVudCwgbGluZXMsIGA8c2NyaXB0IHNyYz1cIiR7c2NyaXB0fVwiPjwvc2NyaXB0PmApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzSHRtbC5oZWFkLmZvckVhY2goaGVhZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkTGluZShpbmRlbnQsIGxpbmVzLCBoZWFkKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGluZGVudC0tO1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkTGluZShpbmRlbnQsIGxpbmVzLCBcIjwvaGVhZD5cIik7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRMaW5lKGluZGVudCwgbGluZXMsIFwiPGJvZHk+XCIpO1xuICAgICAgICAgICAgICAgIGluZGVudCsrO1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkTGluZShpbmRlbnQsIGxpbmVzLCBcIjxkaXYgaWQ9XFxcInJvb3RcXFwiPjwvZGl2PlwiKTtcbiAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXNIdG1sLmJvZHkuZm9yRWFjaChib2R5ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRMaW5lKGluZGVudCwgbGluZXMsIGJvZHkpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGluZGVudC0tO1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkTGluZShpbmRlbnQsIGxpbmVzLCBcIjwvYm9keT5cIik7XG4gICAgICAgICAgICAgICAgaW5kZW50LS07XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRMaW5lKGluZGVudCwgbGluZXMsIFwiPC9odG1sPlwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZExpbmUoaW5kZW50LCBsaW5lcywgc3VwZXIud3JhcEdlbmVyYXRlZE1hcmtlcihcIjwhLS0gXCIsIFwiIC0tPlwiKSk7XG5cbiAgICAgICAgICAgICAgICBhd2FpdCBmaWxlU3lzdGVtLmZpbGVXcml0ZUxpbmVzKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBmaWxlbmFtZSwgbGluZXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgU2tpcHBpbmcgJHtmaWxlbmFtZX0gYXMgaXQgaGFzIG5vIGdlbmVyYXRlZCBtYXJrZXJgLCB7IHd3d0ZvbGRlcjogZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgR2VuZXJhdGluZyAke2ZpbGVuYW1lfSBmYWlsZWRgLCBlcnIsIHsgd3d3Rm9sZGVyOiBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciB9KTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhZGRMaW5lKGluZGVudDogbnVtYmVyLCBsaW5lczogc3RyaW5nW10sIGNvbnRlbnQ6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBsaW5lcy5wdXNoKFwiIFwiLnJlcGVhdChpbmRlbnQgKiA0KSArIGNvbnRlbnQpO1xuICAgIH1cbn1cbiJdfQ==
