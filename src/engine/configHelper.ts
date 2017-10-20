/**
 * Configuration helper
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";

export class ConfigHelper {
    public static async findConfigFolder(fileSystem: IFileSystem, outputDirectory: string | null | undefined): Promise<string> {
        let initialDir;
        if (outputDirectory === undefined || outputDirectory === null || outputDirectory.length === 0) {
            // no output directory specified so use current
            initialDir = fileSystem.pathAbsolute("./");
        } else {
            initialDir = fileSystem.pathAbsolute(outputDirectory);
        }

        let outputDir = initialDir;

        // check to see if this folder contains unite.json if it doesn't then keep recursing up
        // until we find it
        let searchComplete = false;
        let found = false;
        do {
            found = await fileSystem.fileExists(outputDir, "unite.json");

            if (found) {
                searchComplete = true;
            } else {
                const newOutputDir = fileSystem.pathCombine(outputDir, "../");

                // recursing up didn't move so we have reached the end of our search
                if (newOutputDir === outputDir) {
                    searchComplete = true;
                } else {
                    outputDir = newOutputDir;
                }
            }
        }
        while (!searchComplete);

        // not found at all so set outputDir back to initialDir in case this is a new creation
        if (!found) {
            outputDir = initialDir;
        }

        return outputDir;
    }
}
