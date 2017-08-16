/**
 * File system class
 */
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { JsonHelper } from "unitejs-framework/dist/helpers/jsonHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import * as util from "util";

export class FileSystemMock implements IFileSystem {
    public pathCombine(pathName: string, additional: string): string {
        if (pathName === null || pathName === undefined) {
            return this.cleanupSeparators(additional);
        } else if (additional === null || additional === undefined) {
            return this.cleanupSeparators(pathName);
        } else {
            pathName = this.cleanupSeparators(pathName);
            additional = this.cleanupSeparators(additional);
            return path.join(pathName, additional);
        }
    }

    public pathDirectoryRelative(pathName1: string, pathName2: string): string {
        if (pathName1 === null || pathName1 === undefined) {
            return pathName1;
        } else if (pathName2 === null || pathName2 === undefined) {
            return pathName2;
        } else {
            return `.${path.sep}${path.relative(pathName1, pathName2)}${path.sep}`;
        }
    }

    public pathFileRelative(pathName1: string, pathName2: string): string {
        if (pathName1 === null || pathName1 === undefined) {
            return pathName1;
        } else if (pathName2 === null || pathName2 === undefined) {
            return pathName2;
        } else {
            return `.${path.sep}${path.relative(pathName1, pathName2)}`;
        }
    }

    public pathToWeb(pathName: string): string {
        if (pathName === null || pathName === undefined) {
            return pathName;
        } else {
            return pathName.replace(/\\/g, "/");
        }
    }

    public pathAbsolute(pathName: string): string {
        if (pathName === undefined || pathName === null) {
            return pathName;
        } else {
            return path.resolve(this.cleanupSeparators(pathName));
        }
    }

    public pathGetDirectory(pathName: string): string {
        if (pathName === undefined || pathName === null) {
            return pathName;
        } else {
            pathName = this.cleanupSeparators(pathName);
            if (!/.*\.(.*)$/.test(pathName)) {
                pathName = path.join(pathName, "dummy.file");
            }
            return path.dirname(pathName) + path.sep;
        }
    }

    public pathGetFilename(pathName: string): string {
        if (pathName === undefined || pathName === null) {
            return pathName;
        } else {
            pathName = this.cleanupSeparators(pathName);
            if (/[\/\\]+$/.test(pathName)) {
                return undefined;
            } else {
                return path.basename(pathName);
            }
        }
    }

    public async directoryExists(directoryName: string): Promise<boolean> {
        if (directoryName === undefined || directoryName === null) {
            return false;
        } else {
            directoryName = this.cleanupSeparators(directoryName);

            try {
                const stats = await util.promisify(fs.lstat)(directoryName);
                return stats.isDirectory();
            } catch (err) {
                if (err.code === "ENOENT") {
                    return false;
                } else {
                    throw err;
                }
            }
        }
    }

    public async directoryCreate(directoryName: string): Promise<void> {
        if (directoryName !== undefined && directoryName !== null) {
            directoryName = this.cleanupSeparators(directoryName);

            const parts = directoryName.split(path.sep);
            for (let i = 0; i < parts.length; i++) {
                const dName = parts.slice(0, i + 1).join(path.sep);
                const dirExists = await this.directoryExists(dName);

                if (!dirExists) {
                    await util.promisify(fs.mkdir)(dName);
                }
            }
        }
    }

    public async directoryDelete(directoryName: string): Promise<void> {
        if (directoryName !== undefined && directoryName !== null) {
            directoryName = this.cleanupSeparators(directoryName);

            const dirExists = await this.directoryExists(directoryName);
            if (dirExists) {
                const files = await util.promisify(fs.readdir)(directoryName);
                for (let i = 0; i < files.length; i++) {
                    const curPath = path.join(directoryName, files[i]);

                    const stat = await util.promisify(fs.lstat)(curPath);

                    if (stat.isDirectory()) {
                        await this.directoryDelete(curPath);
                    } else {
                        await util.promisify(fs.unlink)(curPath);
                    }
                }

                return util.promisify(fs.rmdir)(directoryName);
            }
        }
    }

