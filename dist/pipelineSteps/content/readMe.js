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
                const hasGeneratedMarker = yield _super("fileHasGeneratedMarker").call(this, fileSystem, engineVariables.wwwFolder, ReadMe.FILENAME);
                if (hasGeneratedMarker) {
                    _super("log").call(this, logger, display, `Writing ${ReadMe.FILENAME}`);
                    const lines = yield fileSystem.fileReadLines(engineVariables.packageAssetsDirectory, ReadMe.FILENAME);
                    lines.unshift("");
                    lines.unshift(`# ${uniteConfiguration.title}`);
                    lines.push("---");
                    lines.push(_super("wrapGeneratedMarker").call(this, "*", "* :zap:"));
                    yield fileSystem.fileWriteLines(engineVariables.wwwFolder, ReadMe.FILENAME, lines);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2NvbnRlbnQvcmVhZE1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFPQSxnRkFBNkU7QUFHN0UsWUFBb0IsU0FBUSwrQ0FBc0I7SUFHakMsT0FBTyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUN0SixJQUFJLENBQUM7Z0JBQ0QsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLGdDQUE0QixZQUFDLFVBQVUsRUFBRSxlQUFlLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFFdEgsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO29CQUNyQixhQUFTLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxXQUFXLE1BQU0sQ0FBQyxRQUFRLEVBQUUsRUFBRTtvQkFFekQsTUFBTSxLQUFLLEdBQUcsTUFBTSxVQUFVLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxzQkFBc0IsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBRXRHLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ2xCLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO29CQUUvQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUNsQixLQUFLLENBQUMsSUFBSSxDQUFDLDZCQUF5QixZQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUUsQ0FBQztvQkFFdEQsTUFBTSxVQUFVLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDdkYsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixhQUFTLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxZQUFZLE1BQU0sQ0FBQyxRQUFRLGdDQUFnQyxFQUFFO2dCQUM1RixDQUFDO2dCQUVELE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxlQUFXLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxXQUFXLE1BQU0sQ0FBQyxRQUFRLFNBQVMsRUFBRSxHQUFHLEVBQUU7Z0JBQ3ZFLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1FBQ0wsQ0FBQztLQUFBOztBQTNCYyxlQUFRLEdBQVcsV0FBVyxDQUFDO0FBRGxELHdCQTZCQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2NvbnRlbnQvcmVhZE1lLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
