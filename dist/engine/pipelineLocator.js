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
            return files.filter(file => file.endsWith(".js"))
                .map(file => file.replace(".js", ""));
        });
    }
    static loadItem(fileSystem, engineRootFolder, category, item) {
        return __awaiter(this, void 0, void 0, function* () {
            const pipelineStepFolder = PipelineLocator.getPipelineFolder(fileSystem, engineRootFolder);
            const categoryFolder = fileSystem.pathCombine(pipelineStepFolder, category);
            const loadFile = fileSystem.pathCombine(categoryFolder, `${item}.js`);
            return Promise.resolve().then(() => require(loadFile));
        });
    }
}
exports.PipelineLocator = PipelineLocator;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmdpbmUvcGlwZWxpbmVMb2NhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFLQTtJQUNXLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxVQUF1QixFQUFFLGdCQUF3QjtRQUM3RSxPQUFPLFVBQVUsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztJQUMxRSxDQUFDO0lBRU0sTUFBTSxDQUFPLHFCQUFxQixDQUFDLFVBQXVCLEVBQUUsZ0JBQXdCOztZQUN2RixNQUFNLGtCQUFrQixHQUFHLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztZQUUzRixPQUFPLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQzlELENBQUM7S0FBQTtJQUVNLE1BQU0sQ0FBTyx3QkFBd0IsQ0FBQyxVQUF1QixFQUFFLGdCQUF3QixFQUFFLFFBQWdCOztZQUM1RyxNQUFNLGtCQUFrQixHQUFHLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztZQUUzRixNQUFNLFVBQVUsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGtCQUFrQixFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3hFLE1BQU0sS0FBSyxHQUFHLE1BQU0sVUFBVSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBRTdELE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQ3BDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdEQsQ0FBQztLQUFBO0lBRU0sTUFBTSxDQUFPLFFBQVEsQ0FBQyxVQUF1QixFQUFFLGdCQUF3QixFQUFFLFFBQWdCLEVBQUUsSUFBWTs7WUFDMUcsTUFBTSxrQkFBa0IsR0FBRyxlQUFlLENBQUMsaUJBQWlCLENBQUMsVUFBVSxFQUFFLGdCQUFnQixDQUFDLENBQUM7WUFDM0YsTUFBTSxjQUFjLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUU1RSxNQUFNLFFBQVEsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGNBQWMsRUFBRSxHQUFHLElBQUksS0FBSyxDQUFDLENBQUM7WUFDdEUsNENBQWMsUUFBUSxHQUFFO1FBQzVCLENBQUM7S0FBQTtDQUNKO0FBNUJELDBDQTRCQyIsImZpbGUiOiJlbmdpbmUvcGlwZWxpbmVMb2NhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBMb2NhdG9yXG4gKi9cbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuXG5leHBvcnQgY2xhc3MgUGlwZWxpbmVMb2NhdG9yIHtcbiAgICBwdWJsaWMgc3RhdGljIGdldFBpcGVsaW5lRm9sZGVyKGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCBlbmdpbmVSb290Rm9sZGVyOiBzdHJpbmcpIDogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lUm9vdEZvbGRlciwgXCJkaXN0L3BpcGVsaW5lU3RlcHNcIik7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBhc3luYyBnZXRQaXBlbGluZUNhdGVnb3JpZXMoZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIGVuZ2luZVJvb3RGb2xkZXI6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nW10+IHtcbiAgICAgICAgY29uc3QgcGlwZWxpbmVTdGVwRm9sZGVyID0gUGlwZWxpbmVMb2NhdG9yLmdldFBpcGVsaW5lRm9sZGVyKGZpbGVTeXN0ZW0sIGVuZ2luZVJvb3RGb2xkZXIpO1xuXG4gICAgICAgIHJldHVybiBmaWxlU3lzdGVtLmRpcmVjdG9yeUdldEZvbGRlcnMocGlwZWxpbmVTdGVwRm9sZGVyKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIGdldFBpcGVsaW5lQ2F0ZWdvcnlJdGVtcyhmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgZW5naW5lUm9vdEZvbGRlcjogc3RyaW5nLCBjYXRlZ29yeTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmdbXT4ge1xuICAgICAgICBjb25zdCBwaXBlbGluZVN0ZXBGb2xkZXIgPSBQaXBlbGluZUxvY2F0b3IuZ2V0UGlwZWxpbmVGb2xkZXIoZmlsZVN5c3RlbSwgZW5naW5lUm9vdEZvbGRlcik7XG5cbiAgICAgICAgY29uc3QgZnVsbEZvbGRlciA9IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUocGlwZWxpbmVTdGVwRm9sZGVyLCBjYXRlZ29yeSk7XG4gICAgICAgIGNvbnN0IGZpbGVzID0gYXdhaXQgZmlsZVN5c3RlbS5kaXJlY3RvcnlHZXRGaWxlcyhmdWxsRm9sZGVyKTtcblxuICAgICAgICByZXR1cm4gZmlsZXMuZmlsdGVyKGZpbGUgPT4gZmlsZS5lbmRzV2l0aChcIi5qc1wiKSlcbiAgICAgICAgICAgICAgICAgICAgLm1hcChmaWxlID0+IGZpbGUucmVwbGFjZShcIi5qc1wiLCBcIlwiKSk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBhc3luYyBsb2FkSXRlbShmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgZW5naW5lUm9vdEZvbGRlcjogc3RyaW5nLCBjYXRlZ29yeTogc3RyaW5nLCBpdGVtOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBjb25zdCBwaXBlbGluZVN0ZXBGb2xkZXIgPSBQaXBlbGluZUxvY2F0b3IuZ2V0UGlwZWxpbmVGb2xkZXIoZmlsZVN5c3RlbSwgZW5naW5lUm9vdEZvbGRlcik7XG4gICAgICAgIGNvbnN0IGNhdGVnb3J5Rm9sZGVyID0gZmlsZVN5c3RlbS5wYXRoQ29tYmluZShwaXBlbGluZVN0ZXBGb2xkZXIsIGNhdGVnb3J5KTtcblxuICAgICAgICBjb25zdCBsb2FkRmlsZSA9IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoY2F0ZWdvcnlGb2xkZXIsIGAke2l0ZW19LmpzYCk7XG4gICAgICAgIHJldHVybiBpbXBvcnQobG9hZEZpbGUpO1xuICAgIH1cbn1cbiJdfQ==
