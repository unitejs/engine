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
 * Tests for ICNS.
 */
const fs = require("fs");
const path = require("path");
const util = require("util");
class ReadOnlyFileSystemMock {
    pathCombine(pathName, additional) {
        if (pathName === null || pathName === undefined) {
            return additional;
        }
        else if (additional === null || additional === undefined) {
            return pathName;
        }
        else {
            return path.join(pathName, additional);
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
            return path.resolve(pathName);
        }
    }
    pathGetDirectory(pathName) {
        if (pathName === undefined || pathName === null) {
            return pathName;
        }
        else {
            let newPathName = pathName;
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
            const newPathName = pathName;
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
            try {
                const stat = yield util.promisify(fs.lstat)(directoryName);
                return stat.isDirectory() || stat.isSymbolicLink();
            }
            catch (err) {
                if (err.code === "ENOENT") {
                    return false;
                }
                else {
                    throw err;
                }
            }
        });
    }
    directoryCreate(directoryName) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve();
        });
    }
    directoryDelete(directoryName) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve();
        });
    }
    directoryGetFiles(directoryName) {
        return __awaiter(this, void 0, void 0, function* () {
            const dirFiles = [];
            if (directoryName !== undefined && directoryName !== null) {
                const dirExists = yield this.directoryExists(directoryName);
                if (dirExists) {
                    const files = yield util.promisify(fs.readdir)(directoryName);
                    for (let i = 0; i < files.length; i++) {
                        const curPath = path.join(directoryName, files[i]);
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
                const dirExists = yield this.directoryExists(directoryName);
                if (dirExists) {
                    const files = yield util.promisify(fs.readdir)(directoryName);
                    for (let i = 0; i < files.length; i++) {
                        const curPath = path.join(directoryName, files[i]);
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
            try {
                return (yield util.promisify(fs.lstat)(path.join(directoryName, fileName))).isFile();
            }
            catch (err) {
                if (err.code === "ENOENT") {
                    return false;
                }
                else {
                    throw err;
                }
            }
        });
    }
    fileWriteText(directoryName, fileName, contents, append) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve();
        });
    }
    fileWriteLines(directoryName, fileName, contents, append) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve();
        });
    }
    fileWriteBinary(directoryName, fileName, obj, append) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve();
        });
    }
    fileWriteJson(directoryName, fileName, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve();
        });
    }
    fileReadText(directoryName, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve("");
        });
    }
    fileReadLines(directoryName, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve([]);
        });
    }
    fileReadBinary(directoryName, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve(undefined);
        });
    }
    fileReadJson(directoryName, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield util.promisify(fs.readFile)(path.join(directoryName, fileName));
            return JSON.parse(data.toString());
        });
    }
    fileDelete(directoryName, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve();
        });
    }
}
exports.ReadOnlyFileSystemMock = ReadOnlyFileSystemMock;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvcmVhZE9ubHlGaWxlU3lzdGVtLm1vY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUU3Qiw2QkFBNkI7QUFFN0I7SUFDZSxXQUFXLENBQUMsUUFBZ0IsRUFBRSxVQUFrQjtRQUN2RCxJQUFJLFFBQVEsS0FBSyxJQUFJLElBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTtZQUM3QyxPQUFPLFVBQVUsQ0FBQztTQUNyQjthQUFNLElBQUksVUFBVSxLQUFLLElBQUksSUFBSSxVQUFVLEtBQUssU0FBUyxFQUFFO1lBQ3hELE9BQU8sUUFBUSxDQUFDO1NBQ25CO2FBQU07WUFDSCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1NBQzFDO0lBQ0wsQ0FBQztJQUVNLHFCQUFxQixDQUFDLFNBQWlCLEVBQUUsU0FBaUI7UUFDN0QsSUFBSSxTQUFTLEtBQUssSUFBSSxJQUFJLFNBQVMsS0FBSyxTQUFTLEVBQUU7WUFDL0MsT0FBTyxTQUFTLENBQUM7U0FDcEI7YUFBTSxJQUFJLFNBQVMsS0FBSyxJQUFJLElBQUksU0FBUyxLQUFLLFNBQVMsRUFBRTtZQUN0RCxPQUFPLFNBQVMsQ0FBQztTQUNwQjthQUFNO1lBQ0gsT0FBTyxJQUFJLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1NBQzFFO0lBQ0wsQ0FBQztJQUVNLGdCQUFnQixDQUFDLFNBQWlCLEVBQUUsU0FBaUI7UUFDeEQsSUFBSSxTQUFTLEtBQUssSUFBSSxJQUFJLFNBQVMsS0FBSyxTQUFTLEVBQUU7WUFDL0MsT0FBTyxTQUFTLENBQUM7U0FDcEI7YUFBTSxJQUFJLFNBQVMsS0FBSyxJQUFJLElBQUksU0FBUyxLQUFLLFNB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LGFBQXFCLEVBQUUsUUFBZ0IsRUFBRSxHQUFROztZQUN4RSxPQUFPLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUM3QixDQUFDO0tBQUE7SUFFWSxZQUFZLENBQUMsYUFBcUIsRUFBRSxRQUFnQjs7WUFDN0QsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQy9CLENBQUM7S0FBQTtJQUVZLGFBQWEsQ0FBQyxhQUFxQixFQUFFLFFBQWdCOztZQUM5RCxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDL0IsQ0FBQztLQUFBO0lBRVksY0FBYyxDQUFDLGFBQXFCLEVBQUUsUUFBZ0I7O1lBQy9ELE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN0QyxDQUFDO0tBQUE7SUFFWSxZQUFZLENBQUksYUFBcUIsRUFBRSxRQUFnQjs7WUFDaEUsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ25GLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUN2QyxDQUFDO0tBQUE7SUFFWSxVQUFVLENBQUMsYUFBcUIsRUFBRSxRQUFnQjs7WUFDM0QsT0FBTyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDN0IsQ0FBQztLQUFBO0NBQ0o7QUFyTEQsd0RBcUxDIiwiZmlsZSI6InJlYWRPbmx5RmlsZVN5c3RlbS5tb2NrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUZXN0cyBmb3IgSUNOUy5cbiAqL1xuaW1wb3J0ICogYXMgZnMgZnJvbSBcImZzXCI7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSBcInV0aWxcIjtcblxuZXhwb3J0IGNsYXNzIFJlYWRPbmx5RmlsZVN5c3RlbU1vY2sgaW1wbGVtZW50cyBJRmlsZVN5c3RlbSB7XG4gICAgICAgIHB1YmxpYyBwYXRoQ29tYmluZShwYXRoTmFtZTogc3RyaW5nLCBhZGRpdGlvbmFsOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBpZiAocGF0aE5hbWUgPT09IG51bGwgfHwgcGF0aE5hbWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGFkZGl0aW9uYWw7XG4gICAgICAgIH0gZWxzZSBpZiAoYWRkaXRpb25hbCA9PT0gbnVsbCB8fCBhZGRpdGlvbmFsID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXRoTmFtZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBwYXRoLmpvaW4ocGF0aE5hbWUsIGFkZGl0aW9uYWwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHBhdGhEaXJlY3RvcnlSZWxhdGl2ZShwYXRoTmFtZTE6IHN0cmluZywgcGF0aE5hbWUyOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBpZiAocGF0aE5hbWUxID09PSBudWxsIHx8IHBhdGhOYW1lMSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gcGF0aE5hbWUxO1xuICAgICAgICB9IGVsc2UgaWYgKHBhdGhOYW1lMiA9PT0gbnVsbCB8fCBwYXRoTmFtZTIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHBhdGhOYW1lMjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBgLiR7cGF0aC5zZXB9JHtwYXRoLnJlbGF0aXZlKHBhdGhOYW1lMSwgcGF0aE5hbWUyKX0ke3BhdGguc2VwfWA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgcGF0aEZpbGVSZWxhdGl2ZShwYXRoTmFtZTE6IHN0cmluZywgcGF0aE5hbWUyOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBpZiAocGF0aE5hbWUxID09PSBudWxsIHx8IHBhdGhOYW1lMSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gcGF0aE5hbWUxO1xuICAgICAgICB9IGVsc2UgaWYgKHBhdGhOYW1lMiA9PT0gbnVsbCB8fCBwYXRoTmFtZTIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHBhdGhOYW1lMjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBgLiR7cGF0aC5zZXB9JHtwYXRoLnJlbGF0aXZlKHBhdGhOYW1lMSwgcGF0aE5hbWUyKX1gO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHBhdGhUb1dlYihwYXRoTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKHBhdGhOYW1lID09PSBudWxsIHx8IHBhdGhOYW1lID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXRoTmFtZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBwYXRoTmFtZS5yZXBsYWNlKC9cXFxcL2csIFwiL1wiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBwYXRoQWJzb2x1dGUocGF0aE5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGlmIChwYXRoTmFtZSA9PT0gdW5kZWZpbmVkIHx8IHBhdGhOYW1lID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gcGF0aE5hbWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gcGF0aC5yZXNvbHZlKHBhdGhOYW1lKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBwYXRoR2V0RGlyZWN0b3J5KHBhdGhOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBpZiAocGF0aE5hbWUgPT09IHVuZGVmaW5lZCB8fCBwYXRoTmFtZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHBhdGhOYW1lO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IG5ld1BhdGhOYW1lID0gcGF0aE5hbWU7XG4gICAgICAgICAgICBpZiAoIS8uKlxcLiguKikkLy50ZXN0KG5ld1BhdGhOYW1lKSkge1xuICAgICAgICAgICAgICAgIG5ld1BhdGhOYW1lID0gcGF0aC5qb2luKG5ld1BhdGhOYW1lLCBcImR1bW15LmZpbGVcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcGF0aC5kaXJuYW1lKG5ld1BhdGhOYW1lKSArIHBhdGguc2VwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHBhdGhHZXRGaWxlbmFtZShwYXRoTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKHBhdGhOYW1lID09PSB1bmRlZmluZWQgfHwgcGF0aE5hbWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXRoTmFtZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IG5ld1BhdGhOYW1lID0gcGF0aE5hbWU7XG4gICAgICAgICAgICBpZiAoL1tcXC9cXFxcXSskLy50ZXN0KG5ld1BhdGhOYW1lKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXRoLmJhc2VuYW1lKG5ld1BhdGhOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBkaXJlY3RvcnlFeGlzdHMoZGlyZWN0b3J5TmFtZTogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBzdGF0ID0gYXdhaXQgdXRpbC5wcm9taXNpZnkoZnMubHN0YXQpKGRpcmVjdG9yeU5hbWUpO1xuICAgICAgICAgICAgcmV0dXJuIHN0YXQuaXNEaXJlY3RvcnkoKSB8fCBzdGF0LmlzU3ltYm9saWNMaW5rKCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgaWYgKGVyci5jb2RlID09PSBcIkVOT0VOVFwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZGlyZWN0b3J5Q3JlYXRlKGRpcmVjdG9yeU5hbWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGRpcmVjdG9yeURlbGV0ZShkaXJlY3RvcnlOYW1lOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBkaXJlY3RvcnlHZXRGaWxlcyhkaXJlY3RvcnlOYW1lOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZ1tdPiB7XG4gICAgICAgIGNvbnN0IGRpckZpbGVzID0gW107XG4gICAgICAgIGlmIChkaXJlY3RvcnlOYW1lICE9PSB1bmRlZmluZWQgJiYgZGlyZWN0b3J5TmFtZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc3QgZGlyRXhpc3RzID0gYXdhaXQgdGhpcy5kaXJlY3RvcnlFeGlzdHMoZGlyZWN0b3J5TmFtZSk7XG4gICAgICAgICAgICBpZiAoZGlyRXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZmlsZXMgPSBhd2FpdCB1dGlsLnByb21pc2lmeShmcy5yZWFkZGlyKShkaXJlY3RvcnlOYW1lKTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1clBhdGggPSBwYXRoLmpvaW4oZGlyZWN0b3J5TmFtZSwgZmlsZXNbaV0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0YXQgPSBhd2FpdCB1dGlsLnByb21pc2lmeShmcy5sc3RhdCkoY3VyUGF0aCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXQuaXNGaWxlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpckZpbGVzLnB1c2goZmlsZXNbaV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkaXJGaWxlcztcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZGlyZWN0b3J5R2V0Rm9sZGVycyhkaXJlY3RvcnlOYW1lOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZ1tdPiB7XG4gICAgICAgIGNvbnN0IGRpckZvbGRlcnMgPSBbXTtcbiAgICAgICAgaWYgKGRpcmVjdG9yeU5hbWUgIT09IHVuZGVmaW5lZCAmJiBkaXJlY3RvcnlOYW1lICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zdCBkaXJFeGlzdHMgPSBhd2FpdCB0aGlzLmRpcmVjdG9yeUV4aXN0cyhkaXJlY3RvcnlOYW1lKTtcbiAgICAgICAgICAgIGlmIChkaXJFeGlzdHMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWxlcyA9IGF3YWl0IHV0aWwucHJvbWlzaWZ5KGZzLnJlYWRkaXIpKGRpcmVjdG9yeU5hbWUpO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VyUGF0aCA9IHBhdGguam9pbihkaXJlY3RvcnlOYW1lLCBmaWxlc1tpXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3RhdCA9IGF3YWl0IHV0aWwucHJvbWlzaWZ5KGZzLmxzdGF0KShjdXJQYXRoKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdC5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXJGb2xkZXJzLnB1c2goZmlsZXNbaV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkaXJGb2xkZXJzO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaWxlRXhpc3RzKGRpcmVjdG9yeU5hbWU6IHN0cmluZywgZmlsZU5hbWU6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIChhd2FpdCB1dGlsLnByb21pc2lmeShmcy5sc3RhdCkocGF0aC5qb2luKGRpcmVjdG9yeU5hbWUsIGZpbGVOYW1lKSkpLmlzRmlsZSgpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGlmIChlcnIuY29kZSA9PT0gXCJFTk9FTlRcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbGVXcml0ZVRleHQoZGlyZWN0b3J5TmFtZTogc3RyaW5nLCBmaWxlTmFtZTogc3RyaW5nLCBjb250ZW50czogc3RyaW5nLCBhcHBlbmQ/OiBib29sZWFuKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlsZVdyaXRlTGluZXMoZGlyZWN0b3J5TmFtZTogc3RyaW5nLCBmaWxlTmFtZTogc3RyaW5nLCBjb250ZW50czogc3RyaW5nW10sIGFwcGVuZD86IGJvb2xlYW4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaWxlV3JpdGVCaW5hcnkoZGlyZWN0b3J5TmFtZTogc3RyaW5nLCBmaWxlTmFtZTogc3RyaW5nLCBvYmo6IFVpbnQ4QXJyYXksIGFwcGVuZD86IGJvb2xlYW4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaWxlV3JpdGVKc29uKGRpcmVjdG9yeU5hbWU6IHN0cmluZywgZmlsZU5hbWU6IHN0cmluZywgb2JqOiBhbnkpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaWxlUmVhZFRleHQoZGlyZWN0b3J5TmFtZTogc3RyaW5nLCBmaWxlTmFtZTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShcIlwiKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlsZVJlYWRMaW5lcyhkaXJlY3RvcnlOYW1lOiBzdHJpbmcsIGZpbGVOYW1lOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZ1tdPiB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaWxlUmVhZEJpbmFyeShkaXJlY3RvcnlOYW1lOiBzdHJpbmcsIGZpbGVOYW1lOiBzdHJpbmcpOiBQcm9taXNlPFVpbnQ4QXJyYXk+IHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh1bmRlZmluZWQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaWxlUmVhZEpzb248VD4oZGlyZWN0b3J5TmFtZTogc3RyaW5nLCBmaWxlTmFtZTogc3RyaW5nKTogUHJvbWlzZTxUPiB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCB1dGlsLnByb21pc2lmeShmcy5yZWFkRmlsZSkocGF0aC5qb2luKGRpcmVjdG9yeU5hbWUsIGZpbGVOYW1lKSk7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKGRhdGEudG9TdHJpbmcoKSk7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbGVEZWxldGUoZGlyZWN0b3J5TmFtZTogc3RyaW5nLCBmaWxlTmFtZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG59XG4iXX0=
