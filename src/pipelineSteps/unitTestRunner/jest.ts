/**
 * Pipeline step to generate jest configuration.
 */
import { ObjectHelper } from "unitejs-framework/dist/helpers/objectHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { JestConfiguration } from "../../configuration/models/jest/jestConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class Jest extends PipelineStepBase {
    private static readonly FILENAME: string = "jest.config.json";
    private static readonly FILENAME_MOCK_DUMMY: string = "dummy.mock.js";

    private _configuration: JestConfiguration;

    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): boolean | undefined {
        return super.condition(uniteConfiguration.unitTestRunner, "Jest");
    }

    public async initialise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        if (mainCondition) {
            if (!super.condition(uniteConfiguration.moduleType, "CommonJS")) {
                logger.error("You can only use CommonJS Module Type when the Unit Test Runner is Jest");
                return 1;
            }

            if (!super.condition(uniteConfiguration.unitTestFramework, "Jasmine")) {
                logger.error("You can only use Jasmine Unit Test Framework when the Unit Test Runner is Jest");
                return 1;
            }

            if (!super.condition(uniteConfiguration.unitTestEngine, "JSDom")) {
                logger.error("You can only use JSDom Unit Test Engine when the Unit Test Runner is Jest");
                return 1;
            }

            return super.fileReadJson<JestConfiguration>(logger,
                                                         fileSystem,
                                                         engineVariables.wwwRootFolder,
                                                         Jest.FILENAME,
                                                         engineVariables.force,
                                                         async (obj) => {
                    this._configuration = obj;

                    this.configDefaults(fileSystem, uniteConfiguration, engineVariables);

                    return 0;
                });
        } else {
            return 0;
        }
    }

    public async configure(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        // Jest needs the babel-core bridge now that we are using babel@7 for our other tasks
        engineVariables.toggleDevDependency(["jest", "jest-cli", "babel-core"], mainCondition);

        return 0;
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        let ret = await super.fileToggleJson(logger,
                                             fileSystem,
                                             engineVariables.wwwRootFolder,
                                             Jest.FILENAME,
                                             engineVariables.force,
                                             mainCondition,
                                             async () => this._configuration);

        if (ret === 0) {
            ret = await super.fileToggleText(logger,
                                             fileSystem,
                                             engineVariables.www.unitRoot,
                                             Jest.FILENAME_MOCK_DUMMY,
                                             engineVariables.force,
                                             mainCondition,
                                             async () => this.wrapGeneratedMarker("/* ", " */"));
        }

        return ret;
    }

    private configDefaults(fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): void {
        const defaultConfiguration = new JestConfiguration();

        const distFolder = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, engineVariables.www.dist));
        const unitRootFolder = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, engineVariables.www.unitRoot));
        const unitDistFolder = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, engineVariables.www.unitDist));
        const reportsFolder = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, engineVariables.www.reports));

        defaultConfiguration.testMatch = [
            `${unitDistFolder.replace(/\.\//, "<rootDir>/")}/**/*.spec.js`
        ];
        defaultConfiguration.moduleNameMapper = {
            "\\.css$": `${unitRootFolder.replace(/\.\//, "<rootDir>/")}/dummy.mock.js`
        };
        defaultConfiguration.setupFiles = [
            `${unitRootFolder.replace(/\.\//, "<rootDir>/")}/unit-bootstrap.js`
        ];
        defaultConfiguration.collectCoverage = true;
        defaultConfiguration.collectCoverageFrom = [
            `${distFolder.replace(/\.\//, "")}/**/!(app-module-config|entryPoint).js`
        ];
        defaultConfiguration.coverageDirectory = reportsFolder.replace(/\.\//, "<rootDir>/");
        defaultConfiguration.coverageReporters = [
            "json",
            "lcov",
            "text"
        ];
        defaultConfiguration.verbose = true;

        this._configuration = ObjectHelper.merge(defaultConfiguration, this._configuration);

        engineVariables.setConfiguration("Jest", this._configuration);
    }
}
