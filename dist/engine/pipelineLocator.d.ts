/**
 * Pipeline Locator
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
export declare class PipelineLocator {
    static getPipelineFolder(fileSystem: IFileSystem, engineRootFolder: string): string;
    static getPipelineCategories(fileSystem: IFileSystem, engineRootFolder: string): Promise<string[]>;
    static getPipelineCategoryItems(fileSystem: IFileSystem, engineRootFolder: string, category: string): Promise<string[]>;
    static loadItem(fileSystem: IFileSystem, engineRootFolder: string, category: string, item: string): Promise<any>;
}
