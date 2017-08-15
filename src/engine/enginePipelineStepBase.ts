/**
 * Base implementation of engine pipeline step.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { IEnginePipelineStep } from "../interfaces/IEnginePipelineStep";
import { EngineVariables } from "./engineVariables";

export abstract class EnginePipelineStepBase implements IEnginePipelineStep {
    public static MARKER: string = "Generated by UniteJS";

    public async prerequisites(logger: ILogger,
                               fileSystem: IFileSystem,
                               uniteConfiguration: UniteConfiguration,
                               engineVariables: EngineVariables): Promise<number> {
        return 0;
    }

    public abstract async process(logger: ILogger,
                                  fileSystem: IFileSystem,
                                  uniteConfiguration: UniteConfiguration,
                                  engineVariables: EngineVariables): Promise<number>;

    public async copyFile(logger: ILogger,
                          fileSystem: IFileSystem,
                          sourceFolder: string,
                          sourceFilename: string,
                          destFolder: string,
                          destFilename: string): Promise<void> {
        const hasGeneratedMarker = await this.fileHasGeneratedMarker(fileSystem, destFolder, destFilename);

        if (hasGeneratedMarker) {
            logger.info(`Copying ${sourceFilename}`, { from: sourceFolder, to: destFolder });

            const folderWithFile = fileSystem.pathCombine(destFolder, destFilename);
            const folderOnly = fileSystem.pathGetDirectory(folderWithFile);
            const dirExists = await fileSystem.directoryExists(folderOnly);
            if (!dirExists) {
                await fileSystem.directoryCreate(folderOnly);
            }

            const lines = await fileSystem.fileReadLines(sourceFolder, sourceFilename);
            await fileSystem.fileWriteLines(destFolder, destFilename, lines);
        } else {
            logger.info(`Skipping ${sourceFilename} as it has no generated marker`,
                        { from: sourceFolder, to: destFolder });
        }
    }

    public async deleteFile(logger: ILogger, fileSystem: IFileSystem,
                            folder: string, filename: string): Promise<number> {
        const hasGeneratedMarker = await this.fileHasGeneratedMarker(fileSystem, folder, filename);

        if (hasGeneratedMarker) {
            try {
                const exists = await fileSystem.fileExists(folder, filename);
                if (exists) {
                    logger.info(`Deleting ${filename}`, { from: folder });
                    await fileSystem.fileDelete(folder, filename);
                }
                return 0;
            } catch (err) {
                logger.error(`Deleting ${filename} failed`, err);
                return 1;
            }
        } else {
            logger.info(`Skipping Delete of ${filename} as it has no generated marker`, { from: folder });
            return 0;
        }
    }

    public wrapGeneratedMarker(before: string, after: string): string {
        return before + EnginePipelineStepBase.MARKER + after;
    }

    public async fileHasGeneratedMarker(fileSystem: IFileSystem, folder: string, filename: string): Promise<boolean> {
        let hasMarker = true;

        try {
            const exists = await fileSystem.fileExists(folder, filename);
            if (exists) {
                const existingLines = await fileSystem.fileReadLines(folder, filename);
                // Test the last few lines in case there are line breaks
                if (existingLines) {
                    hasMarker = false;
                    for (let i = existingLines.length - 1; i >= 0 && i >= existingLines.length - 5 && !hasMarker; i--) {
                        hasMarker = existingLines[i].indexOf(EnginePipelineStepBase.MARKER) >= 0;
                    }
                }
            }
            return hasMarker;
        } catch (err) {
            return true;
        }
    }
}
