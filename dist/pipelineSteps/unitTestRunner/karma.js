"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Pipeline step to generate karma configuration.
 */
const karmaConfiguration_1 = require("../../configuration/models/karma/karmaConfiguration");
const jsonHelper_1 = require("../../core/jsonHelper");
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class Karma extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
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
            ], uniteConfiguration.unitTestRunner === "Karma", true);
            engineVariables.toggleDependencies(["requirejs"], uniteConfiguration.unitTestRunner === "Karma" && uniteConfiguration.moduleType === "AMD", true);
            engineVariables.toggleDependencies(["systemjs"], uniteConfiguration.unitTestRunner === "Karma" && uniteConfiguration.moduleType === "SystemJS", true);
            engineVariables.toggleDependencies(["cajon"], uniteConfiguration.unitTestRunner === "Karma" && uniteConfiguration.moduleType === "CommonJS", true);
            engineVariables.toggleDependencies(["karma-mocha", "karma-chai"], uniteConfiguration.unitTestRunner === "Karma" && uniteConfiguration.unitTestFramework === "Mocha-Chai", true);
            engineVariables.toggleDependencies(["karma-jasmine"], uniteConfiguration.unitTestRunner === "Karma" && uniteConfiguration.unitTestFramework === "Jasmine", true);
            if (uniteConfiguration.unitTestRunner === "Karma") {
                try {
                    const hasGeneratedMarker = yield _super("fileHasGeneratedMarker").call(this, fileSystem, engineVariables.rootFolder, Karma.FILENAME);
                    if (hasGeneratedMarker) {
                        _super("log").call(this, logger, display, `Generating ${Karma.FILENAME}`);
                        const lines = [];
                        this.generateConfig(fileSystem, uniteConfiguration, engineVariables, lines);
                        yield fileSystem.fileWriteLines(engineVariables.rootFolder, Karma.FILENAME, lines);
                    }
                    else {
                        _super("log").call(this, logger, display, `Skipping ${Karma.FILENAME} as it has no generated marker`);
                    }
                    return 0;
                }
                catch (err) {
                    _super("error").call(this, logger, display, `Generating ${Karma.FILENAME} failed`, err);
                    return 1;
                }
            }
            else {
                return yield _super("deleteFile").call(this, logger, display, fileSystem, engineVariables.rootFolder, Karma.FILENAME);
            }
        });
    }
    generateConfig(fileSystem, uniteConfiguration, engineVariables, lines) {
        const testFrameworks = [];
        const testIncludes = [];
        testIncludes.push({ pattern: "./unite.json", included: false });
        testIncludes.push({ pattern: "./node_modules/bluebird/js/browser/bluebird.js", included: true });
        if (uniteConfiguration.moduleType === "AMD") {
            testIncludes.push({ pattern: "./node_modules/requirejs/require.js", included: true });
        }
        else if (uniteConfiguration.moduleType === "SystemJS") {
            testIncludes.push({ pattern: "./node_modules/systemjs/dist/system.js", included: true });
        }
        else if (uniteConfiguration.moduleType === "CommonJS") {
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
            testFrameworks.push("mocha");
            testFrameworks.push("chai");
        }
        else if (uniteConfiguration.unitTestFramework === "Jasmine") {
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
        const karmaConfiguration = new karmaConfiguration_1.KarmaConfiguration();
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
        lines.push("    config.set(" + jsonHelper_1.JsonHelper.codify(karmaConfiguration) + ");");
        lines.push("};");
        lines.push(super.wrapGeneratedMarker("/* ", " */"));
    }
}
Karma.FILENAME = "karma.conf.js";
exports.Karma = Karma;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9waXBlbGluZVN0ZXBzL3VuaXRUZXN0UnVubmVyL2thcm1hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDRGQUF5RjtBQUV6RixzREFBbUQ7QUFDbkQsZ0ZBQTZFO0FBTTdFLFdBQW1CLFNBQVEsK0NBQXNCO0lBR2hDLE9BQU8sQ0FBQyxNQUFlLEVBQUUsT0FBaUIsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDdEosZUFBZSxDQUFDLGtCQUFrQixDQUFDLENBQUMsT0FBTztnQkFDUCx1QkFBdUI7Z0JBQ3ZCLDBCQUEwQjtnQkFDMUIsc0JBQXNCO2dCQUN0QixxQkFBcUI7Z0JBQ3JCLGdCQUFnQjtnQkFDaEIsd0JBQXdCO2dCQUN4QixzQkFBc0I7Z0JBQ3RCLGdCQUFnQjtnQkFDaEIsVUFBVTthQUNULEVBQ0Ysa0JBQWtCLENBQUMsY0FBYyxLQUFLLE9BQU8sRUFDN0MsSUFBSSxDQUFDLENBQUM7WUFFekMsZUFBZSxDQUFDLGtCQUFrQixDQUFDLENBQUMsV0FBVyxDQUFDLEVBQUUsa0JBQWtCLENBQUMsY0FBYyxLQUFLLE9BQU8sSUFBSSxrQkFBa0IsQ0FBQyxVQUFVLEtBQUssS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2xKLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLGNBQWMsS0FBSyxPQUFPLElBQUksa0JBQWtCLENBQUMsVUFBVSxLQUFLLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN0SixlQUFlLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxjQUFjLEtBQUssT0FBTyxJQUFJLGtCQUFrQixDQUFDLFVBQVUsS0FBSyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFbkosZUFBZSxDQUFDLGtCQUFrQixDQUFDLENBQUMsYUFBYSxFQUFFLFlBQVksQ0FBQyxF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QUUsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7UUFFbkksTUFBTSxrQkFBa0IsR0FBRyxJQUFJLHVDQUFrQixFQUFFLENBQUM7UUFDcEQsa0JBQWtCLENBQUMsUUFBUSxHQUFHLFdBQVcsQ0FBQztRQUMxQyxrQkFBa0IsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3BDLGtCQUFrQixDQUFDLFVBQVUsR0FBRyxjQUFjLENBQUM7UUFDL0Msa0JBQWtCLENBQUMsU0FBUyxHQUFHLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztRQUNyRixrQkFBa0IsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUM1QyxrQkFBa0IsQ0FBQyxnQkFBZ0IsR0FBRztZQUM5QixTQUFTLEVBQUU7Z0JBQ1A7b0JBQ0ksSUFBSSxFQUFFLE1BQU07b0JBQ1osR0FBRyxFQUFFLGFBQWE7b0JBQ2xCLE1BQU0sRUFBRSxHQUFHO2lCQUNkO2FBQ0o7U0FDUixDQUFDO1FBRUYsa0JBQWtCLENBQUMsWUFBWSxHQUFHO1lBQzlCLFNBQVMsRUFBRSxhQUFhO1lBQ3hCLFVBQVUsRUFBRSxNQUFNO1NBQ3JCLENBQUM7UUFFRixrQkFBa0IsQ0FBQyxxQkFBcUIsR0FBRztZQUN2QyxPQUFPLEVBQUU7Z0JBQ0wsTUFBTSxFQUFFLGFBQWEsR0FBRyxnQkFBZ0I7Z0JBQ3hDLE1BQU0sRUFBRSxhQUFhLEdBQUcsV0FBVztnQkFDbkMsY0FBYyxFQUFFLEVBQUU7YUFDckI7U0FDSixDQUFDO1FBRUYsa0JBQWtCLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQztRQUN0QyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ2Isa0JBQWtCLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQzdFLENBQUM7UUFDRCxrQkFBa0IsQ0FBQyxLQUFLLEdBQUcsWUFBWSxDQUFDO1FBRXhDLEtBQUssQ0FBQyxJQUFJLENBQUMscUNBQXFDLENBQUMsQ0FBQztRQUNsRCxLQUFLLENBQUMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLHVCQUFVLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDN0UsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqQixLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUN4RCxDQUFDOztBQTdJYyxjQUFRLEdBQVcsZUFBZSxDQUFDO0FBRHRELHNCQStJQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL3VuaXRUZXN0UnVubmVyL2thcm1hLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
