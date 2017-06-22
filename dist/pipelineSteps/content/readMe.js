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
class ReadMe extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            try {
                _super("log").call(this, logger, display, "Writing README.md");
                // If the current file has our marker at the end then overwrite, if its been removed then keep content
                const hasMarker = yield _super("fileHasMarker").call(this, fileSystem, engineVariables.rootFolder, "README.md");
                if (hasMarker) {
                    const lines = [];
                    lines.push("# " + uniteConfiguration.title);
                    lines.push("");
                    lines.push("## Installation");
                    lines.push("");
                    lines.push("The following pre-requisites are needed before you can build the app.");
                    lines.push("");
                    lines.push("\tnpm -g install gulp [or] yarn global add gulp");
                    lines.push("");
                    lines.push("You will then need to install the packages required by the tasks.");
                    lines.push("");
                    lines.push("\tnpm install [or] yarn install");
                    lines.push("");
                    lines.push("## Build");
                    lines.push("");
                    lines.push("To build your application execute the following command:");
                    lines.push("");
                    lines.push("\tgulp build");
                    lines.push("");
                    lines.push("## Unit Testing");
                    lines.push("");
                    lines.push("To unit test your code execute the following command (this will also generate unit and coverage reports in the reports folder):");
                    lines.push("");
                    lines.push("\tgulp unit");
                    lines.push("");
                    lines.push("## Serving");
                    lines.push("");
                    lines.push("To view your application execute the following command and enter the displayed url in your browser:");
                    lines.push("");
                    lines.push("---");
                    lines.push(_super("wrapMarker").call(this, "*", "* :zap:"));
                    yield fileSystem.fileWriteLines(engineVariables.rootFolder, "README.md", lines);
                }
                else {
                    _super("log").call(this, logger, display, "Skipping README.md as it has no marker");
                }
                return 0;
            }
            catch (err) {
                _super("error").call(this, logger, display, "Writing README.md failed", err);
                return 1;
            }
        });
    }
}
exports.ReadMe = ReadMe;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvY29udGVudC9yZWFkTWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUlBLGdGQUE2RTtBQU03RSxZQUFvQixTQUFRLCtDQUFzQjtJQUNqQyxPQUFPLENBQUMsTUFBZSxFQUFFLE9BQWlCLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQ3RKLElBQUksQ0FBQztnQkFDRCxhQUFTLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRTtnQkFFaEQsc0dBQXNHO2dCQUN0RyxNQUFNLFNBQVMsR0FBRyxNQUFNLHVCQUFtQixZQUFDLFVBQVUsRUFBRSxlQUFlLENBQUMsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFDO2dCQUVqRyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO29CQUNaLE1BQU0sS0FBSyxHQUFhLEVBQUUsQ0FBQztvQkFFM0IsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQzVDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ2YsS0FBSyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO29CQUM5QixLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUNmLEtBQUssQ0FBQyxJQUFJLENBQUMsdUVBQXVFLENBQUMsQ0FBQztvQkFDcEYsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDZixLQUFLLENBQUMsSUFBSSxDQUFDLGlEQUFpRCxDQUFDLENBQUM7b0JBQzlELEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ2YsS0FBSyxDQUFDLElBQUksQ0FBQyxtRUFBbUUsQ0FBQyxDQUFDO29CQUNoRixLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUNmLEtBQUssQ0FBQyxJQUFJLENBQUMsaUNBQWlDLENBQUMsQ0FBQztvQkFDOUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDZixLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUN2QixLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUNmLEtBQUssQ0FBQyxJQUFJLENBQUMsMERBQTBELENBQUMsQ0FBQztvQkFDdkUsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDZixLQUFLLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO29CQUMzQixLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUNmLEtBQUssQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztvQkFDOUIsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDZixLQUFLLENBQUMsSUFBSSxDQUFDLGlJQUFpSSxDQUFDLENBQUM7b0JBQzlJLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ2YsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFDMUIsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDZixLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO29CQUN6QixLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUNmLEtBQUssQ0FBQyxJQUFJLENBQUMscUdBQXFHLENBQUMsQ0FBQztvQkFDbEgsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDZixLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUNsQixLQUFLLENBQUMsSUFBSSxDQUFDLG9CQUFnQixZQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUUsQ0FBQztvQkFFN0MsTUFBTSxVQUFVLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUNwRixDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLGFBQVMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLHdDQUF3QyxFQUFFO2dCQUN6RSxDQUFDO2dCQUVELE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxlQUFXLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxHQUFHLEVBQUU7Z0JBQzlELE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1FBQ0wsQ0FBQztLQUFBO0NBQ0o7QUFyREQsd0JBcURDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvY29udGVudC9yZWFkTWUuanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
