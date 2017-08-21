/**
 * Pipeline step to generate Protractor configuration.
 */
import { JsonHelper } from "unitejs-framework/dist/helpers/jsonHelper";
import { ObjectHelper } from "unitejs-framework/dist/helpers/objectHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { EsLintConfiguration } from "../../configuration/models/eslint/esLintConfiguration";
import { ProtractorConfiguration } from "../../configuration/models/protractor/protractorConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class Protractor extends EnginePipelineStepBase {
    private static FILENAME: string = "protractor.conf.js";

    private _configuration: ProtractorConfiguration;
    private _scriptStart: string[];
    private _scriptEnd: string[];

    public async initialise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        if (uniteConfiguration.e2eTestRunner === "Protractor") {
            this.configDefaults(fileSystem, engineVariables);
        }

        return 0;
    }

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["protractor", "browser-sync"], uniteConfiguration.e2eTestRunner === "Protractor");

        const esLintConfiguration = engineVariables.getConfiguration<EsLintConfiguration>("ESLint");
        if (esLintConfiguration) {
            ObjectHelper.addRemove(esLintConfiguration.env, "protractor", true, uniteConfiguration.e2eTestRunner === "Protractor");
        }

        if (uniteConfiguration.e2eTestRunner === "Protractor") {
            try {
                const hasGeneratedMarker = await super.fileHasGeneratedMarker(fileSystem, engineVariables.wwwRootFolder, Protractor.FILENAME);

                if (hasGeneratedMarker === "FileNotExist" || hasGeneratedMarker === "HasMarker") {
                    logger.info(`Generating ${Protractor.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });

                    const lines: string[] = this.createConfig();
                    await fileSystem.fileWriteLines(engineVariables.wwwRootFolder, Protractor.FILENAME, lines);
                } else {
                    logger.info(`Skipping ${Protractor.FILENAME} as it has no generated marker`);
                }

                return 0;
            } catch (err) {
                logger.error(`Generating ${Protractor.FILENAME} failed`, err);
                return 1;
            }
        } else {
            return await super.deleteFile(logger, fileSystem, engineVariables.wwwRootFolder, Protractor.FILENAME);
        }
    }

    private configDefaults(fileSystem: IFileSystem, engineVariables: EngineVariables): void {
        const defaultConfiguration = new ProtractorConfiguration();

        defaultConfiguration.baseUrl = "http://localhost:9000";
        defaultConfiguration.specs = [
            fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.e2eTestDistFolder, "**/*.spec.js")))
        ];
        defaultConfiguration.capabilities = {
            browserName: "chrome"
        };

        defaultConfiguration.plugins = [];

        this._configuration = ObjectHelper.merge(defaultConfiguration, this._configuration);

        this._scriptStart = [];
        this._scriptEnd = [];

        engineVariables.setConfiguration("Protractor", this._configuration);
        engineVariables.setConfiguration("Protractor.ScriptStart", this._scriptStart);
        engineVariables.setConfiguration("Protractor.ScriptEnd", this._scriptEnd);
    }

    private createConfig(): string[] {
        let lines: string[] = [];
        lines = lines.concat(this._scriptStart);
        lines.push(`exports.config = ${JsonHelper.codify(this._configuration)};`);
        lines = lines.concat(this._scriptEnd);
        lines.push(super.wrapGeneratedMarker("/* ", " */"));
        return lines;
    }
}
