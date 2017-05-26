/**
 * Interface for file system abstraction.
 */
export interface IFileSystem {
    directoryPathFormat(directoryName: string): string;
    directoryExists(directoryName: string): Promise<boolean>;
    directoryCreate(directoryName: string): Promise<void>;

    fileWrite(directoryName: string, fileName: string, contents: string): Promise<void>;
}