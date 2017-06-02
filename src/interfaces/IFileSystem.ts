/**
 * Interface for file system abstraction.
 */
export interface IFileSystem {
    pathCombine(pathName: string, additional: string): string;
    pathRelative(pathName1: string, pathName2: string): string;
    pathFormat(pathName: string): string;

    directoryExists(directoryName: string): Promise<boolean>;
    directoryCreate(directoryName: string): Promise<void>;

    fileExists(directoryName: string, fileName: string): Promise<boolean>;

    fileWriteLines(directoryName: string, fileName: string, contents: string[]): Promise<void>;
    fileWriteJson(directoryName: string, fileName: string, obj: any): Promise<void>;

    fileReadLines(directoryName: string, fileName: string): Promise<string[]>;
    fileReadJson<T>(directoryName: string, fileName: string): Promise<T>;
}