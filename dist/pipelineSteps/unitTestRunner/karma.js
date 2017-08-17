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
const jsonHelper_1 = require("unitejs-framework/dist/helpers/jsonHelper");
const karmaConfiguration_1 = require("../../configuration/models/karma/karmaConfiguration");
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class Karma extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["karma",
                "karma-chrome-launcher",
                "karma-phantomjs-launcher",
                "karma-story-reporter",
                "karma-html-reporter",
                "karma-coverage",
                "karma-coverage-allsources",
                "karma-sourcemap-loader",
                "karma-remap-istanbul",
                "remap-istanbul",
                "bluebird"
            ], uniteConfiguration.unitTestRunner === "Karma");
            engineVariables.toggleDevDependency(["requirejs"], uniteConfiguration.unitTestRunner === "Karma" && uniteConfiguration.moduleType === "AMD");
            // We use SystemJS for testing CommonJS modules so we don't need to webpack the tests
            engineVariables.toggleDevDependency(["systemjs"], uniteConfiguration.unitTestRunner === "Karma" &&
                (uniteConfiguration.moduleType === "SystemJS" || uniteConfiguration.moduleType === "CommonJS"));
            engineVariables.toggleDevDependency(["karma-mocha", "karma-chai"], uniteConfiguration.unitTestRunner === "Karma" && uniteConfiguration.unitTestFramework === "Mocha-Chai");
            engineVariables.toggleDevDependency(["karma-jasmine"], uniteConfiguration.unitTestRunner === "Karma" && uniteConfiguration.unitTestFramework === "Jasmine");
            if (uniteConfiguration.unitTestRunner === "Karma") {
                try {
                    const hasGeneratedMarker = yield _super("fileHasGeneratedMarker").call(this, fileSystem, engineVariables.wwwRootFolder, Karma.FILENAME);
                    if (hasGeneratedMarker) {
                        logger.info(`Generating ${Karma.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });
                        const lines = [];
                        this.generateConfig(fileSystem, uniteConfiguration, engineVariables, lines);
                        yield fileSystem.fileWriteLines(engineVariables.wwwRootFolder, Karma.FILENAME, lines);
                    }
                    else {
                        logger.info(`Skipping ${Karma.FILENAME} as it has no generated marker`);
                    }
                    return 0;
                }
                catch (err) {
                    logger.error(`Generating ${Karma.FILENAME} failed`, err);
                    return 1;
                }
            }
            else {
                return yield _super("deleteFile").call(this, logger, fileSystem, engineVariables.wwwRootFolder, Karma.FILENAME);
            }
        });
    }
    generateConfig(fileSystem, uniteConfiguration, engineVariables, lines) {
        const testFrameworks = [];
        const testIncludes = [];
        testIncludes.push({ pattern: "../unite.json", included: false });
        const bbInclude = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.packageFolder, "bluebird/js/browser/bluebird.js")));
        testIncludes.push({ pattern: bbInclude, included: true });
        if (uniteConfiguration.moduleType === "AMD") {
            const reqInclude = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.packageFolder, "requirejs/require.js")));
            testIncludes.push({ pattern: reqInclude, included: true });
        }
        else if (uniteConfiguration.moduleType === "SystemJS" || uniteConfiguration.moduleType === "CommonJS") {
            const sysInclude = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.packageFolder, "systemjs/dist/system.src.js")));
            // We use SystemJS for testing CommonJS modules so we don't need to webpack the tests
            testIncludes.push({ pattern: sysInclude, included: true });
        }
        const testPackages = engineVariables.getTestClientPackages();
        Object.keys(testPackages).forEach(key => {
            const mainSplit = testPackages[key].main.split("/");
            const main = mainSplit.pop();
            let location = mainSplit.join("/");
            if (testPackages[key].isPackage) {
                const keyInclude = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.packageFolder, `${key}/${location}/**/*.{js,html,css}`)));
                testIncludes.push({ pattern: keyInclude, included: false });
            }
            else {
                location += location.length > 0 ? "/" : "";
                const keyInclude = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.packageFolder, `${key}/${location}${main}`)));
                testIncludes.push({ pattern: keyInclude, included: false });
            }
        });
        if (uniteConfiguration.unitTestFramework === "Mocha-Chai") {
            testFrameworks.push("mocha");
            testFrameworks.push("chai");
        }
        else if (uniteConfiguration.unitTestFramework === "Jasmine") {
            testFrameworks.push("jasmine");
        }
        const srcInclude = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.distFolder, "**/!(*-bundle|app-module-config|entryPoint).js")));
        testIncludes.push({
            pattern: srcInclude,
            included: false
        });
        testIncludes.push({
            pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.unitTestDistFolder, "../unit-module-config.js"))),
            included: true
        });
        testIncludes.push({
            pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.unitTestDistFolder, "../unit-bootstrap.js"))),
            included: true
        });
        testIncludes.push({
            pattern: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.unitTestDistFolder, "**/*.spec.js"))),
            included: false
        });
        const reportsFolder = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, engineVariables.www.reportsFolder));
        const karmaConfiguration = new karmaConfiguration_1.KarmaConfiguration();
        karmaConfiguration.basePath = "__dirname";
        karmaConfiguration.singleRun = true;
        karmaConfiguration.frameworks = testFrameworks;
        karmaConfiguration.reporters = ["story", "coverage-allsources", "coverage", "html", "karma-remap-istanbul"];
        karmaConfiguration.browsers = ["PhantomJS"];
        karmaConfiguration.coverageReporter = {
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
        karmaConfiguration.htmlReporter = {
            outputDir: reportsFolder,
            reportName: "unit"
        };
        karmaConfiguration.remapIstanbulReporter = {
            reports: {
                text: "",
                json: `${reportsFolder}/coverage.json`,
                html: `${reportsFolder}/coverage`,
                lcovonly: `${reportsFolder}/lcov.info`
            }
        };
        karmaConfiguration.preprocessors = {};
        if (srcInclude) {
            karmaConfiguration.preprocessors[srcInclude] = ["sourcemap", "coverage"];
        }
        karmaConfiguration.files = testIncludes;
        lines.push("module.exports = function(config) {");
        lines.push(`    config.set(${jsonHelper_1.JsonHelper.codify(karmaConfiguration)});`);
        lines.push("};");
        lines.push(super.wrapGeneratedMarker("/* ", " */"));
    }
}
Karma.FILENAME = "karma.conf.js";
exports.Karma = Karma;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3VuaXRUZXN0UnVubmVyL2thcm1hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDBFQUF1RTtBQUd2RSw0RkFBeUY7QUFFekYsZ0ZBQTZFO0FBRzdFLFdBQW1CLFNBQVEsK0NBQXNCO0lBR2hDLE9BQU8sQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQ25JLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE9BQU87Z0JBQ1AsdUJBQXVCO2dCQUN2QiwwQkFBMEI7Z0JBQzFCLHNCQUFzQjtnQkFDdEIscUJBQXFCO2dCQUNyQixnQkFBZ0I7Z0JBQ2hCLDJCQUEyQjtnQkFDM0Isd0JBQXdCO2dCQUN4QixzQkFBc0I7Z0JBQ3RCLGdCQUFnQjtnQkFDaEIsVUFBVTthQUNWLEVBQ0Qsa0JBQWtCLENBQUMsY0FBYyxLQUFLLE9BQU8sQ0FBQyxDQUFDO1lBRW5GLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLGNBQWMsS0FBSyxPQUFPLElBQUksa0JBQWtCLENBQUMsVUFBVSxLQUFLLEtBQUssQ0FBQyxDQUFDO1lBQzdJLHFGQUFxRjtZQUNyRixlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxjQUFjLEtBQUssT0FBTztnQkFDM0QsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLEtBQUssVUFBVSxJQUFJLGtCQUFrQixDQUFDLFVBQVUsS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBRXBJLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLGFBQWEsRUFBRSxZQUFZLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxjQUFjLEtBQUssT0FBTyxJQUFJLGtCQUFrQixDQUFDLGlCQUFpQixLQUFLLFlBQVksQ0FBQyxDQUFDO1lBQzNLLGVBQWUsQ0FBQyxtQkFB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RSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNiLGtCQUFrQixDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUM3RSxDQUFDO1FBQ0Qsa0JBQWtCLENBQUMsS0FBSyxHQUFHLFlBQVksQ0FBQztRQUV4QyxLQUFLLENBQUMsSUFBSSxDQUFDLHFDQUFxQyxDQUFDLENBQUM7UUFDbEQsS0FBSyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsdUJBQVUsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEUsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqQixLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUN4RCxDQUFDOztBQW5LYyxjQUFRLEdBQVcsZUFBZSxDQUFDO0FBRHRELHNCQXFLQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL3VuaXRUZXN0UnVubmVyL2thcm1hLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIHRvIGdlbmVyYXRlIGthcm1hIGNvbmZpZ3VyYXRpb24uXG4gKi9cbmltcG9ydCB7IEpzb25IZWxwZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL2pzb25IZWxwZXJcIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgS2FybWFDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL2thcm1hL2thcm1hQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lUGlwZWxpbmVTdGVwQmFzZSB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lUGlwZWxpbmVTdGVwQmFzZVwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcblxuZXhwb3J0IGNsYXNzIEthcm1hIGV4dGVuZHMgRW5naW5lUGlwZWxpbmVTdGVwQmFzZSB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgRklMRU5BTUU6IHN0cmluZyA9IFwia2FybWEuY29uZi5qc1wiO1xuXG4gICAgcHVibGljIGFzeW5jIHByb2Nlc3MobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1wia2FybWFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2FybWEtY2hyb21lLWxhdW5jaGVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImthcm1hLXBoYW50b21qcy1sYXVuY2hlclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJrYXJtYS1zdG9yeS1yZXBvcnRlclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJrYXJtYS1odG1sLXJlcG9ydGVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImthcm1hLWNvdmVyYWdlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImthcm1hLWNvdmVyYWdlLWFsbHNvdXJjZXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2FybWEtc291cmNlbWFwLWxvYWRlclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJrYXJtYS1yZW1hcC1pc3RhbmJ1bFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyZW1hcC1pc3RhbmJ1bFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJibHVlYmlyZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdFJ1bm5lciA9PT0gXCJLYXJtYVwiKTtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJyZXF1aXJlanNcIl0sIHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdFJ1bm5lciA9PT0gXCJLYXJtYVwiICYmIHVuaXRlQ29uZmlndXJhdGlvbi5tb2R1bGVUeXBlID09PSBcIkFNRFwiKTtcbiAgICAgICAgLy8gV2UgdXNlIFN5c3RlbUpTIGZvciB0ZXN0aW5nIENvbW1vbkpTIG1vZHVsZXMgc28gd2UgZG9uJ3QgbmVlZCB0byB3ZWJwYWNrIHRoZSB0ZXN0c1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJzeXN0ZW1qc1wiXSwgdW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0UnVubmVyID09PSBcIkthcm1hXCIgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHVuaXRlQ29uZmlndXJhdGlvbi5tb2R1bGVUeXBlID09PSBcIlN5c3RlbUpTXCIgfHwgdW5pdGVDb25maWd1cmF0aW9uLm1vZHVsZVR5cGUgPT09IFwiQ29tbW9uSlNcIikpO1xuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVEZXZEZXBlbmRlbmN5KFtcImthcm1hLW1vY2hhXCIsIFwia2FybWEtY2hhaVwiXSwgdW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0UnVubmVyID09PSBcIkthcm1hXCIgJiYgdW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0RnJhbWV3b3JrID09PSBcIk1vY2hhLUNoYWlcIik7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVEZXZEZXBlbmRlbmN5KFtcImthcm1hLWphc21pbmVcIl0sIHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdFJ1bm5lciA9PT0gXCJLYXJtYVwiICYmIHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdEZyYW1ld29yayA9PT0gXCJKYXNtaW5lXCIpO1xuXG4gICAgICAgIGlmICh1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RSdW5uZXIgPT09IFwiS2FybWFcIikge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBoYXNHZW5lcmF0ZWRNYXJrZXIgPSBhd2FpdCBzdXBlci5maWxlSGFzR2VuZXJhdGVkTWFya2VyKGZpbGVTeXN0ZW0sIGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBLYXJtYS5GSUxFTkFNRSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoaGFzR2VuZXJhdGVkTWFya2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBHZW5lcmF0aW5nICR7S2FybWEuRklMRU5BTUV9YCwgeyB3d3dGb2xkZXI6IGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbGluZXM6IHN0cmluZ1tdID0gW107XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVDb25maWcoZmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMsIGxpbmVzKTtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgZmlsZVN5c3RlbS5maWxlV3JpdGVMaW5lcyhlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgS2FybWEuRklMRU5BTUUsIGxpbmVzKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgU2tpcHBpbmcgJHtLYXJtYS5GSUxFTkFNRX0gYXMgaXQgaGFzIG5vIGdlbmVyYXRlZCBtYXJrZXJgKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgR2VuZXJhdGluZyAke0thcm1hLkZJTEVOQU1FfSBmYWlsZWRgLCBlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHN1cGVyLmRlbGV0ZUZpbGUobG9nZ2VyLCBmaWxlU3lzdGVtLCBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgS2FybWEuRklMRU5BTUUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZW5lcmF0ZUNvbmZpZyhmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBsaW5lczogc3RyaW5nW10pOiB2b2lkIHtcbiAgICAgICAgY29uc3QgdGVzdEZyYW1ld29ya3M6IHN0cmluZ1tdID0gW107XG5cbiAgICAgICAgY29uc3QgdGVzdEluY2x1ZGVzOiB7IHBhdHRlcm46IHN0cmluZzsgaW5jbHVkZWQ6IGJvb2xlYW4gfVtdID0gW107XG5cbiAgICAgICAgdGVzdEluY2x1ZGVzLnB1c2goeyBwYXR0ZXJuOiBcIi4uL3VuaXRlLmpzb25cIiwgaW5jbHVkZWQ6IGZhbHNlIH0pO1xuXG4gICAgICAgIGNvbnN0IGJiSW5jbHVkZSA9IGZpbGVTeXN0ZW0ucGF0aFRvV2ViKFxuICAgICAgICAgICAgZmlsZVN5c3RlbS5wYXRoRmlsZVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy53d3cucGFja2FnZUZvbGRlciwgXCJibHVlYmlyZC9qcy9icm93c2VyL2JsdWViaXJkLmpzXCIpKSk7XG4gICAgICAgIHRlc3RJbmNsdWRlcy5wdXNoKHsgcGF0dGVybjogYmJJbmNsdWRlLCBpbmNsdWRlZDogdHJ1ZSB9KTtcblxuICAgICAgICBpZiAodW5pdGVDb25maWd1cmF0aW9uLm1vZHVsZVR5cGUgPT09IFwiQU1EXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlcUluY2x1ZGUgPSBmaWxlU3lzdGVtLnBhdGhUb1dlYihcbiAgICAgICAgICAgICAgICBmaWxlU3lzdGVtLnBhdGhGaWxlUmVsYXRpdmUoZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLnd3dy5wYWNrYWdlRm9sZGVyLCBcInJlcXVpcmVqcy9yZXF1aXJlLmpzXCIpKSk7XG4gICAgICAgICAgICB0ZXN0SW5jbHVkZXMucHVzaCh7IHBhdHRlcm46IHJlcUluY2x1ZGUsIGluY2x1ZGVkOiB0cnVlIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKHVuaXRlQ29uZmlndXJhdGlvbi5tb2R1bGVUeXBlID09PSBcIlN5c3RlbUpTXCIgfHwgdW5pdGVDb25maWd1cmF0aW9uLm1vZHVsZVR5cGUgPT09IFwiQ29tbW9uSlNcIikge1xuICAgICAgICAgICAgY29uc3Qgc3lzSW5jbHVkZSA9IGZpbGVTeXN0ZW0ucGF0aFRvV2ViKFxuICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW0ucGF0aEZpbGVSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3LnBhY2thZ2VGb2xkZXIsIFwic3lzdGVtanMvZGlzdC9zeXN0ZW0uc3JjLmpzXCIpKSk7XG4gICAgICAgICAgICAvLyBXZSB1c2UgU3lzdGVtSlMgZm9yIHRlc3RpbmcgQ29tbW9uSlMgbW9kdWxlcyBzbyB3ZSBkb24ndCBuZWVkIHRvIHdlYnBhY2sgdGhlIHRlc3RzXG4gICAgICAgICAgICB0ZXN0SW5jbHVkZXMucHVzaCh7IHBhdHRlcm46IHN5c0luY2x1ZGUsIGluY2x1ZGVkOiB0cnVlIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdGVzdFBhY2thZ2VzID0gZW5naW5lVmFyaWFibGVzLmdldFRlc3RDbGllbnRQYWNrYWdlcygpO1xuXG4gICAgICAgIE9iamVjdC5rZXlzKHRlc3RQYWNrYWdlcykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbWFpblNwbGl0ID0gdGVzdFBhY2thZ2VzW2tleV0ubWFpbi5zcGxpdChcIi9cIik7XG4gICAgICAgICAgICBjb25zdCBtYWluID0gbWFpblNwbGl0LnBvcCgpO1xuICAgICAgICAgICAgbGV0IGxvY2F0aW9uID0gbWFpblNwbGl0LmpvaW4oXCIvXCIpO1xuXG4gICAgICAgICAgICBpZiAodGVzdFBhY2thZ2VzW2tleV0uaXNQYWNrYWdlKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qga2V5SW5jbHVkZSA9IGZpbGVTeXN0ZW0ucGF0aFRvV2ViKFxuICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtLnBhdGhGaWxlUmVsYXRpdmUoZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLnd3dy5wYWNrYWdlRm9sZGVyLCBgJHtrZXl9LyR7bG9jYXRpb259LyoqLyoue2pzLGh0bWwsY3NzfWApKSk7XG4gICAgICAgICAgICAgICAgdGVzdEluY2x1ZGVzLnB1c2goeyBwYXR0ZXJuOiBrZXlJbmNsdWRlLCBpbmNsdWRlZDogZmFsc2UgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxvY2F0aW9uICs9IGxvY2F0aW9uLmxlbmd0aCA+IDAgPyBcIi9cIiA6IFwiXCI7XG4gICAgICAgICAgICAgICAgY29uc3Qga2V5SW5jbHVkZSA9IGZpbGVTeXN0ZW0ucGF0aFRvV2ViKFxuICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtLnBhdGhGaWxlUmVsYXRpdmUoZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLnd3dy5wYWNrYWdlRm9sZGVyLCBgJHtrZXl9LyR7bG9jYXRpb259JHttYWlufWApKSk7XG4gICAgICAgICAgICAgICAgdGVzdEluY2x1ZGVzLnB1c2goeyBwYXR0ZXJuOiBrZXlJbmNsdWRlLCBpbmNsdWRlZDogZmFsc2UgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RGcmFtZXdvcmsgPT09IFwiTW9jaGEtQ2hhaVwiKSB7XG4gICAgICAgICAgICB0ZXN0RnJhbWV3b3Jrcy5wdXNoKFwibW9jaGFcIik7XG4gICAgICAgICAgICB0ZXN0RnJhbWV3b3Jrcy5wdXNoKFwiY2hhaVwiKTtcbiAgICAgICAgfSBlbHNlIGlmICh1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RGcmFtZXdvcmsgPT09IFwiSmFzbWluZVwiKSB7XG4gICAgICAgICAgICB0ZXN0RnJhbWV3b3Jrcy5wdXNoKFwiamFzbWluZVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNyY0luY2x1ZGUgPSBmaWxlU3lzdGVtLnBhdGhUb1dlYihmaWxlU3lzdGVtLnBhdGhGaWxlUmVsYXRpdmUoZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3LmRpc3RGb2xkZXIsIFwiKiovISgqLWJ1bmRsZXxhcHAtbW9kdWxlLWNvbmZpZ3xlbnRyeVBvaW50KS5qc1wiKSkpO1xuICAgICAgICB0ZXN0SW5jbHVkZXMucHVzaCh7XG4gICAgICAgICAgICBwYXR0ZXJuOiBzcmNJbmNsdWRlLFxuICAgICAgICAgICAgaW5jbHVkZWQ6IGZhbHNlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRlc3RJbmNsdWRlcy5wdXNoKHtcbiAgICAgICAgICAgIHBhdHRlcm46IGZpbGVTeXN0ZW0ucGF0aFRvV2ViKGZpbGVTeXN0ZW0ucGF0aEZpbGVSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3LnVuaXRUZXN0RGlzdEZvbGRlciwgXCIuLi91bml0LW1vZHVsZS1jb25maWcuanNcIikpKSxcbiAgICAgICAgICAgIGluY2x1ZGVkOiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRlc3RJbmNsdWRlcy5wdXNoKHtcbiAgICAgICAgICAgIHBhdHRlcm46IGZpbGVTeXN0ZW0ucGF0aFRvV2ViKGZpbGVTeXN0ZW0ucGF0aEZpbGVSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3LnVuaXRUZXN0RGlzdEZvbGRlciwgXCIuLi91bml0LWJvb3RzdHJhcC5qc1wiKSkpLFxuICAgICAgICAgICAgaW5jbHVkZWQ6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGVzdEluY2x1ZGVzLnB1c2goe1xuICAgICAgICAgICAgcGF0dGVybjogZmlsZVN5c3RlbS5wYXRoVG9XZWIoZmlsZVN5c3RlbS5wYXRoRmlsZVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy53d3cudW5pdFRlc3REaXN0Rm9sZGVyLCBcIioqLyouc3BlYy5qc1wiKSkpLFxuICAgICAgICAgICAgaW5jbHVkZWQ6IGZhbHNlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IHJlcG9ydHNGb2xkZXIgPSBmaWxlU3lzdGVtLnBhdGhUb1dlYihmaWxlU3lzdGVtLnBhdGhGaWxlUmVsYXRpdmUoZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIGVuZ2luZVZhcmlhYmxlcy53d3cucmVwb3J0c0ZvbGRlcikpO1xuXG4gICAgICAgIGNvbnN0IGthcm1hQ29uZmlndXJhdGlvbiA9IG5ldyBLYXJtYUNvbmZpZ3VyYXRpb24oKTtcbiAgICAgICAga2FybWFDb25maWd1cmF0aW9uLmJhc2VQYXRoID0gXCJfX2Rpcm5hbWVcIjtcbiAgICAgICAga2FybWFDb25maWd1cmF0aW9uLnNpbmdsZVJ1biA9IHRydWU7XG4gICAgICAgIGthcm1hQ29uZmlndXJhdGlvbi5mcmFtZXdvcmtzID0gdGVzdEZyYW1ld29ya3M7XG4gICAgICAgIGthcm1hQ29uZmlndXJhdGlvbi5yZXBvcnRlcnMgPSBbXCJzdG9yeVwiLCBcImNvdmVyYWdlLWFsbHNvdXJjZXNcIiwgXCJjb3ZlcmFnZVwiLCBcImh0bWxcIiwgXCJrYXJtYS1yZW1hcC1pc3RhbmJ1bFwiXTtcbiAgICAgICAga2FybWFDb25maWd1cmF0aW9uLmJyb3dzZXJzID0gW1wiUGhhbnRvbUpTXCJdO1xuICAgICAgICBrYXJtYUNvbmZpZ3VyYXRpb24uY292ZXJhZ2VSZXBvcnRlciA9IHtcbiAgICAgICAgICAgIGluY2x1ZGU6IGZpbGVTeXN0ZW0ucGF0aFRvV2ViKGZpbGVTeXN0ZW0ucGF0aEZpbGVSZWxhdGl2ZShlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3LmRpc3RGb2xkZXIsIFwiKiovIShhcHAtbW9kdWxlLWNvbmZpZ3xlbnRyeVBvaW50KS5qc1wiKSkpLFxuICAgICAgICAgICAgZXhjbHVkZTogXCJcIixcbiAgICAgICAgICAgIHJlcG9ydGVyczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJqc29uXCIsXG4gICAgICAgICAgICAgICAgICAgIGRpcjogcmVwb3J0c0ZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgc3ViZGlyOiBcIi5cIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfTtcblxuICAgICAgICBrYXJtYUNvbmZpZ3VyYXRpb24uaHRtbFJlcG9ydGVyID0ge1xuICAgICAgICAgICAgb3V0cHV0RGlyOiByZXBvcnRzRm9sZGVyLFxuICAgICAgICAgICAgcmVwb3J0TmFtZTogXCJ1bml0XCJcbiAgICAgICAgfTtcblxuICAgICAgICBrYXJtYUNvbmZpZ3VyYXRpb24ucmVtYXBJc3RhbmJ1bFJlcG9ydGVyID0ge1xuICAgICAgICAgICAgcmVwb3J0czoge1xuICAgICAgICAgICAgICAgIHRleHQ6IFwiXCIsXG4gICAgICAgICAgICAgICAganNvbjogYCR7cmVwb3J0c0ZvbGRlcn0vY292ZXJhZ2UuanNvbmAsXG4gICAgICAgICAgICAgICAgaHRtbDogYCR7cmVwb3J0c0ZvbGRlcn0vY292ZXJhZ2VgLFxuICAgICAgICAgICAgICAgIGxjb3Zvbmx5OiBgJHtyZXBvcnRzRm9sZGVyfS9sY292LmluZm9gXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAga2FybWFDb25maWd1cmF0aW9uLnByZXByb2Nlc3NvcnMgPSB7fTtcbiAgICAgICAgaWYgKHNyY0luY2x1ZGUpIHtcbiAgICAgICAgICAgIGthcm1hQ29uZmlndXJhdGlvbi5wcmVwcm9jZXNzb3JzW3NyY0luY2x1ZGVdID0gW1wic291cmNlbWFwXCIsIFwiY292ZXJhZ2VcIl07XG4gICAgICAgIH1cbiAgICAgICAga2FybWFDb25maWd1cmF0aW9uLmZpbGVzID0gdGVzdEluY2x1ZGVzO1xuXG4gICAgICAgIGxpbmVzLnB1c2goXCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGNvbmZpZykge1wiKTtcbiAgICAgICAgbGluZXMucHVzaChgICAgIGNvbmZpZy5zZXQoJHtKc29uSGVscGVyLmNvZGlmeShrYXJtYUNvbmZpZ3VyYXRpb24pfSk7YCk7XG4gICAgICAgIGxpbmVzLnB1c2goXCJ9O1wiKTtcbiAgICAgICAgbGluZXMucHVzaChzdXBlci53cmFwR2VuZXJhdGVkTWFya2VyKFwiLyogXCIsIFwiICovXCIpKTtcbiAgICB9XG59XG4iXX0=
