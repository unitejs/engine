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
const htmlTemplate_1 = require("../html/htmlTemplate");
class GenerateHtmlTemplate extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            try {
                _super("log").call(this, logger, display, "Generating index.html.template int", { outputDirectory: uniteConfiguration.outputDirectory });
                const htmlTemplate = new htmlTemplate_1.HtmlTemplate();
                const lines = htmlTemplate.generateTemplate();
                yield fileSystem.fileWriteLines(uniteConfiguration.outputDirectory, "index.html.template", lines);
                return 0;
            }
            catch (err) {
                _super("error").call(this, logger, display, "Generating index.html.template", err, { outputDirectory: uniteConfiguration.outputDirectory });
                return 1;
            }
        });
    }
}
exports.GenerateHtmlTemplate = GenerateHtmlTemplate;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvZ2VuZXJhdGVIdG1sVGVtcGxhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUlBLDZFQUEwRTtBQUUxRSx1REFBb0Q7QUFLcEQsMEJBQWtDLFNBQVEsK0NBQXNCO0lBQy9DLE9BQU8sQ0FBQyxNQUFlLEVBQUUsT0FBaUIsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDdEosSUFBSSxDQUFDO2dCQUNELGFBQVMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLG9DQUFvQyxFQUFFLEVBQUUsZUFBZSxFQUFFLGtCQUFrQixDQUFDLGVBQWUsRUFBRSxFQUFFO2dCQUMxSCxNQUFNLFlBQVksR0FBRyxJQUFJLDJCQUFZLEVBQUUsQ0FBQztnQkFDeEMsTUFBTSxLQUFLLEdBQUcsWUFBWSxDQUFDLGdCQUFnQixFQUFFLENBQUM7Z0JBQzlDLE1BQU0sVUFBVSxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLEVBQUUscUJBQXFCLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ2xHLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxlQUFXLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxnQ0FBZ0MsRUFBRSxHQUFHLEVBQUUsRUFBRSxlQUFlLEVBQUUsa0JBQWtCLENBQUMsZUFBZSxFQUFFLEVBQUU7Z0JBQzdILE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1FBQ0wsQ0FBQztLQUFBO0NBQ0o7QUFiRCxvREFhQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2dlbmVyYXRlSHRtbFRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
