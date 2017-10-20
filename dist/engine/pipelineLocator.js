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
            return yield Promise.resolve().then(function () { return require(loadFile); });
        });
    }
}
exports.PipelineLocator = PipelineLocator;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmdpbmUvcGlwZWxpbmVMb2NhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFLQTtJQUNXLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxVQUF1QixFQUFFLGdCQUF3QjtRQUM3RSxNQUFNLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFFTSxNQUFNLENBQU8scUJBQXFCLENBQUMsVUFBdUIsRUFBRSxnQkFBd0I7O1lBQ3ZGLE1BQU0sa0JBQWtCLEdBQUcsZUFBZSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1lBRTNGLE1BQU0sQ0FBQyxVQUFVLENBQUMsbUJBQW1CLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUM5RCxDQUFDO0tBQUE7SUFFTSxNQUFNLENBQU8sd0JBQXdCLENBQUMsVUFBdUIsRUFBRSxnQkFBd0IsRUFBRSxRQUFnQjs7WUFDNUcsTUFBTSxrQkFBa0IsR0FBRyxlQUFlLENBQUMsaUJBQWlCLENBQUMsVUFBVSxFQUFFLGdCQUFnQixDQUFDLENBQUM7WUFFM0YsTUFBTSxVQUFVLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUN4RSxNQUFNLEtBQUssR0FBRyxNQUFNLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUU3RCxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzNGLENBQUM7S0FBQTtJQUVNLE1BQU0sQ0FBTyxRQUFRLENBQUMsVUFBdUIsRUFBRSxnQkFBd0IsRUFBRSxRQUFnQixFQUFFLElBQVk7O1lBQzFHLE1BQU0sa0JBQWtCLEdBQUcsZUFBZSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1lBQzNGLE1BQU0sY0FBYyxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsa0JBQWtCLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFFNUUsTUFBTSxRQUFRLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxjQUFjLEVBQUUsR0FBRyxJQUFJLEtBQUssQ0FBQyxDQUFDO1lBQ3RFLE1BQU0sQ0FBQywwREFBYSxRQUFRLEtBQUMsQ0FBQztRQUNsQyxDQUFDO0tBQUE7Q0FDSjtBQTNCRCwwQ0EyQkMiLCJmaWxlIjoiZW5naW5lL3BpcGVsaW5lTG9jYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgTG9jYXRvclxuICovXG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcblxuZXhwb3J0IGNsYXNzIFBpcGVsaW5lTG9jYXRvciB7XG4gICAgcHVibGljIHN0YXRpYyBnZXRQaXBlbGluZUZvbGRlcihmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgZW5naW5lUm9vdEZvbGRlcjogc3RyaW5nKSA6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVJvb3RGb2xkZXIsIFwiZGlzdC9waXBlbGluZVN0ZXBzXCIpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgYXN5bmMgZ2V0UGlwZWxpbmVDYXRlZ29yaWVzKGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCBlbmdpbmVSb290Rm9sZGVyOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZ1tdPiB7XG4gICAgICAgIGNvbnN0IHBpcGVsaW5lU3RlcEZvbGRlciA9IFBpcGVsaW5lTG9jYXRvci5nZXRQaXBlbGluZUZvbGRlcihmaWxlU3lzdGVtLCBlbmdpbmVSb290Rm9sZGVyKTtcblxuICAgICAgICByZXR1cm4gZmlsZVN5c3RlbS5kaXJlY3RvcnlHZXRGb2xkZXJzKHBpcGVsaW5lU3RlcEZvbGRlcik7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBhc3luYyBnZXRQaXBlbGluZUNhdGVnb3J5SXRlbXMoZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIGVuZ2luZVJvb3RGb2xkZXI6IHN0cmluZywgY2F0ZWdvcnk6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nW10+IHtcbiAgICAgICAgY29uc3QgcGlwZWxpbmVTdGVwRm9sZGVyID0gUGlwZWxpbmVMb2NhdG9yLmdldFBpcGVsaW5lRm9sZGVyKGZpbGVTeXN0ZW0sIGVuZ2luZVJvb3RGb2xkZXIpO1xuXG4gICAgICAgIGNvbnN0IGZ1bGxGb2xkZXIgPSBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKHBpcGVsaW5lU3RlcEZvbGRlciwgY2F0ZWdvcnkpO1xuICAgICAgICBjb25zdCBmaWxlcyA9IGF3YWl0IGZpbGVTeXN0ZW0uZGlyZWN0b3J5R2V0RmlsZXMoZnVsbEZvbGRlcik7XG5cbiAgICAgICAgcmV0dXJuIGZpbGVzLmZpbHRlcihmaWxlID0+IGZpbGUuZW5kc1dpdGgoXCIuanNcIikpLm1hcChmaWxlID0+IGZpbGUucmVwbGFjZShcIi5qc1wiLCBcIlwiKSk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBhc3luYyBsb2FkSXRlbShmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgZW5naW5lUm9vdEZvbGRlcjogc3RyaW5nLCBjYXRlZ29yeTogc3RyaW5nLCBpdGVtOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBjb25zdCBwaXBlbGluZVN0ZXBGb2xkZXIgPSBQaXBlbGluZUxvY2F0b3IuZ2V0UGlwZWxpbmVGb2xkZXIoZmlsZVN5c3RlbSwgZW5naW5lUm9vdEZvbGRlcik7XG4gICAgICAgIGNvbnN0IGNhdGVnb3J5Rm9sZGVyID0gZmlsZVN5c3RlbS5wYXRoQ29tYmluZShwaXBlbGluZVN0ZXBGb2xkZXIsIGNhdGVnb3J5KTtcblxuICAgICAgICBjb25zdCBsb2FkRmlsZSA9IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoY2F0ZWdvcnlGb2xkZXIsIGAke2l0ZW19LmpzYCk7XG4gICAgICAgIHJldHVybiBhd2FpdCBpbXBvcnQobG9hZEZpbGUpO1xuICAgIH1cbn1cbiJdfQ==
