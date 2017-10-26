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
class PipelineLocator {
    static getPipelineFolder(fileSystem, engineRootFolder) {
        return fileSystem.pathCombine(engineRootFolder, "dist/pipelineSteps");
    }
    static getPipelineCategories(fileSystem, engineRootFolder) {
        return __awaiter(this, void 0, void 0, function* () {
            const pipelineStepFolder = PipelineLocator.getPipelineFolder(fileSystem, engineRootFolder);
            return fileSystem.directoryGetFolders(pipelineStepFolder);
        });
    }
    static getPipelineCategoryItems(fileSystem, engineRootFolder, category) {
        return __awaiter(this, void 0, void 0, function* () {
            const pipelineStepFolder = PipelineLocator.getPipelineFolder(fileSystem, engineRootFolder);
            const fullFolder = fileSystem.pathCombine(pipelineStepFolder, category);
            const files = yield fileSystem.directoryGetFiles(fullFolder);
            return files.filter(file => file.endsWith(".js")).map(file => file.replace(".js", ""));
        });
    }
    static loadItem(fileSystem, engineRootFolder, category, item) {
        return __awaiter(this, void 0, void 0, function* () {
            const pipelineStepFolder = PipelineLocator.getPipelineFolder(fileSystem, engineRootFolder);
            const categoryFolder = fileSystem.pathCombine(pipelineStepFolder, category);
            const loadFile = fileSystem.pathCombine(categoryFolder, `${item}.js`);
            return Promise.resolve().then(function () { return require(loadFile); });
        });
    }
}
exports.PipelineLocator = PipelineLocator;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmdpbmUvcGlwZWxpbmVMb2NhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFLQTtJQUNXLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxVQUF1QixFQUFFLGdCQUF3QjtRQUM3RSxNQUFNLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFFTSxNQUFNLENBQU8scUJBQXFCLENBQUMsVUFBdUIsRUFBRSxnQkFBd0I7O1lBQ3ZGLE1BQU0sa0JBQWtCLEdBQUcsZUFBZSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1lBRTNGLE1BQU0sQ0FBQyxVQUFVLENBQUMsbUJBQW1CLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUM5RCxDQUFDO0tBQUE7SUFFTSxNQUFNLENBQU8sd0JBQXdCLENBQUMsVUFBdUIsRUFBRSxnQkFBd0IsRUFBRSxRQUFnQjs7WUFDNUcsTUFBTSxrQkFBa0IsR0FBRyxlQUFlLENBQUMsaUJBQWlCLENBQUMsVUFBVSxFQUFFLGdCQUFnQixDQUFDLENBQUM7WUFFM0YsTUFBTSxVQUFVLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUN4RSxNQUFNLEtBQUssR0FBRyxNQUFNLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUU3RCxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzNGLENBQUM7S0FBQTtJQUVNLE1BQU0sQ0FBTyxRQUFRLENBQUMsVUFBdUIsRUFBRSxnQkFBd0IsRUFBRSxRQUFnQixFQUFFLElBQVk7O1lBQzFHLE1BQU0sa0JBQWtCLEdBQUcsZUFBZSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1lBQzNGLE1BQU0sY0FBYyxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsa0JBQWtCLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFFNUUsTUFBTSxRQUFRLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxjQUFjLEVBQUUsR0FBRyxJQUFJLEtBQUssQ0FBQyxDQUFDO1lBQ3RFLE1BQU0scURBQVEsUUFBUSxNQUFFO1FBQzVCLENBQUM7S0FBQTtDQUNKO0FBM0JELDBDQTJCQyIsImZpbGUiOiJlbmdpbmUvcGlwZWxpbmVMb2NhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBMb2NhdG9yXG4gKi9cbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuXG5leHBvcnQgY2xhc3MgUGlwZWxpbmVMb2NhdG9yIHtcbiAgICBwdWJsaWMgc3RhdGljIGdldFBpcGVsaW5lRm9sZGVyKGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCBlbmdpbmVSb290Rm9sZGVyOiBzdHJpbmcpIDogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lUm9vdEZvbGRlciwgXCJkaXN0L3BpcGVsaW5lU3RlcHNcIik7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBhc3luYyBnZXRQaXBlbGluZUNhdGVnb3JpZXMoZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIGVuZ2luZVJvb3RGb2xkZXI6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nW10+IHtcbiAgICAgICAgY29uc3QgcGlwZWxpbmVTdGVwRm9sZGVyID0gUGlwZWxpbmVMb2NhdG9yLmdldFBpcGVsaW5lRm9sZGVyKGZpbGVTeXN0ZW0sIGVuZ2luZVJvb3RGb2xkZXIpO1xuXG4gICAgICAgIHJldHVybiBmaWxlU3lzdGVtLmRpcmVjdG9yeUdldEZvbGRlcnMocGlwZWxpbmVTdGVwRm9sZGVyKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIGdldFBpcGVsaW5lQ2F0ZWdvcnlJdGVtcyhmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgZW5naW5lUm9vdEZvbGRlcjogc3RyaW5nLCBjYXRlZ29yeTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmdbXT4ge1xuICAgICAgICBjb25zdCBwaXBlbGluZVN0ZXBGb2xkZXIgPSBQaXBlbGluZUxvY2F0b3IuZ2V0UGlwZWxpbmVGb2xkZXIoZmlsZVN5c3RlbSwgZW5naW5lUm9vdEZvbGRlcik7XG5cbiAgICAgICAgY29uc3QgZnVsbEZvbGRlciA9IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUocGlwZWxpbmVTdGVwRm9sZGVyLCBjYXRlZ29yeSk7XG4gICAgICAgIGNvbnN0IGZpbGVzID0gYXdhaXQgZmlsZVN5c3RlbS5kaXJlY3RvcnlHZXRGaWxlcyhmdWxsRm9sZGVyKTtcblxuICAgICAgICByZXR1cm4gZmlsZXMuZmlsdGVyKGZpbGUgPT4gZmlsZS5lbmRzV2l0aChcIi5qc1wiKSkubWFwKGZpbGUgPT4gZmlsZS5yZXBsYWNlKFwiLmpzXCIsIFwiXCIpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIGxvYWRJdGVtKGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCBlbmdpbmVSb290Rm9sZGVyOiBzdHJpbmcsIGNhdGVnb3J5OiBzdHJpbmcsIGl0ZW06IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGNvbnN0IHBpcGVsaW5lU3RlcEZvbGRlciA9IFBpcGVsaW5lTG9jYXRvci5nZXRQaXBlbGluZUZvbGRlcihmaWxlU3lzdGVtLCBlbmdpbmVSb290Rm9sZGVyKTtcbiAgICAgICAgY29uc3QgY2F0ZWdvcnlGb2xkZXIgPSBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKHBpcGVsaW5lU3RlcEZvbGRlciwgY2F0ZWdvcnkpO1xuXG4gICAgICAgIGNvbnN0IGxvYWRGaWxlID0gZmlsZVN5c3RlbS5wYXRoQ29tYmluZShjYXRlZ29yeUZvbGRlciwgYCR7aXRlbX0uanNgKTtcbiAgICAgICAgcmV0dXJuIGltcG9ydChsb2FkRmlsZSk7XG4gICAgfVxufVxuIl19
