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
const uniteLanguage_1 = require("../configuration/models/unite/uniteLanguage");
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
                let ext = "";
                switch (engineVariables.uniteLanguage) {
                    case uniteLanguage_1.UniteLanguage.ES5:
                        this.buildES5AppMain(lines);
                        ext = "js";
                        break;
                    // case UniteLanguage.ES6: this.buildES6AppMain(lines); break;
                    // case UniteLanguage.TypeScript: this.buildTypeScriptAppMain(lines); break;
                    default: break;
                }
                yield fileSystem.fileWriteLines(engineVariables.appSourceFolder, "main." + ext, lines);
                return 0;
            }
            catch (err) {
                _super("error").call(this, logger, display, "Generating App main failed", err, { appSourceFolder: engineVariables.appSourceFolder });
                return 1;
            }
        });
    }
    buildES5AppMain(lines) {
        lines.push("/**");
        lines.push(" * Main entry point for app.");
        lines.push(" */");
        lines.push("\"use strict\";");
        lines.push("function main() {");
        lines.push("    console.log('Hello ES5 UniteJS World');");
        lines.push("}");
    }
}
exports.GenerateAppScaffold = GenerateAppScaffold;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvZ2VuZXJhdGVBcHBTY2FmZm9sZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBSUEsK0VBQTRFO0FBQzVFLDZFQUEwRTtBQU0xRSx5QkFBaUMsU0FBUSwrQ0FBc0I7SUFDOUMsT0FBTyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUN0SixlQUFlLENBQUMsZUFBZSxHQUFHLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDL0csSUFBSSxDQUFDO2dCQUNELGFBQVMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLCtCQUErQixFQUFFLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBQyxlQUFlLEVBQUUsRUFBRTtnQkFDbEgsTUFBTSxVQUFVLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUN0RSxDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxlQUFXLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxzQ0FBc0MsRUFBRSxHQUFHLEVBQUUsRUFBRSxlQUFlLEVBQUUsZUFBZSxDQUFDLGVBQWUsRUFBRSxFQUFFO2dCQUNoSSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUVELElBQUksQ0FBQztnQkFDRCxhQUFTLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUMsZUFBZSxFQUFFLEVBQUU7Z0JBRTNHLE1BQU0sS0FBSyxHQUFhLEVBQUUsQ0FBQztnQkFDM0IsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO2dCQUViLE1BQU0sQ0FBQyxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO29CQUNwQyxLQUFLLDZCQUFhLENBQUMsR0FBRzt3QkFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7d0JBQUMsS0FBSyxDQUFDO29CQUN2RSw4REFBOEQ7b0JBQzlELDRFQUE0RTtvQkFDNUUsU0FBUyxLQUFLLENBQUM7Z0JBQ25CLENBQUM7Z0JBRUQsTUFBTSxVQUFVLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQyxlQUFlLEVBQUUsT0FBTyxHQUFHLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDdkYsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLDRCQUE0QixFQUFFLEdBQUcsRUFBRSxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUMsZUFBZSxFQUFFLEVBQUU7Z0JBQ3RILE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1FBQ0wsQ0FBQztLQUFBO0lBRU8sZUFBZSxDQUFDLEtBQWU7UUFDbkMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsQixLQUFLLENBQUMsSUFBSSxDQUFDLDhCQUE4QixDQUFDLENBQUM7UUFDM0MsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsQixLQUFLLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDOUIsS0FBSyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ2hDLEtBQUssQ0FBQyxJQUFJLENBQUMsNkNBQTZDLENBQUMsQ0FBQztRQUMxRCxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3BCLENBQUM7Q0FDSjtBQXpDRCxrREF5Q0MiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9nZW5lcmF0ZUFwcFNjYWZmb2xkLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
