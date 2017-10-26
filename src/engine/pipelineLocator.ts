/**
 * Pipeline Locator
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";

export class PipelineLocator {
    public static getPipelineFolder(fileSystem: IFileSystem, engineRootFolder: string) : string {
        return fileSystem.pathCombine(engineRootFolder, "dist/pipelineSteps");
    }

    public static async getPipelineCategories(fileSystem: IFileSystem, engineRootFolder: string): Promise<string[]> {
        const pipelineStepFolder = PipelineLocator.getPipelineFolder(fileSystem, engineRootFolder);

        return fileSystem.directoryGetFolders(pipelineStepFolder);
    }

    public static async getPipelineCategoryItems(fileSystem: IFileSystem, engineRootFolder: string, category: string): Promise<string[]> {
        const pipelineStepFolder = PipelineLocator.getPipelineFolder(fileSystem, engineRootFolder);

        const fullFolder = fileSystem.pathCombine(pipelineStepFolder, category);
        const files = await fileSystem.directoryGetFiles(fullFolder);

        return files.filter(file => file.endsWith(".js")).map(file => file.replace(".js", ""));
    }

    public static async loadItem(fileSystem: IFileSystem, engineRootFolder: string, category: string, item: string): Promise<any> {
        const pipelineStepFolder = PipelineLocator.getPipelineFolder(fileSystem, engineRootFolder);
        const categoryFolder = fileSystem.pathCombine(pipelineStepFolder, category);

        const loadFile = fileSystem.pathCombine(categoryFolder, `${item}.js`);
        return import(loadFile);
    }
}
