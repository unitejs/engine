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
    preProcess(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            this._htmlNoBundle = {
                head: [],
                body: [],
                scriptIncludes: []
            };
            this._htmlBundle = {
                head: [],
                body: [],
                scriptIncludes: []
            };
            engineVariables.setConfiguration("HTMLBundle", this._htmlBundle);
            engineVariables.setConfiguration("HTMLNoBundle", this._htmlNoBundle);
            return 0;
        });
    }
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.createTemplate(logger, fileSystem, uniteConfiguration, engineVariables, HtmlTemplate.FILENAME_NO_BUNDLE, this._htmlNoBundle);
            if (ret === 0) {
                ret = yield this.createTemplate(logger, fileSystem, uniteConfiguration, engineVariables, HtmlTemplate.FILENAME_BUNDLE, this._htmlBundle);
            }
            return ret;
        });
    }
    createTemplate(logger, fileSystem, uniteConfiguration, engineVariables, filename, engineVariablesHtml) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hasGeneratedMarker = yield _super("fileHasGeneratedMarker").call(this, fileSystem, engineVariables.wwwRootFolder, filename);
                if (hasGeneratedMarker) {
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
                    engineVariablesHtml.scriptIncludes.forEach(scriptInclude => {
                        const script = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.packageFolder, scriptInclude)));
                        this.addLine(indent, lines, `<script src="${script}"></script>`);
                    });
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2NvbnRlbnQvaHRtbFRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFPQSxnRkFBNkU7QUFHN0Usa0JBQTBCLFNBQVEsK0NBQXNCO0lBT3ZDLFVBQVUsQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7WUFDdEksSUFBSSxDQUFDLGFBQWEsR0FBRztnQkFDakIsSUFBSSxFQUFFLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFLEVBQUU7Z0JBQ1IsY0FBYyxFQUFFLEVBQUU7YUFDckIsQ0FBQztZQUVGLElBQUksQ0FBQyxXQUFXLEdBQUc7Z0JBQ2YsSUFBSSxFQUFFLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFLEVBQUU7Z0JBQ1IsY0FBYyxFQUFFLEVBQUU7YUFDckIsQ0FBQztZQUVGLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ2pFLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBRXJFLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7SUFFWSxPQUFPLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7O1lBQ25JLElBQUksR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsRUFBRSxZQUFZLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBRWxKLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNaLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLEVBQUUsWUFBWSxDQUFD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ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgc3RlcCB0byBnZW5lcmF0ZSBodG1sIHRlbXBsYXRlLlxuICovXG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IEh0bWxUZW1wbGF0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvaHRtbFRlbXBsYXRlL2h0bWxUZW1wbGF0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZVBpcGVsaW5lU3RlcEJhc2UgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVBpcGVsaW5lU3RlcEJhc2VcIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5cbmV4cG9ydCBjbGFzcyBIdG1sVGVtcGxhdGUgZXh0ZW5kcyBFbmdpbmVQaXBlbGluZVN0ZXBCYXNlIHtcbiAgICBwcml2YXRlIHN0YXRpYyBGSUxFTkFNRV9OT19CVU5ETEU6IHN0cmluZyA9IFwiaW5kZXgtbm8tYnVuZGxlLmh0bWxcIjtcbiAgICBwcml2YXRlIHN0YXRpYyBGSUxFTkFNRV9CVU5ETEU6IHN0cmluZyA9IFwiaW5kZXgtYnVuZGxlLmh0bWxcIjtcblxuICAgIHByaXZhdGUgX2h0bWxOb0J1bmRsZTogSHRtbFRlbXBsYXRlQ29uZmlndXJhdGlvbjtcbiAgICBwcml2YXRlIF9odG1sQnVuZGxlOiBIdG1sVGVtcGxhdGVDb25maWd1cmF0aW9uO1xuXG4gICAgcHVibGljIGFzeW5jIHByZVByb2Nlc3MobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgdGhpcy5faHRtbE5vQnVuZGxlID0ge1xuICAgICAgICAgICAgaGVhZDogW10sXG4gICAgICAgICAgICBib2R5OiBbXSxcbiAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVzOiBbXVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuX2h0bWxCdW5kbGUgPSB7XG4gICAgICAgICAgICBoZWFkOiBbXSxcbiAgICAgICAgICAgIGJvZHk6IFtdLFxuICAgICAgICAgICAgc2NyaXB0SW5jbHVkZXM6IFtdXG4gICAgICAgIH07XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnNldENvbmZpZ3VyYXRpb24oXCJIVE1MQnVuZGxlXCIsIHRoaXMuX2h0bWxCdW5kbGUpO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuc2V0Q29uZmlndXJhdGlvbihcIkhUTUxOb0J1bmRsZVwiLCB0aGlzLl9odG1sTm9CdW5kbGUpO1xuXG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBwcm9jZXNzKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGxldCByZXQgPSBhd2FpdCB0aGlzLmNyZWF0ZVRlbXBsYXRlKGxvZ2dlciwgZmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMsIEh0bWxUZW1wbGF0ZS5GSUxFTkFNRV9OT19CVU5ETEUsIHRoaXMuX2h0bWxOb0J1bmRsZSk7XG5cbiAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0ID0gYXdhaXQgdGhpcy5jcmVhdGVUZW1wbGF0ZShsb2dnZXIsIGZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzLCBIdG1sVGVtcGxhdGUuRklMRU5BTUVfQlVORExFLCB0aGlzLl9odG1sQnVuZGxlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGNyZWF0ZVRlbXBsYXRlKGxvZ2dlcjogSUxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZW5hbWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzSHRtbDogSHRtbFRlbXBsYXRlQ29uZmlndXJhdGlvbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBoYXNHZW5lcmF0ZWRNYXJrZXIgPSBhd2FpdCBzdXBlci5maWxlSGFzR2VuZXJhdGVkTWFya2VyKGZpbGVTeXN0ZW0sIGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBmaWxlbmFtZSk7XG5cbiAgICAgICAgICAgIGlmIChoYXNHZW5lcmF0ZWRNYXJrZXIpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgR2VuZXJhdGluZyAke2ZpbGVuYW1lfWAsIHsgd3d3Rm9sZGVyOiBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciB9KTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGxpbmVzOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICAgICAgICAgIGxldCBpbmRlbnQgPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkTGluZShpbmRlbnQsIGxpbmVzLCBcIjwhZG9jdHlwZSBodG1sPlwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZExpbmUoaW5kZW50LCBsaW5lcywgXCI8aHRtbD5cIik7XG4gICAgICAgICAgICAgICAgaW5kZW50Kys7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRMaW5lKGluZGVudCwgbGluZXMsIFwiPGhlYWQ+XCIpO1xuICAgICAgICAgICAgICAgIGluZGVudCsrO1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkTGluZShpbmRlbnQsIGxpbmVzLCBcIjxtZXRhIGNoYXJzZXQ9XFxcInV0Zi04XFxcIi8+XCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkTGluZShpbmRlbnQsIGxpbmVzLCBgPHRpdGxlPiR7dW5pdGVDb25maWd1cmF0aW9uLnRpdGxlfTwvdGl0bGU+YCk7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRMaW5lKGluZGVudCwgbGluZXMsIFwiPGxpbmsgcmVsPVxcXCJzdHlsZXNoZWV0XFxcIiBocmVmPVxcXCIuL2Nzcy9zdHlsZS5jc3N7Q0FDSEVCVVNUfVxcXCI+XCIpO1xuICAgICAgICAgICAgICAgIGxpbmVzLnB1c2goXCJ7VEhFTUV9XCIpO1xuXG4gICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzSHRtbC5zY3JpcHRJbmNsdWRlcy5mb3JFYWNoKHNjcmlwdEluY2x1ZGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzY3JpcHQgPSBmaWxlU3lzdGVtLnBhdGhUb1dlYihmaWxlU3lzdGVtLnBhdGhGaWxlUmVsYXRpdmUoZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLnd3dy5wYWNrYWdlRm9sZGVyLCBzY3JpcHRJbmNsdWRlKSkpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkTGluZShpbmRlbnQsIGxpbmVzLCBgPHNjcmlwdCBzcmM9XCIke3NjcmlwdH1cIj48L3NjcmlwdD5gKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlc0h0bWwuaGVhZC5mb3JFYWNoKGhlYWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZExpbmUoaW5kZW50LCBsaW5lcywgaGVhZCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBpbmRlbnQtLTtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZExpbmUoaW5kZW50LCBsaW5lcywgXCI8L2hlYWQ+XCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkTGluZShpbmRlbnQsIGxpbmVzLCBcIjxib2R5PlwiKTtcbiAgICAgICAgICAgICAgICBpbmRlbnQrKztcbiAgICAgICAgICAgICAgICB0aGlzLmFkZExpbmUoaW5kZW50LCBsaW5lcywgXCI8ZGl2IGlkPVxcXCJyb290XFxcIj48L2Rpdj5cIik7XG4gICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzSHRtbC5ib2R5LmZvckVhY2goYm9keSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkTGluZShpbmRlbnQsIGxpbmVzLCBib2R5KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpbmRlbnQtLTtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZExpbmUoaW5kZW50LCBsaW5lcywgXCI8L2JvZHk+XCIpO1xuICAgICAgICAgICAgICAgIGluZGVudC0tO1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkTGluZShpbmRlbnQsIGxpbmVzLCBcIjwvaHRtbD5cIik7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRMaW5lKGluZGVudCwgbGluZXMsIHN1cGVyLndyYXBHZW5lcmF0ZWRNYXJrZXIoXCI8IS0tIFwiLCBcIiAtLT5cIikpO1xuXG4gICAgICAgICAgICAgICAgYXdhaXQgZmlsZVN5c3RlbS5maWxlV3JpdGVMaW5lcyhlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgZmlsZW5hbWUsIGxpbmVzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYFNraXBwaW5nICR7ZmlsZW5hbWV9IGFzIGl0IGhhcyBubyBnZW5lcmF0ZWQgbWFya2VyYCwgeyB3d3dGb2xkZXI6IGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBsb2dnZXIuZXJyb3IoYEdlbmVyYXRpbmcgJHtmaWxlbmFtZX0gZmFpbGVkYCwgZXJyLCB7IHd3d0ZvbGRlcjogZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIgfSk7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYWRkTGluZShpbmRlbnQ6IG51bWJlciwgbGluZXM6IHN0cmluZ1tdLCBjb250ZW50OiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgbGluZXMucHVzaChcIiBcIi5yZXBlYXQoaW5kZW50ICogNCkgKyBjb250ZW50KTtcbiAgICB9XG59XG4iXX0=
