/**
 * Pipeline step to generate karma configuration.
 */
import { KarmaConfiguration } from "../../configuration/models/karma/karmaConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { JsonHelper } from "../../core/jsonHelper";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";
import { IDisplay } from "../../interfaces/IDisplay";
import { IFileSystem } from "../../interfaces/IFileSystem";
import { ILogger } from "../../interfaces/ILogger";

export class Karma extends EnginePipelineStepBase {
    private static FILENAME: string = "karma.conf.js";

    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["karma",
            "karma-chrome-launcher",
            "karma-phantomjs-launcher",
            "karma-story-reporter",
            "karma-html-reporter",
            "karma-coverage",
            "karma-sourcemap-loader",
            "karma-remap-istanbul",
            "remap-istanbul",
            "bluebird"
        ],
            uniteConfiguration.unitTestRunner === "Karma");

        engineVariables.toggleDevDependency(["requirejs"], uniteConfiguration.unitTestRunner === "Karma" && uniteConfiguration.moduleType === "AMD");
        /* We use SystemJS for testing CommonJS modules so we don't need to webpack the tests */
        engineVariables.toggleDevDependency(["systemjs"], uniteConfiguration.unitTestRunner === "Karma" &&
                                            (uniteConfiguration.moduleType === "SystemJS" || uniteConfiguration.moduleType === "CommonJS"));

        engineVariables.toggleDevDependency(["karma-mocha", "karma-chai"], uniteConfiguration.unitTestRunner === "Karma" && uniteConfiguration.unitTestFramework === "Mocha-Chai");
        engineVariables.toggleDevDependency(["karma-jasmine"], uniteConfiguration.unitTestRunner === "Karma" && uniteConfiguration.unitTestFramework === "Jasmine");

        if (uniteConfiguration.unitTestRunner === "Karma") {
            try {
                const hasGeneratedMarker = await super.fileHasGeneratedMarker(fileSystem, engineVariables.rootFolder, Karma.FILENAME);

                if (hasGeneratedMarker) {
                    super.log(logger, display, `Generating ${Karma.FILENAME}`);

                    const lines: string[] = [];
                    this.generateConfig(fileSystem, uniteConfiguration, engineVariables, lines);
                    await fileSystem.fileWriteLines(engineVariables.rootFolder, Karma.FILENAME, lines);
                } else {
                    super.log(logger, display, `Skipping ${Karma.FILENAME} as it has no generated marker`);
                }

                return 0;
            } catch (err) {
                super.error(logger, display, `Generating ${Karma.FILENAME} failed`, err);
                return 1;
            }
        } else {
            return await super.deleteFile(logger, display, fileSystem, engineVariables.rootFolder, Karma.FILENAME);
        }
    }

    private generateConfig(fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, lines: string[]): void {
        const testFrameworks: string[] = [];

        const testIncludes: { pattern: string, included: boolean }[] = [];

        testIncludes.push({ pattern: "./unite.json", included: false });
        testIncludes.push({ pattern: "./node_modules/bluebird/js/browser/bluebird.js", included: true });

        if (uniteConfiguration.moduleType === "AMD") {
            testIncludes.push({ pattern: "./node_modules/requirejs/require.js", included: true });
        } else if (uniteConfiguration.moduleType === "SystemJS" || uniteConfiguration.moduleType === "CommonJS") {
            /* We use SystemJS for testing CommonJS modules so we don't need to webpack the tests */
            testIncludes.push({ pattern: "./node_modules/systemjs/dist/system.js", included: true });
        }

        const packageKeys = Object.keys(uniteConfiguration.clientPackages);
        for (let i = 0; i < packageKeys.length; i++) {
            const pkg = uniteConfiguration.clientPackages[packageKeys[i]];
            if (pkg.includeMode === "test" || pkg.includeMode === "both") {
                testIncludes.push({ pattern: "./node_modules/" + packageKeys[i] + "/**/*", included: false });
            }
        }

        if (uniteConfiguration.unitTestFramework === "Mocha-Chai") {
            testFrameworks.push("mocha");
            testFrameworks.push("chai");
        } else if (uniteConfiguration.unitTestFramework === "Jasmine") {
            testFrameworks.push("jasmine");
        }

        const srcInclude = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.rootFolder, fileSystem.pathCombine(engineVariables.distFolder, "**/!(*-bundle|entryPoint).js")));
        testIncludes.push({
            pattern: srcInclude,
            included: false
        });

        testIncludes.push({
            pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.rootFolder, fileSystem.pathCombine(engineVariables.unitTestDistFolder, "**/*.spec.js"))),
            included: false
        });

        testIncludes.push({
            pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.rootFolder, fileSystem.pathCombine(engineVariables.unitTestDistFolder, "../unit-module-config.js"))),
            included: true
        });

        testIncludes.push({
            pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.rootFolder, fileSystem.pathCombine(engineVariables.unitTestDistFolder, "../unit-bootstrap.js"))),
            included: true
        });

        const reportsFolder = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.rootFolder, engineVariables.reportsFolder));

        const karmaConfiguration = new KarmaConfiguration();
        karmaConfiguration.basePath = "__dirname";
        karmaConfiguration.singleRun = true;
        karmaConfiguration.frameworks = testFrameworks;
        karmaConfiguration.reporters = ["story", "coverage", "html", "karma-remap-istanbul"];
        karmaConfiguration.browsers = ["PhantomJS"];
        karmaConfiguration.coverageReporter = {
            reporters: [
                {
                    type: "json",
                    dir: reportsFolder,
                    subdir: "."
                }
            ]
        };

        karmaConfiguration.htmlReporter = {
            outputDir: reportsFolder,
            reportName: "unit"
        };

        karmaConfiguration.remapIstanbulReporter = {
            reports: {
                "json": reportsFolder + "/coverage.json",
                "html": reportsFolder + "/coverage",
                "text-summary": ""
            }
        };

        karmaConfiguration.preprocessors = {};
        if (srcInclude) {
            karmaConfiguration.preprocessors[srcInclude] = ["sourcemap", "coverage"];
        }
        karmaConfiguration.files = testIncludes;

        lines.push("module.exports = function(config) {");
        lines.push("    config.set(" + JsonHelper.codify(karmaConfiguration) + ");");
        lines.push("};");
        lines.push(super.wrapGeneratedMarker("/* ", " */"));
    }
}