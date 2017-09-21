import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { PackageConfiguration } from "../configuration/models/packages/packageConfiguration";
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "./engineVariables";
import { Pipeline } from "./pipeline";
export declare abstract class EngineCommandBase {
    protected _logger: ILogger;
    protected _fileSystem: IFileSystem;
    protected _engineRootFolder: string;
    protected _enginePackageJson: PackageConfiguration;
    protected _engineAssetsFolder: string;
    protected _profilesFolder: string;
    protected _pipelineStepFolder: string;
    protected _pipeline: Pipeline;
    create(logger: ILogger, fileSystem: IFileSystem, engineRootFolder: string, enginePackageJson: PackageConfiguration): void;
    protected loadConfiguration(outputDirectory: string, profileSource: string, profile: string | undefined | null, force: boolean): Promise<UniteConfiguration | undefined | null>;
    protected loadProfile<T>(profileSource: string, profile: string | undefined | null): Promise<T | undefined | null>;
    protected createEngineVariables(outputDirectory: string, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): void;
    protected mapParser(input: string): {
        [id: string]: string;
    };
}