    public async fileExists(directoryName: string, fileName: string): Promise<boolean> {
        if (directoryName === undefined || directoryName === null ||
            fileName === undefined || fileName === null) {
            return false;
        } else {
            directoryName = this.cleanupSeparators(directoryName);

            try {
                const stat = await util.promisify(fs.lstat)(path.join(directoryName, fileName));
                return stat.isFile();
            } catch (err) {
                if (err.code === "ENOENT") {
                    return false;
                } else {
                    throw err;
                }
            }
        }
    }

    public async fileWriteText(directoryName: string, fileName: string, content: string, append?: boolean): Promise<void> {
        if (directoryName !== undefined && directoryName !== null &&
            fileName !== undefined && fileName !== null &&
            content !== undefined && content !== null) {
            directoryName = this.cleanupSeparators(directoryName);

            return util.promisify(append ? fs.appendFile : fs.writeFile)(path.join(directoryName, fileName), content);
        }
    }

    public async fileWriteLines(directoryName: string, fileName: string, lines: string[], append?: boolean): Promise<void> {
        if (directoryName !== undefined && directoryName !== null &&
            fileName !== undefined && fileName !== null &&
            lines !== undefined && lines !== null) {
            directoryName = this.cleanupSeparators(directoryName);

            return util.promisify(append ? fs.appendFile : fs.writeFile)(path.join(directoryName, fileName), lines.join(os.EOL) + os.EOL);
        }
    }

    public async fileWriteBinary(directoryName: string, fileName: string, data: Uint8Array, append?: boolean): Promise<void> {
        if (directoryName !== undefined && directoryName !== null &&
            fileName !== undefined && fileName !== null &&
            data !== undefined && data !== null) {
            directoryName = this.cleanupSeparators(directoryName);

            return util.promisify(append ? fs.appendFile : fs.writeFile)(path.join(directoryName, fileName), data);
        }
    }

    public async fileWriteJson(directoryName: string, fileName: string, object: any): Promise<void> {
        if (directoryName !== undefined && directoryName !== null &&
            fileName !== undefined && fileName !== null &&
            object !== undefined && object !== null) {
            directoryName = this.cleanupSeparators(directoryName);

            return util.promisify(fs.writeFile)(path.join(directoryName, fileName), JsonHelper.stringify(object, "\t"));
        }
    }

    public async fileReadText(directoryName: string, fileName: string): Promise<string> {
        if (directoryName === undefined || directoryName === null ||
            fileName === undefined || fileName === null) {
            return undefined;
        } else {
            directoryName = this.cleanupSeparators(directoryName);

            const data = await util.promisify(fs.readFile)(path.join(directoryName, fileName));
            return data.toString();
        }
    }

    public async fileReadLines(directoryName: string, fileName: string): Promise<string[]> {
        if (directoryName === undefined || directoryName === null ||
            fileName === undefined || fileName === null) {
            return undefined;
        } else {
            directoryName = this.cleanupSeparators(directoryName);

            const data = await util.promisify(fs.readFile)(path.join(directoryName, fileName));
            return data.toString().replace(/\r/g, "").split("\n");
        }
    }

    public async fileReadBinary(directoryName: string, fileName: string): Promise<Uint8Array> {
        if (directoryName === undefined || directoryName === null ||
            fileName === undefined || fileName === null) {
            return undefined;
        } else {
            directoryName = this.cleanupSeparators(directoryName);

            return util.promisify(fs.readFile)(path.join(directoryName, fileName));
        }
    }

    public async fileReadJson<T>(directoryName: string, fileName: string): Promise<T> {
        if (directoryName === undefined || directoryName === null ||
            fileName === undefined || fileName === null) {
            return undefined;
        } else {
            directoryName = this.cleanupSeparators(directoryName);

            const data = await util.promisify(fs.readFile)(path.join(directoryName, fileName));
            return JSON.parse(data.toString());
        }
    }

    public async fileDelete(directoryName: string, fileName: string): Promise<void> {
        if (directoryName === undefined || directoryName === null ||
            fileName === undefined || fileName === null) {
            return undefined;
        } else {
            directoryName = this.cleanupSeparators(directoryName);

            return util.promisify(fs.unlink)(path.join(directoryName, fileName));
        }
    }

    private cleanupSeparators(pathName: string): string {
        if (pathName === undefined || pathName === null) {
            return pathName;
        } else {
            return path.normalize(pathName);
        }
    }
}
