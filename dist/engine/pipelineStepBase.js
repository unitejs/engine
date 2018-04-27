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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmdpbmUvcGlwZWxpbmVTdGVwQmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBTUEsOERBQTJEO0FBSzNEO0lBR1csYUFBYSxDQUFDLGtCQUFzQyxFQUFFLGVBQWdDO1FBQ3pGLE9BQU8sU0FBUyxDQUFDO0lBQ3JCLENBQUM7SUFFWSxVQUFVLENBQUMsTUFBZSxFQUNmLFVBQXVCLEVBQ3ZCLGtCQUFzQyxFQUN0QyxlQUFnQyxFQUNoQyxhQUFzQjs7WUFDMUMsT0FBTyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7SUFFWSxTQUFTLENBQUMsTUFBZSxFQUNmLFVBQXVCLEVBQ3ZCLGtCQUFzQyxFQUN0QyxlQUFnQyxFQUNoQyxhQUFzQjs7WUFDekMsT0FBTyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7SUFFWSxRQUFRLENBQUMsTUFBZSxFQUNmLFVBQXVCLEVBQ3ZCLGtCQUFzQyxFQUN0QyxlQUFnQyxFQUNoQyxhQUFzQjs7WUFDeEMsT0FBTyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7SUFFWSxRQUFRLENBQUMsTUFBZSxFQUNmLFVBQXVCLEVBQ3ZCLFlBQW9CLEVBQ3BCLGNBQXNCLEVBQ3RCLFVBQWtCLEVBQ2xCLFlBQW9CLEVBQ3BCLEtBQWMsRUFDZCxRQUFpQixFQUNqQixZQUF5Qzs7WUFDM0QsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLFVBQVUsQ0FBQyxVQUFVLENBQUMsWUFBWSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1lBRW5GLElBQUksZ0JBQWdCLEVBQUU7Z0JBQ2xCLE1BQU0sa0JBQWtCLEdBQUcsTUFBTSxJQUFJLENBQUMsc0JBQXNCLENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxZQUFZLENBQUMsQ0FBQztnQkFFbkcsSUFBSSxrQkFBa0IsS0FBSyxjQUFjLElBQUksUUFBUSxFQUFFO29CQUNuRCxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksY0FBYywrQkFBK0IsRUFDekQsRUFBRSxJQUFJLEVBQUUs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SjtZQUVELE1BQU0sS0FBSyxHQUFHLE1BQU0sVUFBVSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3pELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNuQyxNQUFNLGtCQUFrQixHQUFHLE1BQU0sSUFBSSxDQUFDLHNCQUFzQixDQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRTNGLElBQUksa0JBQWtCLEtBQUssVUFBVSxFQUFFO29CQUNuQyxTQUFTLEVBQUUsQ0FBQztpQkFDZjtxQkFBTTtvQkFDSCxNQUFNLFVBQVUsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNqRDthQUNKO1lBRUQsT0FBTyxTQUFTLENBQUM7UUFDckIsQ0FBQztLQUFBOztBQS9hYSx1QkFBTSxHQUFXLHNCQUFzQixDQUFDO0FBRDFELDRDQWliQyIsImZpbGUiOiJlbmdpbmUvcGlwZWxpbmVTdGVwQmFzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBlbmdpbmUgcGlwZWxpbmUgc3RlcC5cbiAqL1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBUZW1wbGF0ZUhlbHBlciB9IGZyb20gXCIuLi9oZWxwZXJzL3RlbXBsYXRlSGVscGVyXCI7XG5pbXBvcnQgeyBJUGlwZWxpbmVTdGVwIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvSVBpcGVsaW5lU3RlcFwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4vZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBNYXJrZXJTdGF0ZSB9IGZyb20gXCIuL21hcmtlclN0YXRlXCI7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBQaXBlbGluZVN0ZXBCYXNlIGltcGxlbWVudHMgSVBpcGVsaW5lU3RlcCB7XG4gICAgcHVibGljIHN0YXRpYyBNQVJLRVI6IHN0cmluZyA9IFwiR2VuZXJhdGVkIGJ5IFVuaXRlSlNcIjtcblxuICAgIHB1YmxpYyBtYWluQ29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IGJvb2xlYW4gfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBpbml0aWFsaXNlKGxvZ2dlcjogSUxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGNvbmZpZ3VyZShsb2dnZXI6IElMb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbmFsaXNlKGxvZ2dlcjogSUxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBjb3B5RmlsZShsb2dnZXI6IElMb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VGb2xkZXI6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlRmlsZW5hbWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzdEZvbGRlcjogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBkZXN0RmlsZW5hbWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yY2U6IGJvb2xlYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG5vQ3JlYXRlOiBib29sZWFuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICByZXBsYWNlbWVudHM/OiB7IFtpZDogc3RyaW5nXTogc3RyaW5nW10gfSk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGNvbnN0IHNvdXJjZUZpbGVFeGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtLmZpbGVFeGlzdHMoc291cmNlRm9sZGVyLCBzb3VyY2VGaWxlbmFtZSk7XG5cbiAgICAgICAgaWYgKHNvdXJjZUZpbGVFeGlzdHMpIHtcbiAgICAgICAgICAgIGNvbnN0IGhhc0dlbmVyYXRlZE1hcmtlciA9IGF3YWl0IHRoaXMuZmlsZUhhc0dlbmVyYXRlZE1hcmtlcihmaWxlU3lzdGVtLCBkZXN0Rm9sZGVyLCBkZXN0RmlsZW5hbWUpO1xuXG4gICAgICAgICAgICBpZiAoaGFzR2VuZXJhdGVkTWFya2VyID09PSBcIkZpbGVOb3RFeGlzdFwiICYmIG5vQ3JlYXRlKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYFNraXBwaW5nICR7c291cmNlRmlsZW5hbWV9IGFzIHRoZSBubyBjcmVhdGUgZmxhZyBpcyBzZXRgLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgZnJvbTogc291cmNlRm9sZGVyLCB0bzogZGVzdEZvbGRlciB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaGFzR2VuZXJhdGVkTWFya2VyID09PSBcIkZpbGVOb3RFeGlzdFwiIHx8IGhhc0dlbmVyYXRlZE1hcmtlciA9PT0gXCJIYXNNYXJrZXJcIiB8fCBmb3JjZSkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBDb3B5aW5nICR7c291cmNlRmlsZW5hbWV9YCwgeyBmcm9tOiBzb3VyY2VGb2xkZXIsIHRvOiBkZXN0Rm9sZGVyIH0pO1xuXG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2UgcmVjb21iaW5lIHRoaXMgYXMgc29tZXRpbWVzIHRoZSBmaWxlbmFtZSBjb250YWlucyBtb3JlIGZvbGRlcnNcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZm9sZGVyV2l0aEZpbGUgPSBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGRlc3RGb2xkZXIsIGRlc3RGaWxlbmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZvbGRlck9ubHkgPSBmaWxlU3lzdGVtLnBhdGhHZXREaXJlY3RvcnkoZm9sZGVyV2l0aEZpbGUpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkaXJFeGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtLmRpcmVjdG9yeUV4aXN0cyhmb2xkZXJPbmx5KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFkaXJFeGlzdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IGZpbGVTeXN0ZW0uZGlyZWN0b3J5Q3JlYXRlKGZvbGRlck9ubHkpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHR4dCA9IGF3YWl0IGZpbGVTeXN0ZW0uZmlsZVJlYWRUZXh0KHNvdXJjZUZvbGRlciwgc291cmNlRmlsZW5hbWUpO1xuICAgICAgICAgICAgICAgICAgICB0eHQgPSBUZW1wbGF0ZUhlbHBlci5yZXBsYWNlU3Vic3RpdHV0aW9ucyhyZXBsYWNlbWVudHMsIHR4dCk7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGZpbGVTeXN0ZW0uZmlsZVdyaXRlVGV4dChkZXN0Rm9sZGVyLCBkZXN0RmlsZW5hbWUsIHR4dCk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgQ29weWluZyAke3NvdXJjZUZpbGVuYW1lfSBmYWlsZWRgLCBlcnIsIHsgZnJvbTogc291cmNlRm9sZGVyLCB0bzogZGVzdEZvbGRlciB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgU2tpcHBpbmcgJHtzb3VyY2VGaWxlbmFtZX0gYXMgaXQgaGFzIG5vIGdlbmVyYXRlZCBtYXJrZXJgLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgZnJvbTogc291cmNlRm9sZGVyLCB0bzogZGVzdEZvbGRlciB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGAke3NvdXJjZUZpbGVuYW1lfSBkb2VzIG5vdCBleGlzdGAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgeyBmb2xkZXI6IHNvdXJjZUZvbGRlciwgZmlsZTogc291cmNlRmlsZW5hbWUgfSk7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmb2xkZXJUb2dnbGUobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgZm9sZGVyOiBzdHJpbmcsIGZvcmNlOiBib29sZWFuLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgaWYgKG1haW5Db25kaXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZvbGRlckNyZWF0ZShsb2dnZXIsIGZpbGVTeXN0ZW0sIGZvbGRlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5mb2xkZXJEZWxldGUobG9nZ2VyLCBmaWxlU3lzdGVtLCBmb2xkZXIsIGZvcmNlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmb2xkZXJDcmVhdGUobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgZm9sZGVyOiBzdHJpbmcpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBsb2dnZXIuaW5mbyhgQ3JlYXRpbmcgRm9sZGVyYCwgeyBmb2xkZXIgfSk7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IGZpbGVTeXN0ZW0uZGlyZWN0b3J5Q3JlYXRlKGZvbGRlcik7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBDcmVhdGluZyBGb2xkZXIgJHtmb2xkZXJ9IGZhaWxlZGAsIGVycik7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmb2xkZXJEZWxldGUobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgZm9sZGVyOiBzdHJpbmcsIGZvcmNlOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IGZpbGVTeXN0ZW0uZGlyZWN0b3J5RXhpc3RzKGZvbGRlcik7XG5cbiAgICAgICAgICAgIGlmIChleGlzdHMpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgRGVsZXRpbmcgRm9sZGVyICR7Zm9sZGVyfWApO1xuICAgICAgICAgICAgICAgIGlmIChmb3JjZSkge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBmaWxlU3lzdGVtLmRpcmVjdG9yeURlbGV0ZShmb2xkZXIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGhhc1JlbWFpbmluZyA9IGF3YWl0IHRoaXMuaW50ZXJuYWxEZWxldGVGb2xkZXIobG9nZ2VyLCBmaWxlU3lzdGVtLCBmb2xkZXIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChoYXNSZW1haW5pbmcgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIud2FybmluZyhgUGFydGlhbCBEZWxldGUgb2YgZm9sZGVyICR7Zm9sZGVyfSBhcyB0aGVyZSBhcmUgbW9kaWZpZWQgZmlsZXMgd2l0aCBubyBnZW5lcmF0ZWQgbWFya2VyYCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBmaWxlU3lzdGVtLmRpcmVjdG9yeURlbGV0ZShmb2xkZXIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBsb2dnZXIuZXJyb3IoYERlbGV0aW5nIEZvbGRlciAke2ZvbGRlcn0gZmFpbGVkYCwgZXJyKTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIHdyYXBHZW5lcmF0ZWRNYXJrZXIoYmVmb3JlOiBzdHJpbmcsIGFmdGVyOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gYmVmb3JlICsgUGlwZWxpbmVTdGVwQmFzZS5NQVJLRVIgKyBhZnRlcjtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlsZUhhc0dlbmVyYXRlZE1hcmtlcihmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgZm9sZGVyOiBzdHJpbmcsIGZpbGVuYW1lOiBzdHJpbmcpOiBQcm9taXNlPE1hcmtlclN0YXRlPiB7XG4gICAgICAgIGxldCBtYXJrZXJTdGF0ZTogTWFya2VyU3RhdGUgPSBcIkZpbGVOb3RFeGlzdFwiO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBleGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtLmZpbGVFeGlzdHMoZm9sZGVyLCBmaWxlbmFtZSk7XG4gICAgICAgICAgICBpZiAoZXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXhpc3RpbmdMaW5lcyA9IGF3YWl0IGZpbGVTeXN0ZW0uZmlsZVJlYWRMaW5lcyhmb2xkZXIsIGZpbGVuYW1lKTtcbiAgICAgICAgICAgICAgICAvLyBUZXN0IHRoZSBsYXN0IGZldyBsaW5lcyBpbiBjYXNlIHRoZXJlIGFyZSBsaW5lIGJyZWFrc1xuICAgICAgICAgICAgICAgIGxldCBoYXNNYXJrZXIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBjb25zdCBtYXJrZXJMb3dlciA9IFBpcGVsaW5lU3RlcEJhc2UuTUFSS0VSLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gZXhpc3RpbmdMaW5lcy5sZW5ndGggLSAxOyBpID49IDAgJiYgaSA+PSBleGlzdGluZ0xpbmVzLmxlbmd0aCAtIDUgJiYgIWhhc01hcmtlcjsgaS0tKSB7XG4gICAgICAgICAgICAgICAgICAgIGhhc01hcmtlciA9IGV4aXN0aW5nTGluZXNbaV0udG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmluZGV4T2YobWFya2VyTG93ZXIpID49IDA7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbWFya2VyU3RhdGUgPSBoYXNNYXJrZXIgPyBcIkhhc01hcmtlclwiIDogXCJOb01hcmtlclwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG1hcmtlclN0YXRlO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBtYXJrZXJTdGF0ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaWxlUmVhZEpzb248VD4obG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgZm9sZGVyOiBzdHJpbmcsIGZpbGVuYW1lOiBzdHJpbmcsIGZvcmNlOiBib29sZWFuLCBqc29uQ2FsbGJhY2s6IChvYmo6IFQpID0+IFByb21pc2U8bnVtYmVyPik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGlmICghZm9yY2UpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXhpc3RzID0gYXdhaXQgZmlsZVN5c3RlbS5maWxlRXhpc3RzKGZvbGRlciwgZmlsZW5hbWUpO1xuICAgICAgICAgICAgICAgIGlmIChleGlzdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYFJlYWRpbmcgZXhpc3RpbmcgJHtmaWxlbmFtZX0gZnJvbSBgLCB7IGZvbGRlciB9KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb2JqID0gYXdhaXQgZmlsZVN5c3RlbS5maWxlUmVhZEpzb248VD4oZm9sZGVyLCBmaWxlbmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBqc29uQ2FsbGJhY2sob2JqKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ganNvbkNhbGxiYWNrKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBSZWFkaW5nIGV4aXN0aW5nICR7ZmlsZW5hbWV9IGZhaWxlZGAsIGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4ganNvbkNhbGxiYWNrKHVuZGVmaW5lZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlsZVJlYWRUZXh0KGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIGZvbGRlcjogc3RyaW5nLCBmaWxlbmFtZTogc3RyaW5nLCBmb3JjZTogYm9vbGVhbiwgdGV4dENhbGxiYWNrOiAodGV4dDogc3RyaW5nKSA9PiBQcm9taXNlPG51bWJlcj4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBpZiAoIWZvcmNlKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IGZpbGVTeXN0ZW0uZmlsZUV4aXN0cyhmb2xkZXIsIGZpbGVuYW1lKTtcbiAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBSZWFkaW5nIGV4aXN0aW5nICR7ZmlsZW5hbWV9IGZyb20gYCwgeyBmb2xkZXIgfSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRleHQgPSBhd2FpdCBmaWxlU3lzdGVtLmZpbGVSZWFkVGV4dChmb2xkZXIsIGZpbGVuYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRleHRDYWxsYmFjayh0ZXh0KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGV4dENhbGxiYWNrKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBSZWFkaW5nIGV4aXN0aW5nICR7ZmlsZW5hbWV9IGZhaWxlZGAsIGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGV4dENhbGxiYWNrKHVuZGVmaW5lZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlsZVJlYWRMaW5lcyhsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCBmb2xkZXI6IHN0cmluZywgZmlsZW5hbWU6IHN0cmluZywgZm9yY2U6IGJvb2xlYW4sIGxpbmVzQ2FsbGJhY2s6IChsaW5lczogc3RyaW5nW10pID0+IFByb21pc2U8bnVtYmVyPik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGlmICghZm9yY2UpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXhpc3RzID0gYXdhaXQgZmlsZVN5c3RlbS5maWxlRXhpc3RzKGZvbGRlciwgZmlsZW5hbWUpO1xuICAgICAgICAgICAgICAgIGlmIChleGlzdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYFJlYWRpbmcgZXhpc3RpbmcgJHtmaWxlbmFtZX0gZnJvbSBgLCB7IGZvbGRlciB9KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVhZExpbmVzID0gYXdhaXQgZmlsZVN5c3RlbS5maWxlUmVhZExpbmVzKGZvbGRlciwgZmlsZW5hbWUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGluZXNDYWxsYmFjayhyZWFkTGluZXMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsaW5lc0NhbGxiYWNrKFtdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoYFJlYWRpbmcgZXhpc3RpbmcgJHtmaWxlbmFtZX0gZmFpbGVkYCwgZXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBsaW5lc0NhbGxiYWNrKFtdKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaWxlVG9nZ2xlTGluZXMobG9nZ2VyOiBJTG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb2xkZXI6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVuYW1lOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JjZTogYm9vbGVhbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5Db25kaXRpb246IGJvb2xlYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lc0dlbmVyYXRvcjogKCkgPT4gUHJvbWlzZTxzdHJpbmdbXT4pOiBQcm9taXNlPG51bWJlcj4ge1xuXG4gICAgICAgIGlmIChtYWluQ29uZGl0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5maWxlV3JpdGVMaW5lcyhsb2dnZXIsIGZpbGVTeXN0ZW0sIGZvbGRlciwgZmlsZW5hbWUsIGZvcmNlLCBsaW5lc0dlbmVyYXRvcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5maWxlRGVsZXRlTGluZXMobG9nZ2VyLCBmaWxlU3lzdGVtLCBmb2xkZXIsIGZpbGVuYW1lLCBmb3JjZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlsZVRvZ2dsZVRleHQobG9nZ2VyOiBJTG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9sZGVyOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVuYW1lOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcmNlOiBib29sZWFuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29uZGl0aW9uOiBib29sZWFuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0R2VuZXJhdG9yOiAoKSA9PiBQcm9taXNlPHN0cmluZz4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBpZiAobWFpbkNvbmRpdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmlsZVdyaXRlVGV4dChsb2dnZXIsIGZpbGVTeXN0ZW0sIGZvbGRlciwgZmlsZW5hbWUsIGZvcmNlLCB0ZXh0R2VuZXJhdG9yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZpbGVEZWxldGVUZXh0KGxvZ2dlciwgZmlsZVN5c3RlbSwgZm9sZGVyLCBmaWxlbmFtZSwgZm9yY2UpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbGVUb2dnbGVKc29uKGxvZ2dlcjogSUxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbGRlcjogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlbmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JjZTogYm9vbGVhbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbkNvbmRpdGlvbjogYm9vbGVhbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAganNvbkdlbmVyYXRvcjogKCkgPT4gUHJvbWlzZTxhbnk+KTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgaWYgKG1haW5Db25kaXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZpbGVXcml0ZUpzb24obG9nZ2VyLCBmaWxlU3lzdGVtLCBmb2xkZXIsIGZpbGVuYW1lLCBmb3JjZSwganNvbkdlbmVyYXRvcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5maWxlRGVsZXRlSnNvbihsb2dnZXIsIGZpbGVTeXN0ZW0sIGZvbGRlciwgZmlsZW5hbWUsIGZvcmNlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaWxlV3JpdGVMaW5lcyhsb2dnZXI6IElMb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb2xkZXI6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZW5hbWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yY2U6IGJvb2xlYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzR2VuZXJhdG9yOiAoKSA9PiBQcm9taXNlPHN0cmluZ1tdPik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBoYXNHZW5lcmF0ZWRNYXJrZXIgPSBhd2FpdCB0aGlzLmZpbGVIYXNHZW5lcmF0ZWRNYXJrZXIoZmlsZVN5c3RlbSwgZm9sZGVyLCBmaWxlbmFtZSk7XG5cbiAgICAgICAgICAgIGlmIChoYXNHZW5lcmF0ZWRNYXJrZXIgPT09IFwiRmlsZU5vdEV4aXN0XCIgfHwgaGFzR2VuZXJhdGVkTWFya2VyID09PSBcIkhhc01hcmtlclwiIHx8IGZvcmNlKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYFdyaXRpbmcgJHtmaWxlbmFtZX0gaW4gYCwgeyBmb2xkZXIgfSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBsaW5lczogc3RyaW5nW10gPSBhd2FpdCBsaW5lc0dlbmVyYXRvcigpO1xuICAgICAgICAgICAgICAgIGF3YWl0IGZpbGVTeXN0ZW0uZmlsZVdyaXRlTGluZXMoZm9sZGVyLCBmaWxlbmFtZSwgbGluZXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgU2tpcHBpbmcgJHtmaWxlbmFtZX0gYXMgaXQgaGFzIG5vIGdlbmVyYXRlZCBtYXJrZXJgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBsb2dnZXIuZXJyb3IoYFdyaXRpbmcgJHtmaWxlbmFtZX0gZmFpbGVkYCwgZXJyKTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaWxlV3JpdGVUZXh0KGxvZ2dlcjogSUxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb2xkZXI6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlbmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcmNlOiBib29sZWFuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRHZW5lcmF0b3I6ICgpID0+IFByb21pc2U8c3RyaW5nPik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsb2dnZXIuaW5mbyhgV3JpdGluZyAke2ZpbGVuYW1lfSBpbiBgLCB7IGZvbGRlciB9KTtcblxuICAgICAgICAgICAgY29uc3QgdGV4dDogc3RyaW5nID0gYXdhaXQgdGV4dEdlbmVyYXRvcigpO1xuICAgICAgICAgICAgYXdhaXQgZmlsZVN5c3RlbS5maWxlV3JpdGVUZXh0KGZvbGRlciwgZmlsZW5hbWUsIHRleHQpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgV3JpdGluZyAke2ZpbGVuYW1lfSBmYWlsZWRgLCBlcnIpO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbGVXcml0ZUpzb24obG9nZ2VyOiBJTG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbGRlcjogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVuYW1lOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yY2U6IGJvb2xlYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAganNvbkdlbmVyYXRvcjogKCkgPT4gUHJvbWlzZTxhbnk+KTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBXcml0aW5nICR7ZmlsZW5hbWV9IGluIGAsIHsgZm9sZGVyIH0pO1xuXG4gICAgICAgICAgICBjb25zdCBvYmogPSBhd2FpdCBqc29uR2VuZXJhdG9yKCk7XG4gICAgICAgICAgICBhd2FpdCBmaWxlU3lzdGVtLmZpbGVXcml0ZUpzb24oZm9sZGVyLCBmaWxlbmFtZSwgb2JqKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBsb2dnZXIuZXJyb3IoYFdyaXRpbmcgJHtmaWxlbmFtZX0gZmFpbGVkYCwgZXJyKTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaWxlRGVsZXRlVGV4dChsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb2xkZXI6IHN0cmluZywgZmlsZW5hbWU6IHN0cmluZywgZm9yY2U6IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBjb25zdCBoYXNHZW5lcmF0ZWRNYXJrZXIgPSBhd2FpdCB0aGlzLmZpbGVIYXNHZW5lcmF0ZWRNYXJrZXIoZmlsZVN5c3RlbSwgZm9sZGVyLCBmaWxlbmFtZSk7XG5cbiAgICAgICAgaWYgKGhhc0dlbmVyYXRlZE1hcmtlciA9PT0gXCJIYXNNYXJrZXJcIiB8fCAoaGFzR2VuZXJhdGVkTWFya2VyICE9PSBcIkZpbGVOb3RFeGlzdFwiICYmIGZvcmNlKSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgRGVsZXRpbmcgJHtmaWxlbmFtZX1gLCB7IGZyb206IGZvbGRlciB9KTtcbiAgICAgICAgICAgICAgICBhd2FpdCBmaWxlU3lzdGVtLmZpbGVEZWxldGUoZm9sZGVyLCBmaWxlbmFtZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoYERlbGV0aW5nICR7ZmlsZW5hbWV9IGZhaWxlZGAsIGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoaGFzR2VuZXJhdGVkTWFya2VyID09PSBcIk5vTWFya2VyXCIpIHtcbiAgICAgICAgICAgIGxvZ2dlci53YXJuaW5nKGBTa2lwcGluZyBEZWxldGUgb2YgJHtmaWxlbmFtZX0gYXMgaXQgaGFzIG5vIGdlbmVyYXRlZCBtYXJrZXJgLCB7IGZyb206IGZvbGRlciB9KTtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlsZURlbGV0ZUxpbmVzKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb2xkZXI6IHN0cmluZywgZmlsZW5hbWU6IHN0cmluZywgZm9yY2U6IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBjb25zdCBoYXNHZW5lcmF0ZWRNYXJrZXIgPSBhd2FpdCB0aGlzLmZpbGVIYXNHZW5lcmF0ZWRNYXJrZXIoZmlsZVN5c3RlbSwgZm9sZGVyLCBmaWxlbmFtZSk7XG5cbiAgICAgICAgaWYgKGhhc0dlbmVyYXRlZE1hcmtlciA9PT0gXCJIYXNNYXJrZXJcIiB8fCAoaGFzR2VuZXJhdGVkTWFya2VyICE9PSBcIkZpbGVOb3RFeGlzdFwiICYmIGZvcmNlKSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgRGVsZXRpbmcgJHtmaWxlbmFtZX1gLCB7IGZyb206IGZvbGRlciB9KTtcbiAgICAgICAgICAgICAgICBhd2FpdCBmaWxlU3lzdGVtLmZpbGVEZWxldGUoZm9sZGVyLCBmaWxlbmFtZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoYERlbGV0aW5nICR7ZmlsZW5hbWV9IGZhaWxlZGAsIGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoaGFzR2VuZXJhdGVkTWFya2VyID09PSBcIk5vTWFya2VyXCIpIHtcbiAgICAgICAgICAgIGxvZ2dlci53YXJuaW5nKGBTa2lwcGluZyBEZWxldGUgb2YgJHtmaWxlbmFtZX0gYXMgaXQgaGFzIG5vIGdlbmVyYXRlZCBtYXJrZXJgLCB7IGZyb206IGZvbGRlciB9KTtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlsZURlbGV0ZUpzb24obG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9sZGVyOiBzdHJpbmcsIGZpbGVuYW1lOiBzdHJpbmcsIGZvcmNlOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IGZpbGVTeXN0ZW0uZmlsZUV4aXN0cyhmb2xkZXIsIGZpbGVuYW1lKTtcbiAgICAgICAgICAgIGlmIChleGlzdHMpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgRGVsZXRpbmcgJHtmaWxlbmFtZX1gLCB7IGZyb206IGZvbGRlciB9KTtcbiAgICAgICAgICAgICAgICBhd2FpdCBmaWxlU3lzdGVtLmZpbGVEZWxldGUoZm9sZGVyLCBmaWxlbmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBsb2dnZXIuZXJyb3IoYERlbGV0aW5nICR7ZmlsZW5hbWV9IGZhaWxlZGAsIGVycik7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBjb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uS2V5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHVuaXRlQ29uZmlndXJhdGlvbktleSAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb25LZXkgIT09IG51bGwgJiZcbiAgICAgICAgICAgIHZhbHVlICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICAgIHZhbHVlICE9PSBudWxsICYmXG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb25LZXkudG9Mb3dlckNhc2UoKSA9PT0gdmFsdWUudG9Mb3dlckNhc2UoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgb2JqZWN0Q29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbk9iamVjdDogYW55LCB2YWx1ZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB1bml0ZUNvbmZpZ3VyYXRpb25PYmplY3QgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uT2JqZWN0ICE9PSBudWxsICYmXG4gICAgICAgICAgICB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICB2YWx1ZSAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgT2JqZWN0LmtleXModW5pdGVDb25maWd1cmF0aW9uT2JqZWN0KVxuICAgICAgICAgICAgICAgIC5tYXAoa2V5ID0+IGtleS50b0xvd2VyQ2FzZSgpKVxuICAgICAgICAgICAgICAgIC5pbmRleE9mKHZhbHVlLnRvTG93ZXJDYXNlKCkpID49IDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFycmF5Q29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbkFycmF5OiBzdHJpbmdbXSwgdmFsdWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdW5pdGVDb25maWd1cmF0aW9uQXJyYXkgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uQXJyYXkgIT09IG51bGwgJiZcbiAgICAgICAgICAgIHZhbHVlICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICAgIHZhbHVlICE9PSBudWxsICYmXG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb25BcnJheVxuICAgICAgICAgICAgICAgIC5tYXAoa2V5ID0+IGtleS50b0xvd2VyQ2FzZSgpKVxuICAgICAgICAgICAgICAgIC5pbmRleE9mKHZhbHVlLnRvTG93ZXJDYXNlKCkpID49IDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGludGVybmFsRGVsZXRlRm9sZGVyKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbGRlcjogc3RyaW5nKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgbGV0IHJlbWFpbmluZyA9IDA7XG5cbiAgICAgICAgY29uc3Qgc3ViRGlycyA9IGF3YWl0IGZpbGVTeXN0ZW0uZGlyZWN0b3J5R2V0Rm9sZGVycyhmb2xkZXIpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN1YkRpcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHN1YkRpciA9IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZm9sZGVyLCBzdWJEaXJzW2ldKTtcbiAgICAgICAgICAgIGNvbnN0IGRpclJlbWFpbmluZyA9IGF3YWl0IHRoaXMuaW50ZXJuYWxEZWxldGVGb2xkZXIobG9nZ2VyLCBmaWxlU3lzdGVtLCBzdWJEaXIpO1xuXG4gICAgICAgICAgICBpZiAoZGlyUmVtYWluaW5nID09PSAwKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgZmlsZVN5c3RlbS5kaXJlY3RvcnlEZWxldGUoc3ViRGlyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVtYWluaW5nICs9IGRpclJlbWFpbmluZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZpbGVzID0gYXdhaXQgZmlsZVN5c3RlbS5kaXJlY3RvcnlHZXRGaWxlcyhmb2xkZXIpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBoYXNHZW5lcmF0ZWRNYXJrZXIgPSBhd2FpdCB0aGlzLmZpbGVIYXNHZW5lcmF0ZWRNYXJrZXIoZmlsZVN5c3RlbSwgZm9sZGVyLCBmaWxlc1tpXSk7XG5cbiAgICAgICAgICAgIGlmIChoYXNHZW5lcmF0ZWRNYXJrZXIgPT09IFwiTm9NYXJrZXJcIikge1xuICAgICAgICAgICAgICAgIHJlbWFpbmluZysrO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhd2FpdCBmaWxlU3lzdGVtLmZpbGVEZWxldGUoZm9sZGVyLCBmaWxlc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVtYWluaW5nO1xuICAgIH1cbn1cbiJdfQ==
