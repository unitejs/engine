/**
 * Pipeline step to generate karma configuration.
 */
import { ArrayHelper } from "unitejs-framework/dist/helpers/arrayHelper";
import { JsonHelper } from "unitejs-framework/dist/helpers/jsonHelper";
import { ObjectHelper } from "unitejs-framework/dist/helpers/objectHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { KarmaConfiguration } from "../../configuration/models/karma/karmaConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class Karma extends EnginePipelineStepBase {
    private static FILENAME: string = "karma.conf.js";

    private _configuration: KarmaConfiguration;

    public async initialise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {

        if (super.condition(uniteConfiguration.unitTestRunner, "Karma")) {
            logger.info(`Initialising ${Karma.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });

            if (!engineVariables.force) {
                try {
                    const exists = await fileSystem.fileExists(engineVariables.wwwRootFolder, Karma.FILENAME);
                    if (exists) {
                        const conf = await fileSystem.fileReadText(engineVariables.wwwRootFolder, Karma.FILENAME);

                        const jsonMatches: RegExpExecArray = /config.set\(((.|\n|\r)*)\)/.exec(conf);
                        if (jsonMatches && jsonMatches.length === 3) {
                            this._configuration = JsonHelper.parseCode(jsonMatches[1]);
                            if (this._configuration.files) {
                                this._configuration.files = this._configuration.files.filter(item => item.isPerm);
                            }
                        } else {
                            logger.error(`Reading existing ${Karma.FILENAME} regex failed to parse`);
                            return 1;
                        }
                    }
                } catch (err) {
                    logger.error(`Reading existing ${Karma.FILENAME} failed`, err);
                    return 1;
                }
            }

            this.configDefaults(fileSystem, uniteConfiguration, engineVariables);
        }

        return 0;
    }

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["karma",
            "karma-story-reporter",
            "karma-html-reporter",
            "karma-coverage",
            "karma-coverage-allsources",
            "karma-sourcemap-loader",
            "karma-remap-istanbul",
            "remap-istanbul",
            "karma-chrome-launcher",
            "karma-firefox-launcher",
            "karma-phantomjs-launcher",
            "karma-safari-launcher",
            "karma-ie-launcher"
        ],
                                            super.condition(uniteConfiguration.unitTestRunner, "Karma"));

        if (super.condition(uniteConfiguration.unitTestRunner, "Karma")) {
            logger.info(`Generating ${Karma.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });

            const lines: string[] = [];
            this.generateConfig(fileSystem, uniteConfiguration, engineVariables, lines);
            await fileSystem.fileWriteLines(engineVariables.wwwRootFolder, Karma.FILENAME, lines);

            return 0;
        } else {
            return await super.deleteFile(logger, fileSystem, engineVariables.wwwRootFolder, Karma.FILENAME, engineVariables.force);
        }
    }

    private configDefaults(fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): void {
        const defaultConfiguration = new KarmaConfiguration();

        const reportsFolder = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, engineVariables.www.reportsFolder));

        defaultConfiguration.basePath = "__dirname";
        defaultConfiguration.singleRun = true;
        defaultConfiguration.frameworks = [];
        defaultConfiguration.reporters = ["story", "coverage-allsources", "coverage", "html", "karma-remap-istanbul"];
        defaultConfiguration.browsers = [];
        defaultConfiguration.coverageReporter = {
            include: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.distFolder, "**/!(app-module-config|entryPoint).js"))),
            exclude: "",
            reporters: [
                {
                    type: "json",
                    dir: reportsFolder,
                    subdir: "."
                }
            ]
        };

        defaultConfiguration.htmlReporter = {
            outputDir: reportsFolder,
            reportName: "unit"
        };

        defaultConfiguration.remapIstanbulReporter = {
            reports: {
                text: "",
                json: `${reportsFolder}/coverage.json`,
                html: `${reportsFolder}/coverage`,
                lcovonly: `${reportsFolder}/lcov.info`
            }
        };

        const srcInclude = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder,
                                                                            fileSystem.pathCombine(engineVariables.www.distFolder, "**/!(*-bundle|app-module-config|entryPoint).js")));

        defaultConfiguration.preprocessors = {};
        defaultConfiguration.preprocessors[srcInclude] = ["sourcemap", "coverage"];

        defaultConfiguration.files = [];

        this._configuration = ObjectHelper.merge(defaultConfiguration, this._configuration);

        ArrayHelper.addRemove(this._configuration.files,
                              {
                                   pattern: srcInclude,
                                   included: false,
                                   isPerm: true
                              },
                              true,
                              (object, item) => object.pattern === item.pattern);

        ArrayHelper.addRemove(this._configuration.files,
                              {
                                   pattern: "../unite.json",
                                   included: false,
                                   isPerm: true
                              },
                              true,
                              (object, item) => object.pattern === item.pattern);

        ArrayHelper.addRemove(this._configuration.files,
                              {
                                   pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder,
                                                                                             fileSystem.pathCombine(engineVariables.www.unitTestDistFolder, "../unit-module-config.js"))),
                                   included: true,
                                   isPerm: true
                              },
                              true,
                              (object, item) => object.pattern === item.pattern);

        ArrayHelper.addRemove(this._configuration.files,
                              {
                                   pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder,
                                                                                             fileSystem.pathCombine(engineVariables.www.unitTestDistFolder, "../unit-bootstrap.js"))),
                                   included: true,
                                   isPerm: true
                              },
                              true,
                              (object, item) => object.pattern === item.pattern);

        ArrayHelper.addRemove(this._configuration.files,
                              {
                                   pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder,
                                                                                             fileSystem.pathCombine(engineVariables.www.unitTestDistFolder, "**/*.spec.js"))),
                                   included: false,
                                   isPerm: true
                              },
                              true,
                              (object, item) => object.pattern === item.pattern);

        engineVariables.setConfiguration("Karma", this._configuration);
    }

    private generateConfig(fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, lines: string[]): void {
        lines.push("module.exports = function(config) {");
        lines.push(`    config.set(${JsonHelper.codify(this._configuration)});`);
        lines.push("};");
        lines.push(super.wrapGeneratedMarker("/* ", " */"));
    }
}
