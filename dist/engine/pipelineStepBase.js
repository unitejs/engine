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
    mainCondition(uniteConfiguration, engineVariables) {
        return undefined;
    }
    initialise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        return __awaiter(this, void 0, void 0, function* () {
            return 0;
        });
    }
    configure(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        return __awaiter(this, void 0, void 0, function* () {
            return 0;
        });
    }
    finalise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        return __awaiter(this, void 0, void 0, function* () {
            return 0;
        });
    }
    copyFile(logger, fileSystem, sourceFolder, sourceFilename, destFolder, destFilename, force, noCreate, replacements) {
        return __awaiter(this, void 0, void 0, function* () {
            const sourceFileExists = yield fileSystem.fileExists(sourceFolder, sourceFilename);
            if (sourceFileExists) {
                const hasGeneratedMarker = yield this.fileHasGeneratedMarker(fileSystem, destFolder, destFilename);
                if (hasGeneratedMarker === "FileNotExist" && noCreate) {
                    logger.info(`Skipping ${sourceFilename} as the no create flag is set`, { from: sourceFolder, to: destFolder });
                }
                else if (hasGeneratedMarker === "FileNotExist" || hasGeneratedMarker === "HasMarker" || force) {
                    logger.info(`Copying ${sourceFilename}`, { from: sourceFolder, to: destFolder });
                    try {
                        // We recombine this as sometimes the filename contains more folders
                        const folderWithFile = fileSystem.pathCombine(destFolder, destFilename);
                        const folderOnly = fileSystem.pathGetDirectory(folderWithFile);
                        const dirExists = yield fileSystem.directoryExists(folderOnly);
                        if (!dirExists) {
                            yield fileSystem.directoryCreate(folderOnly);
                        }
                        let txt = yield fileSystem.fileReadText(sourceFolder, sourceFilename);
                        if (replacements) {
                            Object.keys(replacements).forEach(replacementKey => {
                                txt = txt.replace(new RegExp(replacementKey, "gm"), replacements[replacementKey].join("\r\n"));
                            });
                        }
                        yield fileSystem.fileWriteText(destFolder, destFilename, txt);
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
    folderToggle(logger, fileSystem, folder, force, mainCondition) {
        return __awaiter(this, void 0, void 0, function* () {
            if (mainCondition) {
                return this.folderCreate(logger, fileSystem, folder);
            }
            else {
                return this.folderDelete(logger, fileSystem, folder, force);
            }
        });
    }
    folderCreate(logger, fileSystem, folder) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info(`Creating Folder`, { folder });
            try {
                yield fileSystem.directoryCreate(folder);
            }
            catch (err) {
                logger.error(`Creating Folder ${folder} failed`, err);
                return 1;
            }
            return 0;
        });
    }
    folderDelete(logger, fileSystem, folder, force) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const exists = yield fileSystem.directoryExists(folder);
                if (exists) {
                    logger.info(`Deleting Folder ${folder}`);
                    if (force) {
                        yield fileSystem.directoryDelete(folder);
                    }
                    else {
                        const hasRemaining = yield this.internalDeleteFolder(logger, fileSystem, folder);
                        if (hasRemaining > 0) {
                            logger.warning(`Partial Delete of folder ${folder} as there are modified files with no generated marker`);
                        }
                        else {
                            yield fileSystem.directoryDelete(folder);
                        }
                    }
                }
                else {
                    return 0;
                }
            }
            catch (err) {
                logger.error(`Deleting Folder ${folder} failed`, err);
                return 1;
            }
            return 0;
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
                    const markerLower = PipelineStepBase.MARKER.toLowerCase();
                    for (let i = existingLines.length - 1; i >= 0 && i >= existingLines.length - 5 && !hasMarker; i--) {
                        hasMarker = existingLines[i].toLowerCase().indexOf(markerLower) >= 0;
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
    fileReadJson(logger, fileSystem, folder, filename, force, jsonCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!force) {
                try {
                    const exists = yield fileSystem.fileExists(folder, filename);
                    if (exists) {
                        logger.info(`Reading existing ${filename} from `, { folder });
                        const obj = yield fileSystem.fileReadJson(folder, filename);
                        return jsonCallback(obj);
                    }
                    else {
                        return jsonCallback(undefined);
                    }
                }
                catch (err) {
                    logger.error(`Reading existing ${filename} failed`, err);
                    return 1;
                }
            }
            else {
                return jsonCallback(undefined);
            }
        });
    }
    fileReadText(logger, fileSystem, folder, filename, force, textCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!force) {
                try {
                    const exists = yield fileSystem.fileExists(folder, filename);
                    if (exists) {
                        logger.info(`Reading existing ${filename} from `, { folder });
                        const text = yield fileSystem.fileReadText(folder, filename);
                        return textCallback(text);
                    }
                    else {
                        return textCallback(undefined);
                    }
                }
                catch (err) {
                    logger.error(`Reading existing ${filename} failed`, err);
                    return 1;
                }
            }
            else {
                return textCallback(undefined);
            }
        });
    }
    fileReadLines(logger, fileSystem, folder, filename, force, linesCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!force) {
                try {
                    const exists = yield fileSystem.fileExists(folder, filename);
                    if (exists) {
                        logger.info(`Reading existing ${filename} from `, { folder });
                        const readLines = yield fileSystem.fileReadLines(folder, filename);
                        return linesCallback(readLines);
                    }
                    else {
                        return linesCallback([]);
                    }
                }
                catch (err) {
                    logger.error(`Reading existing ${filename} failed`, err);
                    return 1;
                }
            }
            else {
                return linesCallback([]);
            }
        });
    }
    fileToggleLines(logger, fileSystem, folder, filename, force, mainCondition, linesGenerator) {
        return __awaiter(this, void 0, void 0, function* () {
            if (mainCondition) {
                return this.fileWriteLines(logger, fileSystem, folder, filename, force, linesGenerator);
            }
            else {
                return this.fileDeleteLines(logger, fileSystem, folder, filename, force);
            }
        });
    }
    fileToggleText(logger, fileSystem, folder, filename, force, mainCondition, textGenerator) {
        return __awaiter(this, void 0, void 0, function* () {
            if (mainCondition) {
                return this.fileWriteText(logger, fileSystem, folder, filename, force, textGenerator);
            }
            else {
                return this.fileDeleteText(logger, fileSystem, folder, filename, force);
            }
        });
    }
    fileToggleJson(logger, fileSystem, folder, filename, force, mainCondition, jsonGenerator) {
        return __awaiter(this, void 0, void 0, function* () {
            if (mainCondition) {
                return this.fileWriteJson(logger, fileSystem, folder, filename, force, jsonGenerator);
            }
            else {
                return this.fileDeleteJson(logger, fileSystem, folder, filename, force);
            }
        });
    }
    fileWriteLines(logger, fileSystem, folder, filename, force, linesGenerator) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hasGeneratedMarker = yield this.fileHasGeneratedMarker(fileSystem, folder, filename);
                if (hasGeneratedMarker === "FileNotExist" || hasGeneratedMarker === "HasMarker" || force) {
                    logger.info(`Writing ${filename} in `, { folder });
                    const lines = yield linesGenerator();
                    yield fileSystem.fileWriteLines(folder, filename, lines);
                }
                else {
                    logger.info(`Skipping ${filename} as it has no generated marker`);
                }
            }
            catch (err) {
                logger.error(`Writing ${filename} failed`, err);
                return 1;
            }
            return 0;
        });
    }
    fileWriteText(logger, fileSystem, folder, filename, force, textGenerator) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger.info(`Writing ${filename} in `, { folder });
                const text = yield textGenerator();
                yield fileSystem.fileWriteText(folder, filename, text);
            }
            catch (err) {
                logger.error(`Writing ${filename} failed`, err);
                return 1;
            }
            return 0;
        });
    }
    fileWriteJson(logger, fileSystem, folder, filename, force, jsonGenerator) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger.info(`Writing ${filename} in `, { folder });
                const obj = yield jsonGenerator();
                yield fileSystem.fileWriteJson(folder, filename, obj);
            }
            catch (err) {
                logger.error(`Writing ${filename} failed`, err);
                return 1;
            }
            return 0;
        });
    }
    fileDeleteText(logger, fileSystem, folder, filename, force) {
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
                logger.warning(`Skipping Delete of ${filename} as it has no generated marker`, { from: folder });
                return 0;
            }
            else {
                return 0;
            }
        });
    }
    fileDeleteLines(logger, fileSystem, folder, filename, force) {
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
                logger.warning(`Skipping Delete of ${filename} as it has no generated marker`, { from: folder });
                return 0;
            }
            else {
                return 0;
            }
        });
    }
    fileDeleteJson(logger, fileSystem, folder, filename, force) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const exists = yield fileSystem.fileExists(folder, filename);
                if (exists) {
                    logger.info(`Deleting ${filename}`, { from: folder });
                    yield fileSystem.fileDelete(folder, filename);
                }
                return 0;
            }
            catch (err) {
                logger.error(`Deleting ${filename} failed`, err);
                return 1;
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
    arrayCondition(uniteConfigurationArray, value) {
        return uniteConfigurationArray !== undefined &&
            uniteConfigurationArray !== null &&
            value !== undefined &&
            value !== null &&
            uniteConfigurationArray.map(key => key.toLowerCase()).indexOf(value.toLowerCase()) >= 0;
    }
    internalDeleteFolder(logger, fileSystem, folder) {
        return __awaiter(this, void 0, void 0, function* () {
            let remaining = 0;
            const subDirs = yield fileSystem.directoryGetFolders(folder);
            for (let i = 0; i < subDirs.length; i++) {
                const subDir = fileSystem.pathCombine(folder, subDirs[i]);
                const dirRemaining = yield this.internalDeleteFolder(logger, fileSystem, subDir);
                if (dirRemaining === 0) {
                    yield fileSystem.directoryDelete(subDir);
                }
                else {
                    remaining += dirRemaining;
                }
            }
            const files = yield fileSystem.directoryGetFiles(folder);
            for (let i = 0; i < files.length; i++) {
                const hasGeneratedMarker = yield this.fileHasGeneratedMarker(fileSystem, folder, files[i]);
                if (hasGeneratedMarker === "NoMarker") {
                    remaining++;
                }
                else {
                    yield fileSystem.fileDelete(folder, files[i]);
                }
            }
            return remaining;
        });
    }
}
PipelineStepBase.MARKER = "Generated by UniteJS";
exports.PipelineStepBase = PipelineStepBase;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmdpbmUvcGlwZWxpbmVTdGVwQmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBVUE7SUFHVyxhQUFhLENBQUMsa0JBQXNDLEVBQUUsZUFBZ0M7UUFDekYsTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUNyQixDQUFDO0lBRVksVUFBVSxDQUFDLE1BQWUsRUFDZixVQUF1QixFQUN2QixrQkFBc0MsRUFDdEMsZUFBZ0MsRUFDaEMsYUFBc0I7O1lBQzFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7SUFFWSxTQUFTLENBQUMsTUFBZSxFQUNmLFVBQXVCLEVBQ3ZCLGtCQUFzQyxFQUN0QyxlQUFnQyxFQUNoQyxhQUFzQjs7WUFDekMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtJQUVZLFFBQVEsQ0FBQyxNQUFlLEVBQ2YsVUFBdUIsRUFDdkIsa0JBQXNDLEVBQ3RDLGVBQWdDLEVBQ2hDLGFBQXNCOztZQUN4QyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0lBRVksUUFBUSxDQUFDLE1BQWUsRUFDZixVQUF1QixFQUN2QixZQUFvQixFQUNwQixjQUFzQixFQUN0QixVQUFrQixFQUNsQixZQUFvQixFQUNwQixLQUFjLEVBQ2QsUUFBaUIsRUFDakIsWUFBeUM7O1lBQzNELE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxVQUFVLENBQUMsVUFBVSxDQUFDLFlBQVksRUFBRSxjQUFjLENBQUMsQ0FBQztZQUVuRixFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLE1BQU0sa0JBQWtCLEdBQUcsTUFBTSxJQUFJLENBQUMsc0JBQXNCLENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxZQUFZLENBQUMsQ0FBQztnQkFFbkcsRUFBRSxDQUFDLENBQUMsa0JBQWtCLEtBQUssY0FBYyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQ3BELE1BQU0sQ0FBQyxJ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QkFFakYsRUFBRSxDQUFDLENBQUMsWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3JCLE1BQU0sVUFBVSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDN0MsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixTQUFTLElBQUksWUFBWSxDQUFDO2dCQUM5QixDQUFDO1lBQ0wsQ0FBQztZQUVELE1BQU0sS0FBSyxHQUFHLE1BQU0sVUFBVSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3pELEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUNwQyxNQUFNLGtCQUFrQixHQUFHLE1BQU0sSUFBSSxDQUFDLHNCQUFzQixDQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRTNGLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUM7b0JBQ3BDLFNBQVMsRUFBRSxDQUFDO2dCQUNoQixDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLE1BQU0sVUFBVSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xELENBQUM7WUFDTCxDQUFDO1lBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQztRQUNyQixDQUFDO0tBQUE7O0FBOWFhLHVCQUFNLEdBQVcsc0JBQXNCLENBQUM7QUFEMUQsNENBZ2JDIiwiZmlsZSI6ImVuZ2luZS9waXBlbGluZVN0ZXBCYXNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBCYXNlIGltcGxlbWVudGF0aW9uIG9mIGVuZ2luZSBwaXBlbGluZSBzdGVwLlxuICovXG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IElQaXBlbGluZVN0ZXAgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9JUGlwZWxpbmVTdGVwXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi9lbmdpbmVWYXJpYWJsZXNcIjtcbmltcG9ydCB7IE1hcmtlclN0YXRlIH0gZnJvbSBcIi4vbWFya2VyU3RhdGVcIjtcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFBpcGVsaW5lU3RlcEJhc2UgaW1wbGVtZW50cyBJUGlwZWxpbmVTdGVwIHtcbiAgICBwdWJsaWMgc3RhdGljIE1BUktFUjogc3RyaW5nID0gXCJHZW5lcmF0ZWQgYnkgVW5pdGVKU1wiO1xuXG4gICAgcHVibGljIG1haW5Db25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogYm9vbGVhbiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGluaXRpYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgY29uZmlndXJlKGxvZ2dlcjogSUxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmluYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGNvcHlGaWxlKGxvZ2dlcjogSUxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZUZvbGRlcjogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VGaWxlbmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBkZXN0Rm9sZGVyOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRlc3RGaWxlbmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JjZTogYm9vbGVhbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbm9DcmVhdGU6IGJvb2xlYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJlcGxhY2VtZW50cz86IHsgW2lkOiBzdHJpbmddOiBzdHJpbmdbXSB9KTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgY29uc3Qgc291cmNlRmlsZUV4aXN0cyA9IGF3YWl0IGZpbGVTeXN0ZW0uZmlsZUV4aXN0cyhzb3VyY2VGb2xkZXIsIHNvdXJjZUZpbGVuYW1lKTtcblxuICAgICAgICBpZiAoc291cmNlRmlsZUV4aXN0cykge1xuICAgICAgICAgICAgY29uc3QgaGFzR2VuZXJhdGVkTWFya2VyID0gYXdhaXQgdGhpcy5maWxlSGFzR2VuZXJhdGVkTWFya2VyKGZpbGVTeXN0ZW0sIGRlc3RGb2xkZXIsIGRlc3RGaWxlbmFtZSk7XG5cbiAgICAgICAgICAgIGlmIChoYXNHZW5lcmF0ZWRNYXJrZXIgPT09IFwiRmlsZU5vdEV4aXN0XCIgJiYgbm9DcmVhdGUpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgU2tpcHBpbmcgJHtzb3VyY2VGaWxlbmFtZX0gYXMgdGhlIG5vIGNyZWF0ZSBmbGFnIGlzIHNldGAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBmcm9tOiBzb3VyY2VGb2xkZXIsIHRvOiBkZXN0Rm9sZGVyIH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChoYXNHZW5lcmF0ZWRNYXJrZXIgPT09IFwiRmlsZU5vdEV4aXN0XCIgfHwgaGFzR2VuZXJhdGVkTWFya2VyID09PSBcIkhhc01hcmtlclwiIHx8IGZvcmNlKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYENvcHlpbmcgJHtzb3VyY2VGaWxlbmFtZX1gLCB7IGZyb206IHNvdXJjZUZvbGRlciwgdG86IGRlc3RGb2xkZXIgfSk7XG5cbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAvLyBXZSByZWNvbWJpbmUgdGhpcyBhcyBzb21ldGltZXMgdGhlIGZpbGVuYW1lIGNvbnRhaW5zIG1vcmUgZm9sZGVyc1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmb2xkZXJXaXRoRmlsZSA9IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZGVzdEZvbGRlciwgZGVzdEZpbGVuYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZm9sZGVyT25seSA9IGZpbGVTeXN0ZW0ucGF0aEdldERpcmVjdG9yeShmb2xkZXJXaXRoRmlsZSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRpckV4aXN0cyA9IGF3YWl0IGZpbGVTeXN0ZW0uZGlyZWN0b3J5RXhpc3RzKGZvbGRlck9ubHkpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWRpckV4aXN0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgZmlsZVN5c3RlbS5kaXJlY3RvcnlDcmVhdGUoZm9sZGVyT25seSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBsZXQgdHh0ID0gYXdhaXQgZmlsZVN5c3RlbS5maWxlUmVhZFRleHQoc291cmNlRm9sZGVyLCBzb3VyY2VGaWxlbmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXBsYWNlbWVudHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKHJlcGxhY2VtZW50cykuZm9yRWFjaChyZXBsYWNlbWVudEtleSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHh0ID0gdHh0LnJlcGxhY2UobmV3IFJlZ0V4cChyZXBsYWNlbWVudEtleSwgXCJnbVwiKSwgcmVwbGFjZW1lbnRzW3JlcGxhY2VtZW50S2V5XS5qb2luKFwiXFxyXFxuXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGZpbGVTeXN0ZW0uZmlsZVdyaXRlVGV4dChkZXN0Rm9sZGVyLCBkZXN0RmlsZW5hbWUsIHR4dCk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgQ29weWluZyAke3NvdXJjZUZpbGVuYW1lfSBmYWlsZWRgLCBlcnIsIHsgZnJvbTogc291cmNlRm9sZGVyLCB0bzogZGVzdEZvbGRlciB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgU2tpcHBpbmcgJHtzb3VyY2VGaWxlbmFtZX0gYXMgaXQgaGFzIG5vIGdlbmVyYXRlZCBtYXJrZXJgLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgZnJvbTogc291cmNlRm9sZGVyLCB0bzogZGVzdEZvbGRlciB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGAke3NvdXJjZUZpbGVuYW1lfSBkb2VzIG5vdCBleGlzdGAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgeyBmb2xkZXI6IHNvdXJjZUZvbGRlciwgZmlsZTogc291cmNlRmlsZW5hbWUgfSk7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmb2xkZXJUb2dnbGUobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgZm9sZGVyOiBzdHJpbmcsIGZvcmNlOiBib29sZWFuLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgaWYgKG1haW5Db25kaXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZvbGRlckNyZWF0ZShsb2dnZXIsIGZpbGVTeXN0ZW0sIGZvbGRlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5mb2xkZXJEZWxldGUobG9nZ2VyLCBmaWxlU3lzdGVtLCBmb2xkZXIsIGZvcmNlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmb2xkZXJDcmVhdGUobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgZm9sZGVyOiBzdHJpbmcpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBsb2dnZXIuaW5mbyhgQ3JlYXRpbmcgRm9sZGVyYCwgeyBmb2xkZXIgfSk7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IGZpbGVTeXN0ZW0uZGlyZWN0b3J5Q3JlYXRlKGZvbGRlcik7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBDcmVhdGluZyBGb2xkZXIgJHtmb2xkZXJ9IGZhaWxlZGAsIGVycik7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmb2xkZXJEZWxldGUobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgZm9sZGVyOiBzdHJpbmcsIGZvcmNlOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IGZpbGVTeXN0ZW0uZGlyZWN0b3J5RXhpc3RzKGZvbGRlcik7XG5cbiAgICAgICAgICAgIGlmIChleGlzdHMpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgRGVsZXRpbmcgRm9sZGVyICR7Zm9sZGVyfWApO1xuICAgICAgICAgICAgICAgIGlmIChmb3JjZSkge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBmaWxlU3lzdGVtLmRpcmVjdG9yeURlbGV0ZShmb2xkZXIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGhhc1JlbWFpbmluZyA9IGF3YWl0IHRoaXMuaW50ZXJuYWxEZWxldGVGb2xkZXIobG9nZ2VyLCBmaWxlU3lzdGVtLCBmb2xkZXIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChoYXNSZW1haW5pbmcgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIud2FybmluZyhgUGFydGlhbCBEZWxldGUgb2YgZm9sZGVyICR7Zm9sZGVyfSBhcyB0aGVyZSBhcmUgbW9kaWZpZWQgZmlsZXMgd2l0aCBubyBnZW5lcmF0ZWQgbWFya2VyYCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBmaWxlU3lzdGVtLmRpcmVjdG9yeURlbGV0ZShmb2xkZXIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBsb2dnZXIuZXJyb3IoYERlbGV0aW5nIEZvbGRlciAke2ZvbGRlcn0gZmFpbGVkYCwgZXJyKTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIHdyYXBHZW5lcmF0ZWRNYXJrZXIoYmVmb3JlOiBzdHJpbmcsIGFmdGVyOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gYmVmb3JlICsgUGlwZWxpbmVTdGVwQmFzZS5NQVJLRVIgKyBhZnRlcjtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlsZUhhc0dlbmVyYXRlZE1hcmtlcihmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgZm9sZGVyOiBzdHJpbmcsIGZpbGVuYW1lOiBzdHJpbmcpOiBQcm9taXNlPE1hcmtlclN0YXRlPiB7XG4gICAgICAgIGxldCBtYXJrZXJTdGF0ZTogTWFya2VyU3RhdGUgPSBcIkZpbGVOb3RFeGlzdFwiO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBleGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtLmZpbGVFeGlzdHMoZm9sZGVyLCBmaWxlbmFtZSk7XG4gICAgICAgICAgICBpZiAoZXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXhpc3RpbmdMaW5lcyA9IGF3YWl0IGZpbGVTeXN0ZW0uZmlsZVJlYWRMaW5lcyhmb2xkZXIsIGZpbGVuYW1lKTtcbiAgICAgICAgICAgICAgICAvLyBUZXN0IHRoZSBsYXN0IGZldyBsaW5lcyBpbiBjYXNlIHRoZXJlIGFyZSBsaW5lIGJyZWFrc1xuICAgICAgICAgICAgICAgIGxldCBoYXNNYXJrZXIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBjb25zdCBtYXJrZXJMb3dlciA9IFBpcGVsaW5lU3RlcEJhc2UuTUFSS0VSLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gZXhpc3RpbmdMaW5lcy5sZW5ndGggLSAxOyBpID49IDAgJiYgaSA+PSBleGlzdGluZ0xpbmVzLmxlbmd0aCAtIDUgJiYgIWhhc01hcmtlcjsgaS0tKSB7XG4gICAgICAgICAgICAgICAgICAgIGhhc01hcmtlciA9IGV4aXN0aW5nTGluZXNbaV0udG9Mb3dlckNhc2UoKS5pbmRleE9mKG1hcmtlckxvd2VyKSA+PSAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIG1hcmtlclN0YXRlID0gaGFzTWFya2VyID8gXCJIYXNNYXJrZXJcIiA6IFwiTm9NYXJrZXJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBtYXJrZXJTdGF0ZTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gbWFya2VyU3RhdGU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlsZVJlYWRKc29uPFQ+KGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIGZvbGRlcjogc3RyaW5nLCBmaWxlbmFtZTogc3RyaW5nLCBmb3JjZTogYm9vbGVhbiwganNvbkNhbGxiYWNrOiAob2JqOiBUKSA9PiBQcm9taXNlPG51bWJlcj4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBpZiAoIWZvcmNlKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IGZpbGVTeXN0ZW0uZmlsZUV4aXN0cyhmb2xkZXIsIGZpbGVuYW1lKTtcbiAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBSZWFkaW5nIGV4aXN0aW5nICR7ZmlsZW5hbWV9IGZyb20gYCwgeyBmb2xkZXIgfSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9iaiA9IGF3YWl0IGZpbGVTeXN0ZW0uZmlsZVJlYWRKc29uPFQ+KGZvbGRlciwgZmlsZW5hbWUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ganNvbkNhbGxiYWNrKG9iaik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGpzb25DYWxsYmFjayh1bmRlZmluZWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgUmVhZGluZyBleGlzdGluZyAke2ZpbGVuYW1lfSBmYWlsZWRgLCBlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGpzb25DYWxsYmFjayh1bmRlZmluZWQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbGVSZWFkVGV4dChsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCBmb2xkZXI6IHN0cmluZywgZmlsZW5hbWU6IHN0cmluZywgZm9yY2U6IGJvb2xlYW4sIHRleHRDYWxsYmFjazogKHRleHQ6IHN0cmluZykgPT4gUHJvbWlzZTxudW1iZXI+KTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgaWYgKCFmb3JjZSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBleGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtLmZpbGVFeGlzdHMoZm9sZGVyLCBmaWxlbmFtZSk7XG4gICAgICAgICAgICAgICAgaWYgKGV4aXN0cykge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgUmVhZGluZyBleGlzdGluZyAke2ZpbGVuYW1lfSBmcm9tIGAsIHsgZm9sZGVyIH0pO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgZmlsZVN5c3RlbS5maWxlUmVhZFRleHQoZm9sZGVyLCBmaWxlbmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0ZXh0Q2FsbGJhY2sodGV4dCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRleHRDYWxsYmFjayh1bmRlZmluZWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgUmVhZGluZyBleGlzdGluZyAke2ZpbGVuYW1lfSBmYWlsZWRgLCBlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRleHRDYWxsYmFjayh1bmRlZmluZWQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbGVSZWFkTGluZXMobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgZm9sZGVyOiBzdHJpbmcsIGZpbGVuYW1lOiBzdHJpbmcsIGZvcmNlOiBib29sZWFuLCBsaW5lc0NhbGxiYWNrOiAobGluZXM6IHN0cmluZ1tdKSA9PiBQcm9taXNlPG51bWJlcj4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBpZiAoIWZvcmNlKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IGZpbGVTeXN0ZW0uZmlsZUV4aXN0cyhmb2xkZXIsIGZpbGVuYW1lKTtcbiAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBSZWFkaW5nIGV4aXN0aW5nICR7ZmlsZW5hbWV9IGZyb20gYCwgeyBmb2xkZXIgfSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlYWRMaW5lcyA9IGF3YWl0IGZpbGVTeXN0ZW0uZmlsZVJlYWRMaW5lcyhmb2xkZXIsIGZpbGVuYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpbmVzQ2FsbGJhY2socmVhZExpbmVzKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGluZXNDYWxsYmFjayhbXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBSZWFkaW5nIGV4aXN0aW5nICR7ZmlsZW5hbWV9IGZhaWxlZGAsIGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbGluZXNDYWxsYmFjayhbXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlsZVRvZ2dsZUxpbmVzKGxvZ2dlcjogSUxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9sZGVyOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlbmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yY2U6IGJvb2xlYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29uZGl0aW9uOiBib29sZWFuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZXNHZW5lcmF0b3I6ICgpID0+IFByb21pc2U8c3RyaW5nW10+KTogUHJvbWlzZTxudW1iZXI+IHtcblxuICAgICAgICBpZiAobWFpbkNvbmRpdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmlsZVdyaXRlTGluZXMobG9nZ2VyLCBmaWxlU3lzdGVtLCBmb2xkZXIsIGZpbGVuYW1lLCBmb3JjZSwgbGluZXNHZW5lcmF0b3IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmlsZURlbGV0ZUxpbmVzKGxvZ2dlciwgZmlsZVN5c3RlbSwgZm9sZGVyLCBmaWxlbmFtZSwgZm9yY2UpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbGVUb2dnbGVUZXh0KGxvZ2dlcjogSUxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbGRlcjogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlbmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JjZTogYm9vbGVhbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbkNvbmRpdGlvbjogYm9vbGVhbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEdlbmVyYXRvcjogKCkgPT4gUHJvbWlzZTxzdHJpbmc+KTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgaWYgKG1haW5Db25kaXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZpbGVXcml0ZVRleHQobG9nZ2VyLCBmaWxlU3lzdGVtLCBmb2xkZXIsIGZpbGVuYW1lLCBmb3JjZSwgdGV4dEdlbmVyYXRvcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5maWxlRGVsZXRlVGV4dChsb2dnZXIsIGZpbGVTeXN0ZW0sIGZvbGRlciwgZmlsZW5hbWUsIGZvcmNlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaWxlVG9nZ2xlSnNvbihsb2dnZXI6IElMb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb2xkZXI6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZW5hbWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yY2U6IGJvb2xlYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5Db25kaXRpb246IGJvb2xlYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzb25HZW5lcmF0b3I6ICgpID0+IFByb21pc2U8YW55Pik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGlmIChtYWluQ29uZGl0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5maWxlV3JpdGVKc29uKGxvZ2dlciwgZmlsZVN5c3RlbSwgZm9sZGVyLCBmaWxlbmFtZSwgZm9yY2UsIGpzb25HZW5lcmF0b3IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmlsZURlbGV0ZUpzb24obG9nZ2VyLCBmaWxlU3lzdGVtLCBmb2xkZXIsIGZpbGVuYW1lLCBmb3JjZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlsZVdyaXRlTGluZXMobG9nZ2VyOiBJTG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9sZGVyOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVuYW1lOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcmNlOiBib29sZWFuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lc0dlbmVyYXRvcjogKCkgPT4gUHJvbWlzZTxzdHJpbmdbXT4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgaGFzR2VuZXJhdGVkTWFya2VyID0gYXdhaXQgdGhpcy5maWxlSGFzR2VuZXJhdGVkTWFya2VyKGZpbGVTeXN0ZW0sIGZvbGRlciwgZmlsZW5hbWUpO1xuXG4gICAgICAgICAgICBpZiAoaGFzR2VuZXJhdGVkTWFya2VyID09PSBcIkZpbGVOb3RFeGlzdFwiIHx8IGhhc0dlbmVyYXRlZE1hcmtlciA9PT0gXCJIYXNNYXJrZXJcIiB8fCBmb3JjZSkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBXcml0aW5nICR7ZmlsZW5hbWV9IGluIGAsIHsgZm9sZGVyIH0pO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgbGluZXM6IHN0cmluZ1tdID0gYXdhaXQgbGluZXNHZW5lcmF0b3IoKTtcbiAgICAgICAgICAgICAgICBhd2FpdCBmaWxlU3lzdGVtLmZpbGVXcml0ZUxpbmVzKGZvbGRlciwgZmlsZW5hbWUsIGxpbmVzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYFNraXBwaW5nICR7ZmlsZW5hbWV9IGFzIGl0IGhhcyBubyBnZW5lcmF0ZWQgbWFya2VyYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBXcml0aW5nICR7ZmlsZW5hbWV9IGZhaWxlZGAsIGVycik7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlsZVdyaXRlVGV4dChsb2dnZXI6IElMb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9sZGVyOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZW5hbWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JjZTogYm9vbGVhbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0R2VuZXJhdG9yOiAoKSA9PiBQcm9taXNlPHN0cmluZz4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbG9nZ2VyLmluZm8oYFdyaXRpbmcgJHtmaWxlbmFtZX0gaW4gYCwgeyBmb2xkZXIgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHRleHQ6IHN0cmluZyA9IGF3YWl0IHRleHRHZW5lcmF0b3IoKTtcbiAgICAgICAgICAgIGF3YWl0IGZpbGVTeXN0ZW0uZmlsZVdyaXRlVGV4dChmb2xkZXIsIGZpbGVuYW1lLCB0ZXh0KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBsb2dnZXIuZXJyb3IoYFdyaXRpbmcgJHtmaWxlbmFtZX0gZmFpbGVkYCwgZXJyKTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaWxlV3JpdGVKc29uKGxvZ2dlcjogSUxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb2xkZXI6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlbmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcmNlOiBib29sZWFuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzb25HZW5lcmF0b3I6ICgpID0+IFByb21pc2U8YW55Pik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsb2dnZXIuaW5mbyhgV3JpdGluZyAke2ZpbGVuYW1lfSBpbiBgLCB7IGZvbGRlciB9KTtcblxuICAgICAgICAgICAgY29uc3Qgb2JqID0gYXdhaXQganNvbkdlbmVyYXRvcigpO1xuICAgICAgICAgICAgYXdhaXQgZmlsZVN5c3RlbS5maWxlV3JpdGVKc29uKGZvbGRlciwgZmlsZW5hbWUsIG9iaik7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBXcml0aW5nICR7ZmlsZW5hbWV9IGZhaWxlZGAsIGVycik7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlsZURlbGV0ZVRleHQobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9sZGVyOiBzdHJpbmcsIGZpbGVuYW1lOiBzdHJpbmcsIGZvcmNlOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgY29uc3QgaGFzR2VuZXJhdGVkTWFya2VyID0gYXdhaXQgdGhpcy5maWxlSGFzR2VuZXJhdGVkTWFya2VyKGZpbGVTeXN0ZW0sIGZvbGRlciwgZmlsZW5hbWUpO1xuXG4gICAgICAgIGlmIChoYXNHZW5lcmF0ZWRNYXJrZXIgPT09IFwiSGFzTWFya2VyXCIgfHwgKGhhc0dlbmVyYXRlZE1hcmtlciAhPT0gXCJGaWxlTm90RXhpc3RcIiAmJiBmb3JjZSkpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYERlbGV0aW5nICR7ZmlsZW5hbWV9YCwgeyBmcm9tOiBmb2xkZXIgfSk7XG4gICAgICAgICAgICAgICAgYXdhaXQgZmlsZVN5c3RlbS5maWxlRGVsZXRlKGZvbGRlciwgZmlsZW5hbWUpO1xuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBEZWxldGluZyAke2ZpbGVuYW1lfSBmYWlsZWRgLCBlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGhhc0dlbmVyYXRlZE1hcmtlciA9PT0gXCJOb01hcmtlclwiKSB7XG4gICAgICAgICAgICBsb2dnZXIud2FybmluZyhgU2tpcHBpbmcgRGVsZXRlIG9mICR7ZmlsZW5hbWV9IGFzIGl0IGhhcyBubyBnZW5lcmF0ZWQgbWFya2VyYCwgeyBmcm9tOiBmb2xkZXIgfSk7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbGVEZWxldGVMaW5lcyhsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9sZGVyOiBzdHJpbmcsIGZpbGVuYW1lOiBzdHJpbmcsIGZvcmNlOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgY29uc3QgaGFzR2VuZXJhdGVkTWFya2VyID0gYXdhaXQgdGhpcy5maWxlSGFzR2VuZXJhdGVkTWFya2VyKGZpbGVTeXN0ZW0sIGZvbGRlciwgZmlsZW5hbWUpO1xuXG4gICAgICAgIGlmIChoYXNHZW5lcmF0ZWRNYXJrZXIgPT09IFwiSGFzTWFya2VyXCIgfHwgKGhhc0dlbmVyYXRlZE1hcmtlciAhPT0gXCJGaWxlTm90RXhpc3RcIiAmJiBmb3JjZSkpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYERlbGV0aW5nICR7ZmlsZW5hbWV9YCwgeyBmcm9tOiBmb2xkZXIgfSk7XG4gICAgICAgICAgICAgICAgYXdhaXQgZmlsZVN5c3RlbS5maWxlRGVsZXRlKGZvbGRlciwgZmlsZW5hbWUpO1xuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBEZWxldGluZyAke2ZpbGVuYW1lfSBmYWlsZWRgLCBlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGhhc0dlbmVyYXRlZE1hcmtlciA9PT0gXCJOb01hcmtlclwiKSB7XG4gICAgICAgICAgICBsb2dnZXIud2FybmluZyhgU2tpcHBpbmcgRGVsZXRlIG9mICR7ZmlsZW5hbWV9IGFzIGl0IGhhcyBubyBnZW5lcmF0ZWQgbWFya2VyYCwgeyBmcm9tOiBmb2xkZXIgfSk7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbGVEZWxldGVKc29uKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbGRlcjogc3RyaW5nLCBmaWxlbmFtZTogc3RyaW5nLCBmb3JjZTogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBleGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtLmZpbGVFeGlzdHMoZm9sZGVyLCBmaWxlbmFtZSk7XG4gICAgICAgICAgICBpZiAoZXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYERlbGV0aW5nICR7ZmlsZW5hbWV9YCwgeyBmcm9tOiBmb2xkZXIgfSk7XG4gICAgICAgICAgICAgICAgYXdhaXQgZmlsZVN5c3RlbS5maWxlRGVsZXRlKGZvbGRlciwgZmlsZW5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBEZWxldGluZyAke2ZpbGVuYW1lfSBmYWlsZWRgLCBlcnIpO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbktleTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB1bml0ZUNvbmZpZ3VyYXRpb25LZXkgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uS2V5ICE9PSBudWxsICYmXG4gICAgICAgICAgICB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICB2YWx1ZSAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uS2V5LnRvTG93ZXJDYXNlKCkgPT09IHZhbHVlLnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuXG4gICAgcHVibGljIG9iamVjdENvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb25PYmplY3Q6IGFueSwgdmFsdWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdW5pdGVDb25maWd1cmF0aW9uT2JqZWN0ICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbk9iamVjdCAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgdmFsdWUgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgdmFsdWUgIT09IG51bGwgJiZcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHVuaXRlQ29uZmlndXJhdGlvbk9iamVjdCkubWFwKGtleSA9PiBrZXkudG9Mb3dlckNhc2UoKSkuaW5kZXhPZih2YWx1ZS50b0xvd2VyQ2FzZSgpKSA+PSAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBhcnJheUNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb25BcnJheTogc3RyaW5nW10sIHZhbHVlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHVuaXRlQ29uZmlndXJhdGlvbkFycmF5ICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbkFycmF5ICE9PSBudWxsICYmXG4gICAgICAgICAgICB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICB2YWx1ZSAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uQXJyYXkubWFwKGtleSA9PiBrZXkudG9Mb3dlckNhc2UoKSkuaW5kZXhPZih2YWx1ZS50b0xvd2VyQ2FzZSgpKSA+PSAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBpbnRlcm5hbERlbGV0ZUZvbGRlcihsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb2xkZXI6IHN0cmluZyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGxldCByZW1haW5pbmcgPSAwO1xuXG4gICAgICAgIGNvbnN0IHN1YkRpcnMgPSBhd2FpdCBmaWxlU3lzdGVtLmRpcmVjdG9yeUdldEZvbGRlcnMoZm9sZGVyKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdWJEaXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBzdWJEaXIgPSBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGZvbGRlciwgc3ViRGlyc1tpXSk7XG4gICAgICAgICAgICBjb25zdCBkaXJSZW1haW5pbmcgPSBhd2FpdCB0aGlzLmludGVybmFsRGVsZXRlRm9sZGVyKGxvZ2dlciwgZmlsZVN5c3RlbSwgc3ViRGlyKTtcblxuICAgICAgICAgICAgaWYgKGRpclJlbWFpbmluZyA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGF3YWl0IGZpbGVTeXN0ZW0uZGlyZWN0b3J5RGVsZXRlKHN1YkRpcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlbWFpbmluZyArPSBkaXJSZW1haW5pbmc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmaWxlcyA9IGF3YWl0IGZpbGVTeXN0ZW0uZGlyZWN0b3J5R2V0RmlsZXMoZm9sZGVyKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgaGFzR2VuZXJhdGVkTWFya2VyID0gYXdhaXQgdGhpcy5maWxlSGFzR2VuZXJhdGVkTWFya2VyKGZpbGVTeXN0ZW0sIGZvbGRlciwgZmlsZXNbaV0pO1xuXG4gICAgICAgICAgICBpZiAoaGFzR2VuZXJhdGVkTWFya2VyID09PSBcIk5vTWFya2VyXCIpIHtcbiAgICAgICAgICAgICAgICByZW1haW5pbmcrKztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgZmlsZVN5c3RlbS5maWxlRGVsZXRlKGZvbGRlciwgZmlsZXNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlbWFpbmluZztcbiAgICB9XG59XG4iXX0=
