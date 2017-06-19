/**
 * Interface for package manager.
 */
import { PackageConfiguration } from "../configuration/models/packages/packageConfiguration";

export interface IPackageManager {
    info(packageName: string): Promise<PackageConfiguration>;
    add(workingDirectory: string, packageName: string, version: string, isDev: boolean): Promise<void>;
    remove(workingDirectory: string, packageName: string, isDev: boolean): Promise<void>;
}