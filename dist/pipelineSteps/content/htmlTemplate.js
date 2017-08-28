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
                if (hasGeneratedMarker === "FileNotExist" || hasGeneratedMarker === "HasMarker" || engineVariables.force) {
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2NvbnRlbnQvaHRtbFRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFPQSxnRkFBNkU7QUFHN0Usa0JBQTBCLFNBQVEsK0NBQXNCO0lBT3ZDLFVBQVUsQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7WUFDdEksSUFBSSxDQUFDLGFBQWEsR0FBRztnQkFDakIsSUFBSSxFQUFFLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFLEVBQUU7YUFDWCxDQUFDO1lBRUYsSUFBSSxDQUFDLFdBQVcsR0FBRztnQkFDZixJQUFJLEVBQUUsRUFBRTtnQkFDUixJQUFJLEVBQUUsRUFBRTthQUNYLENBQUM7WUFFRixlQUFlLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNqRSxlQUFlLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUVyRSxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0lBRVksT0FBTyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOztZQUNuSSxJQUFJLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLEVBQUUsWUFBWSxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFFekosRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1osR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsRUFBRSxZQUFZLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFB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WSxRQUFRLGdDQUFnQyxFQUFFLEVBQUUsU0FBUyxFQUFFLGVBQWUsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO2dCQUNwSCxDQUFDO2dCQUVELE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxNQUFNLENBQUMsS0FBSyxDQUFDLGNBQWMsUUFBUSxTQUFTLEVBQUUsR0FBRyxFQUFFLEVBQUUsU0FBUyxFQUFFLGVBQWUsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO2dCQUNqRyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztRQUNMLENBQUM7S0FBQTtJQUVPLE9BQU8sQ0FBQyxNQUFjLEVBQUUsS0FBZSxFQUFFLE9BQWU7UUFDNUQsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQztJQUNqRCxDQUFDOztBQXRHYywrQkFBa0IsR0FBVyxzQkFBc0IsQ0FBQztBQUNwRCw0QkFBZSxHQUFXLG1CQUFtQixDQUFDO0FBRmpFLG9DQXdHQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2NvbnRlbnQvaHRtbFRlbXBsYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIHRvIGdlbmVyYXRlIGh0bWwgdGVtcGxhdGUuXG4gKi9cbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgSHRtbFRlbXBsYXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy9odG1sVGVtcGxhdGUvaHRtbFRlbXBsYXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lUGlwZWxpbmVTdGVwQmFzZSB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lUGlwZWxpbmVTdGVwQmFzZVwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcblxuZXhwb3J0IGNsYXNzIEh0bWxUZW1wbGF0ZSBleHRlbmRzIEVuZ2luZVBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHByaXZhdGUgc3RhdGljIEZJTEVOQU1FX05PX0JVTkRMRTogc3RyaW5nID0gXCJpbmRleC1uby1idW5kbGUuaHRtbFwiO1xuICAgIHByaXZhdGUgc3RhdGljIEZJTEVOQU1FX0JVTkRMRTogc3RyaW5nID0gXCJpbmRleC1idW5kbGUuaHRtbFwiO1xuXG4gICAgcHJpdmF0ZSBfaHRtbE5vQnVuZGxlOiBIdG1sVGVtcGxhdGVDb25maWd1cmF0aW9uO1xuICAgIHByaXZhdGUgX2h0bWxCdW5kbGU6IEh0bWxUZW1wbGF0ZUNvbmZpZ3VyYXRpb247XG5cbiAgICBwdWJsaWMgYXN5bmMgaW5pdGlhbGlzZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICB0aGlzLl9odG1sTm9CdW5kbGUgPSB7XG4gICAgICAgICAgICBoZWFkOiBbXSxcbiAgICAgICAgICAgIGJvZHk6IFtdXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5faHRtbEJ1bmRsZSA9IHtcbiAgICAgICAgICAgIGhlYWQ6IFtdLFxuICAgICAgICAgICAgYm9keTogW11cbiAgICAgICAgfTtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuc2V0Q29uZmlndXJhdGlvbihcIkhUTUxCdW5kbGVcIiwgdGhpcy5faHRtbEJ1bmRsZSk7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5zZXRDb25maWd1cmF0aW9uKFwiSFRNTE5vQnVuZGxlXCIsIHRoaXMuX2h0bWxOb0J1bmRsZSk7XG5cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIHByb2Nlc3MobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgbGV0IHJldCA9IGF3YWl0IHRoaXMuY3JlYXRlVGVtcGxhdGUobG9nZ2VyLCBmaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcywgSHRtbFRlbXBsYXRlLkZJTEVOQU1FX05PX0JVTkRMRSwgdGhpcy5faHRtbE5vQnVuZGxlLCBmYWxzZSk7XG5cbiAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0ID0gYXdhaXQgdGhpcy5jcmVhdGVUZW1wbGF0ZShsb2dnZXIsIGZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzLCBIdG1sVGVtcGxhdGUuRklMRU5BTUVfQlVORExFLCB0aGlzLl9odG1sQnVuZGxlLCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGNyZWF0ZVRlbXBsYXRlKGxvZ2dlcjogSUxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZW5hbWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzSHRtbDogSHRtbFRlbXBsYXRlQ29uZmlndXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNCdW5kbGVkOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGhhc0dlbmVyYXRlZE1hcmtlciA9IGF3YWl0IHN1cGVyLmZpbGVIYXNHZW5lcmF0ZWRNYXJrZXIoZmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIGZpbGVuYW1lKTtcblxuICAgICAgICAgICAgaWYgKGhhc0dlbmVyYXRlZE1hcmtlciA9PT0gXCJGaWxlTm90RXhpc3RcIiB8fCBoYXNHZW5lcmF0ZWRNYXJrZXIgPT09IFwiSGFzTWFya2VyXCIgfHwgZW5naW5lVmFyaWFibGVzLmZvcmNlKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYEdlbmVyYXRpbmcgJHtmaWxlbmFtZX1gLCB7IHd3d0ZvbGRlcjogZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIgfSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBsaW5lczogc3RyaW5nW10gPSBbXTtcbiAgICAgICAgICAgICAgICBsZXQgaW5kZW50ID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZExpbmUoaW5kZW50LCBsaW5lcywgXCI8IWRvY3R5cGUgaHRtbD5cIik7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRMaW5lKGluZGVudCwgbGluZXMsIFwiPGh0bWw+XCIpO1xuICAgICAgICAgICAgICAgIGluZGVudCsrO1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkTGluZShpbmRlbnQsIGxpbmVzLCBcIjxoZWFkPlwiKTtcbiAgICAgICAgICAgICAgICBpbmRlbnQrKztcbiAgICAgICAgICAgICAgICB0aGlzLmFkZExpbmUoaW5kZW50LCBsaW5lcywgXCI8bWV0YSBjaGFyc2V0PVxcXCJ1dGYtOFxcXCIvPlwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZExpbmUoaW5kZW50LCBsaW5lcywgYDx0aXRsZT4ke3VuaXRlQ29uZmlndXJhdGlvbi50aXRsZX08L3RpdGxlPmApO1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkTGluZShpbmRlbnQsIGxpbmVzLCBcIjxsaW5rIHJlbD1cXFwic3R5bGVzaGVldFxcXCIgaHJlZj1cXFwiLi9jc3Mvc3R5bGUuY3Nze0NBQ0hFQlVTVH1cXFwiPlwiKTtcbiAgICAgICAgICAgICAgICBsaW5lcy5wdXNoKFwie1RIRU1FfVwiKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGFwcENsaWVudFBhY2thZ2VzID0gZW5naW5lVmFyaWFibGVzLmdldEFwcENsaWVudFBhY2thZ2VzKCk7XG5cbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHBrZyBpbiBhcHBDbGllbnRQYWNrYWdlcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoKGlzQnVuZGxlZCAmJiAoYXBwQ2xpZW50UGFja2FnZXNbcGtnXS5zY3JpcHRJbmNsdWRlTW9kZSA9PT0gXCJidW5kbGVkXCIgfHwgYXBwQ2xpZW50UGFja2FnZXNbcGtnXS5zY3JpcHRJbmNsdWRlTW9kZSA9PT0gXCJib3RoXCIpKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgKCFpc0J1bmRsZWQgJiYgKGFwcENsaWVudFBhY2thZ2VzW3BrZ10uc2NyaXB0SW5jbHVkZU1vZGUgPT09IFwibm90QnVuZGxlZFwiIHx8IGFwcENsaWVudFBhY2thZ2VzW3BrZ10uc2NyaXB0SW5jbHVkZU1vZGUgPT09IFwiYm90aFwiKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1haW4gPSAoaXNCdW5kbGVkICYmIGFwcENsaWVudFBhY2thZ2VzW3BrZ10ubWFpbk1pbmlmaWVkKSA/IGFwcENsaWVudFBhY2thZ2VzW3BrZ10ubWFpbk1pbmlmaWVkIDogYXBwQ2xpZW50UGFja2FnZXNbcGtnXS5tYWluO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2NyaXB0ID0gZmlsZVN5c3RlbS5wYXRoVG9XZWIoZmlsZVN5c3RlbS5wYXRoRmlsZVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy53d3cucGFja2FnZUZvbGRlciwgYCR7cGtnfS8ke21haW59YCkpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRMaW5lKGluZGVudCwgbGluZXMsIGA8c2NyaXB0IHNyYz1cIiR7c2NyaXB0fVwiPjwvc2NyaXB0PmApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzSHRtbC5oZWFkLmZvckVhY2goaGVhZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkTGluZShpbmRlbnQsIGxpbmVzLCBoZWFkKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGluZGVudC0tO1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkTGluZShpbmRlbnQsIGxpbmVzLCBcIjwvaGVhZD5cIik7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRMaW5lKGluZGVudCwgbGluZXMsIFwiPGJvZHk+XCIpO1xuICAgICAgICAgICAgICAgIGluZGVudCsrO1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkTGluZShpbmRlbnQsIGxpbmVzLCBcIjxkaXYgaWQ9XFxcInJvb3RcXFwiPjwvZGl2PlwiKTtcbiAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXNIdG1sLmJvZHkuZm9yRWFjaChib2R5ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRMaW5lKGluZGVudCwgbGluZXMsIGJvZHkpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGluZGVudC0tO1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkTGluZShpbmRlbnQsIGxpbmVzLCBcIjwvYm9keT5cIik7XG4gICAgICAgICAgICAgICAgaW5kZW50LS07XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRMaW5lKGluZGVudCwgbGluZXMsIFwiPC9odG1sPlwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZExpbmUoaW5kZW50LCBsaW5lcywgc3VwZXIud3JhcEdlbmVyYXRlZE1hcmtlcihcIjwhLS0gXCIsIFwiIC0tPlwiKSk7XG5cbiAgICAgICAgICAgICAgICBhd2FpdCBmaWxlU3lzdGVtLmZpbGVXcml0ZUxpbmVzKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBmaWxlbmFtZSwgbGluZXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgU2tpcHBpbmcgJHtmaWxlbmFtZX0gYXMgaXQgaGFzIG5vIGdlbmVyYXRlZCBtYXJrZXJgLCB7IHd3d0ZvbGRlcjogZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgR2VuZXJhdGluZyAke2ZpbGVuYW1lfSBmYWlsZWRgLCBlcnIsIHsgd3d3Rm9sZGVyOiBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciB9KTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhZGRMaW5lKGluZGVudDogbnVtYmVyLCBsaW5lczogc3RyaW5nW10sIGNvbnRlbnQ6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBsaW5lcy5wdXNoKFwiIFwiLnJlcGVhdChpbmRlbnQgKiA0KSArIGNvbnRlbnQpO1xuICAgIH1cbn1cbiJdfQ==
