/**
 * Interface for package manager.
 */
export interface IPackageManager {
    latestVersion(packageName: string): Promise<string>;
    add(packageName: string, version: string, isDev: boolean): Promise<void>;
    remove(packageName: string, isDev: boolean): Promise<void>;
}