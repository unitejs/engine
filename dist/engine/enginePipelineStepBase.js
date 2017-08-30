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
class EnginePipelineStepBase {
    initialise(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            return 0;
        });
    }
    copyFile(logger, fileSystem, sourceFolder, sourceFilename, destFolder, destFilename, force) {
        return __awaiter(this, void 0, void 0, function* () {
            const sourceFileExists = yield fileSystem.fileExists(sourceFolder, sourceFilename);
            if (sourceFileExists) {
                const hasGeneratedMarker = yield this.fileHasGeneratedMarker(fileSystem, destFolder, destFilename);
                if (hasGeneratedMarker === "FileNotExist" || hasGeneratedMarker === "HasMarker" || force) {
                    logger.info(`Copying ${sourceFilename}`, { from: sourceFolder, to: destFolder });
                    try {
                        // We recombine this as sometimes the filename contains more folders
                        const folderWithFile = fileSystem.pathCombine(destFolder, destFilename);
                        const folderOnly = fileSystem.pathGetDirectory(folderWithFile);
                        const dirExists = yield fileSystem.directoryExists(folderOnly);
                        if (!dirExists) {
                            yield fileSystem.directoryCreate(folderOnly);
                        }
                        const buffer = yield fileSystem.fileReadBinary(sourceFolder, sourceFilename);
                        yield fileSystem.fileWriteBinary(destFolder, destFilename, buffer);
                    }
                    catch (err) {
                        logger.error(`Copying ${sourceFilename} failed`, err, { from: sourceFolder, to: destFolder });
                        return 1;
                    }
                }
                else {
                    logger.info(`Skipping ${sourceFilename} as it has no generated marker`, { from: sourceFolder, to: destFolder });
                }
                return 0;
            }
            else {
                logger.error(`${sourceFilename} does not exist`, { folder: sourceFolder, file: sourceFilename });
                return 1;
            }
        });
    }
    deleteFile(logger, fileSystem, folder, filename, force) {
        return __awaiter(this, void 0, void 0, function* () {
            const hasGeneratedMarker = yield this.fileHasGeneratedMarker(fileSystem, folder, filename);
            if (hasGeneratedMarker === "HasMarker" || (hasGeneratedMarker !== "FileNotExist" && force)) {
                try {
                    logger.info(`Deleting ${filename}`, { from: folder });
                    yield fileSystem.fileDelete(folder, filename);
                    return 0;
                }
                catch (err) {
                    logger.error(`Deleting ${filename} failed`, err);
                    return 1;
                }
            }
            else if (hasGeneratedMarker === "NoMarker") {
                logger.info(`Skipping Delete of ${filename} as it has no generated marker`, { from: folder });
                return 0;
            }
            else {
                return 0;
            }
        });
    }
    wrapGeneratedMarker(before, after) {
        return before + EnginePipelineStepBase.MARKER + after;
    }
    fileHasGeneratedMarker(fileSystem, folder, filename) {
        return __awaiter(this, void 0, void 0, function* () {
            let markerState = "FileNotExist";
            try {
                const exists = yield fileSystem.fileExists(folder, filename);
                if (exists) {
                    const existingLines = yield fileSystem.fileReadLines(folder, filename);
                    // Test the last few lines in case there are line breaks
                    let hasMarker = false;
                    for (let i = existingLines.length - 1; i >= 0 && i >= existingLines.length - 5 && !hasMarker; i--) {
                        hasMarker = existingLines[i].indexOf(EnginePipelineStepBase.MARKER) >= 0;
                    }
                    markerState = hasMarker ? "HasMarker" : "NoMarker";
                }
                return markerState;
            }
            catch (err) {
                return markerState;
            }
        });
    }
    condition(uniteConfigurationKey, value) {
        return uniteConfigurationKey !== undefined &&
            uniteConfigurationKey !== null &&
            value !== undefined &&
            value !== null &&
            uniteConfigurationKey.toLowerCase() === value.toLowerCase();
    }
    objectCondition(uniteConfigurationObject, value) {
        return uniteConfigurationObject !== undefined &&
            uniteConfigurationObject !== null &&
            value !== undefined &&
            value !== null &&
            Object.keys(uniteConfigurationObject).map(key => key.toLowerCase()).indexOf(value.toLowerCase()) >= 0;
    }
}
EnginePipelineStepBase.MARKER = "Generated by UniteJS";
exports.EnginePipelineStepBase = EnginePipelineStepBase;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmdpbmUvZW5naW5lUGlwZWxpbmVTdGVwQmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBVUE7SUFHaUIsVUFBVSxDQUFDLE1BQWUsRUFDZixVQUF1QixFQUN2QixrQkFBc0MsRUFDdEMsZUFBZ0M7O1lBQ3BELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7SUFPWSxRQUFRLENBQUMsTUFBZSxFQUNmLFVBQXVCLEVBQ3ZCLFlBQW9CLEVBQ3BCLGNBQXNCLEVBQ3RCLFVBQWtCLEVBQ2xCLFlBQW9CLEVBQ3BCLEtBQWM7O1lBQ2hDLE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxVQUFVLENBQUMsVUFBVSxDQUFDLFlBQVksRUFBRSxjQUFjLENBQUMsQ0FBQztZQUVuRixFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLE1BQU0sa0JBQWtCLEdBQUcsTUFBTSxJQUFJLENBQUMsc0JBQXNCLENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxZQUFZLENBQUMsQ0FBQztnQkFFbkcsRUFBRSxDQUFDLENBQUMsa0JBQWtCLEtBQUssY0FBYyxJQUFJLGtCQUFrQixLQUFLLFdBQVcsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUN2RixNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsY0FBYyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDO29CQUVqRixJQUFJLENBQUM7d0JBQ0Qsb0VBQW9FO3dCQUNwRSxNQUFNLGNBQWMsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUMsQ0FBQzt3QkFDeEUsTUFBTSxVQUFVLEdBQUcsVUFBVSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxDQUFDO3dCQUMvRCxNQUFNLFNBQVMsR0FBRyxNQUFNLFVBQVUsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFD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V0FBVyxFQUFFLENBQUM7SUFDcEUsQ0FBQztJQUVNLGVBQWUsQ0FBQyx3QkFBNkIsRUFBRSxLQUFhO1FBQy9ELE1BQU0sQ0FBQyx3QkFBd0IsS0FBSyxTQUFTO1lBQ3pDLHdCQUF3QixLQUFLLElBQUk7WUFDakMsS0FBSyxLQUFLLFNBQVM7WUFDbkIsS0FBSyxLQUFLLElBQUk7WUFDZCxNQUFNLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlHLENBQUM7O0FBcEhhLDZCQUFNLEdBQVcsc0JBQXNCLENBQUM7QUFEMUQsd0RBc0hDIiwiZmlsZSI6ImVuZ2luZS9lbmdpbmVQaXBlbGluZVN0ZXBCYXNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBCYXNlIGltcGxlbWVudGF0aW9uIG9mIGVuZ2luZSBwaXBlbGluZSBzdGVwLlxuICovXG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IElFbmdpbmVQaXBlbGluZVN0ZXAgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9JRW5naW5lUGlwZWxpbmVTdGVwXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi9lbmdpbmVWYXJpYWJsZXNcIjtcbmltcG9ydCB7IE1hcmtlclN0YXRlIH0gZnJvbSBcIi4vbWFya2VyU3RhdGVcIjtcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEVuZ2luZVBpcGVsaW5lU3RlcEJhc2UgaW1wbGVtZW50cyBJRW5naW5lUGlwZWxpbmVTdGVwIHtcbiAgICBwdWJsaWMgc3RhdGljIE1BUktFUjogc3RyaW5nID0gXCJHZW5lcmF0ZWQgYnkgVW5pdGVKU1wiO1xuXG4gICAgcHVibGljIGFzeW5jIGluaXRpYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFic3RyYWN0IGFzeW5jIHByb2Nlc3MobG9nZ2VyOiBJTG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogUHJvbWlzZTxudW1iZXI+O1xuXG4gICAgcHVibGljIGFzeW5jIGNvcHlGaWxlKGxvZ2dlcjogSUxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZUZvbGRlcjogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VGaWxlbmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBkZXN0Rm9sZGVyOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRlc3RGaWxlbmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JjZTogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGNvbnN0IHNvdXJjZUZpbGVFeGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtLmZpbGVFeGlzdHMoc291cmNlRm9sZGVyLCBzb3VyY2VGaWxlbmFtZSk7XG5cbiAgICAgICAgaWYgKHNvdXJjZUZpbGVFeGlzdHMpIHtcbiAgICAgICAgICAgIGNvbnN0IGhhc0dlbmVyYXRlZE1hcmtlciA9IGF3YWl0IHRoaXMuZmlsZUhhc0dlbmVyYXRlZE1hcmtlcihmaWxlU3lzdGVtLCBkZXN0Rm9sZGVyLCBkZXN0RmlsZW5hbWUpO1xuXG4gICAgICAgICAgICBpZiAoaGFzR2VuZXJhdGVkTWFya2VyID09PSBcIkZpbGVOb3RFeGlzdFwiIHx8IGhhc0dlbmVyYXRlZE1hcmtlciA9PT0gXCJIYXNNYXJrZXJcIiB8fCBmb3JjZSkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBDb3B5aW5nICR7c291cmNlRmlsZW5hbWV9YCwgeyBmcm9tOiBzb3VyY2VGb2xkZXIsIHRvOiBkZXN0Rm9sZGVyIH0pO1xuXG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2UgcmVjb21iaW5lIHRoaXMgYXMgc29tZXRpbWVzIHRoZSBmaWxlbmFtZSBjb250YWlucyBtb3JlIGZvbGRlcnNcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZm9sZGVyV2l0aEZpbGUgPSBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGRlc3RGb2xkZXIsIGRlc3RGaWxlbmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZvbGRlck9ubHkgPSBmaWxlU3lzdGVtLnBhdGhHZXREaXJlY3RvcnkoZm9sZGVyV2l0aEZpbGUpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkaXJFeGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtLmRpcmVjdG9yeUV4aXN0cyhmb2xkZXJPbmx5KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFkaXJFeGlzdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IGZpbGVTeXN0ZW0uZGlyZWN0b3J5Q3JlYXRlKGZvbGRlck9ubHkpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYnVmZmVyID0gYXdhaXQgZmlsZVN5c3RlbS5maWxlUmVhZEJpbmFyeShzb3VyY2VGb2xkZXIsIHNvdXJjZUZpbGVuYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgZmlsZVN5c3RlbS5maWxlV3JpdGVCaW5hcnkoZGVzdEZvbGRlciwgZGVzdEZpbGVuYW1lLCBidWZmZXIpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoYENvcHlpbmcgJHtzb3VyY2VGaWxlbmFtZX0gZmFpbGVkYCwgZXJyLCB7IGZyb206IHNvdXJjZUZvbGRlciwgdG86IGRlc3RGb2xkZXIgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYFNraXBwaW5nICR7c291cmNlRmlsZW5hbWV9IGFzIGl0IGhhcyBubyBnZW5lcmF0ZWQgbWFya2VyYCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGZyb206IHNvdXJjZUZvbGRlciwgdG86IGRlc3RGb2xkZXIgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgJHtzb3VyY2VGaWxlbmFtZX0gZG9lcyBub3QgZXhpc3RgLFxuICAgICAgICAgICAgICAgICAgICAgICAgIHsgZm9sZGVyOiBzb3VyY2VGb2xkZXIsIGZpbGU6IHNvdXJjZUZpbGVuYW1lIH0pO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZGVsZXRlRmlsZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbGRlcjogc3RyaW5nLCBmaWxlbmFtZTogc3RyaW5nLCBmb3JjZTogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGNvbnN0IGhhc0dlbmVyYXRlZE1hcmtlciA9IGF3YWl0IHRoaXMuZmlsZUhhc0dlbmVyYXRlZE1hcmtlcihmaWxlU3lzdGVtLCBmb2xkZXIsIGZpbGVuYW1lKTtcblxuICAgICAgICBpZiAoaGFzR2VuZXJhdGVkTWFya2VyID09PSBcIkhhc01hcmtlclwiIHx8IChoYXNHZW5lcmF0ZWRNYXJrZXIgIT09IFwiRmlsZU5vdEV4aXN0XCIgJiYgZm9yY2UpKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBEZWxldGluZyAke2ZpbGVuYW1lfWAsIHsgZnJvbTogZm9sZGVyIH0pO1xuICAgICAgICAgICAgICAgIGF3YWl0IGZpbGVTeXN0ZW0uZmlsZURlbGV0ZShmb2xkZXIsIGZpbGVuYW1lKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgRGVsZXRpbmcgJHtmaWxlbmFtZX0gZmFpbGVkYCwgZXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChoYXNHZW5lcmF0ZWRNYXJrZXIgPT09IFwiTm9NYXJrZXJcIikge1xuICAgICAgICAgICAgbG9nZ2VyLmluZm8oYFNraXBwaW5nIERlbGV0ZSBvZiAke2ZpbGVuYW1lfSBhcyBpdCBoYXMgbm8gZ2VuZXJhdGVkIG1hcmtlcmAsIHsgZnJvbTogZm9sZGVyIH0pO1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyB3cmFwR2VuZXJhdGVkTWFya2VyKGJlZm9yZTogc3RyaW5nLCBhZnRlcjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGJlZm9yZSArIEVuZ2luZVBpcGVsaW5lU3RlcEJhc2UuTUFSS0VSICsgYWZ0ZXI7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbGVIYXNHZW5lcmF0ZWRNYXJrZXIoZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIGZvbGRlcjogc3RyaW5nLCBmaWxlbmFtZTogc3RyaW5nKTogUHJvbWlzZTxNYXJrZXJTdGF0ZT4ge1xuICAgICAgICBsZXQgbWFya2VyU3RhdGU6IE1hcmtlclN0YXRlID0gXCJGaWxlTm90RXhpc3RcIjtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgZXhpc3RzID0gYXdhaXQgZmlsZVN5c3RlbS5maWxlRXhpc3RzKGZvbGRlciwgZmlsZW5hbWUpO1xuICAgICAgICAgICAgaWYgKGV4aXN0cykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nTGluZXMgPSBhd2FpdCBmaWxlU3lzdGVtLmZpbGVSZWFkTGluZXMoZm9sZGVyLCBmaWxlbmFtZSk7XG4gICAgICAgICAgICAgICAgLy8gVGVzdCB0aGUgbGFzdCBmZXcgbGluZXMgaW4gY2FzZSB0aGVyZSBhcmUgbGluZSBicmVha3NcbiAgICAgICAgICAgICAgICBsZXQgaGFzTWFya2VyID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IGV4aXN0aW5nTGluZXMubGVuZ3RoIC0gMTsgaSA+PSAwICYmIGkgPj0gZXhpc3RpbmdMaW5lcy5sZW5ndGggLSA1ICYmICFoYXNNYXJrZXI7IGktLSkge1xuICAgICAgICAgICAgICAgICAgICBoYXNNYXJrZXIgPSBleGlzdGluZ0xpbmVzW2ldLmluZGV4T2YoRW5naW5lUGlwZWxpbmVTdGVwQmFzZS5NQVJLRVIpID49IDA7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbWFya2VyU3RhdGUgPSBoYXNNYXJrZXIgPyBcIkhhc01hcmtlclwiIDogXCJOb01hcmtlclwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG1hcmtlclN0YXRlO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBtYXJrZXJTdGF0ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBjb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uS2V5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHVuaXRlQ29uZmlndXJhdGlvbktleSAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb25LZXkgIT09IG51bGwgJiZcbiAgICAgICAgICAgIHZhbHVlICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICAgIHZhbHVlICE9PSBudWxsICYmXG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb25LZXkudG9Mb3dlckNhc2UoKSA9PT0gdmFsdWUudG9Mb3dlckNhc2UoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgb2JqZWN0Q29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbk9iamVjdDogYW55LCB2YWx1ZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB1bml0ZUNvbmZpZ3VyYXRpb25PYmplY3QgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uT2JqZWN0ICE9PSBudWxsICYmXG4gICAgICAgICAgICB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICB2YWx1ZSAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgT2JqZWN0LmtleXModW5pdGVDb25maWd1cmF0aW9uT2JqZWN0KS5tYXAoa2V5ID0+IGtleS50b0xvd2VyQ2FzZSgpKS5pbmRleE9mKHZhbHVlLnRvTG93ZXJDYXNlKCkpID49IDA7XG4gICAgfVxufVxuIl19
