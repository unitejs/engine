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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmdpbmUvcGlwZWxpbmVTdGVwQmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBTUEsOERBQTJEO0FBSzNEO0lBR1csYUFBYSxDQUFDLGtCQUFzQyxFQUFFLGVBQWdDO1FBQ3pGLE1BQU0sQ0FBQyxTQUFTLENBQUM7SUFDckIsQ0FBQztJQUVZLFVBQVUsQ0FBQyxNQUFlLEVBQ2YsVUFBdUIsRUFDdkIsa0JBQXNDLEVBQ3RDLGVBQWdDLEVBQ2hDLGFBQXNCOztZQUMxQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0lBRVksU0FBUyxDQUFDLE1BQWUsRUFDZixVQUF1QixFQUN2QixrQkFBc0MsRUFDdEMsZUFBZ0MsRUFDaEMsYUFBc0I7O1lBQ3pDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7SUFFWSxRQUFRLENBQUMsTUFBZSxFQUNmLFVBQXVCLEVBQ3ZCLGtCQUFzQyxFQUN0QyxlQUFnQyxFQUNoQyxhQUFzQjs7WUFDeEMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtJQUVZLFFBQVEsQ0FBQyxNQUFlLEVBQ2YsVUFBdUIsRUFDdkIsWUFBb0IsRUFDcEIsY0FBc0IsRUFDdEIsVUFBa0IsRUFDbEIsWUFBb0IsRUFDcEIsS0FBYyxFQUNkLFFBQWlCLEVBQ2pCLFlBQXlDOztZQUMzRCxNQUFNLGdCQUFnQixHQUFHLE1BQU0sVUFBVSxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUUsY0FBYyxDQUFDLENBQUM7WUFFbkYsRUFBRSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixNQUFNLGtCQUFrQixHQUFHLE1BQU0sSUFBSSxDQUFDLHNCQUFzQixDQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUUsWUFBWSxDQUFDLENBQUM7Z0JBRW5HLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixLQUFLLGNBQWMsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUNw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R0FBRyxNQUFNLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN6RCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDcEMsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUUzRixFQUFFLENBQUMsQ0FBQyxrQkFBa0IsS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDO29CQUNwQyxTQUFTLEVBQUUsQ0FBQztnQkFDaEIsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixNQUFNLFVBQVUsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsRCxDQUFDO1lBQ0wsQ0FBQztZQUVELE1BQU0sQ0FBQyxTQUFTLENBQUM7UUFDckIsQ0FBQztLQUFBOztBQTFhYSx1QkFBTSxHQUFXLHNCQUFzQixDQUFDO0FBRDFELDRDQTRhQyIsImZpbGUiOiJlbmdpbmUvcGlwZWxpbmVTdGVwQmFzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBlbmdpbmUgcGlwZWxpbmUgc3RlcC5cbiAqL1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBUZW1wbGF0ZUhlbHBlciB9IGZyb20gXCIuLi9oZWxwZXJzL3RlbXBsYXRlSGVscGVyXCI7XG5pbXBvcnQgeyBJUGlwZWxpbmVTdGVwIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvSVBpcGVsaW5lU3RlcFwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4vZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBNYXJrZXJTdGF0ZSB9IGZyb20gXCIuL21hcmtlclN0YXRlXCI7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBQaXBlbGluZVN0ZXBCYXNlIGltcGxlbWVudHMgSVBpcGVsaW5lU3RlcCB7XG4gICAgcHVibGljIHN0YXRpYyBNQVJLRVI6IHN0cmluZyA9IFwiR2VuZXJhdGVkIGJ5IFVuaXRlSlNcIjtcblxuICAgIHB1YmxpYyBtYWluQ29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IGJvb2xlYW4gfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBpbml0aWFsaXNlKGxvZ2dlcjogSUxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGNvbmZpZ3VyZShsb2dnZXI6IElMb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbmFsaXNlKGxvZ2dlcjogSUxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBjb3B5RmlsZShsb2dnZXI6IElMb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VGb2xkZXI6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlRmlsZW5hbWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzdEZvbGRlcjogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBkZXN0RmlsZW5hbWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yY2U6IGJvb2xlYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG5vQ3JlYXRlOiBib29sZWFuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICByZXBsYWNlbWVudHM/OiB7IFtpZDogc3RyaW5nXTogc3RyaW5nW10gfSk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGNvbnN0IHNvdXJjZUZpbGVFeGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtLmZpbGVFeGlzdHMoc291cmNlRm9sZGVyLCBzb3VyY2VGaWxlbmFtZSk7XG5cbiAgICAgICAgaWYgKHNvdXJjZUZpbGVFeGlzdHMpIHtcbiAgICAgICAgICAgIGNvbnN0IGhhc0dlbmVyYXRlZE1hcmtlciA9IGF3YWl0IHRoaXMuZmlsZUhhc0dlbmVyYXRlZE1hcmtlcihmaWxlU3lzdGVtLCBkZXN0Rm9sZGVyLCBkZXN0RmlsZW5hbWUpO1xuXG4gICAgICAgICAgICBpZiAoaGFzR2VuZXJhdGVkTWFya2VyID09PSBcIkZpbGVOb3RFeGlzdFwiICYmIG5vQ3JlYXRlKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYFNraXBwaW5nICR7c291cmNlRmlsZW5hbWV9IGFzIHRoZSBubyBjcmVhdGUgZmxhZyBpcyBzZXRgLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgZnJvbTogc291cmNlRm9sZGVyLCB0bzogZGVzdEZvbGRlciB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaGFzR2VuZXJhdGVkTWFya2VyID09PSBcIkZpbGVOb3RFeGlzdFwiIHx8IGhhc0dlbmVyYXRlZE1hcmtlciA9PT0gXCJIYXNNYXJrZXJcIiB8fCBmb3JjZSkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBDb3B5aW5nICR7c291cmNlRmlsZW5hbWV9YCwgeyBmcm9tOiBzb3VyY2VGb2xkZXIsIHRvOiBkZXN0Rm9sZGVyIH0pO1xuXG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2UgcmVjb21iaW5lIHRoaXMgYXMgc29tZXRpbWVzIHRoZSBmaWxlbmFtZSBjb250YWlucyBtb3JlIGZvbGRlcnNcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZm9sZGVyV2l0aEZpbGUgPSBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGRlc3RGb2xkZXIsIGRlc3RGaWxlbmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZvbGRlck9ubHkgPSBmaWxlU3lzdGVtLnBhdGhHZXREaXJlY3RvcnkoZm9sZGVyV2l0aEZpbGUpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkaXJFeGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtLmRpcmVjdG9yeUV4aXN0cyhmb2xkZXJPbmx5KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFkaXJFeGlzdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IGZpbGVTeXN0ZW0uZGlyZWN0b3J5Q3JlYXRlKGZvbGRlck9ubHkpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHR4dCA9IGF3YWl0IGZpbGVTeXN0ZW0uZmlsZVJlYWRUZXh0KHNvdXJjZUZvbGRlciwgc291cmNlRmlsZW5hbWUpO1xuICAgICAgICAgICAgICAgICAgICB0eHQgPSBUZW1wbGF0ZUhlbHBlci5yZXBsYWNlU3Vic3RpdHV0aW9ucyhyZXBsYWNlbWVudHMsIHR4dCk7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGZpbGVTeXN0ZW0uZmlsZVdyaXRlVGV4dChkZXN0Rm9sZGVyLCBkZXN0RmlsZW5hbWUsIHR4dCk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgQ29weWluZyAke3NvdXJjZUZpbGVuYW1lfSBmYWlsZWRgLCBlcnIsIHsgZnJvbTogc291cmNlRm9sZGVyLCB0bzogZGVzdEZvbGRlciB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgU2tpcHBpbmcgJHtzb3VyY2VGaWxlbmFtZX0gYXMgaXQgaGFzIG5vIGdlbmVyYXRlZCBtYXJrZXJgLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgZnJvbTogc291cmNlRm9sZGVyLCB0bzogZGVzdEZvbGRlciB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGAke3NvdXJjZUZpbGVuYW1lfSBkb2VzIG5vdCBleGlzdGAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgeyBmb2xkZXI6IHNvdXJjZUZvbGRlciwgZmlsZTogc291cmNlRmlsZW5hbWUgfSk7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmb2xkZXJUb2dnbGUobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgZm9sZGVyOiBzdHJpbmcsIGZvcmNlOiBib29sZWFuLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgaWYgKG1haW5Db25kaXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZvbGRlckNyZWF0ZShsb2dnZXIsIGZpbGVTeXN0ZW0sIGZvbGRlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5mb2xkZXJEZWxldGUobG9nZ2VyLCBmaWxlU3lzdGVtLCBmb2xkZXIsIGZvcmNlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmb2xkZXJDcmVhdGUobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgZm9sZGVyOiBzdHJpbmcpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBsb2dnZXIuaW5mbyhgQ3JlYXRpbmcgRm9sZGVyYCwgeyBmb2xkZXIgfSk7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IGZpbGVTeXN0ZW0uZGlyZWN0b3J5Q3JlYXRlKGZvbGRlcik7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBDcmVhdGluZyBGb2xkZXIgJHtmb2xkZXJ9IGZhaWxlZGAsIGVycik7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmb2xkZXJEZWxldGUobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgZm9sZGVyOiBzdHJpbmcsIGZvcmNlOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IGZpbGVTeXN0ZW0uZGlyZWN0b3J5RXhpc3RzKGZvbGRlcik7XG5cbiAgICAgICAgICAgIGlmIChleGlzdHMpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgRGVsZXRpbmcgRm9sZGVyICR7Zm9sZGVyfWApO1xuICAgICAgICAgICAgICAgIGlmIChmb3JjZSkge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBmaWxlU3lzdGVtLmRpcmVjdG9yeURlbGV0ZShmb2xkZXIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGhhc1JlbWFpbmluZyA9IGF3YWl0IHRoaXMuaW50ZXJuYWxEZWxldGVGb2xkZXIobG9nZ2VyLCBmaWxlU3lzdGVtLCBmb2xkZXIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChoYXNSZW1haW5pbmcgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIud2FybmluZyhgUGFydGlhbCBEZWxldGUgb2YgZm9sZGVyICR7Zm9sZGVyfSBhcyB0aGVyZSBhcmUgbW9kaWZpZWQgZmlsZXMgd2l0aCBubyBnZW5lcmF0ZWQgbWFya2VyYCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBmaWxlU3lzdGVtLmRpcmVjdG9yeURlbGV0ZShmb2xkZXIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBsb2dnZXIuZXJyb3IoYERlbGV0aW5nIEZvbGRlciAke2ZvbGRlcn0gZmFpbGVkYCwgZXJyKTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIHdyYXBHZW5lcmF0ZWRNYXJrZXIoYmVmb3JlOiBzdHJpbmcsIGFmdGVyOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gYmVmb3JlICsgUGlwZWxpbmVTdGVwQmFzZS5NQVJLRVIgKyBhZnRlcjtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlsZUhhc0dlbmVyYXRlZE1hcmtlcihmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgZm9sZGVyOiBzdHJpbmcsIGZpbGVuYW1lOiBzdHJpbmcpOiBQcm9taXNlPE1hcmtlclN0YXRlPiB7XG4gICAgICAgIGxldCBtYXJrZXJTdGF0ZTogTWFya2VyU3RhdGUgPSBcIkZpbGVOb3RFeGlzdFwiO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBleGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtLmZpbGVFeGlzdHMoZm9sZGVyLCBmaWxlbmFtZSk7XG4gICAgICAgICAgICBpZiAoZXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXhpc3RpbmdMaW5lcyA9IGF3YWl0IGZpbGVTeXN0ZW0uZmlsZVJlYWRMaW5lcyhmb2xkZXIsIGZpbGVuYW1lKTtcbiAgICAgICAgICAgICAgICAvLyBUZXN0IHRoZSBsYXN0IGZldyBsaW5lcyBpbiBjYXNlIHRoZXJlIGFyZSBsaW5lIGJyZWFrc1xuICAgICAgICAgICAgICAgIGxldCBoYXNNYXJrZXIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBjb25zdCBtYXJrZXJMb3dlciA9IFBpcGVsaW5lU3RlcEJhc2UuTUFSS0VSLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gZXhpc3RpbmdMaW5lcy5sZW5ndGggLSAxOyBpID49IDAgJiYgaSA+PSBleGlzdGluZ0xpbmVzLmxlbmd0aCAtIDUgJiYgIWhhc01hcmtlcjsgaS0tKSB7XG4gICAgICAgICAgICAgICAgICAgIGhhc01hcmtlciA9IGV4aXN0aW5nTGluZXNbaV0udG9Mb3dlckNhc2UoKS5pbmRleE9mKG1hcmtlckxvd2VyKSA+PSAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIG1hcmtlclN0YXRlID0gaGFzTWFya2VyID8gXCJIYXNNYXJrZXJcIiA6IFwiTm9NYXJrZXJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBtYXJrZXJTdGF0ZTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gbWFya2VyU3RhdGU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlsZVJlYWRKc29uPFQ+KGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIGZvbGRlcjogc3RyaW5nLCBmaWxlbmFtZTogc3RyaW5nLCBmb3JjZTogYm9vbGVhbiwganNvbkNhbGxiYWNrOiAob2JqOiBUKSA9PiBQcm9taXNlPG51bWJlcj4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBpZiAoIWZvcmNlKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IGZpbGVTeXN0ZW0uZmlsZUV4aXN0cyhmb2xkZXIsIGZpbGVuYW1lKTtcbiAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBSZWFkaW5nIGV4aXN0aW5nICR7ZmlsZW5hbWV9IGZyb20gYCwgeyBmb2xkZXIgfSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9iaiA9IGF3YWl0IGZpbGVTeXN0ZW0uZmlsZVJlYWRKc29uPFQ+KGZvbGRlciwgZmlsZW5hbWUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ganNvbkNhbGxiYWNrKG9iaik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGpzb25DYWxsYmFjayh1bmRlZmluZWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgUmVhZGluZyBleGlzdGluZyAke2ZpbGVuYW1lfSBmYWlsZWRgLCBlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGpzb25DYWxsYmFjayh1bmRlZmluZWQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbGVSZWFkVGV4dChsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCBmb2xkZXI6IHN0cmluZywgZmlsZW5hbWU6IHN0cmluZywgZm9yY2U6IGJvb2xlYW4sIHRleHRDYWxsYmFjazogKHRleHQ6IHN0cmluZykgPT4gUHJvbWlzZTxudW1iZXI+KTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgaWYgKCFmb3JjZSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBleGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtLmZpbGVFeGlzdHMoZm9sZGVyLCBmaWxlbmFtZSk7XG4gICAgICAgICAgICAgICAgaWYgKGV4aXN0cykge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgUmVhZGluZyBleGlzdGluZyAke2ZpbGVuYW1lfSBmcm9tIGAsIHsgZm9sZGVyIH0pO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgZmlsZVN5c3RlbS5maWxlUmVhZFRleHQoZm9sZGVyLCBmaWxlbmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0ZXh0Q2FsbGJhY2sodGV4dCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRleHRDYWxsYmFjayh1bmRlZmluZWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgUmVhZGluZyBleGlzdGluZyAke2ZpbGVuYW1lfSBmYWlsZWRgLCBlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRleHRDYWxsYmFjayh1bmRlZmluZWQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbGVSZWFkTGluZXMobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgZm9sZGVyOiBzdHJpbmcsIGZpbGVuYW1lOiBzdHJpbmcsIGZvcmNlOiBib29sZWFuLCBsaW5lc0NhbGxiYWNrOiAobGluZXM6IHN0cmluZ1tdKSA9PiBQcm9taXNlPG51bWJlcj4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBpZiAoIWZvcmNlKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IGZpbGVTeXN0ZW0uZmlsZUV4aXN0cyhmb2xkZXIsIGZpbGVuYW1lKTtcbiAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBSZWFkaW5nIGV4aXN0aW5nICR7ZmlsZW5hbWV9IGZyb20gYCwgeyBmb2xkZXIgfSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlYWRMaW5lcyA9IGF3YWl0IGZpbGVTeXN0ZW0uZmlsZVJlYWRMaW5lcyhmb2xkZXIsIGZpbGVuYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpbmVzQ2FsbGJhY2socmVhZExpbmVzKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGluZXNDYWxsYmFjayhbXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBSZWFkaW5nIGV4aXN0aW5nICR7ZmlsZW5hbWV9IGZhaWxlZGAsIGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbGluZXNDYWxsYmFjayhbXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlsZVRvZ2dsZUxpbmVzKGxvZ2dlcjogSUxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9sZGVyOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlbmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yY2U6IGJvb2xlYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29uZGl0aW9uOiBib29sZWFuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZXNHZW5lcmF0b3I6ICgpID0+IFByb21pc2U8c3RyaW5nW10+KTogUHJvbWlzZTxudW1iZXI+IHtcblxuICAgICAgICBpZiAobWFpbkNvbmRpdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmlsZVdyaXRlTGluZXMobG9nZ2VyLCBmaWxlU3lzdGVtLCBmb2xkZXIsIGZpbGVuYW1lLCBmb3JjZSwgbGluZXNHZW5lcmF0b3IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmlsZURlbGV0ZUxpbmVzKGxvZ2dlciwgZmlsZVN5c3RlbSwgZm9sZGVyLCBmaWxlbmFtZSwgZm9yY2UpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbGVUb2dnbGVUZXh0KGxvZ2dlcjogSUxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbGRlcjogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlbmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JjZTogYm9vbGVhbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbkNvbmRpdGlvbjogYm9vbGVhbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEdlbmVyYXRvcjogKCkgPT4gUHJvbWlzZTxzdHJpbmc+KTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgaWYgKG1haW5Db25kaXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZpbGVXcml0ZVRleHQobG9nZ2VyLCBmaWxlU3lzdGVtLCBmb2xkZXIsIGZpbGVuYW1lLCBmb3JjZSwgdGV4dEdlbmVyYXRvcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5maWxlRGVsZXRlVGV4dChsb2dnZXIsIGZpbGVTeXN0ZW0sIGZvbGRlciwgZmlsZW5hbWUsIGZvcmNlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaWxlVG9nZ2xlSnNvbihsb2dnZXI6IElMb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb2xkZXI6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZW5hbWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yY2U6IGJvb2xlYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5Db25kaXRpb246IGJvb2xlYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzb25HZW5lcmF0b3I6ICgpID0+IFByb21pc2U8YW55Pik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGlmIChtYWluQ29uZGl0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5maWxlV3JpdGVKc29uKGxvZ2dlciwgZmlsZVN5c3RlbSwgZm9sZGVyLCBmaWxlbmFtZSwgZm9yY2UsIGpzb25HZW5lcmF0b3IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmlsZURlbGV0ZUpzb24obG9nZ2VyLCBmaWxlU3lzdGVtLCBmb2xkZXIsIGZpbGVuYW1lLCBmb3JjZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlsZVdyaXRlTGluZXMobG9nZ2VyOiBJTG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9sZGVyOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVuYW1lOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcmNlOiBib29sZWFuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lc0dlbmVyYXRvcjogKCkgPT4gUHJvbWlzZTxzdHJpbmdbXT4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgaGFzR2VuZXJhdGVkTWFya2VyID0gYXdhaXQgdGhpcy5maWxlSGFzR2VuZXJhdGVkTWFya2VyKGZpbGVTeXN0ZW0sIGZvbGRlciwgZmlsZW5hbWUpO1xuXG4gICAgICAgICAgICBpZiAoaGFzR2VuZXJhdGVkTWFya2VyID09PSBcIkZpbGVOb3RFeGlzdFwiIHx8IGhhc0dlbmVyYXRlZE1hcmtlciA9PT0gXCJIYXNNYXJrZXJcIiB8fCBmb3JjZSkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBXcml0aW5nICR7ZmlsZW5hbWV9IGluIGAsIHsgZm9sZGVyIH0pO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgbGluZXM6IHN0cmluZ1tdID0gYXdhaXQgbGluZXNHZW5lcmF0b3IoKTtcbiAgICAgICAgICAgICAgICBhd2FpdCBmaWxlU3lzdGVtLmZpbGVXcml0ZUxpbmVzKGZvbGRlciwgZmlsZW5hbWUsIGxpbmVzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYFNraXBwaW5nICR7ZmlsZW5hbWV9IGFzIGl0IGhhcyBubyBnZW5lcmF0ZWQgbWFya2VyYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBXcml0aW5nICR7ZmlsZW5hbWV9IGZhaWxlZGAsIGVycik7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlsZVdyaXRlVGV4dChsb2dnZXI6IElMb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9sZGVyOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZW5hbWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JjZTogYm9vbGVhbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0R2VuZXJhdG9yOiAoKSA9PiBQcm9taXNlPHN0cmluZz4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbG9nZ2VyLmluZm8oYFdyaXRpbmcgJHtmaWxlbmFtZX0gaW4gYCwgeyBmb2xkZXIgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHRleHQ6IHN0cmluZyA9IGF3YWl0IHRleHRHZW5lcmF0b3IoKTtcbiAgICAgICAgICAgIGF3YWl0IGZpbGVTeXN0ZW0uZmlsZVdyaXRlVGV4dChmb2xkZXIsIGZpbGVuYW1lLCB0ZXh0KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBsb2dnZXIuZXJyb3IoYFdyaXRpbmcgJHtmaWxlbmFtZX0gZmFpbGVkYCwgZXJyKTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaWxlV3JpdGVKc29uKGxvZ2dlcjogSUxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb2xkZXI6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlbmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcmNlOiBib29sZWFuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzb25HZW5lcmF0b3I6ICgpID0+IFByb21pc2U8YW55Pik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsb2dnZXIuaW5mbyhgV3JpdGluZyAke2ZpbGVuYW1lfSBpbiBgLCB7IGZvbGRlciB9KTtcblxuICAgICAgICAgICAgY29uc3Qgb2JqID0gYXdhaXQganNvbkdlbmVyYXRvcigpO1xuICAgICAgICAgICAgYXdhaXQgZmlsZVN5c3RlbS5maWxlV3JpdGVKc29uKGZvbGRlciwgZmlsZW5hbWUsIG9iaik7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBXcml0aW5nICR7ZmlsZW5hbWV9IGZhaWxlZGAsIGVycik7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlsZURlbGV0ZVRleHQobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9sZGVyOiBzdHJpbmcsIGZpbGVuYW1lOiBzdHJpbmcsIGZvcmNlOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgY29uc3QgaGFzR2VuZXJhdGVkTWFya2VyID0gYXdhaXQgdGhpcy5maWxlSGFzR2VuZXJhdGVkTWFya2VyKGZpbGVTeXN0ZW0sIGZvbGRlciwgZmlsZW5hbWUpO1xuXG4gICAgICAgIGlmIChoYXNHZW5lcmF0ZWRNYXJrZXIgPT09IFwiSGFzTWFya2VyXCIgfHwgKGhhc0dlbmVyYXRlZE1hcmtlciAhPT0gXCJGaWxlTm90RXhpc3RcIiAmJiBmb3JjZSkpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYERlbGV0aW5nICR7ZmlsZW5hbWV9YCwgeyBmcm9tOiBmb2xkZXIgfSk7XG4gICAgICAgICAgICAgICAgYXdhaXQgZmlsZVN5c3RlbS5maWxlRGVsZXRlKGZvbGRlciwgZmlsZW5hbWUpO1xuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBEZWxldGluZyAke2ZpbGVuYW1lfSBmYWlsZWRgLCBlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGhhc0dlbmVyYXRlZE1hcmtlciA9PT0gXCJOb01hcmtlclwiKSB7XG4gICAgICAgICAgICBsb2dnZXIud2FybmluZyhgU2tpcHBpbmcgRGVsZXRlIG9mICR7ZmlsZW5hbWV9IGFzIGl0IGhhcyBubyBnZW5lcmF0ZWQgbWFya2VyYCwgeyBmcm9tOiBmb2xkZXIgfSk7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbGVEZWxldGVMaW5lcyhsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9sZGVyOiBzdHJpbmcsIGZpbGVuYW1lOiBzdHJpbmcsIGZvcmNlOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgY29uc3QgaGFzR2VuZXJhdGVkTWFya2VyID0gYXdhaXQgdGhpcy5maWxlSGFzR2VuZXJhdGVkTWFya2VyKGZpbGVTeXN0ZW0sIGZvbGRlciwgZmlsZW5hbWUpO1xuXG4gICAgICAgIGlmIChoYXNHZW5lcmF0ZWRNYXJrZXIgPT09IFwiSGFzTWFya2VyXCIgfHwgKGhhc0dlbmVyYXRlZE1hcmtlciAhPT0gXCJGaWxlTm90RXhpc3RcIiAmJiBmb3JjZSkpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYERlbGV0aW5nICR7ZmlsZW5hbWV9YCwgeyBmcm9tOiBmb2xkZXIgfSk7XG4gICAgICAgICAgICAgICAgYXdhaXQgZmlsZVN5c3RlbS5maWxlRGVsZXRlKGZvbGRlciwgZmlsZW5hbWUpO1xuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBEZWxldGluZyAke2ZpbGVuYW1lfSBmYWlsZWRgLCBlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGhhc0dlbmVyYXRlZE1hcmtlciA9PT0gXCJOb01hcmtlclwiKSB7XG4gICAgICAgICAgICBsb2dnZXIud2FybmluZyhgU2tpcHBpbmcgRGVsZXRlIG9mICR7ZmlsZW5hbWV9IGFzIGl0IGhhcyBubyBnZW5lcmF0ZWQgbWFya2VyYCwgeyBmcm9tOiBmb2xkZXIgfSk7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbGVEZWxldGVKc29uKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbGRlcjogc3RyaW5nLCBmaWxlbmFtZTogc3RyaW5nLCBmb3JjZTogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBleGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtLmZpbGVFeGlzdHMoZm9sZGVyLCBmaWxlbmFtZSk7XG4gICAgICAgICAgICBpZiAoZXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYERlbGV0aW5nICR7ZmlsZW5hbWV9YCwgeyBmcm9tOiBmb2xkZXIgfSk7XG4gICAgICAgICAgICAgICAgYXdhaXQgZmlsZVN5c3RlbS5maWxlRGVsZXRlKGZvbGRlciwgZmlsZW5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBEZWxldGluZyAke2ZpbGVuYW1lfSBmYWlsZWRgLCBlcnIpO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbktleTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB1bml0ZUNvbmZpZ3VyYXRpb25LZXkgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uS2V5ICE9PSBudWxsICYmXG4gICAgICAgICAgICB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICB2YWx1ZSAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uS2V5LnRvTG93ZXJDYXNlKCkgPT09IHZhbHVlLnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuXG4gICAgcHVibGljIG9iamVjdENvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb25PYmplY3Q6IGFueSwgdmFsdWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdW5pdGVDb25maWd1cmF0aW9uT2JqZWN0ICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbk9iamVjdCAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgdmFsdWUgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgdmFsdWUgIT09IG51bGwgJiZcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHVuaXRlQ29uZmlndXJhdGlvbk9iamVjdCkubWFwKGtleSA9PiBrZXkudG9Mb3dlckNhc2UoKSkuaW5kZXhPZih2YWx1ZS50b0xvd2VyQ2FzZSgpKSA+PSAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBhcnJheUNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb25BcnJheTogc3RyaW5nW10sIHZhbHVlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHVuaXRlQ29uZmlndXJhdGlvbkFycmF5ICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbkFycmF5ICE9PSBudWxsICYmXG4gICAgICAgICAgICB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICB2YWx1ZSAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uQXJyYXkubWFwKGtleSA9PiBrZXkudG9Mb3dlckNhc2UoKSkuaW5kZXhPZih2YWx1ZS50b0xvd2VyQ2FzZSgpKSA+PSAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBpbnRlcm5hbERlbGV0ZUZvbGRlcihsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb2xkZXI6IHN0cmluZyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGxldCByZW1haW5pbmcgPSAwO1xuXG4gICAgICAgIGNvbnN0IHN1YkRpcnMgPSBhd2FpdCBmaWxlU3lzdGVtLmRpcmVjdG9yeUdldEZvbGRlcnMoZm9sZGVyKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdWJEaXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBzdWJEaXIgPSBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGZvbGRlciwgc3ViRGlyc1tpXSk7XG4gICAgICAgICAgICBjb25zdCBkaXJSZW1haW5pbmcgPSBhd2FpdCB0aGlzLmludGVybmFsRGVsZXRlRm9sZGVyKGxvZ2dlciwgZmlsZVN5c3RlbSwgc3ViRGlyKTtcblxuICAgICAgICAgICAgaWYgKGRpclJlbWFpbmluZyA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGF3YWl0IGZpbGVTeXN0ZW0uZGlyZWN0b3J5RGVsZXRlKHN1YkRpcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlbWFpbmluZyArPSBkaXJSZW1haW5pbmc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmaWxlcyA9IGF3YWl0IGZpbGVTeXN0ZW0uZGlyZWN0b3J5R2V0RmlsZXMoZm9sZGVyKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgaGFzR2VuZXJhdGVkTWFya2VyID0gYXdhaXQgdGhpcy5maWxlSGFzR2VuZXJhdGVkTWFya2VyKGZpbGVTeXN0ZW0sIGZvbGRlciwgZmlsZXNbaV0pO1xuXG4gICAgICAgICAgICBpZiAoaGFzR2VuZXJhdGVkTWFya2VyID09PSBcIk5vTWFya2VyXCIpIHtcbiAgICAgICAgICAgICAgICByZW1haW5pbmcrKztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgZmlsZVN5c3RlbS5maWxlRGVsZXRlKGZvbGRlciwgZmlsZXNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlbWFpbmluZztcbiAgICB9XG59XG4iXX0=
