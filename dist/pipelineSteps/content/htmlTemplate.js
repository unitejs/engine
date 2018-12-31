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
        const _super = Object.create(null, {
            fileToggleLines: { get: () => super.fileToggleLines }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.fileToggleLines.call(this, logger, fileSystem, engineVariables.wwwRootFolder, filename, engineVariables.force, mainCondition, () => __awaiter(this, void 0, void 0, function* () {
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
                this.addLine(indent, lines, this.wrapGeneratedMarker("<!-- ", " -->"));
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2NvbnRlbnQvaHRtbFRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFRQSxvRUFBaUU7QUFFakUsTUFBYSxZQUFhLFNBQVEsbUNBQWdCO0lBT2pDLFVBQVUsQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQyxFQUFFLGFBQXNCOztZQUM5SixJQUFJLENBQUMsYUFBYSxHQUFHO2dCQUNqQixJQUFJLEVBQUUsRUFBRTtnQkFDUixJQUFJLEVBQUUsRUFDTDthQUNKLENBQUM7WUFFRixJQUFJLENBQUMsV0FBVyxHQUFHO2dCQUNmLElBQUksRUFBRSxFQUFFO2dCQUNSLElBQUksRUFBRTtvQkFDRiw4REFBOEQ7b0JBQzlELGdDQUFnQztvQkFDaEMsMkRBQTJEO2lCQUM5RDthQUNKLENBQUM7WUFFRixlQUFlLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNqRSxlQUFlLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUVyRSxPQUFPLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtJQUVZLFFBQVEsQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQyxFQUFFLGFBQXNCOztZQUM1SixJQUFJLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLEVBQUUsWUFBWSxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBRXhLLElBQUksR0FBRyxLQUFLLENBQUMsRUFBRTtnQkFDWCxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsa0JBQWtCLEVBQUUs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RUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDdkMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDdkUsT0FBTyxLQUFLLENBQUM7WUFDakIsQ0FBQyxDQUFBLEVBQUU7UUFDUCxDQUFDO0tBQUE7SUFFTyxPQUFPLENBQUMsTUFBYyxFQUFFLEtBQWUsRUFBRSxPQUFlO1FBQzVELEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUM7SUFDakQsQ0FBQzs7QUE1RnVCLCtCQUFrQixHQUFXLHNCQUFzQixDQUFDO0FBQ3BELDRCQUFlLEdBQVcsbUJBQW1CLENBQUM7QUFGMUUsb0NBOEZDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvY29udGVudC9odG1sVGVtcGxhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFBpcGVsaW5lIHN0ZXAgdG8gZ2VuZXJhdGUgaHRtbCB0ZW1wbGF0ZS5cbiAqL1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBIdG1sVGVtcGxhdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL2h0bWxUZW1wbGF0ZS9odG1sVGVtcGxhdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuaW1wb3J0IHsgUGlwZWxpbmVTdGVwQmFzZSB9IGZyb20gXCIuLi8uLi9lbmdpbmUvcGlwZWxpbmVTdGVwQmFzZVwiO1xuXG5leHBvcnQgY2xhc3MgSHRtbFRlbXBsYXRlIGV4dGVuZHMgUGlwZWxpbmVTdGVwQmFzZSB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgRklMRU5BTUVfTk9fQlVORExFOiBzdHJpbmcgPSBcImluZGV4LW5vLWJ1bmRsZS5odG1sXCI7XG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgRklMRU5BTUVfQlVORExFOiBzdHJpbmcgPSBcImluZGV4LWJ1bmRsZS5odG1sXCI7XG5cbiAgICBwcml2YXRlIF9odG1sTm9CdW5kbGU6IEh0bWxUZW1wbGF0ZUNvbmZpZ3VyYXRpb247XG4gICAgcHJpdmF0ZSBfaHRtbEJ1bmRsZTogSHRtbFRlbXBsYXRlQ29uZmlndXJhdGlvbjtcblxuICAgIHB1YmxpYyBhc3luYyBpbml0aWFsaXNlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIHRoaXMuX2h0bWxOb0J1bmRsZSA9IHtcbiAgICAgICAgICAgIGhlYWQ6IFtdLFxuICAgICAgICAgICAgYm9keTogW1xuICAgICAgICAgICAgXVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuX2h0bWxCdW5kbGUgPSB7XG4gICAgICAgICAgICBoZWFkOiBbXSxcbiAgICAgICAgICAgIGJvZHk6IFtcbiAgICAgICAgICAgICAgICBcIjxzY3JpcHQgc3JjPVxcXCIuL2Rpc3QvdmVuZG9yLWJ1bmRsZS5qc3tDQUNIRUJVU1R9XFxcIj48L3NjcmlwdD5cIixcbiAgICAgICAgICAgICAgICBcIjxzY3JpcHQ+e1VOSVRFQ09ORklHfTwvc2NyaXB0PlwiLFxuICAgICAgICAgICAgICAgIFwiPHNjcmlwdCBzcmM9XFxcIi4vZGlzdC9hcHAtYnVuZGxlLmpze0NBQ0hFQlVTVH1cXFwiPjwvc2NyaXB0PlwiXG4gICAgICAgICAgICBdXG4gICAgICAgIH07XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnNldENvbmZpZ3VyYXRpb24oXCJIVE1MQnVuZGxlXCIsIHRoaXMuX2h0bWxCdW5kbGUpO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuc2V0Q29uZmlndXJhdGlvbihcIkhUTUxOb0J1bmRsZVwiLCB0aGlzLl9odG1sTm9CdW5kbGUpO1xuXG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaW5hbGlzZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBsZXQgcmV0ID0gYXdhaXQgdGhpcy5jcmVhdGVUZW1wbGF0ZShsb2dnZXIsIGZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzLCBIdG1sVGVtcGxhdGUuRklMRU5BTUVfTk9fQlVORExFLCB0aGlzLl9odG1sTm9CdW5kbGUsIGZhbHNlLCBtYWluQ29uZGl0aW9uKTtcblxuICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICByZXQgPSBhd2FpdCB0aGlzLmNyZWF0ZVRlbXBsYXRlKGxvZ2dlciwgZmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMsIEh0bWxUZW1wbGF0ZS5GSUxFTkFNRV9CVU5ETEUsIHRoaXMuX2h0bWxCdW5kbGUsIHRydWUsIG1haW5Db25kaXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgY3JlYXRlVGVtcGxhdGUobG9nZ2VyOiBJTG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlbmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXNIdG1sOiBIdG1sVGVtcGxhdGVDb25maWd1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0J1bmRsZWQ6IGJvb2xlYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICByZXR1cm4gc3VwZXIuZmlsZVRvZ2dsZUxpbmVzKGxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29uZGl0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzeW5jKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGluZXM6IHN0cmluZ1tdID0gW107XG4gICAgICAgICAgICBsZXQgaW5kZW50ID0gMDtcbiAgICAgICAgICAgIHRoaXMuYWRkTGluZShpbmRlbnQsIGxpbmVzLCBcIjwhZG9jdHlwZSBodG1sPlwiKTtcbiAgICAgICAgICAgIHRoaXMuYWRkTGluZShpbmRlbnQsIGxpbmVzLCBcIjxodG1sIGxhbmc9XFxcImVuXFxcIj5cIik7XG4gICAgICAgICAgICBpbmRlbnQrKztcbiAgICAgICAgICAgIHRoaXMuYWRkTGluZShpbmRlbnQsIGxpbmVzLCBcIjxoZWFkPlwiKTtcbiAgICAgICAgICAgIGluZGVudCsrO1xuICAgICAgICAgICAgdGhpcy5hZGRMaW5lKGluZGVudCwgbGluZXMsIFwiPG1ldGEgY2hhcnNldD1cXFwidXRmLThcXFwiLz5cIik7XG4gICAgICAgICAgICB0aGlzLmFkZExpbmUoaW5kZW50LCBsaW5lcywgXCI8bWV0YSBuYW1lPVxcXCJ2aWV3cG9ydFxcXCIgY29udGVudD1cXFwid2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTEsIHNocmluay10by1maXQ9bm9cXFwiPlwiKTtcbiAgICAgICAgICAgIHRoaXMuYWRkTGluZShpbmRlbnQsIGxpbmVzLCBgPHRpdGxlPntUSVRMRX08L3RpdGxlPmApO1xuICAgICAgICAgICAgbGluZXMucHVzaChcIntUSEVNRX1cIik7XG4gICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXNIdG1sLmhlYWQuZm9yRWFjaChoZWFkID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZExpbmUoaW5kZW50LCBsaW5lcywgaGVhZCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaW5kZW50LS07XG4gICAgICAgICAgICB0aGlzLmFkZExpbmUoaW5kZW50LCBsaW5lcywgXCI8L2hlYWQ+XCIpO1xuICAgICAgICAgICAgdGhpcy5hZGRMaW5lKGluZGVudCwgbGluZXMsIFwiPGJvZHk+XCIpO1xuICAgICAgICAgICAgaW5kZW50Kys7XG4gICAgICAgICAgICB0aGlzLmFkZExpbmUoaW5kZW50LCBsaW5lcywgXCI8ZGl2IGlkPVxcXCJhcHAtbG9hZGVyXFxcIj57QVBQTE9BREVSfTwvZGl2PlwiKTtcbiAgICAgICAgICAgIHRoaXMuYWRkTGluZShpbmRlbnQsIGxpbmVzLCBcIjxkaXYgaWQ9XFxcInJvb3RcXFwiPjwvZGl2PlwiKTtcbiAgICAgICAgICAgIGxpbmVzLnB1c2goXCJ7U0NSSVBUSU5DTFVERX1cIik7XG4gICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXNIdG1sLmJvZHkuZm9yRWFjaChib2R5ID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZExpbmUoaW5kZW50LCBsaW5lcywgYm9keSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuYWRkTGluZShpbmRlbnQsIGxpbmVzLCBcIjxsaW5rIHJlbD1cXFwic3R5bGVzaGVldFxcXCIgaHJlZj1cXFwiLi9jc3Mvc3R5bGUuY3Nze0NBQ0hFQlVTVH1cXFwiPlwiKTtcbiAgICAgICAgICAgIHRoaXMuYWRkTGluZShpbmRlbnQsIGxpbmVzLCBcIjxub3NjcmlwdD5Zb3VyIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBKYXZhU2NyaXB0IG9yIGhhcyBpdCBkaXNhYmxlZCwgdGhpcyBzaXRlIHdpbGwgbm90IHdvcmsgd2l0aG91dCBpdC48L25vc2NyaXB0PlwiKTtcbiAgICAgICAgICAgIGxpbmVzLnB1c2goXCJ7Qk9EWUVORH1cIik7XG4gICAgICAgICAgICBpbmRlbnQtLTtcbiAgICAgICAgICAgIHRoaXMuYWRkTGluZShpbmRlbnQsIGxpbmVzLCBcIjwvYm9keT5cIik7XG4gICAgICAgICAgICBpbmRlbnQtLTtcbiAgICAgICAgICAgIHRoaXMuYWRkTGluZShpbmRlbnQsIGxpbmVzLCBcIjwvaHRtbD5cIik7XG4gICAgICAgICAgICB0aGlzLmFkZExpbmUoaW5kZW50LCBsaW5lcywgdGhpcy53cmFwR2VuZXJhdGVkTWFya2VyKFwiPCEtLSBcIiwgXCIgLS0+XCIpKTtcbiAgICAgICAgICAgIHJldHVybiBsaW5lcztcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhZGRMaW5lKGluZGVudDogbnVtYmVyLCBsaW5lczogc3RyaW5nW10sIGNvbnRlbnQ6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBsaW5lcy5wdXNoKFwiIFwiLnJlcGVhdChpbmRlbnQgKiA0KSArIGNvbnRlbnQpO1xuICAgIH1cbn1cbiJdfQ==
