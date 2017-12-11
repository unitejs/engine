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
/**
 * File system class
 */
const fs = require("fs");
const os = require("os");
const path = require("path");
const jsonHelper_1 = require("unitejs-framework/dist/helpers/jsonHelper");
const util = require("util");
class FileSystemMock {
    pathCombine(pathName, additional) {
        if (pathName === null || pathName === undefined) {
            return this.cleanupSeparators(additional);
        }
        else if (additional === null || additional === undefined) {
            return this.cleanupSeparators(pathName);
        }
        else {
            return path.join(this.cleanupSeparators(pathName), this.cleanupSeparators(additional));
        }
    }
    pathDirectoryRelative(pathName1, pathName2) {
        if (pathName1 === null || pathName1 === undefined) {
            return pathName1;
        }
        else if (pathName2 === null || pathName2 === undefined) {
            return pathName2;
        }
        else {
            return `.${path.sep}${path.relative(pathName1, pathName2)}${path.sep}`;
        }
    }
    pathFileRelative(pathName1, pathName2) {
        if (pathName1 === null || pathName1 === undefined) {
            return pathName1;
        }
        else if (pathName2 === null || pathName2 === undefined) {
            return pathName2;
        }
        else {
            return `.${path.sep}${path.relative(pathName1, pathName2)}`;
        }
    }
    pathToWeb(pathName) {
        if (pathName === null || pathName === undefined) {
            return pathName;
        }
        else {
            return pathName.replace(/\\/g, "/");
        }
    }
    pathAbsolute(pathName) {
        if (pathName === undefined || pathName === null) {
            return pathName;
        }
        else {
            return path.resolve(this.cleanupSeparators(pathName));
        }
    }
    pathGetDirectory(pathName) {
        if (pathName === undefined || pathName === null) {
            return pathName;
        }
        else {
            let newPathName = this.cleanupSeparators(pathName);
            if (!/.*\.(.*)$/.test(newPathName)) {
                newPathName = path.join(newPathName, "dummy.file");
            }
            return path.dirname(newPathName) + path.sep;
        }
    }
    pathGetFilename(pathName) {
        if (pathName === undefined || pathName === null) {
            return pathName;
        }
        else {
            const newPathName = this.cleanupSeparators(pathName);
            if (/[\/\\]+$/.test(newPathName)) {
                return undefined;
            }
            else {
                return path.basename(newPathName);
            }
        }
    }
    directoryExists(directoryName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (directoryName === undefined || directoryName === null) {
                return false;
            }
            else {
                try {
                    const stats = yield util.promisify(fs.lstat)(this.cleanupSeparators(directoryName));
                    return stats.isDirectory() || stats.isSymbolicLink();
                }
                catch (err) {
                    if (err.code === "ENOENT") {
                        return false;
                    }
                    else {
                        throw err;
                    }
                }
            }
        });
    }
    directoryCreate(directoryName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (directoryName !== undefined && directoryName !== null) {
                const parts = this.cleanupSeparators(directoryName).split(path.sep);
                for (let i = 0; i < parts.length; i++) {
                    const dName = parts.slice(0, i + 1).join(path.sep);
                    const dirExists = yield this.directoryExists(dName);
                    if (!dirExists) {
                        yield util.promisify(fs.mkdir)(dName);
                    }
                }
            }
        });
    }
    directoryDelete(directoryName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (directoryName !== undefined && directoryName !== null) {
                const newDirectoryName = this.cleanupSeparators(directoryName);
                const dirExists = yield this.directoryExists(newDirectoryName);
                if (dirExists) {
                    const files = yield util.promisify(fs.readdir)(newDirectoryName);
                    for (let i = 0; i < files.length; i++) {
                        const curPath = path.join(newDirectoryName, files[i]);
                        const stat = yield util.promisify(fs.lstat)(curPath);
                        if (stat.isDirectory()) {
                            yield this.directoryDelete(curPath);
                        }
                        else {
                            yield util.promisify(fs.unlink)(curPath);
                        }
                    }
                    return util.promisify(fs.rmdir)(newDirectoryName);
                }
            }
        });
    }
    directoryGetFiles(directoryName) {
        return __awaiter(this, void 0, void 0, function* () {
            const dirFiles = [];
            if (directoryName !== undefined && directoryName !== null) {
                const newDirectoryName = this.cleanupSeparators(directoryName);
                const dirExists = yield this.directoryExists(newDirectoryName);
                if (dirExists) {
                    const files = yield util.promisify(fs.readdir)(newDirectoryName);
                    for (let i = 0; i < files.length; i++) {
                        const curPath = path.join(newDirectoryName, files[i]);
                        const stat = yield util.promisify(fs.lstat)(curPath);
                        if (stat.isFile()) {
                            dirFiles.push(files[i]);
                        }
                    }
                }
            }
            return dirFiles;
        });
    }
    directoryGetFolders(directoryName) {
        return __awaiter(this, void 0, void 0, function* () {
            const dirFolders = [];
            if (directoryName !== undefined && directoryName !== null) {
                const newDirectoryName = this.cleanupSeparators(directoryName);
                const dirExists = yield this.directoryExists(newDirectoryName);
                if (dirExists) {
                    const files = yield util.promisify(fs.readdir)(newDirectoryName);
                    for (let i = 0; i < files.length; i++) {
                        const curPath = path.join(newDirectoryName, files[i]);
                        const stat = yield util.promisify(fs.lstat)(curPath);
                        if (stat.isDirectory()) {
                            dirFolders.push(files[i]);
                        }
                    }
                }
            }
            return dirFolders;
        });
    }
    fileExists(directoryName, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (directoryName === undefined || directoryName === null ||
                fileName === undefined || fileName === null) {
                return false;
            }
            else {
                try {
                    const stat = yield util.promisify(fs.lstat)(path.join(this.cleanupSeparators(directoryName), fileName));
                    return stat.isFile();
                }
                catch (err) {
                    if (err.code === "ENOENT") {
                        return false;
                    }
                    else {
                        throw err;
                    }
                }
            }
        });
    }
    fileWriteText(directoryName, fileName, content, append) {
        return __awaiter(this, void 0, void 0, function* () {
            if (directoryName !== undefined && directoryName !== null &&
                fileName !== undefined && fileName !== null &&
                content !== undefined && content !== null) {
                return util.promisify(append ? fs.appendFile : fs.writeFile)(path.join(this.cleanupSeparators(directoryName), fileName), content);
            }
        });
    }
    fileWriteLines(directoryName, fileName, lines, append) {
        return __awaiter(this, void 0, void 0, function* () {
            if (directoryName !== undefined && directoryName !== null &&
                fileName !== undefined && fileName !== null &&
                lines !== undefined && lines !== null) {
                return util.promisify(append ? fs.appendFile : fs.writeFile)(path.join(this.cleanupSeparators(directoryName), fileName), lines.join(os.EOL) + os.EOL);
            }
        });
    }
    fileWriteBinary(directoryName, fileName, data, append) {
        return __awaiter(this, void 0, void 0, function* () {
            if (directoryName !== undefined && directoryName !== null &&
                fileName !== undefined && fileName !== null &&
                data !== undefined && data !== null) {
                return util.promisify(append ? fs.appendFile : fs.writeFile)(path.join(this.cleanupSeparators(directoryName), fileName), data);
            }
        });
    }
    fileWriteJson(directoryName, fileName, object) {
        return __awaiter(this, void 0, void 0, function* () {
            if (directoryName !== undefined && directoryName !== null &&
                fileName !== undefined && fileName !== null &&
                object !== undefined && object !== null) {
                return util.promisify(fs.writeFile)(path.join(this.cleanupSeparators(directoryName), fileName), jsonHelper_1.JsonHelper.stringify(object, "\t"));
            }
        });
    }
    fileReadText(directoryName, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (directoryName === undefined || directoryName === null ||
                fileName === undefined || fileName === null) {
                return undefined;
            }
            else {
                const data = yield util.promisify(fs.readFile)(path.join(this.cleanupSeparators(directoryName), fileName));
                return data.toString();
            }
        });
    }
    fileReadLines(directoryName, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (directoryName === undefined || directoryName === null ||
                fileName === undefined || fileName === null) {
                return undefined;
            }
            else {
                const data = yield util.promisify(fs.readFile)(path.join(this.cleanupSeparators(directoryName), fileName));
                return data.toString().replace(/\r/g, "").split("\n");
            }
        });
    }
    fileReadBinary(directoryName, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (directoryName === undefined || directoryName === null ||
                fileName === undefined || fileName === null) {
                return undefined;
            }
            else {
                return util.promisify(fs.readFile)(path.join(this.cleanupSeparators(directoryName), fileName));
            }
        });
    }
    fileReadJson(directoryName, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (directoryName === undefined || directoryName === null ||
                fileName === undefined || fileName === null) {
                return undefined;
            }
            else {
                const data = yield util.promisify(fs.readFile)(path.join(this.cleanupSeparators(directoryName), fileName));
                return JSON.parse(data.toString());
            }
        });
    }
    fileDelete(directoryName, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (directoryName === undefined || directoryName === null ||
                fileName === undefined || fileName === null) {
                return undefined;
            }
            else {
                return util.promisify(fs.unlink)(path.join(this.cleanupSeparators(directoryName), fileName));
            }
        });
    }
    cleanupSeparators(pathName) {
        if (pathName === undefined || pathName === null) {
            return pathName;
        }
        else {
            return path.normalize(pathName);
        }
    }
}
exports.FileSystemMock = FileSystemMock;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvZmlsZVN5c3RlbS5tb2NrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILHlCQUF5QjtBQUN6Qix5QkFBeUI7QUFDekIsNkJBQTZCO0FBQzdCLDBFQUF1RTtBQUV2RSw2QkFBNkI7QUFFN0I7SUFDVyxXQUFXLENBQUMsUUFBZ0IsRUFBRSxVQUFrQjtRQUNuRCxFQUFFLENBQUMsQ0FBQyxRQUFRLEtBQUssSUFBSSxJQUFJLFFBQVEsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQzlDLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDOUMsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxVQUFVLEtBQUssSUFBSSxJQUFJLFVBQVUsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3pELE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDNUMsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQzNGLENBQUM7SUFDTCxDQUFDO0lBRU0scUJBQXFCLENBQUMsU0FBaUIsRUFBRSxTQUFpQjtRQUM3RCxFQUFFLENBQUMsQ0FBQyxTQUFTLEtBQUssSUFBSSxJQUFJLFNBQVMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2hELE1BQU0sQ0FBQyxTQUFTLENBQUM7UUFDckIsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLEtBQUssSUFBSSxJQUFJLFNBQVMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3ZELE1BQU0sQ0FBQyxTQUFTLENBQUM7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QyxhQUFxQixFQUFFLFFBQWdCOztZQUMzRCxFQUFFLENBQUMsQ0FBQyxhQUFhLEtBQUssU0FBUyxJQUFJLGFBQWEsS0FBSyxJQUFJO2dCQUNyRCxRQUFRLEtBQUssU0FBUyxJQUFJLFFBQVEsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUM5QyxNQUFNLENBQUMsU0FBUyxDQUFDO1lBQ3JCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsYUFBYSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNqRyxDQUFDO1FBQ0wsQ0FBQztLQUFBO0lBRU8saUJBQWlCLENBQUMsUUFBZ0I7UUFDdEMsRUFBRSxDQUFDLENBQUMsUUFBUSxLQUFLLFNBQVMsSUFBSSxRQUFRLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztZQUM5QyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ3BCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3BDLENBQUM7SUFDTCxDQUFDO0NBQ0o7QUFwUkQsd0NBb1JDIiwiZmlsZSI6ImZpbGVTeXN0ZW0ubW9jay5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogRmlsZSBzeXN0ZW0gY2xhc3NcbiAqL1xuaW1wb3J0ICogYXMgZnMgZnJvbSBcImZzXCI7XG5pbXBvcnQgKiBhcyBvcyBmcm9tIFwib3NcIjtcbmltcG9ydCAqIGFzIHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IEpzb25IZWxwZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL2pzb25IZWxwZXJcIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tIFwidXRpbFwiO1xuXG5leHBvcnQgY2xhc3MgRmlsZVN5c3RlbU1vY2sgaW1wbGVtZW50cyBJRmlsZVN5c3RlbSB7XG4gICAgcHVibGljIHBhdGhDb21iaW5lKHBhdGhOYW1lOiBzdHJpbmcsIGFkZGl0aW9uYWw6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGlmIChwYXRoTmFtZSA9PT0gbnVsbCB8fCBwYXRoTmFtZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jbGVhbnVwU2VwYXJhdG9ycyhhZGRpdGlvbmFsKTtcbiAgICAgICAgfSBlbHNlIGlmIChhZGRpdGlvbmFsID09PSBudWxsIHx8IGFkZGl0aW9uYWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xlYW51cFNlcGFyYXRvcnMocGF0aE5hbWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHBhdGguam9pbih0aGlzLmNsZWFudXBTZXBhcmF0b3JzKHBhdGhOYW1lKSwgdGhpcy5jbGVhbnVwU2VwYXJhdG9ycyhhZGRpdGlvbmFsKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgcGF0aERpcmVjdG9yeVJlbGF0aXZlKHBhdGhOYW1lMTogc3RyaW5nLCBwYXRoTmFtZTI6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGlmIChwYXRoTmFtZTEgPT09IG51bGwgfHwgcGF0aE5hbWUxID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXRoTmFtZTE7XG4gICAgICAgIH0gZWxzZSBpZiAocGF0aE5hbWUyID09PSBudWxsIHx8IHBhdGhOYW1lMiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gcGF0aE5hbWUyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGAuJHtwYXRoLnNlcH0ke3BhdGgucmVsYXRpdmUocGF0aE5hbWUxLCBwYXRoTmFtZTIpfSR7cGF0aC5zZXB9YDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBwYXRoRmlsZVJlbGF0aXZlKHBhdGhOYW1lMTogc3RyaW5nLCBwYXRoTmFtZTI6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGlmIChwYXRoTmFtZTEgPT09IG51bGwgfHwgcGF0aE5hbWUxID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXRoTmFtZTE7XG4gICAgICAgIH0gZWxzZSBpZiAocGF0aE5hbWUyID09PSBudWxsIHx8IHBhdGhOYW1lMiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gcGF0aE5hbWUyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGAuJHtwYXRoLnNlcH0ke3BhdGgucmVsYXRpdmUocGF0aE5hbWUxLCBwYXRoTmFtZTIpfWA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgcGF0aFRvV2ViKHBhdGhOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBpZiAocGF0aE5hbWUgPT09IG51bGwgfHwgcGF0aE5hbWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHBhdGhOYW1lO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHBhdGhOYW1lLnJlcGxhY2UoL1xcXFwvZywgXCIvXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHBhdGhBYnNvbHV0ZShwYXRoTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKHBhdGhOYW1lID09PSB1bmRlZmluZWQgfHwgcGF0aE5hbWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXRoTmFtZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBwYXRoLnJlc29sdmUodGhpcy5jbGVhbnVwU2VwYXJhdG9ycyhwYXRoTmFtZSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHBhdGhHZXREaXJlY3RvcnkocGF0aE5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGlmIChwYXRoTmFtZSA9PT0gdW5kZWZpbmVkIHx8IHBhdGhOYW1lID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gcGF0aE5hbWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgbmV3UGF0aE5hbWUgPSB0aGlzLmNsZWFudXBTZXBhcmF0b3JzKHBhdGhOYW1lKTtcbiAgICAgICAgICAgIGlmICghLy4qXFwuKC4qKSQvLnRlc3QobmV3UGF0aE5hbWUpKSB7XG4gICAgICAgICAgICAgICAgbmV3UGF0aE5hbWUgPSBwYXRoLmpvaW4obmV3UGF0aE5hbWUsIFwiZHVtbXkuZmlsZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBwYXRoLmRpcm5hbWUobmV3UGF0aE5hbWUpICsgcGF0aC5zZXA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgcGF0aEdldEZpbGVuYW1lKHBhdGhOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBpZiAocGF0aE5hbWUgPT09IHVuZGVmaW5lZCB8fCBwYXRoTmFtZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHBhdGhOYW1lO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgbmV3UGF0aE5hbWUgPSB0aGlzLmNsZWFudXBTZXBhcmF0b3JzKHBhdGhOYW1lKTtcbiAgICAgICAgICAgIGlmICgvW1xcL1xcXFxdKyQvLnRlc3QobmV3UGF0aE5hbWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhdGguYmFzZW5hbWUobmV3UGF0aE5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGRpcmVjdG9yeUV4aXN0cyhkaXJlY3RvcnlOYW1lOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgaWYgKGRpcmVjdG9yeU5hbWUgPT09IHVuZGVmaW5lZCB8fCBkaXJlY3RvcnlOYW1lID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXRzID0gYXdhaXQgdXRpbC5wcm9taXNpZnkoZnMubHN0YXQpKHRoaXMuY2xlYW51cFNlcGFyYXRvcnMoZGlyZWN0b3J5TmFtZSkpO1xuICAgICAgICAgICAgICAgIHJldHVybiBzdGF0cy5pc0RpcmVjdG9yeSgpIHx8IHN0YXRzLmlzU3ltYm9saWNMaW5rKCk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyLmNvZGUgPT09IFwiRU5PRU5UXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZGlyZWN0b3J5Q3JlYXRlKGRpcmVjdG9yeU5hbWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBpZiAoZGlyZWN0b3J5TmFtZSAhPT0gdW5kZWZpbmVkICYmIGRpcmVjdG9yeU5hbWUgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnN0IHBhcnRzID0gdGhpcy5jbGVhbnVwU2VwYXJhdG9ycyhkaXJlY3RvcnlOYW1lKS5zcGxpdChwYXRoLnNlcCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZE5hbWUgPSBwYXJ0cy5zbGljZSgwLCBpICsgMSkuam9pbihwYXRoLnNlcCk7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlyRXhpc3RzID0gYXdhaXQgdGhpcy5kaXJlY3RvcnlFeGlzdHMoZE5hbWUpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFkaXJFeGlzdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdXRpbC5wcm9taXNpZnkoZnMubWtkaXIpKGROYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZGlyZWN0b3J5RGVsZXRlKGRpcmVjdG9yeU5hbWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBpZiAoZGlyZWN0b3J5TmFtZSAhPT0gdW5kZWZpbmVkICYmIGRpcmVjdG9yeU5hbWUgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnN0IG5ld0RpcmVjdG9yeU5hbWUgPSB0aGlzLmNsZWFudXBTZXBhcmF0b3JzKGRpcmVjdG9yeU5hbWUpO1xuXG4gICAgICAgICAgICBjb25zdCBkaXJFeGlzdHMgPSBhd2FpdCB0aGlzLmRpcmVjdG9yeUV4aXN0cyhuZXdEaXJlY3RvcnlOYW1lKTtcbiAgICAgICAgICAgIGlmIChkaXJFeGlzdHMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWxlcyA9IGF3YWl0IHV0aWwucHJvbWlzaWZ5KGZzLnJlYWRkaXIpKG5ld0RpcmVjdG9yeU5hbWUpO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VyUGF0aCA9IHBhdGguam9pbihuZXdEaXJlY3RvcnlOYW1lLCBmaWxlc1tpXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3RhdCA9IGF3YWl0IHV0aWwucHJvbWlzaWZ5KGZzLmxzdGF0KShjdXJQYXRoKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdC5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmRpcmVjdG9yeURlbGV0ZShjdXJQYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHV0aWwucHJvbWlzaWZ5KGZzLnVubGluaykoY3VyUGF0aCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdXRpbC5wcm9taXNpZnkoZnMucm1kaXIpKG5ld0RpcmVjdG9yeU5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGRpcmVjdG9yeUdldEZpbGVzKGRpcmVjdG9yeU5hbWU6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nW10+IHtcbiAgICAgICAgY29uc3QgZGlyRmlsZXMgPSBbXTtcbiAgICAgICAgaWYgKGRpcmVjdG9yeU5hbWUgIT09IHVuZGVmaW5lZCAmJiBkaXJlY3RvcnlOYW1lICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zdCBuZXdEaXJlY3RvcnlOYW1lID0gdGhpcy5jbGVhbnVwU2VwYXJhdG9ycyhkaXJlY3RvcnlOYW1lKTtcblxuICAgICAgICAgICAgY29uc3QgZGlyRXhpc3RzID0gYXdhaXQgdGhpcy5kaXJlY3RvcnlFeGlzdHMobmV3RGlyZWN0b3J5TmFtZSk7XG4gICAgICAgICAgICBpZiAoZGlyRXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZmlsZXMgPSBhd2FpdCB1dGlsLnByb21pc2lmeShmcy5yZWFkZGlyKShuZXdEaXJlY3RvcnlOYW1lKTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1clBhdGggPSBwYXRoLmpvaW4obmV3RGlyZWN0b3J5TmFtZSwgZmlsZXNbaV0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0YXQgPSBhd2FpdCB1dGlsLnByb21pc2lmeShmcy5sc3RhdCkoY3VyUGF0aCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXQuaXNGaWxlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpckZpbGVzLnB1c2goZmlsZXNbaV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkaXJGaWxlcztcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZGlyZWN0b3J5R2V0Rm9sZGVycyhkaXJlY3RvcnlOYW1lOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZ1tdPiB7XG4gICAgICAgIGNvbnN0IGRpckZvbGRlcnMgPSBbXTtcbiAgICAgICAgaWYgKGRpcmVjdG9yeU5hbWUgIT09IHVuZGVmaW5lZCAmJiBkaXJlY3RvcnlOYW1lICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zdCBuZXdEaXJlY3RvcnlOYW1lID0gdGhpcy5jbGVhbnVwU2VwYXJhdG9ycyhkaXJlY3RvcnlOYW1lKTtcblxuICAgICAgICAgICAgY29uc3QgZGlyRXhpc3RzID0gYXdhaXQgdGhpcy5kaXJlY3RvcnlFeGlzdHMobmV3RGlyZWN0b3J5TmFtZSk7XG4gICAgICAgICAgICBpZiAoZGlyRXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZmlsZXMgPSBhd2FpdCB1dGlsLnByb21pc2lmeShmcy5yZWFkZGlyKShuZXdEaXJlY3RvcnlOYW1lKTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1clBhdGggPSBwYXRoLmpvaW4obmV3RGlyZWN0b3J5TmFtZSwgZmlsZXNbaV0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0YXQgPSBhd2FpdCB1dGlsLnByb21pc2lmeShmcy5sc3RhdCkoY3VyUGF0aCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXQuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlyRm9sZGVycy5wdXNoKGZpbGVzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGlyRm9sZGVycztcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlsZUV4aXN0cyhkaXJlY3RvcnlOYW1lOiBzdHJpbmcsIGZpbGVOYW1lOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgaWYgKGRpcmVjdG9yeU5hbWUgPT09IHVuZGVmaW5lZCB8fCBkaXJlY3RvcnlOYW1lID09PSBudWxsIHx8XG4gICAgICAgICAgICBmaWxlTmFtZSA9PT0gdW5kZWZpbmVkIHx8IGZpbGVOYW1lID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXQgPSBhd2FpdCB1dGlsLnByb21pc2lmeShmcy5sc3RhdCkocGF0aC5qb2luKHRoaXMuY2xlYW51cFNlcGFyYXRvcnMoZGlyZWN0b3J5TmFtZSksIGZpbGVOYW1lKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0YXQuaXNGaWxlKCk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyLmNvZGUgPT09IFwiRU5PRU5UXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlsZVdyaXRlVGV4dChkaXJlY3RvcnlOYW1lOiBzdHJpbmcsIGZpbGVOYW1lOiBzdHJpbmcsIGNvbnRlbnQ6IHN0cmluZywgYXBwZW5kPzogYm9vbGVhbik6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBpZiAoZGlyZWN0b3J5TmFtZSAhPT0gdW5kZWZpbmVkICYmIGRpcmVjdG9yeU5hbWUgIT09IG51bGwgJiZcbiAgICAgICAgICAgIGZpbGVOYW1lICE9PSB1bmRlZmluZWQgJiYgZmlsZU5hbWUgIT09IG51bGwgJiZcbiAgICAgICAgICAgIGNvbnRlbnQgIT09IHVuZGVmaW5lZCAmJiBjb250ZW50ICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gdXRpbC5wcm9taXNpZnkoYXBwZW5kID8gZnMuYXBwZW5kRmlsZSA6IGZzLndyaXRlRmlsZSkocGF0aC5qb2luKHRoaXMuY2xlYW51cFNlcGFyYXRvcnMoZGlyZWN0b3J5TmFtZSksIGZpbGVOYW1lKSwgY29udGVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlsZVdyaXRlTGluZXMoZGlyZWN0b3J5TmFtZTogc3RyaW5nLCBmaWxlTmFtZTogc3RyaW5nLCBsaW5lczogc3RyaW5nW10sIGFwcGVuZD86IGJvb2xlYW4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgaWYgKGRpcmVjdG9yeU5hbWUgIT09IHVuZGVmaW5lZCAmJiBkaXJlY3RvcnlOYW1lICE9PSBudWxsICYmXG4gICAgICAgICAgICBmaWxlTmFtZSAhPT0gdW5kZWZpbmVkICYmIGZpbGVOYW1lICE9PSBudWxsICYmXG4gICAgICAgICAgICBsaW5lcyAhPT0gdW5kZWZpbmVkICYmIGxpbmVzICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gdXRpbC5wcm9taXNpZnkoYXBwZW5kID8gZnMuYXBwZW5kRmlsZSA6IGZzLndyaXRlRmlsZSkocGF0aC5qb2luKHRoaXMuY2xlYW51cFNlcGFyYXRvcnMoZGlyZWN0b3J5TmFtZSksIGZpbGVOYW1lKSwgbGluZXMuam9pbihvcy5FT0wpICsgb3MuRU9MKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaWxlV3JpdGVCaW5hcnkoZGlyZWN0b3J5TmFtZTogc3RyaW5nLCBmaWxlTmFtZTogc3RyaW5nLCBkYXRhOiBVaW50OEFycmF5LCBhcHBlbmQ/OiBib29sZWFuKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGlmIChkaXJlY3RvcnlOYW1lICE9PSB1bmRlZmluZWQgJiYgZGlyZWN0b3J5TmFtZSAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgZmlsZU5hbWUgIT09IHVuZGVmaW5lZCAmJiBmaWxlTmFtZSAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgZGF0YSAhPT0gdW5kZWZpbmVkICYmIGRhdGEgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB1dGlsLnByb21pc2lmeShhcHBlbmQgPyBmcy5hcHBlbmRGaWxlIDogZnMud3JpdGVGaWxlKShwYXRoLmpvaW4odGhpcy5jbGVhbnVwU2VwYXJhdG9ycyhkaXJlY3RvcnlOYW1lKSwgZmlsZU5hbWUpLCBkYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaWxlV3JpdGVKc29uKGRpcmVjdG9yeU5hbWU6IHN0cmluZywgZmlsZU5hbWU6IHN0cmluZywgb2JqZWN0OiBhbnkpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgaWYgKGRpcmVjdG9yeU5hbWUgIT09IHVuZGVmaW5lZCAmJiBkaXJlY3RvcnlOYW1lICE9PSBudWxsICYmXG4gICAgICAgICAgICBmaWxlTmFtZSAhPT0gdW5kZWZpbmVkICYmIGZpbGVOYW1lICE9PSBudWxsICYmXG4gICAgICAgICAgICBvYmplY3QgIT09IHVuZGVmaW5lZCAmJiBvYmplY3QgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB1dGlsLnByb21pc2lmeShmcy53cml0ZUZpbGUpKHBhdGguam9pbih0aGlzLmNsZWFudXBTZXBhcmF0b3JzKGRpcmVjdG9yeU5hbWUpLCBmaWxlTmFtZSksIEpzb25IZWxwZXIuc3RyaW5naWZ5KG9iamVjdCwgXCJcXHRcIikpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbGVSZWFkVGV4dChkaXJlY3RvcnlOYW1lOiBzdHJpbmcsIGZpbGVOYW1lOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgICAgICBpZiAoZGlyZWN0b3J5TmFtZSA9PT0gdW5kZWZpbmVkIHx8IGRpcmVjdG9yeU5hbWUgPT09IG51bGwgfHxcbiAgICAgICAgICAgIGZpbGVOYW1lID09PSB1bmRlZmluZWQgfHwgZmlsZU5hbWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgdXRpbC5wcm9taXNpZnkoZnMucmVhZEZpbGUpKHBhdGguam9pbih0aGlzLmNsZWFudXBTZXBhcmF0b3JzKGRpcmVjdG9yeU5hbWUpLCBmaWxlTmFtZSkpO1xuICAgICAgICAgICAgcmV0dXJuIGRhdGEudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaWxlUmVhZExpbmVzKGRpcmVjdG9yeU5hbWU6IHN0cmluZywgZmlsZU5hbWU6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nW10+IHtcbiAgICAgICAgaWYgKGRpcmVjdG9yeU5hbWUgPT09IHVuZGVmaW5lZCB8fCBkaXJlY3RvcnlOYW1lID09PSBudWxsIHx8XG4gICAgICAgICAgICBmaWxlTmFtZSA9PT0gdW5kZWZpbmVkIHx8IGZpbGVOYW1lID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHV0aWwucHJvbWlzaWZ5KGZzLnJlYWRGaWxlKShwYXRoLmpvaW4odGhpcy5jbGVhbnVwU2VwYXJhdG9ycyhkaXJlY3RvcnlOYW1lKSwgZmlsZU5hbWUpKTtcbiAgICAgICAgICAgIHJldHVybiBkYXRhLnRvU3RyaW5nKCkucmVwbGFjZSgvXFxyL2csIFwiXCIpLnNwbGl0KFwiXFxuXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbGVSZWFkQmluYXJ5KGRpcmVjdG9yeU5hbWU6IHN0cmluZywgZmlsZU5hbWU6IHN0cmluZyk6IFByb21pc2U8VWludDhBcnJheT4ge1xuICAgICAgICBpZiAoZGlyZWN0b3J5TmFtZSA9PT0gdW5kZWZpbmVkIHx8IGRpcmVjdG9yeU5hbWUgPT09IG51bGwgfHxcbiAgICAgICAgICAgIGZpbGVOYW1lID09PSB1bmRlZmluZWQgfHwgZmlsZU5hbWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdXRpbC5wcm9taXNpZnkoZnMucmVhZEZpbGUpKHBhdGguam9pbih0aGlzLmNsZWFudXBTZXBhcmF0b3JzKGRpcmVjdG9yeU5hbWUpLCBmaWxlTmFtZSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbGVSZWFkSnNvbjxUPihkaXJlY3RvcnlOYW1lOiBzdHJpbmcsIGZpbGVOYW1lOiBzdHJpbmcpOiBQcm9taXNlPFQ+IHtcbiAgICAgICAgaWYgKGRpcmVjdG9yeU5hbWUgPT09IHVuZGVmaW5lZCB8fCBkaXJlY3RvcnlOYW1lID09PSBudWxsIHx8XG4gICAgICAgICAgICBmaWxlTmFtZSA9PT0gdW5kZWZpbmVkIHx8IGZpbGVOYW1lID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHV0aWwucHJvbWlzaWZ5KGZzLnJlYWRGaWxlKShwYXRoLmpvaW4odGhpcy5jbGVhbnVwU2VwYXJhdG9ycyhkaXJlY3RvcnlOYW1lKSwgZmlsZU5hbWUpKTtcbiAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKGRhdGEudG9TdHJpbmcoKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlsZURlbGV0ZShkaXJlY3RvcnlOYW1lOiBzdHJpbmcsIGZpbGVOYW1lOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgaWYgKGRpcmVjdG9yeU5hbWUgPT09IHVuZGVmaW5lZCB8fCBkaXJlY3RvcnlOYW1lID09PSBudWxsIHx8XG4gICAgICAgICAgICBmaWxlTmFtZSA9PT0gdW5kZWZpbmVkIHx8IGZpbGVOYW1lID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHV0aWwucHJvbWlzaWZ5KGZzLnVubGluaykocGF0aC5qb2luKHRoaXMuY2xlYW51cFNlcGFyYXRvcnMoZGlyZWN0b3J5TmFtZSksIGZpbGVOYW1lKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNsZWFudXBTZXBhcmF0b3JzKHBhdGhOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBpZiAocGF0aE5hbWUgPT09IHVuZGVmaW5lZCB8fCBwYXRoTmFtZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHBhdGhOYW1lO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHBhdGgubm9ybWFsaXplKHBhdGhOYW1lKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==
