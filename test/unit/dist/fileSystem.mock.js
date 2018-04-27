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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvZmlsZVN5c3RlbS5tb2NrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILHlCQUF5QjtBQUN6Qix5QkFBeUI7QUFDekIsNkJBQTZCO0FBQzdCLDBFQUF1RTtBQUV2RSw2QkFBNkI7QUFFN0I7SUFDVyxXQUFXLENBQUMsUUFBZ0IsRUFBRSxVQUFrQjtRQUNuRCxJQUFJLFFBQVEsS0FBSyxJQUFJLElBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTtZQUM3QyxPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUM3QzthQUFNLElBQUksVUFBVSxLQUFLLElBQUksSUFBSSxVQUFVLEtBQUssU0FBUyxFQUFFO1lBQ3hELE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQzNDO2FBQU07WUFDSCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1NBQzFGO0lBQ0wsQ0FBQztJQUVNLHFCQUFxQixDQUFDLFNBQWlCLEVBQUUsU0FBaUI7UUFDN0QsSUFBSSxTQUFTLEtBQUssSUFBSSxJQUFJLFNBQVMsS0FBSyxTQUFTLEVBQUU7WUFDL0MsT0FBTyxTQUFTLENBQUM7U0FDcEI7YUFBTSxJQUFJLFNBQVMsS0FBSyxJQUFJLElBQUksU0FBUyxLQUFLLFNBQVMsRUFBRTtZQUN0RCxPQUFPLFNBQVMsQ0FBQztTQUNwQjthQUFNO1lBQ0gsT0FBTyxJQUFJLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1NBQzFFO0lBQ0wsQ0FBQztJQUVNLGdCQUFnQixDQUFDLFNBQWlCLEVBQUUs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QUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGFBQWEsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQzNHLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQzthQUN0QztRQUNMLENBQUM7S0FBQTtJQUVZLFVBQVUsQ0FBQyxhQUFxQixFQUFFLFFBQWdCOztZQUMzRCxJQUFJLGFBQWEsS0FBSyxTQUFTLElBQUksYUFBYSxLQUFLLElBQUk7Z0JBQ3JELFFBQVEsS0FBSyxTQUFTLElBQUksUUFBUSxLQUFLLElBQUksRUFBRTtnQkFDN0MsT0FBTyxTQUFTLENBQUM7YUFDcEI7aUJBQU07Z0JBQ0gsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO2FBQ2hHO1FBQ0wsQ0FBQztLQUFBO0lBRU8saUJBQWlCLENBQUMsUUFBZ0I7UUFDdEMsSUFBSSxRQUFRLEtBQUssU0FBUyxJQUFJLFFBQVEsS0FBSyxJQUFJLEVBQUU7WUFDN0MsT0FBTyxRQUFRLENBQUM7U0FDbkI7YUFBTTtZQUNILE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUNuQztJQUNMLENBQUM7Q0FDSjtBQXBSRCx3Q0FvUkMiLCJmaWxlIjoiZmlsZVN5c3RlbS5tb2NrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBGaWxlIHN5c3RlbSBjbGFzc1xuICovXG5pbXBvcnQgKiBhcyBmcyBmcm9tIFwiZnNcIjtcbmltcG9ydCAqIGFzIG9zIGZyb20gXCJvc1wiO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgSnNvbkhlbHBlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvanNvbkhlbHBlclwiO1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gXCJ1dGlsXCI7XG5cbmV4cG9ydCBjbGFzcyBGaWxlU3lzdGVtTW9jayBpbXBsZW1lbnRzIElGaWxlU3lzdGVtIHtcbiAgICBwdWJsaWMgcGF0aENvbWJpbmUocGF0aE5hbWU6IHN0cmluZywgYWRkaXRpb25hbDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKHBhdGhOYW1lID09PSBudWxsIHx8IHBhdGhOYW1lID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNsZWFudXBTZXBhcmF0b3JzKGFkZGl0aW9uYWwpO1xuICAgICAgICB9IGVsc2UgaWYgKGFkZGl0aW9uYWwgPT09IG51bGwgfHwgYWRkaXRpb25hbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jbGVhbnVwU2VwYXJhdG9ycyhwYXRoTmFtZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gcGF0aC5qb2luKHRoaXMuY2xlYW51cFNlcGFyYXRvcnMocGF0aE5hbWUpLCB0aGlzLmNsZWFudXBTZXBhcmF0b3JzKGFkZGl0aW9uYWwpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBwYXRoRGlyZWN0b3J5UmVsYXRpdmUocGF0aE5hbWUxOiBzdHJpbmcsIHBhdGhOYW1lMjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKHBhdGhOYW1lMSA9PT0gbnVsbCB8fCBwYXRoTmFtZTEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHBhdGhOYW1lMTtcbiAgICAgICAgfSBlbHNlIGlmIChwYXRoTmFtZTIgPT09IG51bGwgfHwgcGF0aE5hbWUyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXRoTmFtZTI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gYC4ke3BhdGguc2VwfSR7cGF0aC5yZWxhdGl2ZShwYXRoTmFtZTEsIHBhdGhOYW1lMil9JHtwYXRoLnNlcH1gO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHBhdGhGaWxlUmVsYXRpdmUocGF0aE5hbWUxOiBzdHJpbmcsIHBhdGhOYW1lMjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKHBhdGhOYW1lMSA9PT0gbnVsbCB8fCBwYXRoTmFtZTEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHBhdGhOYW1lMTtcbiAgICAgICAgfSBlbHNlIGlmIChwYXRoTmFtZTIgPT09IG51bGwgfHwgcGF0aE5hbWUyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXRoTmFtZTI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gYC4ke3BhdGguc2VwfSR7cGF0aC5yZWxhdGl2ZShwYXRoTmFtZTEsIHBhdGhOYW1lMil9YDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBwYXRoVG9XZWIocGF0aE5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGlmIChwYXRoTmFtZSA9PT0gbnVsbCB8fCBwYXRoTmFtZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gcGF0aE5hbWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gcGF0aE5hbWUucmVwbGFjZSgvXFxcXC9nLCBcIi9cIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgcGF0aEFic29sdXRlKHBhdGhOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBpZiAocGF0aE5hbWUgPT09IHVuZGVmaW5lZCB8fCBwYXRoTmFtZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHBhdGhOYW1lO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHBhdGgucmVzb2x2ZSh0aGlzLmNsZWFudXBTZXBhcmF0b3JzKHBhdGhOYW1lKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgcGF0aEdldERpcmVjdG9yeShwYXRoTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKHBhdGhOYW1lID09PSB1bmRlZmluZWQgfHwgcGF0aE5hbWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXRoTmFtZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBuZXdQYXRoTmFtZSA9IHRoaXMuY2xlYW51cFNlcGFyYXRvcnMocGF0aE5hbWUpO1xuICAgICAgICAgICAgaWYgKCEvLipcXC4oLiopJC8udGVzdChuZXdQYXRoTmFtZSkpIHtcbiAgICAgICAgICAgICAgICBuZXdQYXRoTmFtZSA9IHBhdGguam9pbihuZXdQYXRoTmFtZSwgXCJkdW1teS5maWxlXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHBhdGguZGlybmFtZShuZXdQYXRoTmFtZSkgKyBwYXRoLnNlcDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBwYXRoR2V0RmlsZW5hbWUocGF0aE5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGlmIChwYXRoTmFtZSA9PT0gdW5kZWZpbmVkIHx8IHBhdGhOYW1lID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gcGF0aE5hbWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBuZXdQYXRoTmFtZSA9IHRoaXMuY2xlYW51cFNlcGFyYXRvcnMocGF0aE5hbWUpO1xuICAgICAgICAgICAgaWYgKC9bXFwvXFxcXF0rJC8udGVzdChuZXdQYXRoTmFtZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGF0aC5iYXNlbmFtZShuZXdQYXRoTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZGlyZWN0b3J5RXhpc3RzKGRpcmVjdG9yeU5hbWU6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgICBpZiAoZGlyZWN0b3J5TmFtZSA9PT0gdW5kZWZpbmVkIHx8IGRpcmVjdG9yeU5hbWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhdHMgPSBhd2FpdCB1dGlsLnByb21pc2lmeShmcy5sc3RhdCkodGhpcy5jbGVhbnVwU2VwYXJhdG9ycyhkaXJlY3RvcnlOYW1lKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRzLmlzRGlyZWN0b3J5KCkgfHwgc3RhdHMuaXNTeW1ib2xpY0xpbmsoKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGlmIChlcnIuY29kZSA9PT0gXCJFTk9FTlRcIikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBkaXJlY3RvcnlDcmVhdGUoZGlyZWN0b3J5TmFtZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGlmIChkaXJlY3RvcnlOYW1lICE9PSB1bmRlZmluZWQgJiYgZGlyZWN0b3J5TmFtZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc3QgcGFydHMgPSB0aGlzLmNsZWFudXBTZXBhcmF0b3JzKGRpcmVjdG9yeU5hbWUpLnNwbGl0KHBhdGguc2VwKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkTmFtZSA9IHBhcnRzLnNsaWNlKDAsIGkgKyAxKS5qb2luKHBhdGguc2VwKTtcbiAgICAgICAgICAgICAgICBjb25zdCBkaXJFeGlzdHMgPSBhd2FpdCB0aGlzLmRpcmVjdG9yeUV4aXN0cyhkTmFtZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWRpckV4aXN0cykge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCB1dGlsLnByb21pc2lmeShmcy5ta2RpcikoZE5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBkaXJlY3RvcnlEZWxldGUoZGlyZWN0b3J5TmFtZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGlmIChkaXJlY3RvcnlOYW1lICE9PSB1bmRlZmluZWQgJiYgZGlyZWN0b3J5TmFtZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc3QgbmV3RGlyZWN0b3J5TmFtZSA9IHRoaXMuY2xlYW51cFNlcGFyYXRvcnMoZGlyZWN0b3J5TmFtZSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGRpckV4aXN0cyA9IGF3YWl0IHRoaXMuZGlyZWN0b3J5RXhpc3RzKG5ld0RpcmVjdG9yeU5hbWUpO1xuICAgICAgICAgICAgaWYgKGRpckV4aXN0cykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpbGVzID0gYXdhaXQgdXRpbC5wcm9taXNpZnkoZnMucmVhZGRpcikobmV3RGlyZWN0b3J5TmFtZSk7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJQYXRoID0gcGF0aC5qb2luKG5ld0RpcmVjdG9yeU5hbWUsIGZpbGVzW2ldKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdGF0ID0gYXdhaXQgdXRpbC5wcm9taXNpZnkoZnMubHN0YXQpKGN1clBhdGgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGF0LmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuZGlyZWN0b3J5RGVsZXRlKGN1clBhdGgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdXRpbC5wcm9taXNpZnkoZnMudW5saW5rKShjdXJQYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB1dGlsLnByb21pc2lmeShmcy5ybWRpcikobmV3RGlyZWN0b3J5TmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZGlyZWN0b3J5R2V0RmlsZXMoZGlyZWN0b3J5TmFtZTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmdbXT4ge1xuICAgICAgICBjb25zdCBkaXJGaWxlcyA9IFtdO1xuICAgICAgICBpZiAoZGlyZWN0b3J5TmFtZSAhPT0gdW5kZWZpbmVkICYmIGRpcmVjdG9yeU5hbWUgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnN0IG5ld0RpcmVjdG9yeU5hbWUgPSB0aGlzLmNsZWFudXBTZXBhcmF0b3JzKGRpcmVjdG9yeU5hbWUpO1xuXG4gICAgICAgICAgICBjb25zdCBkaXJFeGlzdHMgPSBhd2FpdCB0aGlzLmRpcmVjdG9yeUV4aXN0cyhuZXdEaXJlY3RvcnlOYW1lKTtcbiAgICAgICAgICAgIGlmIChkaXJFeGlzdHMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWxlcyA9IGF3YWl0IHV0aWwucHJvbWlzaWZ5KGZzLnJlYWRkaXIpKG5ld0RpcmVjdG9yeU5hbWUpO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VyUGF0aCA9IHBhdGguam9pbihuZXdEaXJlY3RvcnlOYW1lLCBmaWxlc1tpXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3RhdCA9IGF3YWl0IHV0aWwucHJvbWlzaWZ5KGZzLmxzdGF0KShjdXJQYXRoKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdC5pc0ZpbGUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlyRmlsZXMucHVzaChmaWxlc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRpckZpbGVzO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBkaXJlY3RvcnlHZXRGb2xkZXJzKGRpcmVjdG9yeU5hbWU6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nW10+IHtcbiAgICAgICAgY29uc3QgZGlyRm9sZGVycyA9IFtdO1xuICAgICAgICBpZiAoZGlyZWN0b3J5TmFtZSAhPT0gdW5kZWZpbmVkICYmIGRpcmVjdG9yeU5hbWUgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnN0IG5ld0RpcmVjdG9yeU5hbWUgPSB0aGlzLmNsZWFudXBTZXBhcmF0b3JzKGRpcmVjdG9yeU5hbWUpO1xuXG4gICAgICAgICAgICBjb25zdCBkaXJFeGlzdHMgPSBhd2FpdCB0aGlzLmRpcmVjdG9yeUV4aXN0cyhuZXdEaXJlY3RvcnlOYW1lKTtcbiAgICAgICAgICAgIGlmIChkaXJFeGlzdHMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWxlcyA9IGF3YWl0IHV0aWwucHJvbWlzaWZ5KGZzLnJlYWRkaXIpKG5ld0RpcmVjdG9yeU5hbWUpO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VyUGF0aCA9IHBhdGguam9pbihuZXdEaXJlY3RvcnlOYW1lLCBmaWxlc1tpXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3RhdCA9IGF3YWl0IHV0aWwucHJvbWlzaWZ5KGZzLmxzdGF0KShjdXJQYXRoKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdC5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXJGb2xkZXJzLnB1c2goZmlsZXNbaV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkaXJGb2xkZXJzO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaWxlRXhpc3RzKGRpcmVjdG9yeU5hbWU6IHN0cmluZywgZmlsZU5hbWU6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgICBpZiAoZGlyZWN0b3J5TmFtZSA9PT0gdW5kZWZpbmVkIHx8IGRpcmVjdG9yeU5hbWUgPT09IG51bGwgfHxcbiAgICAgICAgICAgIGZpbGVOYW1lID09PSB1bmRlZmluZWQgfHwgZmlsZU5hbWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhdCA9IGF3YWl0IHV0aWwucHJvbWlzaWZ5KGZzLmxzdGF0KShwYXRoLmpvaW4odGhpcy5jbGVhbnVwU2VwYXJhdG9ycyhkaXJlY3RvcnlOYW1lKSwgZmlsZU5hbWUpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdC5pc0ZpbGUoKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGlmIChlcnIuY29kZSA9PT0gXCJFTk9FTlRcIikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaWxlV3JpdGVUZXh0KGRpcmVjdG9yeU5hbWU6IHN0cmluZywgZmlsZU5hbWU6IHN0cmluZywgY29udGVudDogc3RyaW5nLCBhcHBlbmQ/OiBib29sZWFuKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGlmIChkaXJlY3RvcnlOYW1lICE9PSB1bmRlZmluZWQgJiYgZGlyZWN0b3J5TmFtZSAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgZmlsZU5hbWUgIT09IHVuZGVmaW5lZCAmJiBmaWxlTmFtZSAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgY29udGVudCAhPT0gdW5kZWZpbmVkICYmIGNvbnRlbnQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB1dGlsLnByb21pc2lmeShhcHBlbmQgPyBmcy5hcHBlbmRGaWxlIDogZnMud3JpdGVGaWxlKShwYXRoLmpvaW4odGhpcy5jbGVhbnVwU2VwYXJhdG9ycyhkaXJlY3RvcnlOYW1lKSwgZmlsZU5hbWUpLCBjb250ZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaWxlV3JpdGVMaW5lcyhkaXJlY3RvcnlOYW1lOiBzdHJpbmcsIGZpbGVOYW1lOiBzdHJpbmcsIGxpbmVzOiBzdHJpbmdbXSwgYXBwZW5kPzogYm9vbGVhbik6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBpZiAoZGlyZWN0b3J5TmFtZSAhPT0gdW5kZWZpbmVkICYmIGRpcmVjdG9yeU5hbWUgIT09IG51bGwgJiZcbiAgICAgICAgICAgIGZpbGVOYW1lICE9PSB1bmRlZmluZWQgJiYgZmlsZU5hbWUgIT09IG51bGwgJiZcbiAgICAgICAgICAgIGxpbmVzICE9PSB1bmRlZmluZWQgJiYgbGluZXMgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB1dGlsLnByb21pc2lmeShhcHBlbmQgPyBmcy5hcHBlbmRGaWxlIDogZnMud3JpdGVGaWxlKShwYXRoLmpvaW4odGhpcy5jbGVhbnVwU2VwYXJhdG9ycyhkaXJlY3RvcnlOYW1lKSwgZmlsZU5hbWUpLCBsaW5lcy5qb2luKG9zLkVPTCkgKyBvcy5FT0wpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbGVXcml0ZUJpbmFyeShkaXJlY3RvcnlOYW1lOiBzdHJpbmcsIGZpbGVOYW1lOiBzdHJpbmcsIGRhdGE6IFVpbnQ4QXJyYXksIGFwcGVuZD86IGJvb2xlYW4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgaWYgKGRpcmVjdG9yeU5hbWUgIT09IHVuZGVmaW5lZCAmJiBkaXJlY3RvcnlOYW1lICE9PSBudWxsICYmXG4gICAgICAgICAgICBmaWxlTmFtZSAhPT0gdW5kZWZpbmVkICYmIGZpbGVOYW1lICE9PSBudWxsICYmXG4gICAgICAgICAgICBkYXRhICE9PSB1bmRlZmluZWQgJiYgZGF0YSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHV0aWwucHJvbWlzaWZ5KGFwcGVuZCA/IGZzLmFwcGVuZEZpbGUgOiBmcy53cml0ZUZpbGUpKHBhdGguam9pbih0aGlzLmNsZWFudXBTZXBhcmF0b3JzKGRpcmVjdG9yeU5hbWUpLCBmaWxlTmFtZSksIGRhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbGVXcml0ZUpzb24oZGlyZWN0b3J5TmFtZTogc3RyaW5nLCBmaWxlTmFtZTogc3RyaW5nLCBvYmplY3Q6IGFueSk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBpZiAoZGlyZWN0b3J5TmFtZSAhPT0gdW5kZWZpbmVkICYmIGRpcmVjdG9yeU5hbWUgIT09IG51bGwgJiZcbiAgICAgICAgICAgIGZpbGVOYW1lICE9PSB1bmRlZmluZWQgJiYgZmlsZU5hbWUgIT09IG51bGwgJiZcbiAgICAgICAgICAgIG9iamVjdCAhPT0gdW5kZWZpbmVkICYmIG9iamVjdCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHV0aWwucHJvbWlzaWZ5KGZzLndyaXRlRmlsZSkocGF0aC5qb2luKHRoaXMuY2xlYW51cFNlcGFyYXRvcnMoZGlyZWN0b3J5TmFtZSksIGZpbGVOYW1lKSwgSnNvbkhlbHBlci5zdHJpbmdpZnkob2JqZWN0LCBcIlxcdFwiKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlsZVJlYWRUZXh0KGRpcmVjdG9yeU5hbWU6IHN0cmluZywgZmlsZU5hbWU6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgIGlmIChkaXJlY3RvcnlOYW1lID09PSB1bmRlZmluZWQgfHwgZGlyZWN0b3J5TmFtZSA9PT0gbnVsbCB8fFxuICAgICAgICAgICAgZmlsZU5hbWUgPT09IHVuZGVmaW5lZCB8fCBmaWxlTmFtZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCB1dGlsLnByb21pc2lmeShmcy5yZWFkRmlsZSkocGF0aC5qb2luKHRoaXMuY2xlYW51cFNlcGFyYXRvcnMoZGlyZWN0b3J5TmFtZSksIGZpbGVOYW1lKSk7XG4gICAgICAgICAgICByZXR1cm4gZGF0YS50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbGVSZWFkTGluZXMoZGlyZWN0b3J5TmFtZTogc3RyaW5nLCBmaWxlTmFtZTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmdbXT4ge1xuICAgICAgICBpZiAoZGlyZWN0b3J5TmFtZSA9PT0gdW5kZWZpbmVkIHx8IGRpcmVjdG9yeU5hbWUgPT09IG51bGwgfHxcbiAgICAgICAgICAgIGZpbGVOYW1lID09PSB1bmRlZmluZWQgfHwgZmlsZU5hbWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgdXRpbC5wcm9taXNpZnkoZnMucmVhZEZpbGUpKHBhdGguam9pbih0aGlzLmNsZWFudXBTZXBhcmF0b3JzKGRpcmVjdG9yeU5hbWUpLCBmaWxlTmFtZSkpO1xuICAgICAgICAgICAgcmV0dXJuIGRhdGEudG9TdHJpbmcoKS5yZXBsYWNlKC9cXHIvZywgXCJcIikuc3BsaXQoXCJcXG5cIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlsZVJlYWRCaW5hcnkoZGlyZWN0b3J5TmFtZTogc3RyaW5nLCBmaWxlTmFtZTogc3RyaW5nKTogUHJvbWlzZTxVaW50OEFycmF5PiB7XG4gICAgICAgIGlmIChkaXJlY3RvcnlOYW1lID09PSB1bmRlZmluZWQgfHwgZGlyZWN0b3J5TmFtZSA9PT0gbnVsbCB8fFxuICAgICAgICAgICAgZmlsZU5hbWUgPT09IHVuZGVmaW5lZCB8fCBmaWxlTmFtZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB1dGlsLnByb21pc2lmeShmcy5yZWFkRmlsZSkocGF0aC5qb2luKHRoaXMuY2xlYW51cFNlcGFyYXRvcnMoZGlyZWN0b3J5TmFtZSksIGZpbGVOYW1lKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlsZVJlYWRKc29uPFQ+KGRpcmVjdG9yeU5hbWU6IHN0cmluZywgZmlsZU5hbWU6IHN0cmluZyk6IFByb21pc2U8VD4ge1xuICAgICAgICBpZiAoZGlyZWN0b3J5TmFtZSA9PT0gdW5kZWZpbmVkIHx8IGRpcmVjdG9yeU5hbWUgPT09IG51bGwgfHxcbiAgICAgICAgICAgIGZpbGVOYW1lID09PSB1bmRlZmluZWQgfHwgZmlsZU5hbWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgdXRpbC5wcm9taXNpZnkoZnMucmVhZEZpbGUpKHBhdGguam9pbih0aGlzLmNsZWFudXBTZXBhcmF0b3JzKGRpcmVjdG9yeU5hbWUpLCBmaWxlTmFtZSkpO1xuICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoZGF0YS50b1N0cmluZygpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaWxlRGVsZXRlKGRpcmVjdG9yeU5hbWU6IHN0cmluZywgZmlsZU5hbWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBpZiAoZGlyZWN0b3J5TmFtZSA9PT0gdW5kZWZpbmVkIHx8IGRpcmVjdG9yeU5hbWUgPT09IG51bGwgfHxcbiAgICAgICAgICAgIGZpbGVOYW1lID09PSB1bmRlZmluZWQgfHwgZmlsZU5hbWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdXRpbC5wcm9taXNpZnkoZnMudW5saW5rKShwYXRoLmpvaW4odGhpcy5jbGVhbnVwU2VwYXJhdG9ycyhkaXJlY3RvcnlOYW1lKSwgZmlsZU5hbWUpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgY2xlYW51cFNlcGFyYXRvcnMocGF0aE5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGlmIChwYXRoTmFtZSA9PT0gdW5kZWZpbmVkIHx8IHBhdGhOYW1lID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gcGF0aE5hbWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gcGF0aC5ub3JtYWxpemUocGF0aE5hbWUpO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19
