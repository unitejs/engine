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
class PipelineStepBase {
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
        return before + PipelineStepBase.MARKER + after;
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
                        hasMarker = existingLines[i].indexOf(PipelineStepBase.MARKER) >= 0;
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
PipelineStepBase.MARKER = "Generated by UniteJS";
exports.PipelineStepBase = PipelineStepBase;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmdpbmUvcGlwZWxpbmVTdGVwQmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBV0E7SUFHaUIsVUFBVSxDQUFDLE1BQWUsRUFDZixVQUF1QixFQUN2QixrQkFBc0MsRUFDdEMsZUFBZ0M7O1lBQ3BELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7SUFTWSxRQUFRLENBQUMsTUFBZSxFQUNmLFVBQXVCLEVBQ3ZCLFlBQW9CLEVBQ3BCLGNBQXNCLEVBQ3RCLFVBQWtCLEVBQ2xCLFlBQW9CLEVBQ3BCLEtBQWM7O1lBQ2hDLE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxVQUFVLENBQUMsVUFBVSxDQUFDLFlBQVksRUFBRSxjQUFjLENBQUMsQ0FBQztZQUVuRixFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLE1BQU0sa0JBQWtCLEdBQUcsTUFBTSxJQUFJLENBQUMsc0JBQXNCLENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxZQUFZLENBQUMsQ0FBQztnQkFFbkcsRUFBRSxDQUFDLENBQUMsa0JBQWtCLEtBQUssY0FBYyxJQUFJLGtCQUFrQixLQUFLLFdBQVcsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUN2RixNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsY0FBYyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDO29CQUVqRixJQUFJLENBQUM7d0JBQ0Qsb0VBQW9FO3dCQUNwRSxNQUFNLGNBQWMsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUMsQ0FBQzt3QkFDeEUsTUFBTSxVQUFVLEdBQUcsVUFBVSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxDQUFDO3dCQUMvRCxNQUFNLFNBQVMsR0FBRyxNQUFNLFVBQVUsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7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QUFFLENBQUM7SUFDcEUsQ0FBQztJQUVNLGVBQWUsQ0FBQyx3QkFBNkIsRUFBRSxLQUFhO1FBQy9ELE1BQU0sQ0FBQyx3QkFBd0IsS0FBSyxTQUFTO1lBQ3pDLHdCQUF3QixLQUFLLElBQUk7WUFDakMsS0FBSyxLQUFLLFNBQVM7WUFDbkIsS0FBSyxLQUFLLElBQUk7WUFDZCxNQUFNLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlHLENBQUM7O0FBdEhhLHVCQUFNLEdBQVcsc0JBQXNCLENBQUM7QUFEMUQsNENBd0hDIiwiZmlsZSI6ImVuZ2luZS9waXBlbGluZVN0ZXBCYXNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBCYXNlIGltcGxlbWVudGF0aW9uIG9mIGVuZ2luZSBwaXBlbGluZSBzdGVwLlxuICovXG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IElQaXBlbGluZVN0ZXAgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9JUGlwZWxpbmVTdGVwXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi9lbmdpbmVWYXJpYWJsZXNcIjtcbmltcG9ydCB7IE1hcmtlclN0YXRlIH0gZnJvbSBcIi4vbWFya2VyU3RhdGVcIjtcbmltcG9ydCB7IFBpcGVsaW5lS2V5IH0gZnJvbSBcIi4vcGlwZWxpbmVLZXlcIjtcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFBpcGVsaW5lU3RlcEJhc2UgaW1wbGVtZW50cyBJUGlwZWxpbmVTdGVwIHtcbiAgICBwdWJsaWMgc3RhdGljIE1BUktFUjogc3RyaW5nID0gXCJHZW5lcmF0ZWQgYnkgVW5pdGVKU1wiO1xuXG4gICAgcHVibGljIGFzeW5jIGluaXRpYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFic3RyYWN0IGluZmx1ZW5jZXMoKTogUGlwZWxpbmVLZXlbXTtcblxuICAgIHB1YmxpYyBhYnN0cmFjdCBhc3luYyBwcm9jZXNzKGxvZ2dlcjogSUxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IFByb21pc2U8bnVtYmVyPjtcblxuICAgIHB1YmxpYyBhc3luYyBjb3B5RmlsZShsb2dnZXI6IElMb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VGb2xkZXI6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlRmlsZW5hbWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzdEZvbGRlcjogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBkZXN0RmlsZW5hbWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yY2U6IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBjb25zdCBzb3VyY2VGaWxlRXhpc3RzID0gYXdhaXQgZmlsZVN5c3RlbS5maWxlRXhpc3RzKHNvdXJjZUZvbGRlciwgc291cmNlRmlsZW5hbWUpO1xuXG4gICAgICAgIGlmIChzb3VyY2VGaWxlRXhpc3RzKSB7XG4gICAgICAgICAgICBjb25zdCBoYXNHZW5lcmF0ZWRNYXJrZXIgPSBhd2FpdCB0aGlzLmZpbGVIYXNHZW5lcmF0ZWRNYXJrZXIoZmlsZVN5c3RlbSwgZGVzdEZvbGRlciwgZGVzdEZpbGVuYW1lKTtcblxuICAgICAgICAgICAgaWYgKGhhc0dlbmVyYXRlZE1hcmtlciA9PT0gXCJGaWxlTm90RXhpc3RcIiB8fCBoYXNHZW5lcmF0ZWRNYXJrZXIgPT09IFwiSGFzTWFya2VyXCIgfHwgZm9yY2UpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgQ29weWluZyAke3NvdXJjZUZpbGVuYW1lfWAsIHsgZnJvbTogc291cmNlRm9sZGVyLCB0bzogZGVzdEZvbGRlciB9KTtcblxuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFdlIHJlY29tYmluZSB0aGlzIGFzIHNvbWV0aW1lcyB0aGUgZmlsZW5hbWUgY29udGFpbnMgbW9yZSBmb2xkZXJzXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZvbGRlcldpdGhGaWxlID0gZmlsZVN5c3RlbS5wYXRoQ29tYmluZShkZXN0Rm9sZGVyLCBkZXN0RmlsZW5hbWUpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmb2xkZXJPbmx5ID0gZmlsZVN5c3RlbS5wYXRoR2V0RGlyZWN0b3J5KGZvbGRlcldpdGhGaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGlyRXhpc3RzID0gYXdhaXQgZmlsZVN5c3RlbS5kaXJlY3RvcnlFeGlzdHMoZm9sZGVyT25seSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZGlyRXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBmaWxlU3lzdGVtLmRpcmVjdG9yeUNyZWF0ZShmb2xkZXJPbmx5KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJ1ZmZlciA9IGF3YWl0IGZpbGVTeXN0ZW0uZmlsZVJlYWRCaW5hcnkoc291cmNlRm9sZGVyLCBzb3VyY2VGaWxlbmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGZpbGVTeXN0ZW0uZmlsZVdyaXRlQmluYXJ5KGRlc3RGb2xkZXIsIGRlc3RGaWxlbmFtZSwgYnVmZmVyKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBDb3B5aW5nICR7c291cmNlRmlsZW5hbWV9IGZhaWxlZGAsIGVyciwgeyBmcm9tOiBzb3VyY2VGb2xkZXIsIHRvOiBkZXN0Rm9sZGVyIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBTa2lwcGluZyAke3NvdXJjZUZpbGVuYW1lfSBhcyBpdCBoYXMgbm8gZ2VuZXJhdGVkIG1hcmtlcmAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBmcm9tOiBzb3VyY2VGb2xkZXIsIHRvOiBkZXN0Rm9sZGVyIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsb2dnZXIuZXJyb3IoYCR7c291cmNlRmlsZW5hbWV9IGRvZXMgbm90IGV4aXN0YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICB7IGZvbGRlcjogc291cmNlRm9sZGVyLCBmaWxlOiBzb3VyY2VGaWxlbmFtZSB9KTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGRlbGV0ZUZpbGUobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb2xkZXI6IHN0cmluZywgZmlsZW5hbWU6IHN0cmluZywgZm9yY2U6IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBjb25zdCBoYXNHZW5lcmF0ZWRNYXJrZXIgPSBhd2FpdCB0aGlzLmZpbGVIYXNHZW5lcmF0ZWRNYXJrZXIoZmlsZVN5c3RlbSwgZm9sZGVyLCBmaWxlbmFtZSk7XG5cbiAgICAgICAgaWYgKGhhc0dlbmVyYXRlZE1hcmtlciA9PT0gXCJIYXNNYXJrZXJcIiB8fCAoaGFzR2VuZXJhdGVkTWFya2VyICE9PSBcIkZpbGVOb3RFeGlzdFwiICYmIGZvcmNlKSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgRGVsZXRpbmcgJHtmaWxlbmFtZX1gLCB7IGZyb206IGZvbGRlciB9KTtcbiAgICAgICAgICAgICAgICBhd2FpdCBmaWxlU3lzdGVtLmZpbGVEZWxldGUoZm9sZGVyLCBmaWxlbmFtZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoYERlbGV0aW5nICR7ZmlsZW5hbWV9IGZhaWxlZGAsIGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoaGFzR2VuZXJhdGVkTWFya2VyID09PSBcIk5vTWFya2VyXCIpIHtcbiAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBTa2lwcGluZyBEZWxldGUgb2YgJHtmaWxlbmFtZX0gYXMgaXQgaGFzIG5vIGdlbmVyYXRlZCBtYXJrZXJgLCB7IGZyb206IGZvbGRlciB9KTtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgd3JhcEdlbmVyYXRlZE1hcmtlcihiZWZvcmU6IHN0cmluZywgYWZ0ZXI6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBiZWZvcmUgKyBQaXBlbGluZVN0ZXBCYXNlLk1BUktFUiArIGFmdGVyO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaWxlSGFzR2VuZXJhdGVkTWFya2VyKGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCBmb2xkZXI6IHN0cmluZywgZmlsZW5hbWU6IHN0cmluZyk6IFByb21pc2U8TWFya2VyU3RhdGU+IHtcbiAgICAgICAgbGV0IG1hcmtlclN0YXRlOiBNYXJrZXJTdGF0ZSA9IFwiRmlsZU5vdEV4aXN0XCI7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IGZpbGVTeXN0ZW0uZmlsZUV4aXN0cyhmb2xkZXIsIGZpbGVuYW1lKTtcbiAgICAgICAgICAgIGlmIChleGlzdHMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBleGlzdGluZ0xpbmVzID0gYXdhaXQgZmlsZVN5c3RlbS5maWxlUmVhZExpbmVzKGZvbGRlciwgZmlsZW5hbWUpO1xuICAgICAgICAgICAgICAgIC8vIFRlc3QgdGhlIGxhc3QgZmV3IGxpbmVzIGluIGNhc2UgdGhlcmUgYXJlIGxpbmUgYnJlYWtzXG4gICAgICAgICAgICAgICAgbGV0IGhhc01hcmtlciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSBleGlzdGluZ0xpbmVzLmxlbmd0aCAtIDE7IGkgPj0gMCAmJiBpID49IGV4aXN0aW5nTGluZXMubGVuZ3RoIC0gNSAmJiAhaGFzTWFya2VyOyBpLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgaGFzTWFya2VyID0gZXhpc3RpbmdMaW5lc1tpXS5pbmRleE9mKFBpcGVsaW5lU3RlcEJhc2UuTUFSS0VSKSA+PSAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIG1hcmtlclN0YXRlID0gaGFzTWFya2VyID8gXCJIYXNNYXJrZXJcIiA6IFwiTm9NYXJrZXJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBtYXJrZXJTdGF0ZTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gbWFya2VyU3RhdGU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbktleTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB1bml0ZUNvbmZpZ3VyYXRpb25LZXkgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uS2V5ICE9PSBudWxsICYmXG4gICAgICAgICAgICB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICB2YWx1ZSAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uS2V5LnRvTG93ZXJDYXNlKCkgPT09IHZhbHVlLnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuXG4gICAgcHVibGljIG9iamVjdENvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb25PYmplY3Q6IGFueSwgdmFsdWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdW5pdGVDb25maWd1cmF0aW9uT2JqZWN0ICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbk9iamVjdCAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgdmFsdWUgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgdmFsdWUgIT09IG51bGwgJiZcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHVuaXRlQ29uZmlndXJhdGlvbk9iamVjdCkubWFwKGtleSA9PiBrZXkudG9Mb3dlckNhc2UoKSkuaW5kZXhPZih2YWx1ZS50b0xvd2VyQ2FzZSgpKSA+PSAwO1xuICAgIH1cbn1cbiJdfQ==
