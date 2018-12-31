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
const templateHelper_1 = require("../helpers/templateHelper");
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
                        txt = templateHelper_1.TemplateHelper.replaceSubstitutions(replacements, txt);
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
                        hasMarker = existingLines[i].toLowerCase()
                            .indexOf(markerLower) >= 0;
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
            Object.keys(uniteConfigurationObject)
                .map(key => key.toLowerCase())
                .indexOf(value.toLowerCase()) >= 0;
    }
    arrayCondition(uniteConfigurationArray, value) {
        return uniteConfigurationArray !== undefined &&
            uniteConfigurationArray !== null &&
            value !== undefined &&
            value !== null &&
            uniteConfigurationArray
                .map(key => key.toLowerCase())
                .indexOf(value.toLowerCase()) >= 0;
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmdpbmUvcGlwZWxpbmVTdGVwQmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBTUEsOERBQTJEO0FBSzNELE1BQXNCLGdCQUFnQjtJQUczQixhQUFhLENBQUMsa0JBQXNDLEVBQUUsZUFBZ0M7UUFDekYsT0FBTyxTQUFTLENBQUM7SUFDckIsQ0FBQztJQUVZLFVBQVUsQ0FBQyxNQUFlLEVBQ2YsVUFBdUIsRUFDdkIsa0JBQXNDLEVBQ3RDLGVBQWdDLEVBQ2hDLGFBQXNCOztZQUMxQyxPQUFPLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtJQUVZLFNBQVMsQ0FBQyxNQUFlLEVBQ2YsVUFBdUIsRUFDdkIsa0JBQXNDLEVBQ3RDLGVBQWdDLEVBQ2hDLGFBQXNCOztZQUN6QyxPQUFPLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtJQUVZLFFBQVEsQ0FBQyxNQUFlLEVBQ2YsVUFBdUIsRUFDdkIsa0JBQXNDLEVBQ3RDLGVBQWdDLEVBQ2hDLGFBQXNCOztZQUN4QyxPQUFPLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtJQUVZLFFBQVEsQ0FBQyxNQUFlLEVBQ2YsVUFBdUIsRUFDdkIsWUFBb0IsRUFDcEIsY0FBc0IsRUFDdEIsVUFBa0IsRUFDbEIsWUFBb0IsRUFDcEIsS0FBYyxFQUNkLFFBQWlCLEVBQ2pCLFlBQXlDOztZQUMzRCxNQUFNLGdCQUFnQixHQUFHLE1BQU0sVUFBVSxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUUsY0FBYyxDQUFDLENBQUM7WUFFbkYsSUFBSSxnQkFBZ0IsRUFBRTtnQkFDbEIsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLFlBQVksQ0FBQyxDQUFDO2dCQUVuRyxJQUFJLGtCQUFrQixLQUFLLGNBQWMsSUFBSSxRQUFRLEVBQUU7b0JBQ25ELE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxjQUFjLCtCQUErQixFQUN6RCxF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QUFDO2lCQUM3QjthQUNKO1lBRUQsTUFBTSxLQUFLLEdBQUcsTUFBTSxVQUFVLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDekQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ25DLE1BQU0sa0JBQWtCLEdBQUcsTUFBTSxJQUFJLENBQUMsc0JBQXNCLENBQUMsVUFBVSxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFM0YsSUFBSSxrQkFBa0IsS0FBSyxVQUFVLEVBQUU7b0JBQ25DLFNBQVMsRUFBRSxDQUFDO2lCQUNmO3FCQUFNO29CQUNILE1BQU0sVUFBVSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ2pEO2FBQ0o7WUFFRCxPQUFPLFNBQVMsQ0FBQztRQUNyQixDQUFDO0tBQUE7O0FBL2FhLHVCQUFNLEdBQVcsc0JBQXNCLENBQUM7QUFEMUQsNENBaWJDIiwiZmlsZSI6ImVuZ2luZS9waXBlbGluZVN0ZXBCYXNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBCYXNlIGltcGxlbWVudGF0aW9uIG9mIGVuZ2luZSBwaXBlbGluZSBzdGVwLlxuICovXG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFRlbXBsYXRlSGVscGVyIH0gZnJvbSBcIi4uL2hlbHBlcnMvdGVtcGxhdGVIZWxwZXJcIjtcbmltcG9ydCB7IElQaXBlbGluZVN0ZXAgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9JUGlwZWxpbmVTdGVwXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi9lbmdpbmVWYXJpYWJsZXNcIjtcbmltcG9ydCB7IE1hcmtlclN0YXRlIH0gZnJvbSBcIi4vbWFya2VyU3RhdGVcIjtcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFBpcGVsaW5lU3RlcEJhc2UgaW1wbGVtZW50cyBJUGlwZWxpbmVTdGVwIHtcbiAgICBwdWJsaWMgc3RhdGljIE1BUktFUjogc3RyaW5nID0gXCJHZW5lcmF0ZWQgYnkgVW5pdGVKU1wiO1xuXG4gICAgcHVibGljIG1haW5Db25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogYm9vbGVhbiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGluaXRpYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgY29uZmlndXJlKGxvZ2dlcjogSUxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmluYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGNvcHlGaWxlKGxvZ2dlcjogSUxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZUZvbGRlcjogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VGaWxlbmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBkZXN0Rm9sZGVyOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRlc3RGaWxlbmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JjZTogYm9vbGVhbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbm9DcmVhdGU6IGJvb2xlYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJlcGxhY2VtZW50cz86IHsgW2lkOiBzdHJpbmddOiBzdHJpbmdbXSB9KTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgY29uc3Qgc291cmNlRmlsZUV4aXN0cyA9IGF3YWl0IGZpbGVTeXN0ZW0uZmlsZUV4aXN0cyhzb3VyY2VGb2xkZXIsIHNvdXJjZUZpbGVuYW1lKTtcblxuICAgICAgICBpZiAoc291cmNlRmlsZUV4aXN0cykge1xuICAgICAgICAgICAgY29uc3QgaGFzR2VuZXJhdGVkTWFya2VyID0gYXdhaXQgdGhpcy5maWxlSGFzR2VuZXJhdGVkTWFya2VyKGZpbGVTeXN0ZW0sIGRlc3RGb2xkZXIsIGRlc3RGaWxlbmFtZSk7XG5cbiAgICAgICAgICAgIGlmIChoYXNHZW5lcmF0ZWRNYXJrZXIgPT09IFwiRmlsZU5vdEV4aXN0XCIgJiYgbm9DcmVhdGUpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgU2tpcHBpbmcgJHtzb3VyY2VGaWxlbmFtZX0gYXMgdGhlIG5vIGNyZWF0ZSBmbGFnIGlzIHNldGAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBmcm9tOiBzb3VyY2VGb2xkZXIsIHRvOiBkZXN0Rm9sZGVyIH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChoYXNHZW5lcmF0ZWRNYXJrZXIgPT09IFwiRmlsZU5vdEV4aXN0XCIgfHwgaGFzR2VuZXJhdGVkTWFya2VyID09PSBcIkhhc01hcmtlclwiIHx8IGZvcmNlKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYENvcHlpbmcgJHtzb3VyY2VGaWxlbmFtZX1gLCB7IGZyb206IHNvdXJjZUZvbGRlciwgdG86IGRlc3RGb2xkZXIgfSk7XG5cbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAvLyBXZSByZWNvbWJpbmUgdGhpcyBhcyBzb21ldGltZXMgdGhlIGZpbGVuYW1lIGNvbnRhaW5zIG1vcmUgZm9sZGVyc1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmb2xkZXJXaXRoRmlsZSA9IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZGVzdEZvbGRlciwgZGVzdEZpbGVuYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZm9sZGVyT25seSA9IGZpbGVTeXN0ZW0ucGF0aEdldERpcmVjdG9yeShmb2xkZXJXaXRoRmlsZSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRpckV4aXN0cyA9IGF3YWl0IGZpbGVTeXN0ZW0uZGlyZWN0b3J5RXhpc3RzKGZvbGRlck9ubHkpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWRpckV4aXN0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgZmlsZVN5c3RlbS5kaXJlY3RvcnlDcmVhdGUoZm9sZGVyT25seSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBsZXQgdHh0ID0gYXdhaXQgZmlsZVN5c3RlbS5maWxlUmVhZFRleHQoc291cmNlRm9sZGVyLCBzb3VyY2VGaWxlbmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIHR4dCA9IFRlbXBsYXRlSGVscGVyLnJlcGxhY2VTdWJzdGl0dXRpb25zKHJlcGxhY2VtZW50cywgdHh0KTtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgZmlsZVN5c3RlbS5maWxlV3JpdGVUZXh0KGRlc3RGb2xkZXIsIGRlc3RGaWxlbmFtZSwgdHh0KTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBDb3B5aW5nICR7c291cmNlRmlsZW5hbWV9IGZhaWxlZGAsIGVyciwgeyBmcm9tOiBzb3VyY2VGb2xkZXIsIHRvOiBkZXN0Rm9sZGVyIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBTa2lwcGluZyAke3NvdXJjZUZpbGVuYW1lfSBhcyBpdCBoYXMgbm8gZ2VuZXJhdGVkIG1hcmtlcmAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBmcm9tOiBzb3VyY2VGb2xkZXIsIHRvOiBkZXN0Rm9sZGVyIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsb2dnZXIuZXJyb3IoYCR7c291cmNlRmlsZW5hbWV9IGRvZXMgbm90IGV4aXN0YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICB7IGZvbGRlcjogc291cmNlRm9sZGVyLCBmaWxlOiBzb3VyY2VGaWxlbmFtZSB9KTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZvbGRlclRvZ2dsZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCBmb2xkZXI6IHN0cmluZywgZm9yY2U6IGJvb2xlYW4sIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBpZiAobWFpbkNvbmRpdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZm9sZGVyQ3JlYXRlKGxvZ2dlciwgZmlsZVN5c3RlbSwgZm9sZGVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZvbGRlckRlbGV0ZShsb2dnZXIsIGZpbGVTeXN0ZW0sIGZvbGRlciwgZm9yY2UpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZvbGRlckNyZWF0ZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCBmb2xkZXI6IHN0cmluZyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGxvZ2dlci5pbmZvKGBDcmVhdGluZyBGb2xkZXJgLCB7IGZvbGRlciB9KTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgZmlsZVN5c3RlbS5kaXJlY3RvcnlDcmVhdGUoZm9sZGVyKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBsb2dnZXIuZXJyb3IoYENyZWF0aW5nIEZvbGRlciAke2ZvbGRlcn0gZmFpbGVkYCwgZXJyKTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZvbGRlckRlbGV0ZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCBmb2xkZXI6IHN0cmluZywgZm9yY2U6IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgZXhpc3RzID0gYXdhaXQgZmlsZVN5c3RlbS5kaXJlY3RvcnlFeGlzdHMoZm9sZGVyKTtcblxuICAgICAgICAgICAgaWYgKGV4aXN0cykge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBEZWxldGluZyBGb2xkZXIgJHtmb2xkZXJ9YCk7XG4gICAgICAgICAgICAgICAgaWYgKGZvcmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGZpbGVTeXN0ZW0uZGlyZWN0b3J5RGVsZXRlKGZvbGRlcik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaGFzUmVtYWluaW5nID0gYXdhaXQgdGhpcy5pbnRlcm5hbERlbGV0ZUZvbGRlcihsb2dnZXIsIGZpbGVTeXN0ZW0sIGZvbGRlcik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGhhc1JlbWFpbmluZyA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci53YXJuaW5nKGBQYXJ0aWFsIERlbGV0ZSBvZiBmb2xkZXIgJHtmb2xkZXJ9IGFzIHRoZXJlIGFyZSBtb2RpZmllZCBmaWxlcyB3aXRoIG5vIGdlbmVyYXRlZCBtYXJrZXJgKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IGZpbGVTeXN0ZW0uZGlyZWN0b3J5RGVsZXRlKGZvbGRlcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgRGVsZXRpbmcgRm9sZGVyICR7Zm9sZGVyfSBmYWlsZWRgLCBlcnIpO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgd3JhcEdlbmVyYXRlZE1hcmtlcihiZWZvcmU6IHN0cmluZywgYWZ0ZXI6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBiZWZvcmUgKyBQaXBlbGluZVN0ZXBCYXNlLk1BUktFUiArIGFmdGVyO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaWxlSGFzR2VuZXJhdGVkTWFya2VyKGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCBmb2xkZXI6IHN0cmluZywgZmlsZW5hbWU6IHN0cmluZyk6IFByb21pc2U8TWFya2VyU3RhdGU+IHtcbiAgICAgICAgbGV0IG1hcmtlclN0YXRlOiBNYXJrZXJTdGF0ZSA9IFwiRmlsZU5vdEV4aXN0XCI7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IGZpbGVTeXN0ZW0uZmlsZUV4aXN0cyhmb2xkZXIsIGZpbGVuYW1lKTtcbiAgICAgICAgICAgIGlmIChleGlzdHMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBleGlzdGluZ0xpbmVzID0gYXdhaXQgZmlsZVN5c3RlbS5maWxlUmVhZExpbmVzKGZvbGRlciwgZmlsZW5hbWUpO1xuICAgICAgICAgICAgICAgIC8vIFRlc3QgdGhlIGxhc3QgZmV3IGxpbmVzIGluIGNhc2UgdGhlcmUgYXJlIGxpbmUgYnJlYWtzXG4gICAgICAgICAgICAgICAgbGV0IGhhc01hcmtlciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGNvbnN0IG1hcmtlckxvd2VyID0gUGlwZWxpbmVTdGVwQmFzZS5NQVJLRVIudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSBleGlzdGluZ0xpbmVzLmxlbmd0aCAtIDE7IGkgPj0gMCAmJiBpID49IGV4aXN0aW5nTGluZXMubGVuZ3RoIC0gNSAmJiAhaGFzTWFya2VyOyBpLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgaGFzTWFya2VyID0gZXhpc3RpbmdMaW5lc1tpXS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuaW5kZXhPZihtYXJrZXJMb3dlcikgPj0gMDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBtYXJrZXJTdGF0ZSA9IGhhc01hcmtlciA/IFwiSGFzTWFya2VyXCIgOiBcIk5vTWFya2VyXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbWFya2VyU3RhdGU7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgcmV0dXJuIG1hcmtlclN0YXRlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbGVSZWFkSnNvbjxUPihsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCBmb2xkZXI6IHN0cmluZywgZmlsZW5hbWU6IHN0cmluZywgZm9yY2U6IGJvb2xlYW4sIGpzb25DYWxsYmFjazogKG9iajogVCkgPT4gUHJvbWlzZTxudW1iZXI+KTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgaWYgKCFmb3JjZSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBleGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtLmZpbGVFeGlzdHMoZm9sZGVyLCBmaWxlbmFtZSk7XG4gICAgICAgICAgICAgICAgaWYgKGV4aXN0cykge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgUmVhZGluZyBleGlzdGluZyAke2ZpbGVuYW1lfSBmcm9tIGAsIHsgZm9sZGVyIH0pO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBvYmogPSBhd2FpdCBmaWxlU3lzdGVtLmZpbGVSZWFkSnNvbjxUPihmb2xkZXIsIGZpbGVuYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGpzb25DYWxsYmFjayhvYmopO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBqc29uQ2FsbGJhY2sodW5kZWZpbmVkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoYFJlYWRpbmcgZXhpc3RpbmcgJHtmaWxlbmFtZX0gZmFpbGVkYCwgZXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBqc29uQ2FsbGJhY2sodW5kZWZpbmVkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaWxlUmVhZFRleHQobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgZm9sZGVyOiBzdHJpbmcsIGZpbGVuYW1lOiBzdHJpbmcsIGZvcmNlOiBib29sZWFuLCB0ZXh0Q2FsbGJhY2s6ICh0ZXh0OiBzdHJpbmcpID0+IFByb21pc2U8bnVtYmVyPik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGlmICghZm9yY2UpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXhpc3RzID0gYXdhaXQgZmlsZVN5c3RlbS5maWxlRXhpc3RzKGZvbGRlciwgZmlsZW5hbWUpO1xuICAgICAgICAgICAgICAgIGlmIChleGlzdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYFJlYWRpbmcgZXhpc3RpbmcgJHtmaWxlbmFtZX0gZnJvbSBgLCB7IGZvbGRlciB9KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGV4dCA9IGF3YWl0IGZpbGVTeXN0ZW0uZmlsZVJlYWRUZXh0KGZvbGRlciwgZmlsZW5hbWUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGV4dENhbGxiYWNrKHRleHQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0ZXh0Q2FsbGJhY2sodW5kZWZpbmVkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoYFJlYWRpbmcgZXhpc3RpbmcgJHtmaWxlbmFtZX0gZmFpbGVkYCwgZXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0ZXh0Q2FsbGJhY2sodW5kZWZpbmVkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaWxlUmVhZExpbmVzKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIGZvbGRlcjogc3RyaW5nLCBmaWxlbmFtZTogc3RyaW5nLCBmb3JjZTogYm9vbGVhbiwgbGluZXNDYWxsYmFjazogKGxpbmVzOiBzdHJpbmdbXSkgPT4gUHJvbWlzZTxudW1iZXI+KTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgaWYgKCFmb3JjZSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBleGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtLmZpbGVFeGlzdHMoZm9sZGVyLCBmaWxlbmFtZSk7XG4gICAgICAgICAgICAgICAgaWYgKGV4aXN0cykge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgUmVhZGluZyBleGlzdGluZyAke2ZpbGVuYW1lfSBmcm9tIGAsIHsgZm9sZGVyIH0pO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZWFkTGluZXMgPSBhd2FpdCBmaWxlU3lzdGVtLmZpbGVSZWFkTGluZXMoZm9sZGVyLCBmaWxlbmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsaW5lc0NhbGxiYWNrKHJlYWRMaW5lcyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpbmVzQ2FsbGJhY2soW10pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgUmVhZGluZyBleGlzdGluZyAke2ZpbGVuYW1lfSBmYWlsZWRgLCBlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGxpbmVzQ2FsbGJhY2soW10pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbGVUb2dnbGVMaW5lcyhsb2dnZXI6IElMb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbGRlcjogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZW5hbWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcmNlOiBib29sZWFuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbkNvbmRpdGlvbjogYm9vbGVhbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzR2VuZXJhdG9yOiAoKSA9PiBQcm9taXNlPHN0cmluZ1tdPik6IFByb21pc2U8bnVtYmVyPiB7XG5cbiAgICAgICAgaWYgKG1haW5Db25kaXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZpbGVXcml0ZUxpbmVzKGxvZ2dlciwgZmlsZVN5c3RlbSwgZm9sZGVyLCBmaWxlbmFtZSwgZm9yY2UsIGxpbmVzR2VuZXJhdG9yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZpbGVEZWxldGVMaW5lcyhsb2dnZXIsIGZpbGVTeXN0ZW0sIGZvbGRlciwgZmlsZW5hbWUsIGZvcmNlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaWxlVG9nZ2xlVGV4dChsb2dnZXI6IElMb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb2xkZXI6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZW5hbWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yY2U6IGJvb2xlYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5Db25kaXRpb246IGJvb2xlYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRHZW5lcmF0b3I6ICgpID0+IFByb21pc2U8c3RyaW5nPik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGlmIChtYWluQ29uZGl0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5maWxlV3JpdGVUZXh0KGxvZ2dlciwgZmlsZVN5c3RlbSwgZm9sZGVyLCBmaWxlbmFtZSwgZm9yY2UsIHRleHRHZW5lcmF0b3IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmlsZURlbGV0ZVRleHQobG9nZ2VyLCBmaWxlU3lzdGVtLCBmb2xkZXIsIGZpbGVuYW1lLCBmb3JjZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlsZVRvZ2dsZUpzb24obG9nZ2VyOiBJTG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9sZGVyOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVuYW1lOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcmNlOiBib29sZWFuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29uZGl0aW9uOiBib29sZWFuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc29uR2VuZXJhdG9yOiAoKSA9PiBQcm9taXNlPGFueT4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBpZiAobWFpbkNvbmRpdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmlsZVdyaXRlSnNvbihsb2dnZXIsIGZpbGVTeXN0ZW0sIGZvbGRlciwgZmlsZW5hbWUsIGZvcmNlLCBqc29uR2VuZXJhdG9yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZpbGVEZWxldGVKc29uKGxvZ2dlciwgZmlsZVN5c3RlbSwgZm9sZGVyLCBmaWxlbmFtZSwgZm9yY2UpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbGVXcml0ZUxpbmVzKGxvZ2dlcjogSUxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbGRlcjogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlbmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JjZTogYm9vbGVhbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZXNHZW5lcmF0b3I6ICgpID0+IFByb21pc2U8c3RyaW5nW10+KTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGhhc0dlbmVyYXRlZE1hcmtlciA9IGF3YWl0IHRoaXMuZmlsZUhhc0dlbmVyYXRlZE1hcmtlcihmaWxlU3lzdGVtLCBmb2xkZXIsIGZpbGVuYW1lKTtcblxuICAgICAgICAgICAgaWYgKGhhc0dlbmVyYXRlZE1hcmtlciA9PT0gXCJGaWxlTm90RXhpc3RcIiB8fCBoYXNHZW5lcmF0ZWRNYXJrZXIgPT09IFwiSGFzTWFya2VyXCIgfHwgZm9yY2UpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgV3JpdGluZyAke2ZpbGVuYW1lfSBpbiBgLCB7IGZvbGRlciB9KTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGxpbmVzOiBzdHJpbmdbXSA9IGF3YWl0IGxpbmVzR2VuZXJhdG9yKCk7XG4gICAgICAgICAgICAgICAgYXdhaXQgZmlsZVN5c3RlbS5maWxlV3JpdGVMaW5lcyhmb2xkZXIsIGZpbGVuYW1lLCBsaW5lcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBTa2lwcGluZyAke2ZpbGVuYW1lfSBhcyBpdCBoYXMgbm8gZ2VuZXJhdGVkIG1hcmtlcmApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgV3JpdGluZyAke2ZpbGVuYW1lfSBmYWlsZWRgLCBlcnIpO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbGVXcml0ZVRleHQobG9nZ2VyOiBJTG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbGRlcjogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVuYW1lOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yY2U6IGJvb2xlYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEdlbmVyYXRvcjogKCkgPT4gUHJvbWlzZTxzdHJpbmc+KTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBXcml0aW5nICR7ZmlsZW5hbWV9IGluIGAsIHsgZm9sZGVyIH0pO1xuXG4gICAgICAgICAgICBjb25zdCB0ZXh0OiBzdHJpbmcgPSBhd2FpdCB0ZXh0R2VuZXJhdG9yKCk7XG4gICAgICAgICAgICBhd2FpdCBmaWxlU3lzdGVtLmZpbGVXcml0ZVRleHQoZm9sZGVyLCBmaWxlbmFtZSwgdGV4dCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBXcml0aW5nICR7ZmlsZW5hbWV9IGZhaWxlZGAsIGVycik7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlsZVdyaXRlSnNvbihsb2dnZXI6IElMb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9sZGVyOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZW5hbWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JjZTogYm9vbGVhbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc29uR2VuZXJhdG9yOiAoKSA9PiBQcm9taXNlPGFueT4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbG9nZ2VyLmluZm8oYFdyaXRpbmcgJHtmaWxlbmFtZX0gaW4gYCwgeyBmb2xkZXIgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IGF3YWl0IGpzb25HZW5lcmF0b3IoKTtcbiAgICAgICAgICAgIGF3YWl0IGZpbGVTeXN0ZW0uZmlsZVdyaXRlSnNvbihmb2xkZXIsIGZpbGVuYW1lLCBvYmopO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgV3JpdGluZyAke2ZpbGVuYW1lfSBmYWlsZWRgLCBlcnIpO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbGVEZWxldGVUZXh0KGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbGRlcjogc3RyaW5nLCBmaWxlbmFtZTogc3RyaW5nLCBmb3JjZTogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGNvbnN0IGhhc0dlbmVyYXRlZE1hcmtlciA9IGF3YWl0IHRoaXMuZmlsZUhhc0dlbmVyYXRlZE1hcmtlcihmaWxlU3lzdGVtLCBmb2xkZXIsIGZpbGVuYW1lKTtcblxuICAgICAgICBpZiAoaGFzR2VuZXJhdGVkTWFya2VyID09PSBcIkhhc01hcmtlclwiIHx8IChoYXNHZW5lcmF0ZWRNYXJrZXIgIT09IFwiRmlsZU5vdEV4aXN0XCIgJiYgZm9yY2UpKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBEZWxldGluZyAke2ZpbGVuYW1lfWAsIHsgZnJvbTogZm9sZGVyIH0pO1xuICAgICAgICAgICAgICAgIGF3YWl0IGZpbGVTeXN0ZW0uZmlsZURlbGV0ZShmb2xkZXIsIGZpbGVuYW1lKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgRGVsZXRpbmcgJHtmaWxlbmFtZX0gZmFpbGVkYCwgZXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChoYXNHZW5lcmF0ZWRNYXJrZXIgPT09IFwiTm9NYXJrZXJcIikge1xuICAgICAgICAgICAgbG9nZ2VyLndhcm5pbmcoYFNraXBwaW5nIERlbGV0ZSBvZiAke2ZpbGVuYW1lfSBhcyBpdCBoYXMgbm8gZ2VuZXJhdGVkIG1hcmtlcmAsIHsgZnJvbTogZm9sZGVyIH0pO1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaWxlRGVsZXRlTGluZXMobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbGRlcjogc3RyaW5nLCBmaWxlbmFtZTogc3RyaW5nLCBmb3JjZTogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGNvbnN0IGhhc0dlbmVyYXRlZE1hcmtlciA9IGF3YWl0IHRoaXMuZmlsZUhhc0dlbmVyYXRlZE1hcmtlcihmaWxlU3lzdGVtLCBmb2xkZXIsIGZpbGVuYW1lKTtcblxuICAgICAgICBpZiAoaGFzR2VuZXJhdGVkTWFya2VyID09PSBcIkhhc01hcmtlclwiIHx8IChoYXNHZW5lcmF0ZWRNYXJrZXIgIT09IFwiRmlsZU5vdEV4aXN0XCIgJiYgZm9yY2UpKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBEZWxldGluZyAke2ZpbGVuYW1lfWAsIHsgZnJvbTogZm9sZGVyIH0pO1xuICAgICAgICAgICAgICAgIGF3YWl0IGZpbGVTeXN0ZW0uZmlsZURlbGV0ZShmb2xkZXIsIGZpbGVuYW1lKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgRGVsZXRpbmcgJHtmaWxlbmFtZX0gZmFpbGVkYCwgZXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChoYXNHZW5lcmF0ZWRNYXJrZXIgPT09IFwiTm9NYXJrZXJcIikge1xuICAgICAgICAgICAgbG9nZ2VyLndhcm5pbmcoYFNraXBwaW5nIERlbGV0ZSBvZiAke2ZpbGVuYW1lfSBhcyBpdCBoYXMgbm8gZ2VuZXJhdGVkIG1hcmtlcmAsIHsgZnJvbTogZm9sZGVyIH0pO1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaWxlRGVsZXRlSnNvbihsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb2xkZXI6IHN0cmluZywgZmlsZW5hbWU6IHN0cmluZywgZm9yY2U6IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgZXhpc3RzID0gYXdhaXQgZmlsZVN5c3RlbS5maWxlRXhpc3RzKGZvbGRlciwgZmlsZW5hbWUpO1xuICAgICAgICAgICAgaWYgKGV4aXN0cykge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBEZWxldGluZyAke2ZpbGVuYW1lfWAsIHsgZnJvbTogZm9sZGVyIH0pO1xuICAgICAgICAgICAgICAgIGF3YWl0IGZpbGVTeXN0ZW0uZmlsZURlbGV0ZShmb2xkZXIsIGZpbGVuYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgRGVsZXRpbmcgJHtmaWxlbmFtZX0gZmFpbGVkYCwgZXJyKTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb25LZXk6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdW5pdGVDb25maWd1cmF0aW9uS2V5ICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbktleSAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgdmFsdWUgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgdmFsdWUgIT09IG51bGwgJiZcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbktleS50b0xvd2VyQ2FzZSgpID09PSB2YWx1ZS50b0xvd2VyQ2FzZSgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBvYmplY3RDb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uT2JqZWN0OiBhbnksIHZhbHVlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHVuaXRlQ29uZmlndXJhdGlvbk9iamVjdCAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb25PYmplY3QgIT09IG51bGwgJiZcbiAgICAgICAgICAgIHZhbHVlICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICAgIHZhbHVlICE9PSBudWxsICYmXG4gICAgICAgICAgICBPYmplY3Qua2V5cyh1bml0ZUNvbmZpZ3VyYXRpb25PYmplY3QpXG4gICAgICAgICAgICAgICAgLm1hcChrZXkgPT4ga2V5LnRvTG93ZXJDYXNlKCkpXG4gICAgICAgICAgICAgICAgLmluZGV4T2YodmFsdWUudG9Mb3dlckNhc2UoKSkgPj0gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXJyYXlDb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uQXJyYXk6IHN0cmluZ1tdLCB2YWx1ZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB1bml0ZUNvbmZpZ3VyYXRpb25BcnJheSAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb25BcnJheSAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgdmFsdWUgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgdmFsdWUgIT09IG51bGwgJiZcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbkFycmF5XG4gICAgICAgICAgICAgICAgLm1hcChrZXkgPT4ga2V5LnRvTG93ZXJDYXNlKCkpXG4gICAgICAgICAgICAgICAgLmluZGV4T2YodmFsdWUudG9Mb3dlckNhc2UoKSkgPj0gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgaW50ZXJuYWxEZWxldGVGb2xkZXIobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9sZGVyOiBzdHJpbmcpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBsZXQgcmVtYWluaW5nID0gMDtcblxuICAgICAgICBjb25zdCBzdWJEaXJzID0gYXdhaXQgZmlsZVN5c3RlbS5kaXJlY3RvcnlHZXRGb2xkZXJzKGZvbGRlcik7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3ViRGlycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3Qgc3ViRGlyID0gZmlsZVN5c3RlbS5wYXRoQ29tYmluZShmb2xkZXIsIHN1YkRpcnNbaV0pO1xuICAgICAgICAgICAgY29uc3QgZGlyUmVtYWluaW5nID0gYXdhaXQgdGhpcy5pbnRlcm5hbERlbGV0ZUZvbGRlcihsb2dnZXIsIGZpbGVTeXN0ZW0sIHN1YkRpcik7XG5cbiAgICAgICAgICAgIGlmIChkaXJSZW1haW5pbmcgPT09IDApIHtcbiAgICAgICAgICAgICAgICBhd2FpdCBmaWxlU3lzdGVtLmRpcmVjdG9yeURlbGV0ZShzdWJEaXIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZW1haW5pbmcgKz0gZGlyUmVtYWluaW5nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZmlsZXMgPSBhd2FpdCBmaWxlU3lzdGVtLmRpcmVjdG9yeUdldEZpbGVzKGZvbGRlcik7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGhhc0dlbmVyYXRlZE1hcmtlciA9IGF3YWl0IHRoaXMuZmlsZUhhc0dlbmVyYXRlZE1hcmtlcihmaWxlU3lzdGVtLCBmb2xkZXIsIGZpbGVzW2ldKTtcblxuICAgICAgICAgICAgaWYgKGhhc0dlbmVyYXRlZE1hcmtlciA9PT0gXCJOb01hcmtlclwiKSB7XG4gICAgICAgICAgICAgICAgcmVtYWluaW5nKys7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGF3YWl0IGZpbGVTeXN0ZW0uZmlsZURlbGV0ZShmb2xkZXIsIGZpbGVzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZW1haW5pbmc7XG4gICAgfVxufVxuIl19
