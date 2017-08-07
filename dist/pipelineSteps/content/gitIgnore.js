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
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hasGeneratedMarker = yield _super("fileHasGeneratedMarker").call(this, fileSystem, engineVariables.wwwFolder, GitIgnore.FILENAME);
                if (hasGeneratedMarker) {
                    logger.info(`Generating ${GitIgnore.FILENAME}`, { wwwFolder: engineVariables.wwwFolder });
                    engineVariables.gitIgnore.push("node_modules");
                    engineVariables.gitIgnore.push(_super("wrapGeneratedMarker").call(this, "# ", ""));
                    yield fileSystem.fileWriteLines(engineVariables.wwwFolder, GitIgnore.FILENAME, engineVariables.gitIgnore);
                }
                else {
                    logger.info(`Skipping ${GitIgnore.FILENAME} as it has no generated marker`);
                }
                return 0;
            }
            catch (err) {
                logger.error(`Generating ${GitIgnore.FILENAME} failed`, err);
                return 1;
            }
        });
    }
}
GitIgnore.FILENAME = ".gitignore";
exports.GitIgnore = GitIgnore;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2NvbnRlbnQvZ2l0SWdub3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFNQSxnRkFBNkU7QUFHN0UsZUFBdUIsU0FBUSwrQ0FBc0I7SUFHcEMsT0FBTyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDbkksSUFBSSxDQUFDO2dCQUNELE1BQU0sa0JBQWtCLEdBQUcsTUFBTSxnQ0FBNEIsWUFBQyxVQUFVLEVBQUUsZUFBZSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBRXpILEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztvQkFDckIsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLFNBQVMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxlQUFlLENBQUMsU0FBUyxFQUFDLENBQUMsQ0FBQztvQkFFekYsZUFBZSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7b0JBQy9DLGVBQWUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLDZCQUF5QixZQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQztvQkFFcEUsTUFBTSxVQUFVLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLFFBQVEsRUFBRSxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQzlHLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLFNBQVMsQ0FBQyxRQUFRLGdDQUFnQyxDQUFDLENBQUM7Z0JBQ2hGLENBQUM7Z0JBRUQsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsY0FBYyxTQUFTLENBQUMsUUFBUSxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQzdELE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1FBQ0wsQ0FBQztLQUFBOztBQXRCYyxrQkFBUSxHQUFXLFlBQVksQ0FBQztBQURuRCw4QkF3QkMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9jb250ZW50L2dpdElnbm9yZS5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMifQ==
