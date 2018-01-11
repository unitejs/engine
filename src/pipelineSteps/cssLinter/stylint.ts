/**
 * Pipeline step to generate stylint configuration.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { StylintConfiguration } from "../../configuration/models/stylint/stylintConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class Stylint extends PipelineStepBase {
    private static readonly FILENAME: string = ".stylintrc";

    private _configuration: StylintConfiguration;

    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): boolean | undefined {
        return super.condition(uniteConfiguration.cssLinter, "Stylint");
    }

    public async initialise(logger: ILogger,
                            fileSystem: IFileSystem,
                            uniteConfiguration: UniteConfiguration,
                            engineVariables: EngineVariables,
                            mainCondition: boolean): Promise<number> {
        if (mainCondition) {
            if (!super.condition(uniteConfiguration.cssPre, "Stylus")) {
                logger.error("You can only use Stylint when the css preprocessor is Stylus");
                return 1;
            }
            return super.fileReadJson<StylintConfiguration>(logger, fileSystem, engineVariables.wwwRootFolder, Stylint.FILENAME, engineVariables.force, async (obj) => {
                this._configuration = obj;

                this.configDefaults(engineVariables);

                return 0;
            });
        } else {
            return 0;
        }
    }

    public async configure(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        engineVariables.toggleDevDependency(["stylint", "stylint-stylish"], mainCondition);

        return 0;
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        return super.fileToggleJson(logger,
                                    fileSystem,
                                    engineVariables.wwwRootFolder,
                                    Stylint.FILENAME,
                                    engineVariables.force,
                                    mainCondition,
                                    async () => this._configuration);

    }

    private configDefaults(engineVariables: EngineVariables): void {
        const defaultConfiguration = new StylintConfiguration();

        defaultConfiguration.blocks = false;
        defaultConfiguration.brackets = "never";
        defaultConfiguration.colons = "always";
        defaultConfiguration.colors = "always";
        defaultConfiguration.commaSpace = "always";
        defaultConfiguration.commentSpace = "always";
        defaultConfiguration.cssLiteral = "never";
        defaultConfiguration.customProperties = [];
        defaultConfiguration.depthLimit = false;
        defaultConfiguration.duplicates = true;
        defaultConfiguration.efficient = "always";
        defaultConfiguration.exclude = [];
        defaultConfiguration.extendPref = false;
        defaultConfiguration.globalDupe = false;
        defaultConfiguration.groupOutputByFile = true;
        defaultConfiguration.indentPref = false;
        defaultConfiguration.leadingZero = "never";
        defaultConfiguration.maxErrors = false;
        defaultConfiguration.maxWarnings = false;
        defaultConfiguration.mixed = false;
        defaultConfiguration.mixins = [];
        defaultConfiguration.namingConvention = false;
        defaultConfiguration.namingConventionStrict = false;
        defaultConfiguration.none = "never";
        defaultConfiguration.noImportant = true;
        defaultConfiguration.parenSpace = false;
        defaultConfiguration.placeholders = "always";
        defaultConfiguration.prefixVarsWithDollar = "always";
        defaultConfiguration.quotePref = false;
        defaultConfiguration.semicolons = "never";
        defaultConfiguration.sortOrder = "alphabetical";
        defaultConfiguration.stackedProperties = "never";
        defaultConfiguration.trailingWhitespace = "never";
        defaultConfiguration.universal = false;
        defaultConfiguration.valid = true;
        defaultConfiguration.zeroUnits = "never";
        defaultConfiguration.zIndexNormalize = false;

        this._configuration = {...defaultConfiguration, ...this._configuration};

        engineVariables.setConfiguration("Stylint", this._configuration);
    }
}
