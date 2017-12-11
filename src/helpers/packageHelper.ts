/**
 * Package helper
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";

export class PackageHelper {
    public static async locate(fileSystem: IFileSystem, logger: ILogger, initialDir: string, packageName: string): Promise<string> {
        const subFolder = fileSystem.pathAbsolute(fileSystem.pathCombine(initialDir, `node_modules/${packageName}`));

        const subExists = await fileSystem.directoryExists(subFolder);

        if (subExists) {
            return subFolder;
        } else {
            const parentFolder = fileSystem.pathAbsolute(fileSystem.pathCombine(initialDir, `../${packageName}`));

            const parentExists = await fileSystem.directoryExists(parentFolder);

            if (parentExists) {
                return parentFolder;
            } else {
                logger.error(`Could not find package '${packageName}' at ${subFolder} or ${parentFolder}`);
                return null;
            }
        }
    }
}
