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
                const hasGeneratedMarker = yield _super("fileHasGeneratedMarker").call(this, fileSystem, engineVariables.rootFolder, ReadMe.FILENAME);
                if (hasGeneratedMarker) {
                    _super("log").call(this, logger, display, `Writing ${ReadMe.FILENAME}`);
                    const lines = [];
                    lines.push(`# ${uniteConfiguration.title}`);
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
                    lines.push(_super("wrapGeneratedMarker").call(this, "*", "* :zap:"));
                    yield fileSystem.fileWriteLines(engineVariables.rootFolder, ReadMe.FILENAME, lines);
                }
                else {
                    _super("log").call(this, logger, display, `Skipping ${ReadMe.FILENAME} as it has no generated marker`);
                }
                return 0;
            }
            catch (err) {
                _super("error").call(this, logger, display, `Writing ${ReadMe.FILENAME} failed`, err);
                return 1;
            }
        });
    }
}
ReadMe.FILENAME = "README.md";
exports.ReadMe = ReadMe;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2NvbnRlbnQvcmVhZE1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFPQSxnRkFBNkU7QUFHN0UsWUFBb0IsU0FBUSwrQ0FBc0I7SUFHakMsT0FBTyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUN0SixJQUFJLENBQUM7Z0JBQ0QsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLGdDQUE0QixZQUFDLFVBQVUsRUFBRSxlQUFlLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFFdkgsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO29CQUNyQixhQUFTLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxXQUFXLE1BQU0sQ0FBQyxRQUFRLEVBQUUsRUFBRTtvQkFFekQsTUFBTSxLQUFLLEdBQWEsRUFBRSxDQUFDO29CQUUzQixLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssa0JBQWtCLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztvQkFDNUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDZixLQUFLLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7b0JBQzlCLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ2YsS0FBSyxDQUFDLElBQUksQ0FBQyx1RUFBdUUsQ0FBQyxDQUFDO29CQUNwRixLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUNmLEtBQUssQ0FBQyxJQUFJLENBQUMsaURBQWlELENBQUMsQ0FBQztvQkFDOUQsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDZixLQUFLLENBQUMsSUFBSSxDQUFDLG1FQUFtRSxDQUFDLENBQUM7b0JBQ2hGLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ2YsS0FBSyxDQUFDLElBQUksQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO29CQUM5QyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUNmLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7b0JBQ3ZCLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ2YsS0FBSyxDQUFDLElBQUksQ0FBQywwREFBMEQsQ0FBQyxDQUFDO29CQUN2RSxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUNmLEtBQUssQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7b0JBQzNCLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ2YsS0FBSyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO29CQUM5QixLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUNmLEtBQUssQ0FBQyxJQUFJLENBQUMsaUlBQWlJLENBQUMsQ0FBQztvQkFDOUksS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDZixLQUFLLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUMxQixLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUNmLEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7b0JBQ3pCLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ2YsS0FBSyxDQUFDLElBQUksQ0FBQyxxR0FBcUcsQ0FBQyxDQUFDO29CQUNsSCxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUNmLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ2xCLEtBQUssQ0FBQyxJQUFJLENBQUMsNkJBQXlCLFlBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxDQUFDO29CQUV0RCxNQUFNLFVBQVUsQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUN4RixDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLGFBQVMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFlBQVksTUFBTSxDQUFDLFFBQVEsZ0NBQWdDLEVBQUU7Z0JBQzVGLENBQUM7Z0JBRUQsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFdBQVcsTUFBTSxDQUFDLFFBQVEsU0FBUyxFQUFFLEdBQUcsRUFBRTtnQkFDdkUsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7UUFDTCxDQUFDO0tBQUE7O0FBcERjLGVBQVEsR0FBVyxXQUFXLENBQUM7QUFEbEQsd0JBc0RDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvY29udGVudC9yZWFkTWUuanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
