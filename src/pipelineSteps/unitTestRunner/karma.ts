/**
 * Pipeline step to generate karma configuration.
 */
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
            const hasGeneratedMarker = await super.fileHasGeneratedMarker(fileSystem, engineVariables.wwwRootFolder, Karma.FILENAME);

            if (hasGeneratedMarker === "FileNotExist" || hasGeneratedMarker === "HasMarker" || engineVariables.force) {
                logger.info(`Generating ${Karma.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });

                const lines: string[] = [];
                this.generateConfig(fileSystem, uniteConfiguration, engineVariables, lines);
                await fileSystem.fileWriteLines(engineVariables.wwwRootFolder, Karma.FILENAME, lines);
            } else {
                logger.info(`Skipping ${Karma.FILENAME} as it has no generated marker`);
            }

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

        defaultConfiguration.files.push({
            pattern: srcInclude,
            included: false
        });

        this._configuration = ObjectHelper.merge(defaultConfiguration, this._configuration);

        engineVariables.setConfiguration("Karma", this._configuration);
    }

    private generateConfig(fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, lines: string[]): void {
        const testPackages = engineVariables.getTestClientPackages();

        Object.keys(testPackages).forEach(key => {
            const pkg = testPackages[key];
            if (pkg.main) {
                const mainSplit = pkg.main.split("/");
                let main = mainSplit.pop();
                let location = mainSplit.join("/");

                let keyInclude;
                if (pkg.isPackage) {
                    keyInclude = fileSystem.pathToWeb(
                        fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.packageFolder, `${key}/${location}/**/*.{js,html,css}`)));
                } else {
                    location += location.length > 0 ? "/" : "";
                    if (main === "*") {
                        main = "**/*.{js,html,css}";
                    }
                    keyInclude = fileSystem.pathToWeb(
                        fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.packageFolder, `${key}/${location}${main}`)));
                }
                this._configuration.files.push({ pattern: keyInclude, included: pkg.scriptIncludeMode === "notBundled" || pkg.scriptIncludeMode === "both" });

                if (pkg.testingAdditions) {
                    const additionKeys = Object.keys(pkg.testingAdditions);
                    additionKeys.forEach(additionKey => {
                        const additionKeyInclude = fileSystem.pathToWeb(
                            fileSystem.pathFileRelative(engineVariables.wwwRootFolder,
                                                        fileSystem.pathCombine(engineVariables.www.packageFolder,
                                                                               `${key}/${pkg.testingAdditions[additionKey]}`)));
                        this._configuration.files.push({ pattern: additionKeyInclude, included: pkg.scriptIncludeMode === "notBundled" || pkg.scriptIncludeMode === "both" });
                    });
                }
            }

            if (testPackages[key].assets !== undefined && testPackages[key].assets !== null && testPackages[key].assets.length > 0) {
                const cas = testPackages[key].assets.split(";");
                cas.forEach((ca) => {
                    const keyInclude = fileSystem.pathToWeb(
                        fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.packageFolder, `${key}/${ca}`)));
                    this._configuration.files.push({ pattern: keyInclude, included: false });
                });
            }
        });

        this._configuration.files.push({ pattern: "../unite.json", included: false });

        this._configuration.files.push({
            pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.unitTestDistFolder, "../unit-module-config.js"))),
            included: true
        });

        this._configuration.files.push({
            pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.unitTestDistFolder, "../unit-bootstrap.js"))),
            included: true
        });

        this._configuration.files.push({
            pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.unitTestDistFolder, "**/*.spec.js"))),
            included: false
        });

        lines.push("module.exports = function(config) {");
        lines.push(`    config.set(${JsonHelper.codify(this._configuration)});`);
        lines.push("};");
        lines.push(super.wrapGeneratedMarker("/* ", " */"));
    }
}
