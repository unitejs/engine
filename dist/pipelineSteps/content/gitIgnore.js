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
class GitIgnore extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hasGeneratedMarker = yield _super("fileHasGeneratedMarker").call(this, fileSystem, engineVariables.rootFolder, GitIgnore.FILENAME);
                if (hasGeneratedMarker) {
                    _super("log").call(this, logger, display, `Writing ${GitIgnore.FILENAME}`);
                    engineVariables.gitIgnore.push("node_modules");
                    engineVariables.gitIgnore.push(_super("wrapGeneratedMarker").call(this, "# ", ""));
                    yield fileSystem.fileWriteLines(engineVariables.rootFolder, GitIgnore.FILENAME, engineVariables.gitIgnore);
                }
                else {
                    _super("log").call(this, logger, display, `Skipping ${GitIgnore.FILENAME} as it has no generated marker`);
                }
                return 0;
            }
            catch (err) {
                _super("error").call(this, logger, display, `Writing ${GitIgnore.FILENAME} failed`, err);
                return 1;
            }
        });
    }
}
GitIgnore.FILENAME = ".gitignore";
exports.GitIgnore = GitIgnore;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2NvbnRlbnQvZ2l0SWdub3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFPQSxnRkFBNkU7QUFHN0UsZUFBdUIsU0FBUSwrQ0FBc0I7SUFHcEMsT0FBTyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUN0SixJQUFJLENBQUM7Z0JBQ0QsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLGdDQUE0QixZQUFDLFVBQVUsRUFBRSxlQUFlLENBQUMsVUFBVSxFQUFFLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFFMUgsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO29CQUNyQixhQUFTLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxXQUFXLFNBQVMsQ0FBQyxRQUFRLEVBQUUsRUFBRTtvQkFFNUQsZUFBZSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7b0JBQy9DLGVBQWUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLDZCQUF5QixZQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQztvQkFFcEUsTUFBTSxVQUFVLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDLFFBQVEsRUFBRSxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQy9HLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsWUFBWSxTQUFTLENBQUMsUUFBUSxnQ0FBZ0MsRUFBRTtnQkFDL0YsQ0FBQztnQkFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsZUFBVyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsV0FBVyxTQUFTLENBQUMsUUFBUSxTQUFTLEVBQUUsR0FBRyxFQUFFO2dCQUMxRSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztRQUNMLENBQUM7S0FBQTs7QUF0QmMsa0JBQVEsR0FBVyxZQUFZLENBQUM7QUFEbkQsOEJBd0JDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvY29udGVudC9naXRJZ25vcmUuanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
