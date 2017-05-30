/**
 * Pipeline step to generate package.json.
 */
import { PackageConfiguration } from "../configuration/models/packages/packageConfiguration";
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../engine/enginePipelineStepBase";
import { IDisplay } from "../interfaces/IDisplay";
import { IFileSystem } from "../interfaces/IFileSystem";
import { ILogger } from "../interfaces/ILogger";

export class GeneratePackageJson extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration): Promise<number> {
        try {
            super.log(logger, display, "Generating package.json in", { outputDirectory: uniteConfiguration.outputDirectory });
            const packageJson = new PackageConfiguration();
            packageJson.name = uniteConfiguration.name;
            packageJson.version = "0.0.1";
            await fileSystem.fileWriteJson(uniteConfiguration.outputDirectory, "package.json", packageJson);
            return 0;
        } catch (err) {
            super.error(logger, display, "Generating package.json failed", err, { outputDirectory: uniteConfiguration.outputDirectory });
            return 1;
        }
    }
}