/**
 * Main engine
 */
import { PackageConfiguration } from "../configuration/models/packages/packageConfiguration";
import { UniteLanguage } from "../configuration/models/unite/uniteLanguage";
import { EnumEx } from "../core/enumEx";
import { IDisplay } from "../interfaces/IDisplay";
import { IEngine } from "../interfaces/IEngine";
import { IFileSystem } from "../interfaces/IFileSystem";
import { ILogger } from "../interfaces/ILogger";
import { EngineValidation } from "./engineValidation";

export class Engine implements IEngine {
    private _logger: ILogger;
    private _display: IDisplay;
    private _fileSystem: IFileSystem;

    constructor(logger: ILogger, display: IDisplay, fileSystem: IFileSystem) {
        this._logger = logger;
        this._display = display;
        this._fileSystem = fileSystem;
    }

    public async init(packageName: string | undefined | null, language: string | undefined | null, outputDirectory: string | undefined | null): Promise<number> {
        if (!EngineValidation.checkPackageName(this._display, "packageName", packageName)) {
            return 1;
        }
        if (!EngineValidation.checkOneOf(this._display, "language", language, EnumEx.getNames(UniteLanguage))) {
            return 1;
        }
        outputDirectory = this._fileSystem.directoryPathFormat(outputDirectory!);
        if (!EngineValidation.notEmpty(this._display, "outputDirectory", outputDirectory)) {
            return 1;
        }

        this._logger.info("Engine::init", { packageName, language, outputDirectory });

        try {
            this._display.log("Creating Directory: " + outputDirectory);
            await this._fileSystem.directoryCreate(outputDirectory);
        } catch (err) {
            this._logger.exception("Creating Directory", err, { outputDirectory });
            return 1;
        }

        try {
            this._display.log("Writing package.json in: " + outputDirectory);
            const packageJson = new PackageConfiguration();
            packageJson.name = packageName!;
            packageJson.version = "0.0.1";
            await this._fileSystem.fileWrite(outputDirectory, "package.json", JSON.stringify(packageJson, null, "\t"));
        } catch (err) {
            this._logger.exception("Writing package.json", err, { outputDirectory });
            return 1;
        }

        return 0;
    }
}