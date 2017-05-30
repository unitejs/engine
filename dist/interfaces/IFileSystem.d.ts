/**
 * Interface for file system abstraction.
 */
export interface IFileSystem {
    directoryPathCombine(directoryName: string, additional: string): string;
    directoryPathFormat(directoryName: string): string;
    directoryExists(directoryName: string): Promise<boolean>;
    directoryCreate(directoryName: string): Promise<void>;
    fileWriteLines(directoryName: string, fileName: string, contents: string[]): Promise<void>;
    fileWriteJson(directoryName: string, fileName: string, obj: any): Promise<void>;
}
