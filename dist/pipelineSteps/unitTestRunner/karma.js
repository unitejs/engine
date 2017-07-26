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
            ], uniteConfiguration.unitTestRunner === "Karma");
            engineVariables.toggleDevDependency(["requirejs"], uniteConfiguration.unitTestRunner === "Karma" && uniteConfiguration.moduleType === "AMD");
            /* We use SystemJS for testing CommonJS modules so we don't need to webpack the tests */
            engineVariables.toggleDevDependency(["systemjs"], uniteConfiguration.unitTestRunner === "Karma" &&
                (uniteConfiguration.moduleType === "SystemJS" || uniteConfiguration.moduleType === "CommonJS"));
            engineVariables.toggleDevDependency(["karma-mocha", "karma-chai"], uniteConfiguration.unitTestRunner === "Karma" && uniteConfiguration.unitTestFramework === "Mocha-Chai");
            engineVariables.toggleDevDependency(["karma-jasmine"], uniteConfiguration.unitTestRunner === "Karma" && uniteConfiguration.unitTestFramework === "Jasmine");
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
        else if (uniteConfiguration.moduleType === "SystemJS" || uniteConfiguration.moduleType === "CommonJS") {
            /* We use SystemJS for testing CommonJS modules so we don't need to webpack the tests */
            testIncludes.push({ pattern: "./node_modules/systemjs/dist/system.js", included: true });
        }
        const packageKeys = engineVariables.getTestClientPackages();
        for (let i = 0; i < packageKeys.length; i++) {
            testIncludes.push({ pattern: "./node_modules/" + packageKeys[i] + "/**/*", included: false });
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9waXBlbGluZVN0ZXBzL3VuaXRUZXN0UnVubmVyL2thcm1hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDRGQUF5RjtBQUV6RixzREFBbUQ7QUFDbkQsZ0ZBQTZFO0FBTTdFLFdBQW1CLFNBQVEsK0NBQXNCO0lBR2hDLE9BQU8sQ0FBQyxNQUFlLEVBQUUsT0FBaUIsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDdEosZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsT0FBTztnQkFDeEMsdUJBQXVCO2dCQUN2QiwwQkFBMEI7Z0JBQzFCLHNCQUFzQjtnQkFDdEIscUJBQXFCO2dCQUNyQixnQkFBZ0I7Z0JBQ2hCLHdCQUF3QjtnQkFDeEIsc0JBQXNCO2dCQUN0QixnQkFBZ0I7Z0JBQ2hCLFVBQVU7YUFDYixFQUNHLGtCQUFrQixDQUFDLGNBQWMsS0FBSyxPQUFPLENBQUMsQ0FBQztZQUVuRCxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxXQUFXLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxjQUFjLEtBQUssT0FBTyxJQUFJLGtCQUFrQixDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUMsQ0FBQztZQUM3SSx3RkFBd0Y7WUFDeEYsZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsVUFBVSxDQUFDLEVBQUUsa0JBQWtCLENBQUMsY0FBYyxLQUFLLE9BQU87Z0JBQzNELENBQUMsa0JBQWtCLENBQUMsVUFBVSxLQUFLLFVBQVUsSUFBSSxrQkFBa0IsQ0FBQyxVQUFVLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQztZQUVwSSxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxhQUFhLEVBQUUsWUFBWSxDQUFDLEVBQUUsa0JBQWtCLENBQUMsY0FBYyxLQUFLLE9BQU8sSUFBSSxrQkFBa0IsQ0FBQyxpQkFBaUIsS0FBSyxZQUFZLENBQUMsQ0FBQztZQUMzSyxlQUFlLENBQUMsbUJBQW1CLENB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aUJBQ2Q7YUFDSjtTQUNKLENBQUM7UUFFRixrQkFBa0IsQ0FBQyxZQUFZLEdBQUc7WUFDOUIsU0FBUyxFQUFFLGFBQWE7WUFDeEIsVUFBVSxFQUFFLE1BQU07U0FDckIsQ0FBQztRQUVGLGtCQUFrQixDQUFDLHFCQUFxQixHQUFHO1lBQ3ZDLE9BQU8sRUFBRTtnQkFDTCxNQUFNLEVBQUUsYUFBYSxHQUFHLGdCQUFnQjtnQkFDeEMsTUFBTSxFQUFFLGFBQWEsR0FBRyxXQUFXO2dCQUNuQyxjQUFjLEVBQUUsRUFBRTthQUNyQjtTQUNKLENBQUM7UUFFRixrQkFBa0IsQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO1FBQ3RDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDYixrQkFBa0IsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDN0UsQ0FBQztRQUNELGtCQUFrQixDQUFDLEtBQUssR0FBRyxZQUFZLENBQUM7UUFFeEMsS0FBSyxDQUFDLElBQUksQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO1FBQ2xELEtBQUssQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsdUJBQVUsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUM3RSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pCLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3hELENBQUM7O0FBekljLGNBQVEsR0FBVyxlQUFlLENBQUM7QUFEdEQsc0JBMklDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvdW5pdFRlc3RSdW5uZXIva2FybWEuanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
