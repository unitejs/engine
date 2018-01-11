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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmdpbmUvcGlwZWxpbmVMb2NhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFLQTtJQUNXLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxVQUF1QixFQUFFLGdCQUF3QjtRQUM3RSxNQUFNLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFFTSxNQUFNLENBQU8scUJBQXFCLENBQUMsVUFBdUIsRUFBRSxnQkFBd0I7O1lBQ3ZGLE1BQU0sa0JBQWtCLEdBQUcsZUFBZSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1lBRTNGLE1BQU0sQ0FBQyxVQUFVLENBQUMsbUJBQW1CLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUM5RCxDQUFDO0tBQUE7SUFFTSxNQUFNLENBQU8sd0JBQXdCLENBQUMsVUFBdUIsRUFBRSxnQkFBd0IsRUFBRSxRQUFnQjs7WUFDNUcsTUFBTSxrQkFBa0IsR0FBRyxlQUFlLENBQUMsaUJBQWlCLENBQUMsVUFBVSxFQUFFLGdCQUFnQixDQUFDLENBQUM7WUFFM0YsTUFBTSxVQUFVLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUN4RSxNQUFNLEtBQUssR0FBRyxNQUFNLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUU3RCxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQ3BDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdEQsQ0FBQztLQUFBO0lBRU0sTUFBTSxDQUFPLFFBQVEsQ0FBQyxVQUF1QixFQUFFLGdCQUF3QixFQUFFLFFBQWdCLEVBQUUsSUFBWTs7WUFDMUcsTUFBTSxrQkFBa0IsR0FBRyxlQUFlLENBQUMsaUJBQWlCLENBQUMsVUFBVSxFQUFFLGdCQUFnQixDQUFDLENBQUM7WUFDM0YsTUFBTSxjQUFjLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUU1RSxNQUFNLFFBQVEsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGNBQWMsRUFBRSxHQUFHLElBQUksS0FBSyxDQUFDLENBQUM7WUFDdEUsTUFBTSxzQ0FBUSxRQUFRLEdBQUU7UUFDNUIsQ0FBQztLQUFBO0NBQ0o7QUE1QkQsMENBNEJDIiwiZmlsZSI6ImVuZ2luZS9waXBlbGluZUxvY2F0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFBpcGVsaW5lIExvY2F0b3JcbiAqL1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5cbmV4cG9ydCBjbGFzcyBQaXBlbGluZUxvY2F0b3Ige1xuICAgIHB1YmxpYyBzdGF0aWMgZ2V0UGlwZWxpbmVGb2xkZXIoZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIGVuZ2luZVJvb3RGb2xkZXI6IHN0cmluZykgOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVSb290Rm9sZGVyLCBcImRpc3QvcGlwZWxpbmVTdGVwc1wiKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIGdldFBpcGVsaW5lQ2F0ZWdvcmllcyhmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgZW5naW5lUm9vdEZvbGRlcjogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmdbXT4ge1xuICAgICAgICBjb25zdCBwaXBlbGluZVN0ZXBGb2xkZXIgPSBQaXBlbGluZUxvY2F0b3IuZ2V0UGlwZWxpbmVGb2xkZXIoZmlsZVN5c3RlbSwgZW5naW5lUm9vdEZvbGRlcik7XG5cbiAgICAgICAgcmV0dXJuIGZpbGVTeXN0ZW0uZGlyZWN0b3J5R2V0Rm9sZGVycyhwaXBlbGluZVN0ZXBGb2xkZXIpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgYXN5bmMgZ2V0UGlwZWxpbmVDYXRlZ29yeUl0ZW1zKGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCBlbmdpbmVSb290Rm9sZGVyOiBzdHJpbmcsIGNhdGVnb3J5OiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZ1tdPiB7XG4gICAgICAgIGNvbnN0IHBpcGVsaW5lU3RlcEZvbGRlciA9IFBpcGVsaW5lTG9jYXRvci5nZXRQaXBlbGluZUZvbGRlcihmaWxlU3lzdGVtLCBlbmdpbmVSb290Rm9sZGVyKTtcblxuICAgICAgICBjb25zdCBmdWxsRm9sZGVyID0gZmlsZVN5c3RlbS5wYXRoQ29tYmluZShwaXBlbGluZVN0ZXBGb2xkZXIsIGNhdGVnb3J5KTtcbiAgICAgICAgY29uc3QgZmlsZXMgPSBhd2FpdCBmaWxlU3lzdGVtLmRpcmVjdG9yeUdldEZpbGVzKGZ1bGxGb2xkZXIpO1xuXG4gICAgICAgIHJldHVybiBmaWxlcy5maWx0ZXIoZmlsZSA9PiBmaWxlLmVuZHNXaXRoKFwiLmpzXCIpKVxuICAgICAgICAgICAgICAgICAgICAubWFwKGZpbGUgPT4gZmlsZS5yZXBsYWNlKFwiLmpzXCIsIFwiXCIpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIGxvYWRJdGVtKGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCBlbmdpbmVSb290Rm9sZGVyOiBzdHJpbmcsIGNhdGVnb3J5OiBzdHJpbmcsIGl0ZW06IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGNvbnN0IHBpcGVsaW5lU3RlcEZvbGRlciA9IFBpcGVsaW5lTG9jYXRvci5nZXRQaXBlbGluZUZvbGRlcihmaWxlU3lzdGVtLCBlbmdpbmVSb290Rm9sZGVyKTtcbiAgICAgICAgY29uc3QgY2F0ZWdvcnlGb2xkZXIgPSBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKHBpcGVsaW5lU3RlcEZvbGRlciwgY2F0ZWdvcnkpO1xuXG4gICAgICAgIGNvbnN0IGxvYWRGaWxlID0gZmlsZVN5c3RlbS5wYXRoQ29tYmluZShjYXRlZ29yeUZvbGRlciwgYCR7aXRlbX0uanNgKTtcbiAgICAgICAgcmV0dXJuIGltcG9ydChsb2FkRmlsZSk7XG4gICAgfVxufVxuIl19
