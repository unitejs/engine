/**
 * Tests for ICNS.
 */
import * as fs from "fs";
import * as path from "path";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import * as util from "util";

export class ReadOnlyFileSystemMock implements IFileSystem {
    public pathCombine(pathName: string, additional: string): string {
        return path.join(pathName, additional);
    }

    public pathDirectoryRelative(pathName1: string, pathName2: string): string {
        return "";
    }

    public pathFileRelative(pathName1: string, pathName2: string): string {
        return "";
    }

    public pathAbsolute(pathName: string): string {
        return "";
    }

    public pathGetDirectory(pathName: string): string {
        return "";
    }

    public pathGetFilename(pathName: string): string {
        return "";
    }

    public pathToWeb(pathName: string): string {
        return "";
    }

    public async directoryExists(directoryName: string): Promise<boolean> {
        try {
            return (await util.promisify(fs.lstat)(directoryName)).isDirectory();
        } catch (err) {
            if (err.code === "ENOENT") {
                return false;
            } else {
                throw err;
            }
        }
    }

    public async directoryCreate(directoryName: string): Promise<void> {
        return Promise.resolve();
    }

    public async directoryDelete(directoryName: string): Promise<void> {
        return Promise.resolve();
    }

    public async directoryGetFiles(directoryName: string): Promise<string[]> {
        const dirFiles = [];
        if (directoryName !== undefined && directoryName !== null) {
            const dirExists = await this.directoryExists(directoryName);
            if (dirExists) {
                const files = await util.promisify(fs.readdir)(directoryName);
                for (let i = 0; i < files.length; i++) {
                    const curPath = path.join(directoryName, files[i]);

                    const stat = await util.promisify(fs.lstat)(curPath);

                    if (stat.isFile()) {
                        dirFiles.push(files[i]);
                    }
                }
            }
        }
        return dirFiles;
    }

    public async directoryGetFolders(directoryName: string): Promise<string[]> {
        const dirFolders = [];
        if (directoryName !== undefined && directoryName !== null) {
            const dirExists = await this.directoryExists(directoryName);
            if (dirExists) {
                const files = await util.promisify(fs.readdir)(directoryName);
                for (let i = 0; i < files.length; i++) {
                    const curPath = path.join(directoryName, files[i]);

                    const stat = await util.promisify(fs.lstat)(curPath);

                    if (stat.isDirectory()) {
                        dirFolders.push(files[i]);
                    }
                }
            }
        }
        return dirFolders;
    }

    public async fileExists(directoryName: string, fileName: string): Promise<boolean> {
        try {
            return (await util.promisify(fs.lstat)(path.join(directoryName, fileName))).isFile();
        } catch (err) {
            if (err.code === "ENOENT") {
                return false;
            } else {
                throw err;
            }
        }
    }

    public async fileWriteText(directoryName: string, fileName: string, contents: string, append?: boolean): Promise<void> {
        return Promise.resolve();
    }

    public async fileWriteLines(directoryName: string, fileName: string, contents: string[], append?: boolean): Promise<void> {
        return Promise.resolve();
    }

    public async fileWriteBinary(directoryName: string, fileName: string, obj: Uint8Array, append?: boolean): Promise<void> {
        return Promise.resolve();
    }

    public async fileWriteJson(directoryName: string, fileName: string, obj: any): Promise<void> {
        return Promise.resolve();
    }

    public async fileReadText(directoryName: string, fileName: string): Promise<string> {
        return Promise.resolve("");
    }

    public async fileReadLines(directoryName: string, fileName: string): Promise<string[]> {
        return Promise.resolve([]);
    }

    public async fileReadBinary(directoryName: string, fileName: string): Promise<Uint8Array> {
        return Promise.resolve(undefined);
    }

    public async fileReadJson<T>(directoryName: string, fileName: string): Promise<T> {
        const data = await util.promisify(fs.readFile)(path.join(directoryName, fileName));
        return JSON.parse(data.toString());
    }

    public async fileDelete(directoryName: string, fileName: string): Promise<void> {
        return Promise.resolve();
    }
}
