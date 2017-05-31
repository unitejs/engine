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
class GenerateAppScaffold extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.appSourceFolder = fileSystem.directoryPathCombine(uniteConfiguration.outputDirectory, "\\src");
            try {
                _super("log").call(this, logger, display, "Creating App Source Directory", { appSourceFolder: engineVariables.appSourceFolder });
                yield fileSystem.directoryCreate(engineVariables.appSourceFolder);
            }
            catch (err) {
                _super("error").call(this, logger, display, "Creating App Source Directory failed", err, { appSourceFolder: engineVariables.appSourceFolder });
                return 1;
            }
            try {
                _super("log").call(this, logger, display, "Generating App Main in", { appSourceFolder: engineVariables.appSourceFolder });
                const lines = [];
                const ext = engineVariables.uniteSourceLanguage === "JavaScript" ? "js" : "ts";
                this.buildAppMain(lines, engineVariables.uniteSourceLanguage);
                yield fileSystem.fileWriteLines(engineVariables.appSourceFolder, "main." + ext, lines);
                return 0;
            }
            catch (err) {
                _super("error").call(this, logger, display, "Generating App main failed", err, { appSourceFolder: engineVariables.appSourceFolder });
                return 1;
            }
        });
    }
    buildAppMain(lines, language) {
        const quote = language === "JavaScript" ? "'" : "\"";
        lines.push("/**");
        lines.push(" * Main entry point for app.");
        lines.push(" */");
        lines.push("export function entryPoint() {");
        lines.push("    document.body.innerHTML = " + quote + "Hello " + language + " UniteJS World!" + quote + ";");
        lines.push("}");
    }
}
exports.GenerateAppScaffold = GenerateAppScaffold;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvZ2VuZXJhdGVBcHBTY2FmZm9sZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBS0EsNkVBQTBFO0FBTTFFLHlCQUFpQyxTQUFRLCtDQUFzQjtJQUM5QyxPQUFPLENBQUMsTUFBZSxFQUFFLE9BQWlCLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQ3RKLGVBQWUsQ0FBQyxlQUFlLEdBQUcsVUFBVSxDQUFDLG9CQUFvQixDQUFDLGtCQUFrQixDQUFDLGVBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUMvRyxJQUFJLENBQUM7Z0JBQ0QsYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsK0JBQStCLEVBQUUsRUFBRSxlQUFlLEVBQUUsZUFBZSxDQUFDLGVBQWUsRUFBRSxFQUFFO2dCQUNsSCxNQUFNLFVBQVUsQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ3RFLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLHNDQUFzQyxFQUFFLEdBQUcsRUFBRSxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUMsZUFBZSxFQUFFLEVBQUU7Z0JBQ2hJLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBRUQsSUFBSSxDQUFDO2dCQUNELGFBQVMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLHdCQUF3QixFQUFFLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBQyxlQUFlLEVBQUUsRUFBRTtnQkFFM0csTUFBTSxLQUFLLEdBQWEsRUFBRSxDQUFDO2dCQUMzQixNQUFNLEdBQUcsR0FBRyxlQUFlLENBQUMsbUJBQW1CLEtBQUssWUFBWSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUM7Z0JBRS9FLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO2dCQUU5RCxNQUFNLFVBQVUsQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLGVBQWUsRUFBRSxPQUFPLEdBQUcsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUN2RixNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsZUFBVyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsR0FBRyxFQUFFLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBQyxlQUFlLEVBQUUsRUFBRTtnQkFDdEgsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7UUFDTCxDQUFDO0tBQUE7SUFFTyxZQUFZLENBQUMsS0FBZSxFQUFFLFFBQTZCO1FBQy9ELE1BQU0sS0FBSyxHQUFHLFFBQVEsS0FBSyxZQUFZLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQztRQUVyRCxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xCLEtBQUssQ0FBQyxJQUFJLENBQUMsOEJBQThCLENBQUMsQ0FBQztRQUMzQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xCLEtBQUssQ0FBQyxJQUFJLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztRQUM3QyxLQUFLLENBQUMsSUFBSSxDQUFDLGdDQUFnQyxHQUFHLEtBQUssR0FBRyxRQUFRLEdBQUcsUUFBUSxHQUFHLGlCQUFpQixHQUFHLEtBQUssR0FBRyxHQUFHLENBQUMsQ0FBQztRQUM3RyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3BCLENBQUM7Q0FDSjtBQXJDRCxrREFxQ0MiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9nZW5lcmF0ZUFwcFNjYWZmb2xkLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
