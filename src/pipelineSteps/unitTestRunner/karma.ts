/**
 * Pipeline step to generate karma configuration.
 */
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";
import { IDisplay } from "../../interfaces/IDisplay";
import { IFileSystem } from "../../interfaces/IFileSystem";
import { ILogger } from "../../interfaces/ILogger";

export class Karma extends EnginePipelineStepBase {
    private static FILENAME: string = "karma.conf.js";

    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDependencies(["karma",
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
                                           uniteConfiguration.unitTestRunner === "Karma",
                                           true);

        engineVariables.toggleDependencies(["requirejs"], uniteConfiguration.unitTestRunner === "Karma" && uniteConfiguration.moduleLoader === "RequireJS", true);
        engineVariables.toggleDependencies(["systemjs"], uniteConfiguration.unitTestRunner === "Karma" && uniteConfiguration.moduleLoader === "SystemJS", true);
        engineVariables.toggleDependencies(["cajon"], uniteConfiguration.unitTestRunner === "Karma" &&
                                                      (uniteConfiguration.moduleLoader === "Browserify" || uniteConfiguration.moduleLoader === "Webpack"),
                                           true);

        engineVariables.toggleDependencies(["karma-mocha", "karma-chai"], uniteConfiguration.unitTestRunner === "Karma" && uniteConfiguration.unitTestFramework === "Mocha-Chai", true);
        engineVariables.toggleDependencies(["karma-jasmine"], uniteConfiguration.unitTestRunner === "Karma" && uniteConfiguration.unitTestFramework === "Jasmine", true);

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
            try {
                const exists = await fileSystem.fileExists(engineVariables.rootFolder, Karma.FILENAME);
                if (exists) {
                    await fileSystem.fileDelete(engineVariables.rootFolder, Karma.FILENAME);
                }
            } catch (err) {
                super.error(logger, display, `Deleting ${Karma.FILENAME} failed`, err);
                return 1;
            }
        }

        return 0;
    }

    private generateConfig(fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, lines: string[]): void {
        const testFrameworks: string[] = [];

        const testIncludes: { pattern: string, included: boolean}[] = [];

        testIncludes.push({ pattern: "./unite.json", included: false });
        testIncludes.push({ pattern: "./node_modules/bluebird/js/browser/bluebird.js", included: true });

        if (uniteConfiguration.moduleLoader === "RequireJS") {
            testIncludes.push({ pattern: "./node_modules/requirejs/require.js", included: true });
        } else if (uniteConfiguration.moduleLoader === "SystemJS") {
            testIncludes.push({ pattern: "./node_modules/systemjs/dist/system.js", included: true });
        } else if (uniteConfiguration.moduleLoader === "Webpack" || uniteConfiguration.moduleLoader === "Browserify") {
            testIncludes.push({ pattern: "./node_modules/cajon/cajon.js", included: true });
        }

        const packageKeys = Object.keys(uniteConfiguration.clientPackages);
        for (let i = 0; i < packageKeys.length; i++) {
            const pkg = uniteConfiguration.clientPackages[packageKeys[i]];
            if (pkg.includeMode === "test" || pkg.includeMode === "both") {
                testIncludes.push({ pattern: "./node_modules/" + packageKeys[i] + "/**/*", included: false });
            }
        }

        if (uniteConfiguration.unitTestFramework === "Mocha-Chai") {
            testFrameworks.push("'mocha'");
            testFrameworks.push("'chai'");
        } else if (uniteConfiguration.unitTestFramework === "Jasmine") {
            testFrameworks.push("'jasmine'");
        }

        let srcInclude;
        if (uniteConfiguration.moduleLoader === "RequireJS" || uniteConfiguration.moduleLoader === "SystemJS") {
            srcInclude = "**/*.js";
        } else if (uniteConfiguration.moduleLoader === "Webpack" || uniteConfiguration.moduleLoader === "Browserify") {
            srcInclude = "**/!(*-bundle|entryPoint).js";
        }

        if (srcInclude) {
            srcInclude = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.rootFolder, fileSystem.pathCombine(engineVariables.distFolder, srcInclude)));
            testIncludes.push({
                pattern: srcInclude,
                included: false
            });
        }

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

        lines.push("module.exports = function(config) {");
        lines.push("    config.set({");
        lines.push("        basePath: __dirname,");
        lines.push("        singleRun: true,");
        lines.push("        frameworks: [" + testFrameworks.join(", ") + "],");
        lines.push("        reporters: ['story', 'coverage', 'html', 'karma-remap-istanbul'],");
        lines.push("        browsers: ['PhantomJS'],");
        lines.push("        coverageReporter: {");
        lines.push("            reporters: [");
        lines.push("                {");
        lines.push("                    type: 'json',");
        lines.push("                    dir: '" + reportsFolder + "',");
        lines.push("                    subdir: '.'");
        lines.push("                }");
        lines.push("            ]");
        lines.push("        },");
        lines.push("        htmlReporter: {");
        lines.push("            outputDir: '" + reportsFolder + "',");
        lines.push("            reportName: 'unit'");
        lines.push("        },");
        lines.push("        remapIstanbulReporter: {");
        lines.push("            reports: {");
        lines.push("        		'json': '" + reportsFolder + "/coverage.json',");
        lines.push("        		'html': '" + reportsFolder + "/coverage',");
        lines.push("                'text-summary': ''");
        lines.push("        	}");
        lines.push("        },");
        lines.push("        preprocessors: {");
        lines.push("            '" + srcInclude + "': ['sourcemap', 'coverage']");
        lines.push("        },");
        lines.push("        files: [");
        for (let i = 0; i < testIncludes.length; i++) {
            lines.push("            { pattern: '" + testIncludes[i].pattern + "', included: " + testIncludes[i].included + " }" + (i < testIncludes.length - 1 ? "," : ""));
        }
        lines.push("        ]");
        lines.push("    });");
        lines.push("};");
        lines.push(super.wrapGeneratedMarker("/* ", " */"));
    }
}