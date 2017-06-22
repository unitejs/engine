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
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class Karma extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (uniteConfiguration.unitTestRunner === "Karma") {
                try {
                    const hasMarker = yield _super("fileHasMarker").call(this, fileSystem, engineVariables.rootFolder, "karma.conf.js");
                    if (hasMarker) {
                        _super("log").call(this, logger, display, "Generating Karma Configuration");
                        engineVariables.requiredDevDependencies.push("karma");
                        engineVariables.requiredDevDependencies.push("karma-chrome-launcher");
                        engineVariables.requiredDevDependencies.push("karma-phantomjs-launcher");
                        const lines = [];
                        this.generateConfig(fileSystem, uniteConfiguration, engineVariables, lines);
                        yield fileSystem.fileWriteLines(engineVariables.rootFolder, "karma.conf.js", lines);
                    }
                    else {
                        _super("log").call(this, logger, display, "Skipping karma.conf.js as it has no marker");
                    }
                    return 0;
                }
                catch (err) {
                    _super("error").call(this, logger, display, "Generating Karma Configuration failed", err);
                    return 1;
                }
            }
            else {
                try {
                    const exists = yield fileSystem.fileExists(engineVariables.rootFolder, "karma.conf.js");
                    if (exists) {
                        yield fileSystem.fileDelete(engineVariables.rootFolder, "karma.conf.js");
                    }
                }
                catch (err) {
                    _super("error").call(this, logger, display, "Deleting Karma Configuration failed", err);
                    return 1;
                }
            }
            return 0;
        });
    }
    generateConfig(fileSystem, uniteConfiguration, engineVariables, lines) {
        const testFrameworks = [];
        const testIncludes = [];
        testIncludes.push({ pattern: "./unite.json", included: false });
        testIncludes.push({ pattern: "./node_modules/bluebird/js/browser/bluebird.js", included: true });
        engineVariables.requiredDevDependencies.push("bluebird");
        if (uniteConfiguration.moduleLoader === "RequireJS") {
            engineVariables.requiredDevDependencies.push("requirejs");
            testIncludes.push({ pattern: "./node_modules/requirejs/require.js", included: true });
        }
        else if (uniteConfiguration.moduleLoader === "SystemJS") {
            engineVariables.requiredDevDependencies.push("systemjs");
            testIncludes.push({ pattern: "./node_modules/systemjs/dist/system.js", included: true });
        }
        else if (uniteConfiguration.moduleLoader === "Webpack" || uniteConfiguration.moduleLoader === "Browserify") {
            engineVariables.requiredDevDependencies.push("cajon");
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
            engineVariables.requiredDevDependencies.push("karma-mocha");
            engineVariables.requiredDevDependencies.push("karma-chai");
        }
        else if (uniteConfiguration.unitTestFramework === "Jasmine") {
            testFrameworks.push("'jasmine'");
            engineVariables.requiredDevDependencies.push("karma-jasmine");
        }
        let srcInclude;
        if (uniteConfiguration.moduleLoader === "RequireJS" || uniteConfiguration.moduleLoader === "SystemJS") {
            srcInclude = "**/*.js";
        }
        else if (uniteConfiguration.moduleLoader === "Webpack" || uniteConfiguration.moduleLoader === "Browserify") {
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
        lines.push(super.wrapMarker("/* ", " */"));
    }
}
exports.Karma = Karma;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvdW5pdFRlc3Qva2FybWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUlBLGdGQUE2RTtBQU03RSxXQUFtQixTQUFRLCtDQUFzQjtJQUNoQyxPQUFPLENBQUMsTUFBZSxFQUFFLE9BQWlCLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQ3RKLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLGNBQWMsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNoRCxJQUFJLENBQUM7b0JBQ0QsTUFBTSxTQUFTLEdBQUcsTUFBTSx1QkFBbUIsWUFBQyxVQUFVLEVBQUUsZUFBZSxDQUFDLFVBQVUsRUFBRSxlQUFlLENBQUMsQ0FBQztvQkFFckcsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzt3QkFDWixhQUFTLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxnQ0FBZ0MsRUFBRTt3QkFFN0QsZUFBZSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzt3QkFDdEQsZUFBZSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO3dCQUN0RSxlQUFlLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLDBCQUEwQixDQUFDLENBQUM7d0JBRXpFLE1BQU0sS0FBSyxHQUFhLEVBQUUsQ0FBQzt3QkFDM0IsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsa0JBQWtCLEVBQUUsZUFBZSxFQUFFLEtBQUssQ0FBQyxDQUFDO3dCQUM1RSxNQUFNLFVBQVUsQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxlQUFlLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBQ3hGLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsNENBQTRDLEVBQUU7b0JBQzdFLENBQUM7b0JBRUQsTUFB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QUMsSUFBSSxDQUFDLDBCQUEwQixHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsZUFBZSxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3BLLENBQUM7UUFDRCxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3hCLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdEIsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqQixLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDL0MsQ0FBQztDQUNKO0FBdkpELHNCQXVKQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL3VuaXRUZXN0L2thcm1hLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
